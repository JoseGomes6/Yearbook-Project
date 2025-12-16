import React, { useState } from "react";
import "../styles/main.css";

export default function GetStarted({ userId, onFinish }) {
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

  // Estado para o achievement em edição no modal
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    image: null,
  });

  // Estados para as fotos (mantidos separados para upload)
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  // 🛑 Handler genérico para inputs simples (Personal, Class, Quote)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Navegação entre tabs (Permanecem iguais)
  const handleNextStep = () => {
    if (activeTab === "personal") setActiveTab("class");
    else if (activeTab === "class") setActiveTab("achievements");
    else if (activeTab === "achievements") setActiveTab("quote");
  };

  const handleFinish = async () => {
    // 1. Verificações de Frontend (Mantenha estas)
    if (profileData.quote.length > 50) {
      alert("Citação muito longa! Máx. 50 caracteres.");
      return;
    }

    setLoading(true);

    // 🛑 ATENÇÃO: Desativamos a verificação do userId para o mock
    // if (!userId) {
    //   alert("Erro de autenticação. ID do utilizador não encontrado.");
    //   setLoading(false);
    //   return;
    // }

    // ----------------------------------------------------------------------
    // 🛑 MOCK: SIMULAÇÃO DA CHAMADA DE BACKEND (Sem fazer o fetch real)
    // ----------------------------------------------------------------------
    console.log("SIMULAÇÃO: Enviando dados para o servidor...");
    console.log("Dados do Perfil:", profileData);

    // Simula um atraso de rede de 1 segundo (como se estivesse a guardar na BD)
    setTimeout(() => {
      try {
        // AQUI O BACKEND RESPONDERIA COM SUCESSO
        alert(
          "✅ [MOCK] Perfil concluído e salvo com sucesso! A redirecionar..."
        );

        // Chamamos a função para avançar a página (para 'yearbook')
        if (onFinish) {
          onFinish();
        }
      } catch (error) {
        // Simulação de falha
        alert("❌ [MOCK] Falha na simulação de salvamento.");
      } finally {
        setLoading(false);
      }
    }, 1000); // 1000ms = 1 segundo de "carregamento"

    // ----------------------------------------------------------------------
  };
  {
    /*// 🛑 LÓGICA DE ENVIO FINAL PARA O BACKEND (Permanece igual)
  const handleFinish = async () => {
    // 1. Verificações de Frontend
    if (!userId) {
      alert("Erro de autenticação. ID do utilizador não encontrado.");
      return;
    }

    if (profileData.quote.length > 50) {
      alert("Citação muito longa! Máx. 50 caracteres.");
      return;
    }

    setLoading(true);

    try {
      // Endpoint: PUT http://localhost:5005/api/profile/:userId
      const response = await fetch(
        `http://localhost:5005/api/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Página do Yearbook concluída e salva! A redirecionar...");
        if (onFinish) {
          onFinish();
        }
      } else {
        alert(
          `Falha ao salvar o perfil: ${data.message || "Erro desconhecido."}`
        );
      }
    } catch (error) {
      console.error("Erro de conexão ao salvar perfil:", error);
      alert("Erro de conexão ao salvar o perfil. Verifique o backend (5005).");
    } finally {
      setLoading(false);
    }
  };

   */
  }

  // 🛑 Modal Achievements (Lógica de estado corrigida para usar profileData)
  const handleAddAchievement = () => setShowModal(true);

  const handleModalSubmit = (e) => {
    e.preventDefault();

    // Adiciona o achievement ao array achievements no profileData
    setProfileData((prevData) => ({
      ...prevData,
      achievements: [...prevData.achievements, newAchievement],
    }));

    // Reset o estado do novo achievement
    setNewAchievement({ title: "", description: "", image: null });
    setShowModal(false);
  };

  const handleModalChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setNewAchievement((prevAchievement) => ({
        ...prevAchievement,
        image: files[0],
      }));
    } else {
      setNewAchievement((prevAchievement) => ({
        ...prevAchievement,
        [name]: value,
      }));
    }
  };

  // Upload de fotos (Permanecem iguais)
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) setCoverPhoto(URL.createObjectURL(file));
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePhoto(URL.createObjectURL(file));
  };

  // 🛑 Função auxiliar InputField CORRIGIDA
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
        name={name} // Usado pelo handleInputChange
        value={value || ""}
        onChange={onChange} // Usa a função passada
        required={required}
      />
    </div>
  );

  return (
    <div className="page">
      <div className="getstarted-main">
        {/* Header (Sem alterações) */}
        <div className="getstarted-header">
          <h1>WELCOME TO YOUR YEARBOOK!</h1>
          <h4>Let’s complete your profile so others can get to know you.</h4>
        </div>

        {/* Cover & Profile Photo (Sem alterações) */}
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

        {/* Tabs (Sem alterações) */}
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
                  {/* 🛑 LIGAÇÃO CORRIGIDA */}
                  <InputField
                    type="text"
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
                  {/* 🛑 LIGAÇÃO CORRIGIDA */}
                  <InputField
                    label="Date of Birth:"
                    name="dateOfBirth"
                    placeholder="dd/mm/yyyy"
                    pattern="\d{2}/\d{2}/\d{4}"
                    title="Please enter the date in dd/mm/yyyy format"
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
                  {/* 🛑 LIGAÇÃO CORRIGIDA */}
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
                  {/* 🛑 LIGAÇÃO CORRIGIDA */}
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
                  onChange={handleInputChange} // 🛑 LIGAÇÃO CORRIGIDA
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

        {/* Botões Next / Finish */}
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

      {/* Modal (Permanece igual) */}
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
                placeholder="e.g. Achieved top grades in the final year of studies."
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
