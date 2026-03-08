# Email Validator - Complete Application

A modern, full-stack email validation application built with Reacher backend and React frontend.

## Features

- **Single Email Validation**: Verify individual email addresses with detailed results
- **Bulk Email Validation**: Validate thousands of emails efficiently
  - Upload CSV files
  - Paste email lists
  - Real-time progress tracking
  - Download results as CSV
- **Comprehensive Validation**: Syntax, MX records, SMTP verification, and more
- **Modern UI**: Clean, responsive interface with real-time updates
- **Production Ready**: Docker support, scalable architecture

## Screenshots

### Single Email Validation
Verify individual emails with detailed validation results including:
- Syntax validation
- MX record verification
- SMTP connection testing
- Disposable email detection
- Role account detection

### Bulk Email Validation
Process multiple emails efficiently:
- Upload CSV files or paste email lists
- Real-time progress tracking
- Summary statistics (deliverable, risky, invalid, unknown)
- Download complete results as CSV

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up
```

Access the application at `http://localhost`

### Option 2: Manual Setup

#### Prerequisites
- Rust (latest stable)
- Node.js (v16+)
- PostgreSQL (optional, for storing results)

#### Backend Setup
```bash
cd backend
cargo build --release
cargo run
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Access the application at `http://localhost:5173`

## Project Structure

```
.
├── backend/              # Reacher email validation API (Rust)
│   ├── src/             # Source code
│   ├── migrations/      # Database migrations
│   └── backend_config.toml  # Configuration
├── frontend/            # Web interface (React + Vite)
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.jsx     # Main application
│   │   └── App.css     # Styles
│   └── public/          # Static assets
├── docker-compose.yml   # Docker orchestration
└── DEPLOYMENT.md        # Deployment guide
```

## API Endpoints

### Single Email Validation
```bash
POST /v1/check_email
Content-Type: application/json

{
  "to_email": "example@domain.com"
}
```

### Bulk Email Validation
```bash
# Create job
POST /v1/bulk
Content-Type: application/json

{
  "input": ["email1@domain.com", "email2@domain.com"]
}

# Check progress
GET /v1/bulk/{job_id}

# Download results
GET /v1/bulk/{job_id}/results?format=csv
```

## Configuration

### Backend Configuration
Edit `backend/backend_config.toml`:

```toml
backend_name = "my-validator"
http_host = "0.0.0.0"
http_port = 8080

# Throttle settings (v1 endpoints only)
[throttle]
max_requests_per_minute = 60
max_requests_per_day = 10000

# Database (optional)
[storage.postgres]
db_url = "postgresql://user:pass@localhost/reacherdb"
```

### Frontend Configuration
Create `frontend/.env`:

```
VITE_API_URL=http://localhost:8080
```

## Usage Guide

### Single Email Validation

1. Click the "Single Validation" tab
2. Enter an email address
3. Click "Validate"
4. View detailed results:
   - **Deliverable**: Email is valid and can receive mail
   - **Risky**: Email exists but has suspicious properties
   - **Undeliverable**: Email does not exist or is disabled
   - **Unknown**: Verification could not be completed

### Bulk Email Validation

1. Click the "Bulk Validation" tab
2. Choose input method:
   - **Paste Text**: Enter emails (one per line or comma-separated)
   - **Upload CSV**: Select a CSV file with email addresses
3. Click "Start Validation"
4. Monitor real-time progress
5. When complete, download results as CSV

### CSV Format

Input CSV can be simple (one email per line):
```
email1@example.com
email2@example.com
```

Or with headers:
```
email
user1@example.com
user2@example.com
```

Output CSV includes all validation details:
```
input,is_reachable,syntax__is_valid_syntax,mx__accepts_mail,...
user1@example.com,safe,true,true,...
user2@example.com,invalid,false,false,...
```

## Validation Results Explained

### Reachability Status
- **Safe (Deliverable)**: Email is valid, mailbox exists, and can receive mail
- **Risky**: Email might be valid but has concerning properties (catch-all, disposable, etc.)
- **Invalid (Undeliverable)**: Email is invalid or mailbox doesn't exist
- **Unknown**: Unable to determine (server timeout, temporary errors, etc.)

### Validation Checks
- **Syntax**: RFC-compliant email format
- **MX Records**: Domain has mail servers configured
- **SMTP**: Mailbox exists and accepts mail
- **Catch-all**: Domain accepts mail for any address
- **Disposable**: Temporary/disposable email service
- **Role Account**: Generic address (admin@, info@, etc.)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy with Docker

```bash
# Production deployment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Performance

- **Single validation**: ~2-5 seconds per email
- **Bulk validation**: Processes emails in parallel (configurable concurrency)
- **Rate limiting**: Configurable throttle to protect your IP reputation
- **Scaling**: Support for RabbitMQ worker architecture for high volume

## Security

- No authentication required for basic use (add your own if needed)
- Rate limiting to prevent abuse
- Proxy support for IP rotation
- Secure SMTP connections
- No email addresses stored by default (enable PostgreSQL storage if needed)

## Troubleshooting

### Backend won't start
- Check if port 8080 is available
- Verify Rust installation: `cargo --version`
- Check logs for specific errors

### Frontend build fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be v16+)

### Validation errors
- Verify backend is running and accessible
- Check network connectivity
- Some email providers block verification attempts

### CORS errors
- In development, ensure Vite proxy is configured
- In production, configure proper CORS headers or use reverse proxy

## Contributing

See the main Reacher repository for contribution guidelines.

## License

See LICENSE.md in the root directory.

## Support

- Backend Documentation: `backend/README.md`
- Frontend Documentation: `frontend/README.md`
- Deployment Guide: `DEPLOYMENT.md`
- Issues: Submit via GitHub

## Credits

- Backend: [Reacher](https://github.com/reacherhq/check-if-email-exists) - Open-source email verification
- Frontend: Custom React interface built with Vite
