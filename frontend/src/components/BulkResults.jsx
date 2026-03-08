import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

function BulkResults({ jobId, progress, onReset }) {
  const [downloading, setDownloading] = useState(false);

  const downloadResults = async (format = 'csv') => {
    setDownloading(true);
    try {
      const response = await fetch(`${API_URL}/v1/bulk/${jobId}/results?format=${format}`);

      if (!response.ok) {
        throw new Error('Failed to download results');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `validation-results-${jobId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading results:', err);
      alert('Failed to download results');
    } finally {
      setDownloading(false);
    }
  };

  if (!progress) {
    return (
      <div className="bulk-results loading">
        <div className="spinner-large"></div>
        <p>Loading job status...</p>
      </div>
    );
  }

  const isComplete = progress.job_status === 'Completed';
  const percentage = progress.total_records > 0
    ? Math.round((progress.total_processed / progress.total_records) * 100)
    : 0;

  return (
    <div className="bulk-results">
      <div className="results-header">
        <div>
          <h3>Bulk Validation Progress</h3>
          <p className="job-id">Job ID: {jobId}</p>
        </div>
        {isComplete && (
          <button onClick={onReset} className="btn btn-secondary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            New Validation
          </button>
        )}
      </div>

      <div className="progress-section">
        <div className="progress-stats">
          <div className="stat">
            <span className="stat-label">Total</span>
            <span className="stat-value">{progress.total_records}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Processed</span>
            <span className="stat-value">{progress.total_processed}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Status</span>
            <span className={`stat-badge ${isComplete ? 'badge-success' : 'badge-info'}`}>
              {progress.job_status}
            </span>
          </div>
        </div>

        <div className="progress-bar-container">
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="progress-percentage">{percentage}%</span>
        </div>
      </div>

      {progress.summary && (
        <div className="summary-section">
          <h4>Validation Summary</h4>
          <div className="summary-grid">
            <div className="summary-card summary-safe">
              <div className="summary-icon">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="summary-content">
                <span className="summary-label">Deliverable</span>
                <span className="summary-value">{progress.summary.total_safe || 0}</span>
              </div>
            </div>

            <div className="summary-card summary-risky">
              <div className="summary-icon">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="summary-content">
                <span className="summary-label">Risky</span>
                <span className="summary-value">{progress.summary.total_risky || 0}</span>
              </div>
            </div>

            <div className="summary-card summary-invalid">
              <div className="summary-icon">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="summary-content">
                <span className="summary-label">Undeliverable</span>
                <span className="summary-value">{progress.summary.total_invalid || 0}</span>
              </div>
            </div>

            <div className="summary-card summary-unknown">
              <div className="summary-icon">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="summary-content">
                <span className="summary-label">Unknown</span>
                <span className="summary-value">{progress.summary.total_unknown || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="download-section">
          <div className="download-info">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            <div>
              <h4>Download Results</h4>
              <p>Report Download available only for 7 days from creation</p>
            </div>
          </div>
          <button
            onClick={() => downloadResults('csv')}
            disabled={downloading}
            className="btn btn-primary"
          >
            {downloading ? (
              <>
                <span className="spinner"></span>
                Downloading...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download CSV
              </>
            )}
          </button>
        </div>
      )}

      {!isComplete && (
        <div className="alert alert-info">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Validation in progress. This page will update automatically.
        </div>
      )}
    </div>
  );
}

export default BulkResults;
