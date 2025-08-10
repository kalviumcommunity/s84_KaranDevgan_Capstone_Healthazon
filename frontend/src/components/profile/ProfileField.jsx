import React from 'react';
import './ProfileComponents.css';

const ProfileField = ({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  required = false, 
  readOnly = false, 
  options = null,
  placeholder = ""
}) => {
  const renderInput = () => {
    if (type === "select" && options) {
      return (
        <select 
          name={name} 
          value={value} 
          onChange={onChange}
          className="profile-select"
          required={required}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`profile-input ${readOnly ? 'readonly' : ''}`}
      />
    );
  };

  return (
    <div className="profile-field">
      <label className="profile-label" htmlFor={name}>
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <div className="input-wrapper">
        {renderInput()}
        {readOnly && (
          <div className="readonly-indicator">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <circle cx="12" cy="16" r="1"></circle>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileField;
