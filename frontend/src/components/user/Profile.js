import React, { useEffect, useState } from 'react';
import { getUserProfile, logoutUser } from '../api';
import { removeUser, getToken } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Profile.css'

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = getToken();
        if (!token) {
          setProfileData(null);
        } else {
          const profile = await getUserProfile();
          setProfileData(profile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    await logoutUser(); 
    removeUser(); 
    navigate('/'); 
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      {profileData ? (
        <div>
          <p>Name: {profileData.name}</p>
          <p>Email: {profileData.email}</p>
          <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>No user logged in.</p>
          <div>
            <Link to="/register" className="btn btn-primary">Register</Link>
            <Link to="/login" className="btn btn-primary">Login</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
