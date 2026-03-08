import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ValidationResult {
  input: string;
  is_reachable: 'safe' | 'risky' | 'invalid' | 'unknown';
  syntax: {
    username: string;
    domain: string;
    is_valid_syntax: boolean;
  };
  mx: {
    accepts_mail: boolean;
    records: string[];
  };
  misc: {
    is_disposable: boolean;
    is_role_account: boolean;
  };
}

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

async function validateEmail(email: string): Promise<ValidationResult> {
  const isValidSyntax = validateEmailSyntax(email);
  
  if (!isValidSyntax) {
    return {
      input: email,
      is_reachable: 'invalid',
      syntax: {
        username: '',
        domain: '',
        is_valid_syntax: false,
      },
      mx: {
        accepts_mail: false,
        records: [],
      },
      misc: {
        is_disposable: false,
        is_role_account: false,
      },
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
    syntax: {
      username,
      domain,
      is_valid_syntax: true,
    },
    mx: {
      accepts_mail: mxCheck.exists,
      records: mxCheck.records,
    },
    misc: {
      is_disposable: isDisposable,
      is_role_account: isRoleAccount,
    },
  };
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
