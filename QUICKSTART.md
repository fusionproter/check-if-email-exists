# Quick Start Guide

Get the email validator running in 5 minutes!

## Prerequisites

- Docker and Docker Compose (Recommended)
  OR
- Rust + Node.js (Manual setup)

## Option 1: Docker (Easiest)

```bash
# Start everything
docker-compose up

# Access the application
# Open http://localhost in your browser
```

That's it! The complete application is now running.

## Option 2: Development Mode

### Terminal 1 - Backend
```bash
cd backend
cargo run
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

### Access
Open http://localhost:5173 in your browser

## First Validation

### Single Email
1. Click "Single Validation" tab
2. Enter: `test@gmail.com`
3. Click "Validate"
4. View results!

### Bulk Emails
1. Click "Bulk Validation" tab
2. Paste these emails:
   ```
   test1@gmail.com
   test2@yahoo.com
   invalid@invalid123456.com
   ```
3. Click "Start Validation"
4. Watch the progress
5. Download CSV when complete

## What's Running?

- **Backend** (Port 8080): Email validation API
- **Frontend** (Port 5173 or 80): Web interface
- **Database** (Port 5432): PostgreSQL (Docker only)

## Next Steps

- Read `EMAIL_VALIDATOR_README.md` for full documentation
- Check `DEPLOYMENT.md` for production deployment
- Customize `backend/backend_config.toml` for your needs

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :8080
lsof -i :5173

# Kill the process or change ports in config
```

### Docker issues
```bash
# Clean up and restart
docker-compose down
docker-compose up --build
```

### Backend compile errors
```bash
# Update Rust
rustup update

# Clean build
cd backend
cargo clean
cargo build
```

## Need Help?

- Check logs: `docker-compose logs -f`
- Review `EMAIL_VALIDATOR_README.md`
- Check backend logs in terminal
- Open browser console for frontend errors

Happy validating!
