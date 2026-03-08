/*
  # Email Validation Schema

  1. New Tables
    - `email_validations`
      - `id` (uuid, primary key)
      - `email` (text, email being validated)
      - `is_reachable` (text, validation result: safe/risky/invalid/unknown)
      - `is_valid_syntax` (boolean)
      - `domain` (text)
      - `username` (text)
      - `mx_records` (jsonb, array of MX records)
      - `accepts_mail` (boolean)
      - `is_disposable` (boolean)
      - `is_role_account` (boolean)
      - `created_at` (timestamptz)
      
    - `bulk_validation_jobs`
      - `id` (uuid, primary key)
      - `total_records` (integer)
      - `processed_records` (integer, default 0)
      - `status` (text, Running/Completed)
      - `total_safe` (integer, default 0)
      - `total_risky` (integer, default 0)
      - `total_invalid` (integer, default 0)
      - `total_unknown` (integer, default 0)
      - `created_at` (timestamptz)
      - `finished_at` (timestamptz, nullable)
      
    - `bulk_validation_results`
      - `id` (uuid, primary key)
      - `job_id` (uuid, foreign key to bulk_validation_jobs)
      - `email` (text)
      - `result` (jsonb, full validation result)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public can insert and read (no auth required for simplicity)
*/

-- Email Validations Table
CREATE TABLE IF NOT EXISTS email_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  is_reachable text NOT NULL,
  is_valid_syntax boolean DEFAULT false,
  domain text,
  username text,
  mx_records jsonb DEFAULT '[]'::jsonb,
  accepts_mail boolean DEFAULT false,
  is_disposable boolean DEFAULT false,
  is_role_account boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Bulk Validation Jobs Table
CREATE TABLE IF NOT EXISTS bulk_validation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_records integer NOT NULL,
  processed_records integer DEFAULT 0,
  status text DEFAULT 'Running',
  total_safe integer DEFAULT 0,
  total_risky integer DEFAULT 0,
  total_invalid integer DEFAULT 0,
  total_unknown integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  finished_at timestamptz
);

-- Bulk Validation Results Table
CREATE TABLE IF NOT EXISTS bulk_validation_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES bulk_validation_jobs(id) ON DELETE CASCADE,
  email text NOT NULL,
  result jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_validations_email ON email_validations(email);
CREATE INDEX IF NOT EXISTS idx_email_validations_created_at ON email_validations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bulk_jobs_created_at ON bulk_validation_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bulk_results_job_id ON bulk_validation_results(job_id);

-- Enable Row Level Security
ALTER TABLE email_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_validation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_validation_results ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public access (no auth required)
CREATE POLICY "Anyone can insert email validations"
  ON email_validations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read email validations"
  ON email_validations FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert bulk jobs"
  ON bulk_validation_jobs FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read bulk jobs"
  ON bulk_validation_jobs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update bulk jobs"
  ON bulk_validation_jobs FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert bulk results"
  ON bulk_validation_results FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read bulk results"
  ON bulk_validation_results FOR SELECT
  TO anon
  USING (true);
