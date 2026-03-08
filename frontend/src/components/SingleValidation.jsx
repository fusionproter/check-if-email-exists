import { useState } from 'react';
import ResultCard from './ResultCard';

const API_URL = import.meta.env.VITE_API_URL || '';

function SingleValidation() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const validateEmail = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/v1/check_email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to_email: email,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(`Failed to validate email: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="validation-section">
      <div className="section-header">
        <h2>Single Email Validation</h2>
        <p>Verify a single email address for deliverability and accuracy</p>
      </div>

      <form onSubmit={validateEmail} className="single-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-group">
            <input
              type="email"
              id="email"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="email-input"
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Validating...
                </>
              ) : (
                'Validate'
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="alert alert-error">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {result && <ResultCard result={result} />}
    </div>
  );
}

export default SingleValidation;
