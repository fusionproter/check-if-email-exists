function ResultCard({ result }) {
  const getStatusBadge = (status) => {
    const badges = {
      safe: { label: 'Deliverable', className: 'badge-success' },
      risky: { label: 'Risky', className: 'badge-warning' },
      invalid: { label: 'Undeliverable', className: 'badge-error' },
      unknown: { label: 'Unknown', className: 'badge-neutral' },
    };
    return badges[status] || badges.unknown;
  };

  const badge = getStatusBadge(result.is_reachable);

  return (
    <div className="result-card">
      <div className="result-header">
        <h3>Validation Result</h3>
        <span className={`badge ${badge.className}`}>{badge.label}</span>
      </div>

      <div className="result-main">
        <div className="result-email">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span>{result.input}</span>
        </div>
      </div>

      <div className="result-details">
        <div className="detail-section">
          <h4>Syntax Validation</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Valid Syntax</span>
              <span className={`detail-value ${result.syntax?.is_valid_syntax ? 'text-success' : 'text-error'}`}>
                {result.syntax?.is_valid_syntax ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Username</span>
              <span className="detail-value">{result.syntax?.username || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Domain</span>
              <span className="detail-value">{result.syntax?.domain || '-'}</span>
            </div>
          </div>
        </div>

        {result.mx && (
          <div className="detail-section">
            <h4>MX Records</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Accepts Mail</span>
                <span className={`detail-value ${result.mx.accepts_mail ? 'text-success' : 'text-error'}`}>
                  {result.mx.accepts_mail ? 'Yes' : 'No'}
                </span>
              </div>
              {result.mx.records && result.mx.records.length > 0 && (
                <div className="detail-item detail-item-full">
                  <span className="detail-label">Mail Servers</span>
                  <div className="detail-list">
                    {result.mx.records.slice(0, 3).map((record, idx) => (
                      <span key={idx} className="detail-value detail-chip">{record}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {result.smtp && (
          <div className="detail-section">
            <h4>SMTP Validation</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Can Connect</span>
                <span className={`detail-value ${result.smtp.can_connect_smtp ? 'text-success' : 'text-error'}`}>
                  {result.smtp.can_connect_smtp ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Deliverable</span>
                <span className={`detail-value ${result.smtp.is_deliverable ? 'text-success' : 'text-error'}`}>
                  {result.smtp.is_deliverable ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Catch-All</span>
                <span className={`detail-value ${result.smtp.is_catch_all ? 'text-warning' : 'text-neutral'}`}>
                  {result.smtp.is_catch_all ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Full Inbox</span>
                <span className={`detail-value ${result.smtp.has_full_inbox ? 'text-error' : 'text-neutral'}`}>
                  {result.smtp.has_full_inbox ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Disabled</span>
                <span className={`detail-value ${result.smtp.is_disabled ? 'text-error' : 'text-neutral'}`}>
                  {result.smtp.is_disabled ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}

        {result.misc && (
          <div className="detail-section">
            <h4>Additional Information</h4>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Disposable</span>
                <span className={`detail-value ${result.misc.is_disposable ? 'text-warning' : 'text-neutral'}`}>
                  {result.misc.is_disposable ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Role Account</span>
                <span className={`detail-value ${result.misc.is_role_account ? 'text-warning' : 'text-neutral'}`}>
                  {result.misc.is_role_account ? 'Yes' : 'No'}
                </span>
              </div>
              {result.misc.gravatar_url && (
                <div className="detail-item">
                  <span className="detail-label">Gravatar</span>
                  <span className="detail-value text-success">Found</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultCard;
