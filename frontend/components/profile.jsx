import React, { useState, useEffect } from "react";
import "../styles/main.css";

export default function Profile({ userId, onViewProfile }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const id = userId || localStorage.getItem("userId");

      console.log("DEBUG: ID detetado no Profile:", id);

      if (!id || id === "undefined" || id === "null") {
        console.error("ERRO: Nenhum ID encontrado!");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5005/api/profile/${id}`);

        if (!response.ok) {
          throw new Error("Perfil não encontrado no servidor");
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Erro no fetch:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading)
    return <div className="loading">A carregar o teu Yearbook...</div>;

  if (!profile) {
    return (
      <div className="error-container">
        <h2>Perfil não encontrado</h2>
        <p>
          O ID do utilizador é:{" "}
          {userId || localStorage.getItem("userId") || "Nulo"}
        </p>
        <button onClick={() => window.location.reload()}>
          Recarregar Página
        </button>
      </div>
    );
  }
  return (
    <div className="page profile-page-container">
      <header className="profile-header-area">
        <div
          className="cover-area"
          style={{
            backgroundImage: `url(${
              profile.coverPhoto || "https://via.placeholder.com/1200x300"
            })`,
            backgroundColor: "#ddd",
          }}
        />

        <div className="profile-img-overlay-pos">
          <img
            src={profile.profilePhoto || "https://via.placeholder.com/150"}
            alt={`${profile.firstName}'s Profile`}
            className="profile-photo-lg"
          />
        </div>
      </header>

      <main className="profile-main-content">
        <section className="profile-section profile-intro-section">
          <div className="profile-main-details">
            <div className="name-and-friends">
              <h1 className="profile-name">
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="friend-count">
                {profile.friends?.length || 0} Friends 👥
              </p>
            </div>

            <p className="profile-class">
              Class/Section: <strong>{profile.section || "N/A"}</strong>
            </p>
            <p className="profile-course">
              Course: <strong>{profile.course}</strong>
            </p>
          </div>

          <div className="profile-quote-box">
            <h3>"Quote"</h3>
            <p className="quote-text-lg">
              "{profile.quote || "No quote added yet."}"
            </p>
          </div>
        </section>

        <hr className="section-divider" />

        <div className="main-sections-wrapper">
          <section className="profile-section achievements-list-display">
            <h2>🏆 Achievements</h2>
            <div className="achievement-grid">
              {profile.achievements && profile.achievements.length > 0 ? (
                profile.achievements.map((item, index) => (
                  <div key={index} className="achievement-card">
                    <div className="achievement-card-content">
                      <div className="achievement-text-area">
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                      </div>
                      {item.image && (
                        <img
                          src={item.image}
                          alt="Achievement"
                          className="achievement-card-img"
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p>No achievements added yet.</p>
              )}
            </div>
          </section>

          <section className="profile-section personal-contact">
            <h2>📞 Contact & Info</h2>
            <div className="contact-card">
              <div className="contact-details">
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Hometown:</strong> {profile.hometown}
                </p>
                <p>
                  <strong>City:</strong> {profile.city}
                </p>
                <p>
                  <strong>Graduation Year:</strong> {profile.year}
                </p>
                <p>
                  <strong>School:</strong> {profile.school}
                </p>
              </div>
            </div>
          </section>
        </div>

        <hr className="section-divider" />

        {/* Seção 3: Mensagens e Amigos */}
        <div className="signatures-friends-wrapper">
          <section className="profile-section signatures-area">
            <h2>💌 Yearbook Messages ({profile.signatures?.length || 0})</h2>
            <div className="signatures-list">
              {profile.signatures?.map((sig, index) => (
                <div key={index} className="signature-card">
                  <p className="signature-message">"{sig.message}"</p>
                  <p className="signature-sender">— {sig.sender}</p>
                </div>
              )) || <p>No messages yet.</p>}
            </div>
          </section>

          <section className="profile-section friends-photos-area">
            <h2>👥 Friends ({profile.friends?.length || 0})</h2>
            <div className="friends-photo-grid">
              {profile.friends && profile.friends.length > 0 ? (
                profile.friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="friend-circle-container"
                    title={friend.firstName}
                  >
                    <img
                      src={
                        friend.profilePhoto || "https://via.placeholder.com/150"
                      }
                      alt={friend.firstName}
                      className="friend-circle-photo"
                      style={{ cursor: "pointer" }}
                      onClick={() => onViewProfile(friend._id)} // Agora funciona!
                    />
                    <p className="friend-small-name">{friend.firstName}</p>
                  </div>
                ))
              ) : (
                <p>Looking for friends...</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
