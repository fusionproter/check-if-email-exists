# Email Validator Frontend

A modern web interface for validating email addresses using the Reacher backend.

## Features

- **Single Email Validation**: Verify individual email addresses
- **Bulk Email Validation**: Validate multiple emails at once
  - Upload CSV files
  - Paste email lists
  - Track validation progress
  - Download results as CSV
- Modern, responsive design
- Real-time validation status updates

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Reacher backend running on `http://localhost:8080`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Configuration

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:8080
```

For production, set `VITE_API_URL` to your backend URL.

## Usage

### Single Email Validation

1. Navigate to the "Single Validation" tab
2. Enter an email address
3. Click "Validate"
4. View detailed validation results

### Bulk Email Validation

1. Navigate to the "Bulk Validation" tab
2. Choose input method:
   - **Paste Text**: Enter emails separated by newlines, commas, or semicolons
   - **Upload CSV**: Upload a CSV file containing email addresses
3. Click "Start Validation"
4. Monitor progress in real-time
5. Download results as CSV when complete

## API Endpoints Used

- `POST /v1/check_email` - Single email validation
- `POST /v1/bulk` - Create bulk validation job
- `GET /v1/bulk/{job_id}` - Check bulk validation progress
- `GET /v1/bulk/{job_id}/results` - Download bulk validation results

## License

This project is part of the Reacher email validation suite.
