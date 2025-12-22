import React, { useState, useEffect, useCallback } from "react"; // 1. Adiciona useCallback
import "../styles/main.css";

export default function Profile({ userId, navigate }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 3;
  const myId = localStorage.getItem("userId");
  const isOwnProfile = !userId || userId === myId;
  const targetId = userId || myId;
  const isFriend = profile?.friends?.some(
    (friend) => friend._id === myId || friend === myId
  );

  const fetchProfileData = useCallback(async () => {
    try {
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
  }, [targetId]);
  useEffect(() => {
    setLoading(true);
    setCurrentPage(1);
    if (targetId) {
      fetchProfileData();
    }
  }, [targetId, fetchProfileData]);

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
        fetchProfileData();
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error adding signature:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const totalMessages = profile?.signatures?.length || 0;
  const totalPages = Math.ceil(totalMessages / messagesPerPage);
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages =
    profile?.signatures?.slice(indexOfFirstMessage, indexOfLastMessage) || [];

  if (loading) {
    return (
      <div className="page profile-page-container skeleton-profile">
        <header className="profile-header-area">
          <div
            className="cover-area skeleton-shimmer"
            style={{ backgroundColor: "#eee" }}
          />
          <div className="profile-img-overlay-pos">
            <div
              className="profile-photo-lg skeleton-shimmer"
              style={{ borderRadius: "50%", backgroundColor: "#ddd" }}
            />
          </div>
        </header>
        <main className="profile-main-content">
          <div className="skeleton-line skeleton-name skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-text-short skeleton-shimmer"></div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="error-container">
        <h2>Profile not found</h2>
        <button onClick={() => navigate("/yearbook")}>Back to Yearbook</button>
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
            alt="Profile"
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
                onClick={() => navigate("/edit-profile")}
                className="btn-edit-profile"
              >
                EDIT PROFILE
              </button>
            )}
            <div className="profile-quote-box">
              <h3>Quote</h3>
              <p className="quote-text-lg">
                "{profile.quote || "No quote added yet."}"
              </p>
            </div>
          </div>
        </section>

        <div className="main-sections-wrapper">
          <section className="profile-section">
            <h2>🏆 Achievements</h2>
            <div className="achievement-grid">
              {profile.achievements?.length > 0 ? (
                profile.achievements.map((item, i) => (
                  <div key={i} className="achievement-card">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                ))
              ) : (
                <p>No achievements yet.</p>
              )}
            </div>
          </section>

          <section className="profile-section">
            <h2>📞 Info</h2>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Hometown:</strong> {profile.hometown}
            </p>
            <p>
              <strong>Phone:</strong> {profile.phone}
            </p>
          </section>
        </div>

        <hr className="section-divider" />

        <div className="signatures-friends-wrapper">
          <section className="profile-section signatures-area">
            <h2>💌 Yearbook Messages ({totalMessages})</h2>

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
              {currentMessages.length > 0 ? (
                <>
                  {currentMessages.map((sig, index) => (
                    <div key={index} className="signature-card">
                      <p className="signature-message">"{sig.message}"</p>
                      <p className="signature-sender">
                        — {sig.senderName || "Friend"}
                      </p>
                    </div>
                  ))}

                  {totalMessages > messagesPerPage && (
                    <div className="pagination-controls">
                      <button
                        className="btn-pagination"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        ← Previous
                      </button>
                      <span className="page-indicator">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        className="btn-pagination"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p>No memories shared yet.</p>
              )}
            </div>
          </section>

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
