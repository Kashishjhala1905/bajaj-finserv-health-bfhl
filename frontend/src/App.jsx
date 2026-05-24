import React, { useState } from 'react';
import JsonInput from './components/JsonInput';
import MultiSelector from './components/MultiSelector';
import ResponseDisplay from './components/ResponseDisplay';

export default function App() {
  const [apiUrl, setApiUrl] = useState('http://localhost:5000/bfhl');
  const [selectedFilters, setSelectedFilters] = useState(['alphabets', 'numbers', 'highest_lowercase_alphabet']);
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFormSubmit = async (payload) => {
    setIsLoading(true);
    setErrorMessage(null);
    setResponseData(null);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseData(data);
      } else {
        setErrorMessage(data.message || `API Error: Server returned status code ${response.status}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      setErrorMessage(`Network connection failed: Unable to connect to ${apiUrl}. Please make sure the backend server is running and CORS is enabled.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-logo-glow">BF</div>
          <div>
            <h1 className="brand-title">Bajaj Health Qualifier 1</h1>
            <span className="brand-subtitle">Automated Data & File Processing Engine</span>
          </div>
        </div>
        <div className="roll-badge">
          ROLL: 21BCE10000
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="main-grid">
        {/* Left Hand Column: Inputs */}
        <section className="left-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* API Configuration Card */}
          <div className="glass-card">
            <div className="card-title-wrapper" style={{ marginBottom: '1rem' }}>
              <span className="card-icon" style={{ color: 'var(--color-secondary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </span>
              <h3 className="card-title" style={{ fontSize: '1.1rem' }}>API Endpoint Settings</h3>
            </div>
            
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Express Deployed / Local URL</label>
              <div className="endpoint-config-wrapper">
                <input
                  type="text"
                  className="input-text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://your-backend.onrender.com/bfhl"
                />
              </div>
            </div>
          </div>

          <JsonInput onSubmit={handleFormSubmit} isLoading={isLoading} />
        </section>

        {/* Right Hand Column: Outputs */}
        <section className="right-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {errorMessage && (
            <div className="error-box" style={{ margin: 0 }}>
              <span className="error-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="glass-card" style={{ paddingBottom: '1rem', paddingTop: '1.5rem' }}>
            <MultiSelector
              selectedFilters={selectedFilters}
              onFilterChange={setSelectedFilters}
            />
          </div>

          <ResponseDisplay
            responseData={responseData}
            selectedFilters={selectedFilters}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Bajaj Finserv Health Challenge Qualifier 1 Application • Developed by Kashish Jhala (Roll: 21BCE10000)</p>
      </footer>
    </div>
  );
}
