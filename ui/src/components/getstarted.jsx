import React, { useState } from "react";
import "../styles/main.css";

// ✅ COMPONENTE EXTERNO PARA NÃO PERDER O FOCO
const InputField = ({
  label,
  type = "text",
  placeholder,
  pattern,
  title,
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
      pattern={pattern}
      title={title}
      name={name}
      value={value || ""}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default function GetStarted({ userId, navigate }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
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
  });

  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    image: null, // Mantemos o ficheiro original para o preview
  });

  const [coverPhoto, setCoverPhoto] = useState(null); // Guardará Base64
  const [profilePhoto, setProfilePhoto] = useState(null); // Guardará Base64

  // ✅ Função para transformar imagem em string para a Base de Dados
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
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    if (activeTab === "personal") setActiveTab("class");
    else if (activeTab === "class") setActiveTab("achievements");
    else if (activeTab === "achievements") setActiveTab("quote");
  };

  const handleFinish = async () => {
    if (profileData.quote.length > 50) {
      alert("Citação muito longa!");
      return;
    }
    if (!userId) {
      alert("Erro: ID do utilizador não encontrado.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Juntamos os dados de texto com as imagens em Base64
      const finalData = {
        ...profileData,
        coverPhoto,
        profilePhoto,
      };

      const response = await fetch(
        `http://localhost:5005/api/profile/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        }
      );

      if (response.ok) {
        alert("✅ Perfil guardado com sucesso!");
        if (navigate) {
          navigate("/yearbook");
        }
      } else {
        const data = await response.json();
        alert(`❌ Erro: ${data.message}`);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handlers de Imagem corrigidos para converter para Base64
  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await convertToBase64(file);
      setCoverPhoto(b64);
    }
  };

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const b64 = await convertToBase64(file);
      setProfilePhoto(b64);
    }
  };

  // Handlers da Modal de Achievements (Mantendo a tua estrutura)
  const handleAddAchievement = () => setShowModal(true);

  const handleModalSubmit = (e) => {
    e.preventDefault();
    setProfileData((prevData) => ({
      ...prevData,
      achievements: [...prevData.achievements, newAchievement],
    }));
    setNewAchievement({ title: "", description: "", image: null });
    setShowModal(false);
  };

  const handleModalChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewAchievement((prev) => ({ ...prev, image: files[0] }));
    } else {
      setNewAchievement((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="page">
      <div className="getstarted-main">
        <div className="getstarted-header">
          <h1>WELCOME TO YOUR YEARBOOK!</h1>
          <h4>Let’s complete your profile so others can get to know you.</h4>
        </div>

        <div className="cover-wrapper">
          <div className="cover-upload">
            {coverPhoto ? (
              <img src={coverPhoto} alt="Cover" className="cover-photo" />
            ) : (
              <label className="cover-placeholder">
                <div className="cover-icon">⬆️</div>
                <span>Upload Cover Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>

          <div className="profile-upload">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="profile-photo" />
            ) : (
              <label className="profile-placeholder">
                <div className="profile-icon">+</div>
                <span>Upload Profile Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileChange}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>
        </div>

        <div className="tabs">
          {["personal", "class", "achievements", "quote"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "personal"
                ? "PERSONAL INFORMATION"
                : tab === "class"
                ? "CLASS/YEAR"
                : tab === "achievements"
                ? "ACHIEVEMENTS"
                : "QUOTE"}
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
                    placeholder="John"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Last Name:"
                    name="lastName"
                    placeholder="Doe"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Email Address:"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Phone Number:"
                    name="phone"
                    placeholder="(555) 123-4567"
                    value={profileData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="column">
                  <InputField
                    label="Date of Birth:"
                    name="dateOfBirth"
                    placeholder="dd/mm/yyyy"
                    pattern="\\d{2}/\\d{2}/\\d{4}"
                    value={profileData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Hometown:"
                    name="hometown"
                    placeholder="London"
                    value={profileData.hometown}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="City:"
                    name="city"
                    placeholder="Manchester"
                    value={profileData.city}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Address:"
                    name="address"
                    placeholder="123 Example Street"
                    value={profileData.address}
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
                    placeholder="Cambridge University"
                    value={profileData.school}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Year/Graduation:"
                    name="year"
                    placeholder="2024"
                    value={profileData.year}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="column">
                  <InputField
                    label="Course/Program:"
                    name="course"
                    placeholder="Computer Science"
                    value={profileData.course}
                    onChange={handleInputChange}
                  />
                  <InputField
                    label="Section/Group:"
                    name="section"
                    placeholder="A-402"
                    value={profileData.section}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="tab achievements">
              <h3 className="achievements-title">My Achievements</h3>
              <button
                className="btn-add-achievement"
                onClick={handleAddAchievement}
              >
                + Add New Achievement
              </button>
              <div className="achievements-list">
                {profileData.achievements.map((a, index) => (
                  <div key={index} className="achievement-item">
                    <div className="achievement-text">
                      <strong>{a.title}</strong>
                      <p>{a.description}</p>
                    </div>
                    {a.image && (
                      <img
                        src={URL.createObjectURL(a.image)}
                        alt={a.title}
                        className="achievement-image"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quote" && (
            <div className="tab quote quote-container">
              <div className="quote-input-area">
                <label>Favorite Quote</label>
                <textarea
                  maxLength={50}
                  placeholder="e.g. The only way to do great work is to love what you do."
                  name="quote"
                  value={profileData.quote}
                  onChange={handleInputChange}
                />
                <div
                  className={`quote-counter ${
                    profileData.quote.length > 50 ? "over-limit" : ""
                  }`}
                >
                  {profileData.quote.length}/50
                </div>
              </div>
            </div>
          )}
        </div>

        {activeTab !== "quote" && (
          <button className="btn-continue" onClick={handleNextStep}>
            Next Step
          </button>
        )}
        {activeTab === "quote" && (
          <button
            className="btn-continue btn-finish"
            onClick={handleFinish}
            disabled={loading}
          >
            {loading ? "A Guardar..." : "Finish"}
          </button>
        )}
      </div>

      {/* 🛑 A TUA MODAL ORIGINAL MANTIDA */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Achievement</h3>
            <form onSubmit={handleModalSubmit}>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Academic Excellence Award"
                value={newAchievement.title}
                onChange={handleModalChange}
                required
              />
              <label>Description:</label>
              <textarea
                name="description"
                placeholder="e.g. Achieved top grades..."
                value={newAchievement.description}
                onChange={handleModalChange}
                required
              />
              <label>Image (Optional):</label>
              <input
                type="file"
                name="image"
                onChange={handleModalChange}
                accept="image/*"
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
