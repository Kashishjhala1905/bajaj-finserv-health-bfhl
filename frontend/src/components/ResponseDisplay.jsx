import React from 'react';

export default function ResponseDisplay({ responseData, selectedFilters }) {
  if (!responseData) return null;

  const {
    numbers = [],
    alphabets = [],
    highest_lowercase_alphabet = [],
    is_prime_found = false,
    file_valid = false,
    file_mime_type = null,
    file_size_kb = null
  } = responseData;

  // Check if any filters are selected
  const hasFilters = selectedFilters.length > 0;

  return (
    <div className="glass-card">
      <div className="card-title-wrapper">
        <span className="card-icon" style={{ color: 'var(--color-secondary)' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>
        </span>
        <h2 className="card-title">Response Explorer</h2>
      </div>

      <p className="card-subtitle">Filtered view of processed results from the API.</p>

      <div className="results-grid">
        {/* Render filtered lists */}
        {hasFilters ? (
          <>
            {selectedFilters.includes('numbers') && (
              <div className="result-card">
                <div className="result-header">
                  <span className="result-header-dot" style={{ background: 'var(--color-secondary)' }}></span>
                  Numbers
                </div>
                <div className="values-container">
                  {numbers.length > 0 ? (
                    numbers.map((num, i) => (
                      <span key={i} className="value-tag highlight">{num}</span>
                    ))
                  ) : (
                    <span className="empty-placeholder">No numeric strings found</span>
                  )}
                </div>
              </div>
            )}

            {selectedFilters.includes('alphabets') && (
              <div className="result-card">
                <div className="result-header">
                  <span className="result-header-dot" style={{ background: 'var(--color-primary)' }}></span>
                  Alphabets
                </div>
                <div className="values-container">
                  {alphabets.length > 0 ? (
                    alphabets.map((alpha, i) => (
                      <span key={i} className="value-tag">{alpha}</span>
                    ))
                  ) : (
                    <span className="empty-placeholder">No alphabetic characters found</span>
                  )}
                </div>
              </div>
            )}

            {selectedFilters.includes('highest_lowercase_alphabet') && (
              <div className="result-card">
                <div className="result-header">
                  <span className="result-header-dot" style={{ background: 'var(--color-success)' }}></span>
                  Highest Lowercase Alphabet
                </div>
                <div className="values-container">
                  {highest_lowercase_alphabet.length > 0 ? (
                    highest_lowercase_alphabet.map((char, i) => (
                      <span key={i} className="value-tag" style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.08)' }}>{char}</span>
                    ))
                  ) : (
                    <span className="empty-placeholder">No lowercase alphabets found</span>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="result-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.75rem', opacity: 0.5 }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <p>Please select one or more filter tags above to inspect response data fields.</p>
          </div>
        )}

        {/* Metapanel details */}
        <div className="meta-panel-grid">
          <div className="meta-item">
            <div className={`meta-icon-box ${is_prime_found ? 'success' : 'primary'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <div className="meta-content">
              <span className="meta-label">Prime Numbers</span>
              <span className="meta-val">{is_prime_found ? 'PRIME DETECTED' : 'NO PRIMES FOUND'}</span>
            </div>
          </div>

          <div className="meta-item">
            <div className={`meta-icon-box ${file_valid ? 'success' : 'warning'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
              </svg>
            </div>
            <div className="meta-content">
              <span className="meta-label">File Status</span>
              <span className="meta-val">
                {file_valid ? `${file_mime_type} (${file_size_kb} KB)` : 'NO FILE / INVALID'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
