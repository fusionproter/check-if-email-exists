import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function convertToCSV(results: any[]): string {
  if (results.length === 0) return '';

  const headers = ['email', 'is_reachable', 'is_valid_syntax', 'username', 'domain', 'accepts_mail', 'is_disposable', 'is_role_account'];
  const rows = results.map(r => {
    const result = r.result;
    return [
      result.input,
      result.is_reachable,
      result.syntax.is_valid_syntax,
      result.syntax.username,
      result.syntax.domain,
      result.mx.accepts_mail,
      result.misc.is_disposable,
      result.misc.is_role_account,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const jobId = url.searchParams.get('job_id');
    const format = url.searchParams.get('format') || 'json';

    if (!jobId) {
      return new Response(
        JSON.stringify({ error: 'job_id parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: results, error } = await supabase
      .from('bulk_validation_results')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error('Failed to fetch results');
    }

    if (format === 'csv') {
      const csv = convertToCSV(results || []);
      return new Response(csv, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="validation-results-${jobId}.csv"`,
        },
      });
    }

    return new Response(
      JSON.stringify({ results: results?.map(r => r.result) || [] }),
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
