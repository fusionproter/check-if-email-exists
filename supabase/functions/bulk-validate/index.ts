import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const disposableDomains = new Set([
  'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
  'throwaway.email', 'maildrop.cc', 'yopmail.com', 'temp-mail.org',
  'getnada.com', 'trashmail.com', 'fakeinbox.com', 'sharklasers.com'
]);

const roleAccounts = new Set([
  'admin', 'support', 'info', 'sales', 'contact', 'help', 'webmaster',
  'postmaster', 'noreply', 'no-reply', 'abuse', 'marketing', 'hello'
]);

function validateEmailSyntax(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function parseEmail(email: string): { username: string; domain: string } {
  const [username, domain] = email.toLowerCase().split('@');
  return { username, domain };
}

async function checkMXRecords(domain: string): Promise<{ exists: boolean; records: string[] }> {
  try {
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
    const data = await response.json();
    
    if (data.Answer && data.Answer.length > 0) {
      const records = data.Answer.map((record: any) => record.data.split(' ')[1]);
      return { exists: true, records };
    }
    return { exists: false, records: [] };
  } catch {
    return { exists: false, records: [] };
  }
}

async function validateEmail(email: string) {
  const isValidSyntax = validateEmailSyntax(email);
  
  if (!isValidSyntax) {
    return {
      input: email,
      is_reachable: 'invalid',
      syntax: { username: '', domain: '', is_valid_syntax: false },
      mx: { accepts_mail: false, records: [] },
      misc: { is_disposable: false, is_role_account: false },
    };
  }

  const { username, domain } = parseEmail(email);
  const isDisposable = disposableDomains.has(domain);
  const isRoleAccount = roleAccounts.has(username);
  
  const mxCheck = await checkMXRecords(domain);
  
  let isReachable: 'safe' | 'risky' | 'invalid' | 'unknown' = 'unknown';
  
  if (!mxCheck.exists) {
    isReachable = 'invalid';
  } else if (isDisposable || isRoleAccount) {
    isReachable = 'risky';
  } else {
    isReachable = 'safe';
  }

  return {
    input: email,
    is_reachable: isReachable,
    syntax: { username, domain, is_valid_syntax: true },
    mx: { accepts_mail: mxCheck.exists, records: mxCheck.records },
    misc: { is_disposable: isDisposable, is_role_account: isRoleAccount },
  };
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
