import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/main.css";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState(""); // Estado para o novo comentário
  const [submitting, setSubmitting] = useState(false);

  const myId = localStorage.getItem("userId");
  const isOwnProfile = !id || id === myId;
  const targetId = id || myId;

  // Verifica se o utilizador logado é amigo deste perfil
  const isFriend = profile?.friends?.some(
    (friend) => friend._id === myId || friend === myId
  );

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5005/api/profile/${targetId}`
      );
      if (!response.ok) throw new Error("Profile not found");
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetId) fetchProfile();
  }, [targetId]);

  // Função para enviar a mensagem (Signature)
  const handleAddSignature = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:5005/api/profile/signature/${targetId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: myId,
            message: newMessage,
          }),
        }
      );

      if (response.ok) {
        setNewMessage("");
        fetchProfile(); // Recarrega o perfil para mostrar a nova mensagem
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error adding signature:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading Profile...</div>;

  if (!profile) {
    return (
      <div className="error-container">
        <h2>Profile not found</h2>
        <button onClick={() => navigate("/yearbook")}>Back to Yearbook</button>
      </div>
    );
  }

  return (
    <div className="page profile-page-container" style={{ textAlign: "left" }}>
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
            <h1 className="profile-name">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="profile-course">
              <strong>{profile.course}</strong> | {profile.school}
            </p>
          </div>

          <div style={{ position: "relative", marginTop: "20px" }}>
            {isOwnProfile && (
              <button
                onClick={() => navigate("/edit-profile")} // MUDAR DE /get-started PARA /edit-profile
                className="btn-edit-profile"
                style={
                  {
                    /* teus estilos */
                  }
                }
              >
                EDIT PROFILE
              </button>
            )}
            <div className="profile-quote-box">
              <h3>"Yearbook Quote"</h3>
              <p className="quote-text-lg">
                "{profile.quote || "No quote added yet."}"
              </p>
            </div>
          </div>
        </section>

        <div className="main-sections-wrapper">
          {/* ACHIEVEMENTS */}
          <section className="profile-section">
            <h2>🏆 Achievements</h2>
            <div className="achievement-grid">
              {profile.achievements?.length > 0 ? (
                profile.achievements.map((item, index) => (
                  <div key={index} className="achievement-card">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                ))
              ) : (
                <p>No achievements yet.</p>
              )}
            </div>
          </section>

          {/* CONTACT INFO */}
          <section className="profile-section">
            <h2>📞 Info</h2>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Hometown:</strong> {profile.hometown}
            </p>
            <p>
              <strong>Graduation:</strong> {profile.year}
            </p>
          </section>
        </div>

        <hr className="section-divider" />

        <div className="signatures-friends-wrapper">
          {/* YEARBOOK MESSAGES (SIGNATURES) */}
          <section className="profile-section signatures-area">
            <h2>💌 Yearbook Messages ({profile.signatures?.length || 0})</h2>

            {/* Form de comentário: Só aparece se for AMIGO e não for o meu perfil */}
            {!isOwnProfile && isFriend && (
              <form onSubmit={handleAddSignature} className="signature-form">
                <textarea
                  placeholder="Leave a memory for your friend..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  required
                />
                <button type="submit" disabled={submitting}>
                  {submitting ? "Sending..." : "Post Message"}
                </button>
              </form>
            )}

            {!isFriend && !isOwnProfile && (
              <p className="info-text">
                Only friends can leave yearbook messages.
              </p>
            )}

            <div className="signatures-list">
              {profile.signatures?.length > 0 ? (
                profile.signatures.map((sig, index) => (
                  <div key={index} className="signature-card">
                    <p className="signature-message">"{sig.message}"</p>
                    <p className="signature-sender">
                      — {sig.senderName || "Friend"}
                    </p>
                  </div>
                ))
              ) : (
                <p>No memories shared yet.</p>
              )}
            </div>
          </section>

          {/* FRIENDS LIST */}
          <section className="profile-section friends-photos-area">
            <h2>👥 Friends ({profile.friends?.length || 0})</h2>
            <div className="friends-photo-grid">
              {profile.friends?.map((friend) => (
                <div key={friend._id} className="friend-circle-container">
                  <img
                    src={
                      friend.profilePhoto || "https://via.placeholder.com/150"
                    }
                    alt={friend.firstName}
                    className="friend-circle-photo"
                    onClick={() => navigate(`/profile/${friend._id}`)}
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
