import React from 'react';
import './ProfileComponents.css';

const ProfileHeader = ({ title, subtitle }) => {
  return (
    <div className="profile-header">
      <div className="profile-header-content">
        <h1 className="profile-title">{title}</h1>
        {subtitle && <p className="profile-subtitle">{subtitle}</p>}
      </div>
      <div className="profile-header-decoration">
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
        <div className="decoration-circle"></div>
      </div>
    </div>
  );
};

export default ProfileHeader;
