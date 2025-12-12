import React, { useState } from "react";
import "../styles/main.css"; // ajusta conforme o teu caminho real

// 1. Recebe a prop onFinish do App.jsx
export default function GetStarted({ onFinish }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [achievements, setAchievements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [quote, setQuote] = useState("");

  // Navegação entre tabs
  const handleNextStep = () => {
    if (activeTab === "personal") setActiveTab("class");
    else if (activeTab === "class") setActiveTab("achievements");
    else if (activeTab === "achievements") setActiveTab("quote");
  };

  // 2. Chama onFinish para mudar o estado da página no App.jsx
  const handleFinish = () => {
    if (quote.length <= 50) {
      alert("Yearbook page completed!");

      // Chama a função de navegação passada como prop
      if (onFinish) {
        onFinish();
      }
    } else {
      alert("Quote too long! Max 50 characters.");
    }
  };

  // Modal achievements
  const handleAddAchievement = () => setShowModal(true);

  const handleModalSubmit = (e) => {
    e.preventDefault();
    setAchievements([...achievements, newAchievement]);
    setNewAchievement({ title: "", description: "", image: null });
    setShowModal(false);
  };

  const handleModalChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setNewAchievement({ ...newAchievement, image: files[0] });
    } else {
      setNewAchievement({ ...newAchievement, [name]: value });
    }
  };

  // Upload de fotos
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) setCoverPhoto(URL.createObjectURL(file));
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePhoto(URL.createObjectURL(file));
  };

  // Função auxiliar para renderizar um campo de input com label
  const InputField = ({
    label,
    type = "text",
    placeholder,
    pattern,
    title,
    // Adicione name, value, onChange para o Modal funcionar corretamente
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
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );

  return (
    <div className="page">
      <div className="getstarted-main">
        {/* Header */}
        <div className="getstarted-header">
          <h1>WELCOME TO YOUR YEARBOOK!</h1>
          <h4>Let’s complete your profile so others can get to know you.</h4>
        </div>

        {/* Cover & Profile Photo */}
        <div className="cover-wrapper">
          {/* Cover Photo */}
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

          {/* Profile Photo */}
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

        {/* Tabs */}
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

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "personal" && (
            <div className="tab personal">
              <div className="columns-wrapper">
                <div className="column">
                  <InputField label="First Name:" placeholder="John" />
                  <InputField label="Last Name:" placeholder="Doe" />
                  <InputField
                    label="Email Address:"
                    type="email"
                    placeholder="john.doe@example.com"
                  />
                  <InputField
                    label="Phone Number:"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="column">
                  <InputField
                    label="Date of Birth:"
                    placeholder="dd/mm/yyyy"
                    pattern="\d{2}/\d{2}/\d{4}"
                    title="Please enter the date in dd/mm/yyyy format"
                  />
                  <InputField label="Hometown:" placeholder="London" />
                  <InputField label="City:" placeholder="Manchester" />
                  <InputField
                    label="Address:"
                    placeholder="123 Example Street"
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
                    placeholder="Cambridge University"
                  />
                  <InputField label="Year/Graduation:" placeholder="2024" />
                </div>
                <div className="column">
                  <InputField
                    label="Course/Program:"
                    placeholder="Computer Science"
                  />
                  <InputField label="Section/Group:" placeholder="A-402" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="tab achievements">
              {/* Título adicionado */}
              <h3 className="achievements-title">My Achievements</h3>

              {/* Botão de adicionar fora do círculo */}
              <button
                className="btn-add-achievement"
                onClick={handleAddAchievement}
              >
                + Add New Achievement
              </button>

              <div className="achievements-list">
                {achievements.map((a, index) => (
                  <div key={index} className="achievement-item">
                    <strong>{a.title}</strong>
                    <p>{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quote" && (
            // Classe quote-container usada para o alinhamento lado a lado (se necessário no CSS)
            <div className="tab quote quote-container">
              <div className="quote-input-area">
                <label>Favorite Quote</label>
                <textarea
                  maxLength={50}
                  placeholder="e.g. The only way to do great work is to love what you do."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                />
                <div
                  className={`quote-counter ${
                    quote.length > 50 ? "over-limit" : ""
                  }`}
                >
                  {quote.length}/50
                </div>
              </div>

              {/* No modo Quote, o botão Finish é renderizado separadamente abaixo, se não estiver usando o alinhamento lado a lado */}
              {/* Eu mantive o seu JSX original (botão renderizado abaixo) */}
            </div>
          )}
        </div>

        {/* Botões Next / Finish */}
        {activeTab !== "quote" && (
          <button className="btn-continue" onClick={handleNextStep}>
            Next Step
          </button>
        )}
        {activeTab === "quote" && (
          <button className="btn-continue btn-finish" onClick={handleFinish}>
            Finish
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add Achievement</h3>
            <form onSubmit={handleModalSubmit}>
              <InputField
                label="Title"
                name="title"
                placeholder="Academic Excellence Award"
                value={newAchievement.title}
                onChange={handleModalChange}
                required
              />
              <label>Description</label>
              <textarea
                name="description"
                placeholder="e.g. Achieved top grades in the final year of studies."
                value={newAchievement.description}
                onChange={handleModalChange}
                required
              />
              <label>Image (Optional)</label>
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
