# Email Validator - Deployment Guide

This guide will help you deploy the complete email validation application (frontend + backend).

## Overview

The application consists of:
- **Backend**: Rust-based email verification API (Reacher)
- **Frontend**: React-based web interface

## Quick Start (Development)

### 1. Start the Backend

```bash
cd backend
cargo run
```

The backend will start on `http://localhost:8080`

### 2. Start the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

Visit `http://localhost:5173` in your browser to use the application.

## Production Deployment

### Backend Setup

1. Build the backend:
```bash
cd backend
cargo build --release
```

2. Configure the backend by editing `backend/backend_config.toml`:
```toml
backend_name = "production"
http_host = "0.0.0.0"
http_port = 8080
```

3. Run the backend:
```bash
./target/release/backend
```

### Frontend Setup

1. Build the frontend:
```bash
cd frontend
npm install
npm run build
```

2. The built files are in `frontend/dist/`

3. Serve the static files using any web server (nginx, Apache, etc.)

#### Example: Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /v0 {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /v1 {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Environment Variables

For production, set the API URL in the frontend `.env` file:

```
VITE_API_URL=https://api.yourdomain.com
```

Then rebuild the frontend.

## Docker Deployment (Alternative)

### Backend Docker

The backend already has a Dockerfile at `backend/Dockerfile`.

Build and run:
```bash
cd backend
docker build -t email-validator-backend .
docker run -p 8080:8080 email-validator-backend
```

### Frontend Docker

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Database Setup

If using PostgreSQL for storing results:

1. Create a PostgreSQL database
2. Configure the connection in `backend/backend_config.toml`:
```toml
[storage.postgres]
db_url = "postgresql://user:password@localhost/reacherdb"
```

3. Run migrations:
```bash
cd backend
sqlx migrate run
```

## Testing the Deployment

### Test Single Email Validation

```bash
curl -X POST http://localhost:8080/v1/check_email \
  -H "Content-Type: application/json" \
  -d '{"to_email": "test@example.com"}'
```

### Test Bulk Validation

1. Create a job:
```bash
curl -X POST http://localhost:8080/v1/bulk \
  -H "Content-Type: application/json" \
  -d '{"input": ["test1@example.com", "test2@example.com"]}'
```

2. Check progress (replace {job_id}):
```bash
curl http://localhost:8080/v1/bulk/{job_id}
```

3. Download results:
```bash
curl http://localhost:8080/v1/bulk/{job_id}/results?format=csv
```

## Monitoring

- Backend logs: Check console output or configure logging in `backend_config.toml`
- Frontend logs: Check browser console for client-side errors
- API performance: Monitor backend response times

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure:
1. The backend is configured to accept requests from your frontend domain
2. The proxy configuration in nginx/apache is correct

### Connection Refused

- Verify the backend is running on the expected port
- Check firewall rules
- Ensure the frontend is configured with the correct API URL

### Build Errors

Frontend:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

Backend:
```bash
cd backend
cargo clean
cargo build --release
```

## Security Considerations

1. **Rate Limiting**: Configure throttle settings in `backend_config.toml`
2. **Authentication**: Add authentication if exposing publicly
3. **HTTPS**: Always use HTTPS in production
4. **Database**: Secure PostgreSQL with strong passwords
5. **API Keys**: Never commit API keys or secrets to version control

## Scaling

For high-volume usage:

1. Enable RabbitMQ worker architecture (see `backend/README.md`)
2. Use multiple backend instances behind a load balancer
3. Configure PostgreSQL for optimal performance
4. Consider caching frequently validated domains

## Support

For issues or questions:
- Backend: See `backend/README.md`
- Frontend: See `frontend/README.md`
- Issues: Check the GitHub repository
