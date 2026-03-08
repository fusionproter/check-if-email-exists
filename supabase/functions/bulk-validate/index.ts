import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const BACKEND_URL = Deno.env.get('REACHER_BACKEND_URL') || 'http://localhost:8080';

async function validateEmail(email: string): Promise<any> {
  const response = await fetch(`${BACKEND_URL}/v0/check_email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to_email: email,
    }),
  });

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  return await response.json();
}

async function processEmails(jobId: string, emails: string[], supabase: any) {
  let processed = 0;
  let safe = 0, risky = 0, invalid = 0, unknown = 0;

  for (const email of emails) {
    try {
      const result = await validateEmail(email);
      
      await supabase.from('bulk_validation_results').insert({
        job_id: jobId,
        email,
        result,
      });

      processed++;
      if (result.is_reachable === 'safe') safe++;
      else if (result.is_reachable === 'risky') risky++;
      else if (result.is_reachable === 'invalid') invalid++;
      else unknown++;

      await supabase.from('bulk_validation_jobs').update({
        processed_records: processed,
        total_safe: safe,
        total_risky: risky,
        total_invalid: invalid,
        total_unknown: unknown,
      }).eq('id', jobId);

      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error validating ${email}:`, error);
    }
  }

  await supabase.from('bulk_validation_jobs').update({
    status: 'Completed',
    finished_at: new Date().toISOString(),
  }).eq('id', jobId);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const { input } = await req.json();

    if (!input || !Array.isArray(input) || input.length === 0) {
      return new Response(
        JSON.stringify({ error: 'input must be a non-empty array of emails' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { data: job, error } = await supabase
      .from('bulk_validation_jobs')
      .insert({
        total_records: input.length,
        processed_records: 0,
        status: 'Running',
      })
      .select()
      .single();

    if (error || !job) {
      throw new Error('Failed to create job');
    }

    processEmails(job.id, input, supabase);

    return new Response(
      JSON.stringify({ job_id: job.id }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
