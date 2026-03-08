import { useState, useRef, useEffect } from 'react';
import BulkResults from './BulkResults';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw';

function BulkValidation() {
  const [emails, setEmails] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [inputMode, setInputMode] = useState('text');
  const fileInputRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (jobId) {
      checkProgress();
      intervalRef.current = setInterval(checkProgress, 2000);
      return () => clearInterval(intervalRef.current);
    }
  }, [jobId]);

  const checkProgress = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/bulk-status?job_id=${jobId}`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      if (!response.ok) throw new Error('Failed to check progress');

      const data = await response.json();
      setProgress(data);

      if (data.job_status === 'Completed') {
        clearInterval(intervalRef.current);
      }
    } catch (err) {
      console.error('Error checking progress:', err);
    }
  };

  const parseEmails = (text) => {
    return text
      .split(/[\n,;]/)
      .map(e => e.trim())
      .filter(e => e && e.includes('@'));
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const emailList = parseEmails(text);
      setEmails(emailList.join('\n'));
    };
    reader.readAsText(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailList = parseEmails(emails);

    if (emailList.length === 0) {
      setError('Please enter at least one email address');
      return;
    }

    setLoading(true);
    setError(null);
    setJobId(null);
    setProgress(null);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/bulk-validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          input: emailList,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJobId(data.job_id);
    } catch (err) {
      setError(`Failed to start bulk validation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmails('');
    setFile(null);
    setJobId(null);
    setProgress(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div className="validation-section">
      <div className="section-header">
        <h2>Bulk Email Validation</h2>
        <p>Quickly validate bulk emails for accuracy and efficiency</p>
      </div>

      {!jobId ? (
        <>
          <div className="input-mode-toggle">
            <button
              className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
              onClick={() => setInputMode('text')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Paste Text
            </button>
            <button
              className={`mode-btn ${inputMode === 'file' ? 'active' : ''}`}
              onClick={() => setInputMode('file')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Upload CSV
            </button>
          </div>

          <form onSubmit={handleSubmit} className="bulk-form">
            {inputMode === 'text' ? (
              <div className="form-group">
                <label htmlFor="emails">Email Addresses</label>
                <textarea
                  id="emails"
                  placeholder="Enter email addresses (one per line or comma-separated)&#10;example1@domain.com&#10;example2@domain.com&#10;example3@domain.com"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  disabled={loading}
                  rows={10}
                  className="email-textarea"
                />
                <div className="help-text">
                  {parseEmails(emails).length} email(s) ready to validate
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="file-upload" className="file-upload-label">
                  <div className="file-upload-area">
                    <svg width="48" height="48" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <p className="file-upload-text">
                      {file ? file.name : 'Select a CSV or Excel file to import'}
                    </p>
                    <p className="file-upload-hint">or drag and drop it here</p>
                    <p className="file-upload-limit">Maximum file size: 10 MB and up to 50,000 rows allowed.</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="file-input"
                  />
                </label>
                {file && (
                  <div className="help-text">
                    {parseEmails(emails).length} email(s) loaded from file
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="alert alert-error">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !emails}
              className="btn btn-primary btn-large"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Starting Validation...
                </>
              ) : (
                <>
                  Start Validation
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        <BulkResults
          jobId={jobId}
          progress={progress}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default BulkValidation;
