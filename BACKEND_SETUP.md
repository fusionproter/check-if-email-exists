# Backend Setup Guide - Using Real Email Validation

Your application now uses the **real** `check-if-email-exists` Rust backend for email validation!

## Architecture

```
Frontend (React)
    ↓
Supabase Edge Functions (TypeScript proxy)
    ↓
Reacher Backend (Rust - check-if-email-exists)
    ↓
SMTP Servers (Gmail, Yahoo, Outlook, etc.)
```

The Edge Functions act as a proxy to the Rust backend and store results in Supabase.

---

## Quick Start: Run Backend Locally with Docker

### 1. Start the Backend

```bash
docker run -p 8080:8080 reacherhq/backend:latest
```

The backend will be available at `http://localhost:8080`

### 2. Set the Environment Variable

You need to tell the Edge Functions where the backend is running.

**For local development:**
- The backend runs on `http://localhost:8080`
- But Edge Functions can't access `localhost` from Supabase's cloud
- **You need to deploy the backend to a publicly accessible URL**

### 3. Deploy Backend to Fly.io (Recommended)

```bash
cd backend

# Install flyctl if you haven't
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
fly auth login

# Deploy the backend
fly deploy
```

After deployment, Fly.io will give you a URL like:
```
https://email-validator-backend.fly.dev
```

### 4. Configure Edge Functions

Set the `REACHER_BACKEND_URL` environment variable in Supabase:

```bash
# Using Supabase CLI
supabase secrets set REACHER_BACKEND_URL=https://email-validator-backend.fly.dev

# Or manually in Supabase Dashboard:
# Project Settings → Edge Functions → Environment Variables
# Add: REACHER_BACKEND_URL = https://email-validator-backend.fly.dev
```

---

## Alternative: Use Docker Compose Locally

For local development only:

```bash
# Start backend
docker-compose -f docker-compose-backend.yml up -d

# Backend will be at http://localhost:8080
```

**Note:** Supabase Edge Functions can't access localhost, so this is only for testing the backend directly.

---

## How It Works

### Single Email Validation

1. Frontend calls: `POST /functions/v1/validate-email`
2. Edge Function calls: `POST http://your-backend/v0/check_email`
3. Backend performs real SMTP verification
4. Result stored in Supabase `email_validations` table
5. Result returned to frontend

### Bulk Email Validation

1. Frontend calls: `POST /functions/v1/bulk-validate`
2. Edge Function:
   - Creates job in Supabase
   - For each email: calls backend `POST /v0/check_email`
   - Stores each result in Supabase
   - Updates job progress
3. Frontend polls: `GET /functions/v1/bulk-status?job_id=X`
4. When complete, downloads: `GET /functions/v1/bulk-results?job_id=X&format=csv`

---

## Testing the Backend

### Test Single Validation

```bash
curl -X POST http://localhost:8080/v0/check_email \
  -H "Content-Type: application/json" \
  -d '{"to_email": "someone@gmail.com"}'
```

### Expected Response

```json
{
  "input": "someone@gmail.com",
  "is_reachable": "invalid",
  "misc": {
    "is_disposable": false,
    "is_role_account": false
  },
  "mx": {
    "accepts_mail": true,
    "records": ["gmail-smtp-in.l.google.com."]
  },
  "smtp": {
    "can_connect_smtp": true,
    "has_full_inbox": false,
    "is_catch_all": false,
    "is_deliverable": false,
    "is_disabled": true
  },
  "syntax": {
    "domain": "gmail.com",
    "is_valid_syntax": true,
    "username": "someone"
  }
}
```

---

## Backend Configuration

The backend is configured via `backend/backend_config.toml` or environment variables.

### Important Settings

```toml
# SMTP settings (very important for deliverability)
hello_name = "your-domain.com"  # Should match your server's reverse DNS
from_email = "noreply@your-domain.com"  # Should match hello_name domain

# Timeout for SMTP connections (seconds)
smtp_timeout = 45

# Use a proxy for better deliverability (optional but recommended)
[proxy]
host = "your-proxy.com"
port = 1080
username = "your-username"  # optional
password = "your-password"  # optional
```

### Environment Variables

```bash
# HTTP Server
RCH__HTTP_HOST=0.0.0.0
RCH__HTTP_PORT=8080

# SMTP Configuration
RCH__HELLO_NAME=your-domain.com
RCH__FROM_EMAIL=noreply@your-domain.com
RCH__SMTP_TIMEOUT=45

# Proxy (optional but recommended for production)
RCH__PROXY__HOST=your-proxy.com
RCH__PROXY__PORT=1080
```

---

## Production Deployment Checklist

- [ ] Deploy backend to Fly.io (or any cloud platform with port 25 open)
- [ ] Configure proper `hello_name` and `from_email` matching your domain
- [ ] Set up a SOCKS5 proxy for better deliverability (recommended)
- [ ] Configure `REACHER_BACKEND_URL` environment variable in Supabase
- [ ] Test with various email providers (Gmail, Yahoo, Outlook, etc.)
- [ ] Monitor backend logs for errors
- [ ] Set up proper DNS records (SPF, DKIM, DMARC) for your domain

---

## Troubleshooting

### "Failed to connect to backend"

1. Check that backend is running: `curl http://your-backend/version`
2. Verify `REACHER_BACKEND_URL` is set correctly in Supabase
3. Ensure backend URL is publicly accessible (not localhost)

### "Connection timeout" or slow validations

1. Increase `smtp_timeout` in backend config
2. Use a proxy to avoid IP blocks
3. Check network connectivity to mail servers

### "Invalid result" for valid emails

1. Some providers (Gmail, Yahoo) block unknown IPs
2. Use a proxy with a residential IP
3. Configure proper `hello_name` matching reverse DNS
4. Set up SPF/DKIM records for your domain

### Backend crashes or restarts

1. Check memory usage (Chrome headless needs ~512MB)
2. Increase VM size on Fly.io
3. Check logs: `fly logs` or `docker logs`

---

## Next Steps

1. **Deploy the backend to Fly.io** (see step 3 above)
2. **Configure REACHER_BACKEND_URL** in Supabase
3. **Test the application** end-to-end
4. **Consider setting up a proxy** for production use
5. **Monitor and optimize** based on your usage patterns

---

## Need Help?

- Backend Documentation: https://github.com/reacherhq/check-if-email-exists
- Reacher SaaS: https://reacher.email
- Issues: https://github.com/reacherhq/check-if-email-exists/issues
