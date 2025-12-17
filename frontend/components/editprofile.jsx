import React, { useState, useEffect } from "react";
import "../styles/main.css";

export default function EditProfile({ userId, onFinish, existingData }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Inicializamos o estado com os dados que já existem (mockData ou vindo da BD)
  const [profileData, setProfileData] = useState({
    firstName: "John", // Exemplo de dados pré-preenchidos
    lastName: "Doe",
    email: "john.doe@yearbook.com",
    phone: "",
    dateOfBirth: "",
    hometown: "Porto",
    city: "",
    address: "",
    school: "University of Lisbon",
    year: "2024",
    course: "Computer Science",
    section: "A",
    achievements: [],
    quote: "The only way to do great work is to love what you do.",
  });

  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    const tabs = ["personal", "class", "achievements", "quote"];
    const nextIndex = tabs.indexOf(activeTab) + 1;
    if (nextIndex < tabs.length) setActiveTab(tabs[nextIndex]);
  };

  const handleFinish = async () => {
    setLoading(true);
    console.log("A atualizar perfil no servidor...", profileData);

    setTimeout(() => {
      alert("✅ Perfil atualizado com sucesso!");
      if (onFinish) onFinish();
      setLoading(false);
    }, 1000);
  };

  // Reutilizamos o teu componente auxiliar InputField
  const InputField = ({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
  }) => (
    <div className="input-field-wrapper">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="page">
      <div className="getstarted-main">
        <div className="getstarted-header">
          <h1>EDIT YOUR PROFILE</h1>
          <h4>Keep your information up to date for the yearbook.</h4>
        </div>

        {/* Reutiliza o layout de fotos do GetStarted */}
        <div className="cover-wrapper">
          <div
            className="cover-upload"
            onClick={() => document.getElementById("coverInput").click()}
          >
            <img
              src={coverPhoto || "https://picsum.photos/1200/300"}
              className="cover-photo"
              alt="Cover"
            />
            <input
              id="coverInput"
              type="file"
              hidden
              onChange={(e) =>
                setCoverPhoto(URL.createObjectURL(e.target.files[0]))
              }
            />
          </div>
          <div
            className="profile-upload"
            onClick={() => document.getElementById("profileInput").click()}
          >
            <img
              src={profilePhoto || "https://i.pravatar.cc/150"}
              className="profile-photo"
              alt="Profile"
            />
            <input
              id="profileInput"
              type="file"
              hidden
              onChange={(e) =>
                setProfilePhoto(URL.createObjectURL(e.target.files[0]))
              }
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
                    label="First Name"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Last Name"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="column">
                  <InputField
                    label="Hometown"
                    name="hometown"
                    value={profileData.hometown}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "quote" && (
            <div className="tab quote quote-container">
              <label>Edit Quote</label>
              <textarea
                name="quote"
                value={profileData.quote}
                onChange={handleInputChange}
                maxLength={50}
              />
              <p>{profileData.quote.length}/50</p>
            </div>
          )}

          {/* Adicionar aqui as tabs de Class e Achievements conforme o teu GetStarted */}
        </div>

        <div
          className="edit-actions"
          style={{ marginTop: "20px", display: "flex", gap: "10px" }}
        >
          {activeTab !== "quote" ? (
            <button className="btn-continue" onClick={handleNextStep}>
              Next
            </button>
          ) : (
            <button
              className="btn-continue btn-finish"
              onClick={handleFinish}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          )}
          <button
            className="btn-secondary"
            onClick={() => window.history.back()}
            style={{ background: "#ccc" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
