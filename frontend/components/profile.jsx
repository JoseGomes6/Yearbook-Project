import React from "react";
// Assuma que 'profile.css' contém os estilos que definimos.
import "../styles/main.css";

// Dados mockados (simulados) - Mantemos os mesmos dados de mock.
const mockProfileData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@yearbook.com",
  school: "University of Lisbon",
  course: "Computer Science",
  graduationYear: "2024",
  hometown: "Porto",
  quote: "The only way to do great work is to love what you do.",
  friendCount: 42,
  class: "2024 - A",
  signatures: [
    {
      sender: "Alice",
      message: "Greatest coder I know! Good luck with the job search!",
    },
    {
      sender: "Bob",
      message: "We'll miss your bad jokes in the lab. Keep in touch!",
    },
    {
      sender: "Charlie",
      message: "A true leader. See you at the graduation party!",
    },
  ],
  friends: [
    { id: 1, name: "Alice", photo: "https://i.pravatar.cc/50?img=1" },
    { id: 2, name: "Bob", photo: "https://i.pravatar.cc/50?img=2" },
    { id: 3, name: "Charlie", photo: "https://i.pravatar.cc/50?img=3" },
    { id: 4, name: "Diana", photo: "https://i.pravatar.cc/50?img=4" },
  ],
  profilePhoto: "https://i.pravatar.cc/150?img=5",
  coverPhoto: "https://picsum.photos/1200/300?random=1",
  achievements: [
    {
      title: "Academic Excellence Award",
      description: "Top student in Software Engineering.",
    },
    {
      title: "Hackathon Winner",
      description: "First place in the 2023 University Hackathon.",
    },
  ],
};

export default function Profile() {
  const profile = mockProfileData;

  return (
    <div className="page profile-page-container">
      {/* 1. HEADER (Apenas Capa e Foto) */}
      <header className="profile-header-area">
        {/* Foto de Capa (Full Width) */}
        <div
          className="cover-area"
          style={{ backgroundImage: `url(${profile.coverPhoto})` }}
        />

        {/* Foto de Perfil à Esquerda (Bate na Linha Inferior) */}
        {/* Movemos este contêiner para a posição de sobreposição */}
        <div className="profile-img-overlay-pos">
          <img
            src={profile.profilePhoto}
            alt={`${profile.firstName}'s Profile`}
            className="profile-photo-lg"
          />
        </div>
      </header>

      {/* 2. CONTEÚDO PRINCIPAL */}
      <main className="profile-main-content">
        {/* 🛑 NOVA SEÇÃO: INTRODUÇÃO (Nome, Amigos, Quote) */}
        <section className="profile-section profile-intro-section">
          <div className="profile-main-details">
            <div className="name-and-friends">
              <h1 className="profile-name">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="friend-count">{profile.friendCount} Friends 👥</p>
            </div>

            <p className="profile-class">
              Class: <strong>{profile.class}</strong>
            </p>
            <p className="profile-course">
              Course: <strong>{profile.course}</strong>
            </p>
          </div>

          {/* Citação (Quote) à Direita */}
          <div className="profile-quote-box">
            <h3>"Quote"</h3>
            <p className="quote-text-lg">"{profile.quote}"</p>
          </div>
        </section>

        <hr className="section-divider" />

        {/* Seção Principal (Achievements e Contactos) - Colunas */}
        <div className="main-sections-wrapper">
          {/* Coluna 1: Achievements */}
          <section className="profile-section achievements-list-display">
            <h2>🏆 Achievements</h2>
            {/* ... (renderização de achievements) ... */}
            <div className="achievement-grid">
              {profile.achievements.map((item, index) => (
                <div key={index} className="achievement-card">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Coluna 2: Informação de Contacto / Badges */}
          <section className="profile-section personal-contact">
            <h2>📞 Contact & Info</h2>
            {/* ... (renderização de contacto) ... */}
            <div className="contact-details">
              <p>
                <strong>Email:</strong> {profile.email}
              </p>
              <p>
                <strong>Hometown:</strong> {profile.hometown}
              </p>
              <p>
                <strong>Graduation:</strong> {profile.graduationYear}
              </p>
            </div>
          </section>
        </div>

        <hr className="section-divider" />

        {/* Seção 3: Assinaturas e Amigos */}
        <div className="signatures-friends-wrapper">
          {/* Coluna 1: Assinaturas / Mensagens */}
          <section className="profile-section signatures-area">
            <h2>💌 Yearbook Messages ({profile.signatures.length})</h2>
            {/* ... (renderização de signatures) ... */}
            <div className="signatures-list">
              {profile.signatures.map((sig, index) => (
                <div key={index} className="signature-card">
                  <p className="signature-message">"{sig.message}"</p>
                  <p className="signature-sender">— {sig.sender}</p>
                </div>
              ))}
              <button className="btn-sign-profile">Sign John's Profile</button>
            </div>
          </section>

          {/* Coluna 2: Fotos dos Amigos */}
          <section className="profile-section friends-photos-area">
            <h2>👥 Friends ({profile.friends.length})</h2>
            {/* ... (renderização de amigos) ... */}
            <div className="friends-photo-grid">
              {profile.friends.map((friend) => (
                <div key={friend.id} className="friend-circle-container">
                  <img
                    src={friend.photo}
                    alt={friend.name}
                    title={friend.name}
                    className="friend-circle-photo"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
