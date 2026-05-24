import React, { useState, useEffect } from 'react';

export default function JsonInput({ onSubmit, isLoading }) {
  const [jsonText, setJsonText] = useState(
    JSON.stringify({ data: ["A", "1", "334", "4", "R", "g"] }, null, 2)
  );
  const [validationError, setValidationError] = useState(null);
  const [fileBase64, setFileBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  // Validate JSON whenever the user types
  useEffect(() => {
    if (!jsonText.trim()) {
      setValidationError("JSON input cannot be empty");
      return;
    }
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.data || !Array.isArray(parsed.data)) {
        setValidationError("JSON must contain a 'data' array (e.g. { \"data\": [\"A\", \"1\"] })");
      } else {
        setValidationError(null);
      }
    } catch (e) {
      setValidationError(`Invalid JSON syntax: ${e.message}`);
    }
  }, [jsonText]);

  // Convert uploaded file to base64 and inject into the JSON payload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const sizeInKb = (file.size / 1024).toFixed(1);
    setFileSize(`${sizeInKb} KB`);

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      setFileBase64(base64String);

      // Dynamically inject the base64 string into the active JSON editor text
      try {
        const parsed = JSON.parse(jsonText);
        parsed.file_b64 = base64String;
        setJsonText(JSON.stringify(parsed, null, 2));
      } catch (err) {
        // If current text isn't valid JSON, overwrite it completely
        setJsonText(JSON.stringify({
          data: ["A", "1", "334", "4", "R", "g"],
          file_b64: base64String
        }, null, 2));
      }
    };
    reader.onerror = (error) => {
      console.error('File reading error:', error);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setFileBase64('');
    setFileName('');
    setFileSize('');

    try {
      const parsed = JSON.parse(jsonText);
      delete parsed.file_b64;
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch (err) {
      // If parsing fails, fall back to default
      setJsonText(JSON.stringify({ data: ["A", "1", "334", "4", "R", "g"] }, null, 2));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validationError) return;

    try {
      const payload = JSON.parse(jsonText);
      onSubmit(payload);
    } catch (err) {
      setValidationError("Failed to parse JSON. Please check syntax.");
    }
  };

  return (
    <div className="glass-card">
      <div className="card-title-wrapper">
        <span className="card-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </span>
        <h2 className="card-title">API Request Builder</h2>
      </div>

      <p className="card-subtitle">Enter the input JSON payload and optionally attach a file to analyze.</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">JSON Payload</label>
          <textarea
            className="textarea-code"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='{ "data": ["A", "1", "334"] }'
            spellCheck="false"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Optional File Attachment (MIME & Size Parser)</label>
          
          {!fileName ? (
            <label className="file-upload-box">
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <span className="file-upload-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
              </span>
              <span className="file-upload-text">Click to choose or drop a file</span>
              <span className="file-upload-subtext">Will auto-encode to Base64 and insert into JSON payload</span>
            </label>
          ) : (
            <div className="file-details-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-secondary)' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <div className="file-details-text">
                <strong>{fileName}</strong> ({fileSize})
              </div>
              <button
                type="button"
                className="file-remove-btn"
                onClick={handleRemoveFile}
                title="Remove file"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          )}
        </div>

        {validationError && (
          <div className="error-box">
            <span className="error-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </span>
            <span>{validationError}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary"
          disabled={!!validationError || isLoading}
        >
          {isLoading ? (
            <>
              <span className="loader-spinner"></span>
              Executing Request...
            </>
          ) : (
            <>
              <span>Submit Request</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
