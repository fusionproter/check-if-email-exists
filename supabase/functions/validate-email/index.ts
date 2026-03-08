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
    throw new Error(`Backend returned ${response.status}: ${await response.text()}`);
  }

  return await response.json();
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { to_email } = await req.json();

    if (!to_email) {
      return new Response(
        JSON.stringify({ error: 'to_email is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await validateEmail(to_email);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    await supabase.from('email_validations').insert({
      email: result.input,
      is_reachable: result.is_reachable,
      is_valid_syntax: result.syntax.is_valid_syntax,
      domain: result.syntax.domain,
      username: result.syntax.username,
      mx_records: result.mx.records,
      accepts_mail: result.mx.accepts_mail,
      is_disposable: result.misc.is_disposable,
      is_role_account: result.misc.is_role_account,
    });

    return new Response(
      JSON.stringify(result),
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
