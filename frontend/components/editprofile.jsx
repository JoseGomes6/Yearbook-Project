import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

const InputField = ({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  required,
}) => (
  <div className="input-field-wrapper">
    <label>{label}</label>
    <input
      type={type}
      placeholder={`e.g. ${placeholder}`}
      name={name}
      value={value || ""}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default function EditProfile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    hometown: "",
    city: "",
    address: "",
    school: "",
    year: "",
    course: "",
    section: "",
    achievements: [],
    quote: "",
    coverPhoto: null,
    profilePhoto: null,
  });

  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5005/api/profile/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setProfileData((prev) => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhotoChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await convertToBase64(file);
      setProfileData((prev) => ({ ...prev, [type]: b64 }));
    }
  };

  const removeAchievement = (indexToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `http://localhost:5005/api/profile/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData),
        }
      );
      if (response.ok) {
        alert("✅ Changes saved!");
        navigate(`/profile/${userId}`);
      }
    } catch (error) {
      alert("Error saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    let achievementWithB64 = { ...newAchievement };
    if (newAchievement.image instanceof File) {
      achievementWithB64.image = await convertToBase64(newAchievement.image);
    }
    setProfileData((prevData) => ({
      ...prevData,
      achievements: [...prevData.achievements, achievementWithB64],
    }));
    setNewAchievement({ title: "", description: "", image: null });
    setShowModal(false);
  };

  if (loading) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div className="getstarted-main">
        <div className="getstarted-header">
          <h1>EDIT YOUR PROFILE</h1>
          <h4>Update your information and keep your yearbook fresh.</h4>
        </div>

        <div className="cover-wrapper">
          <div
            className="cover-upload"
            onClick={() => document.getElementById("coverIn").click()}
          >
            <img
              src={
                profileData.coverPhoto || "https://via.placeholder.com/1200x300"
              }
              alt="Cover"
              className="cover-photo"
            />
            <input
              id="coverIn"
              type="file"
              hidden
              onChange={(e) => handlePhotoChange(e, "coverPhoto")}
            />
          </div>
          <div
            className="profile-upload"
            onClick={() => document.getElementById("profileIn").click()}
          >
            <img
              src={
                profileData.profilePhoto || "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="profile-photo"
            />
            <input
              id="profileIn"
              type="file"
              hidden
              onChange={(e) => handlePhotoChange(e, "profilePhoto")}
            />
          </div>
        </div>

        <div className="tabs">
          {["personal", "class", "achievements", "quote"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === "personal" && (
            <div className="tab personal">
              <div className="columns-wrapper">
                <div className="column">
                  <InputField
                    label="First Name:"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Last Name:"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Email Address:"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="column">
                  <InputField
                    label="Date of Birth:"
                    name="dateOfBirth"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Hometown:"
                    name="hometown"
                    value={profileData.hometown}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="City:"
                    name="city"
                    value={profileData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "class" && (
            <div className="tab class">
              <div className="columns-wrapper">
                <div className="column">
                  <InputField
                    label="School/University:"
                    name="school"
                    value={profileData.school}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Year/Graduation:"
                    name="year"
                    value={profileData.year}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="column">
                  <InputField
                    label="Course/Program:"
                    name="course"
                    value={profileData.course}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Section/Group:"
                    name="section"
                    value={profileData.section}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="tab achievements">
              <button
                className="btn-add-achievement"
                onClick={() => setShowModal(true)}
              >
                + Add Achievement
              </button>
              <div className="achievements-list">
                {profileData.achievements.map((a, index) => (
                  <div key={index} className="achievement-item">
                    <button
                      className="remove-badge"
                      onClick={() => removeAchievement(index)}
                    >
                      ✕
                    </button>
                    <div className="achievement-text">
                      <strong>{a.title}</strong>
                      <p>{a.description}</p>
                    </div>
                    {a.image && (
                      <img
                        src={a.image}
                        alt="Ach"
                        className="achievement-image"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quote" && (
            <div className="tab quote-container">
              <label>Favorite Quote</label>
              <textarea
                maxLength={50}
                name="quote"
                value={profileData.quote}
                onChange={handleInputChange}
              />
              <div className="quote-counter">{profileData.quote.length}/50</div>
            </div>
          )}
        </div>

        <div className="edit-actions">
          <button
            className="btn-continue"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            className="btn-action btn-cancel"
            onClick={() => navigate(`/profile/${userId}`)}
          >
            Cancel
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Achievement</h3>
            <form onSubmit={handleModalSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={newAchievement.title}
                onChange={(e) =>
                  setNewAchievement({
                    ...newAchievement,
                    title: e.target.value,
                  })
                }
                required
              />
              <textarea
                placeholder="Description"
                value={newAchievement.description}
                onChange={(e) =>
                  setNewAchievement({
                    ...newAchievement,
                    description: e.target.value,
                  })
                }
                required
              />
              <input
                type="file"
                onChange={(e) =>
                  setNewAchievement({
                    ...newAchievement,
                    image: e.target.files[0],
                  })
                }
              />
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
