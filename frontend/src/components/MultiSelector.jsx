import React from 'react';

const FILTER_OPTIONS = [
  { id: 'alphabets', label: 'Alphabets', color: 'var(--color-primary)' },
  { id: 'numbers', label: 'Numbers', color: 'var(--color-secondary)' },
  { id: 'highest_lowercase_alphabet', label: 'Highest lowercase alphabet', color: 'var(--color-success)' }
];

export default function MultiSelector({ selectedFilters, onFilterChange }) {
  const handleToggle = (id) => {
    if (selectedFilters.includes(id)) {
      onFilterChange(selectedFilters.filter(item => item !== id));
    } else {
      onFilterChange([...selectedFilters, id]);
    }
  };

  return (
    <div className="multiselect-container">
      <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }}>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        Filter Response Fields
      </label>
      <div className="chips-wrapper">
        {FILTER_OPTIONS.map((option) => {
          const isActive = selectedFilters.includes(option.id);
          return (
            <div
              key={option.id}
              className={`custom-chip ${isActive ? 'active' : ''}`}
              onClick={() => handleToggle(option.id)}
              style={isActive ? { borderColor: option.color, color: option.color } : {}}
            >
              <span
                className="chip-dot"
                style={isActive ? { background: option.color, boxShadow: `0 0 8px ${option.color}` } : {}}
              />
              {option.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
