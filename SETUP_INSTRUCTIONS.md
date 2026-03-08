# 🚀 Setup Instructions - Email Validator SaaS

## Current Status

✅ Frontend is ready and deployed
✅ Supabase database is configured
✅ Edge Functions are deployed
⚠️  **Backend needs to be deployed**

---

## Quick Start (3 Steps)

### Step 1: Deploy the Rust Backend to Fly.io

The backend performs the real email validation using SMTP verification.

```bash
# Navigate to backend folder
cd backend

# Install Fly CLI (if not already installed)
curl -L https://fly.io/install.sh | sh

# Login to Fly.io (creates free account if needed)
fly auth login

# Deploy to Fly.io
fly deploy
```

After deployment, you'll get a URL like:
```
https://email-validator-backend.fly.dev
```

**Copy this URL** - you'll need it in Step 2!

---

### Step 2: Configure the Backend URL

Tell Supabase where your backend is running.

**Option A: Using Supabase Dashboard (Easiest)**

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Project Settings** → **Edge Functions**
4. Add environment variable:
   - Name: `REACHER_BACKEND_URL`
   - Value: `https://email-validator-backend.fly.dev` (your URL from Step 1)
5. Click **Save**

**Option B: Using Supabase CLI**

```bash
supabase secrets set REACHER_BACKEND_URL=https://email-validator-backend.fly.dev
```

---

### Step 3: Test Your Application

Open your deployed frontend and try validating an email!

**Test emails:**
- ✅ Valid: `test@gmail.com`
- ❌ Invalid: `invalid@nonexistentdomain123456.com`
- ⚠️  Risky: `admin@example.com` (role account)

---

## Alternative: Local Development

### Run Backend Locally (Docker)

```bash
# Start the backend
docker run -p 8080:8080 reacherhq/backend:latest

# Test it
curl -X POST http://localhost:8080/v0/check_email \
  -H "Content-Type: application/json" \
  -d '{"to_email": "test@gmail.com"}'
```

**Note:** Edge Functions can't access `localhost`, so this is only for direct backend testing.

---

## How It Works

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────────┐
│  Supabase Edge      │  (TypeScript Proxy)
│  Functions          │
└──────┬──────────────┘
       │ Proxies to...
       ▼
┌─────────────────────┐
│  Reacher Backend    │  (Rust - Real SMTP Verification)
│  (Fly.io)           │
└──────┬──────────────┘
       │ Verifies via SMTP
       ▼
┌─────────────────────┐
│  Email Providers    │  (Gmail, Yahoo, Outlook, etc.)
│  SMTP Servers       │
└─────────────────────┘
```

---

## Production Checklist

For production use, you should:

- [ ] Deploy backend to Fly.io or similar (port 25 must be open)
- [ ] Configure `REACHER_BACKEND_URL` in Supabase
- [ ] Set up proper SMTP settings (`hello_name`, `from_email`)
- [ ] Consider using a SOCKS5 proxy for better deliverability
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Add authentication to your frontend

---

## Troubleshooting

### "Failed to fetch" or CORS errors

- Make sure `REACHER_BACKEND_URL` is set in Supabase
- Verify the backend URL is publicly accessible
- Check backend is running: `curl https://your-backend.fly.dev/version`

### Emails showing as "invalid" when they're valid

- Some providers (Gmail, Yahoo) block unknown IPs
- Use a proxy with a residential IP address
- Configure proper reverse DNS and SPF/DKIM records

### Backend not responding

- Check Fly.io logs: `fly logs`
- Verify the app is running: `fly status`
- Ensure port 8080 is exposed in `fly.toml`

---

## Documentation

- **Backend Setup Guide**: See `BACKEND_SETUP.md` for detailed configuration
- **API Documentation**: See `backend/openapi.json`
- **Deployment Guide**: See `DEPLOYMENT.md`

---

## Need Help?

1. **Read the guides**:
   - `BACKEND_SETUP.md` - Detailed backend configuration
   - `DEPLOYMENT.md` - Full deployment guide
   - `README.md` - Project overview

2. **Check the backend repo**:
   - https://github.com/reacherhq/check-if-email-exists

3. **Commercial support**:
   - https://reacher.email

---

**You're almost done! Just deploy the backend and configure the URL.**
