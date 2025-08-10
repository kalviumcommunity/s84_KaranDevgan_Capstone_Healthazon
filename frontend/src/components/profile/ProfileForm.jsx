import React from 'react';
import ProfileField from './ProfileField';
import './ProfileComponents.css';

const ProfileForm = ({ formData, handleChange, handleSubmit, isLoading = false }) => {
  const genderOptions = [
    { value: "", label: "-- Select Gender --" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ];

  return (
    <div className="profile-form-container">
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="form-grid">
            <ProfileField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={true}
              placeholder="Enter your full name"
            />
            
            <ProfileField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={true}
            />
            
            <ProfileField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
            />
            
            <ProfileField
              label="Gender"
              name="gender"
              type="select"
              value={formData.gender}
              onChange={handleChange}
              options={genderOptions}
            />
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Contact Information</h3>
          <div className="form-grid">
            <ProfileField
              label="Phone Number"
              name="contact"
              type="tel"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
            
            <ProfileField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Updating...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17,21 17,13 7,13 7,21"></polyline>
                  <polyline points="7,3 7,8 15,8"></polyline>
                </svg>
                Update Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
