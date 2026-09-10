import React from 'react';
import './SearchBar.css';

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

/**
 * SearchBar — Reusable search input for tasks.
 * Props: value, onChange, placeholder
 */
export default function SearchBar({ value, onChange, placeholder = 'Search tasks...' }) {
  return (
    <div className="searchbar-wrapper">
      <span className="searchbar-icon"><IconSearch /></span>
      <input
        id="task-search-input"
        type="search"
        className="searchbar-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {value && (
        <button
          className="searchbar-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
}
