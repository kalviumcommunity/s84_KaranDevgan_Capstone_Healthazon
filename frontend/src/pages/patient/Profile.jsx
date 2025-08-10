import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import API from "../../services/api";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileForm from "../../components/profile/ProfileForm";
import "../../components/profile/ProfileComponents.css";
import { showToast } from "../../utils/toast";
import "../../styles/ProfilePage.css";

function Profile() {
  const { user, setUser, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
  });

  // Fetch current user from backend when page loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/current", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(res.data);
      } catch (err) {
        showToast.error("Error fetching profile:", err);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await API.put(
        "/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast.success(res.data.message);
      setUser(res.data); 
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ user: res.data, token })
      ); 
    } catch (err) {
      showToast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <ProfileHeader 
        title="My Profile" 
        subtitle="Manage your personal information and preferences"
      />
      
      <ProfileForm 
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default Profile;
