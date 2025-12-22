import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

export default function FriendsList({ userId }) {
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const id = userId || localStorage.getItem("userId");

      const resRequests = await fetch(
        `http://localhost:5005/api/friends/requests/${id}`
      );
      const dataRequests = await resRequests.json();
      setRequests(dataRequests);

      const resFriends = await fetch(
        `http://localhost:5005/api/friends/list/${id}`
      );
      const dataFriends = await resFriends.json();
      setFriends(dataFriends);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = userId || localStorage.getItem("userId");
    if (id) fetchData();
  }, [userId]);

  // Função para renderizar os Skeletons
  const renderSkeletons = () => (
    <>
      {[1, 2, 3].map((n) => (
        <div key={n} className="skeleton-card">
          <div className="skeleton-img skeleton"></div>
          <div className="skeleton-text-container">
            <div className="skeleton-title skeleton"></div>
            <div className="skeleton-subtitle skeleton"></div>
          </div>
          <div className="skeleton-btn skeleton"></div>
        </div>
      ))}
    </>
  );

  const acceptFriend = async (friendId) => {
    try {
      const response = await fetch("http://localhost:5005/api/friends/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || localStorage.getItem("userId"),
          friendId,
        }),
      });
      if (response.ok) fetchData();
    } catch (error) {
      console.error("Erro ao aceitar amigo:", error);
    }
  };

  const removeFriend = async (friendId) => {
    if (!window.confirm("Tens a certeza que queres remover este amigo?"))
      return;
    try {
      const response = await fetch("http://localhost:5005/api/friends/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || localStorage.getItem("userId"),
          friendId,
        }),
      });
      if (response.ok) {
        setFriends(friends.filter((f) => f._id !== friendId));
      }
    } catch (error) {
      console.error("Erro ao remover amigo:", error);
    }
  };

  return (
    <div className="page friends-page-container">
      {/* SECÇÃO 1: PEDIDOS PENDENTES */}
      <section className="friends-section">
        <h1 className="friends-title">Friend Requests</h1>
        <div className="requests-list">
          {loading ? (
            renderSkeletons()
          ) : requests.length > 0 ? (
            requests.map((sender) => (
              <div key={sender._id} className="request-card">
                <img
                  src={sender.profilePhoto || "https://via.placeholder.com/150"}
                  alt={sender.firstName}
                  className="request-photo clickable"
                  onClick={() => navigate(`/profile/${sender._id}`)}
                />
                <div
                  className="request-info clickable"
                  onClick={() => navigate(`/profile/${sender._id}`)}
                >
                  <h4>
                    {sender.firstName} {sender.lastName}
                  </h4>
                  <p>{sender.school}</p>
                </div>
                <div className="request-actions">
                  <button
                    className="btn-accept"
                    onClick={() => acceptFriend(sender._id)}
                  >
                    Accept
                  </button>
                  <button className="btn-decline">Decline</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No pending requests.</p>
          )}
        </div>
      </section>

      <hr className="section-divider" />

      {/* SECÇÃO 2: LISTA DE AMIGOS ATUAIS */}
      <section className="friends-section">
        <h1 className="friends-title">My Friends</h1>
        <div className="requests-list">
          {loading ? (
            renderSkeletons()
          ) : friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend._id} className="request-card friend-card-active">
                <img
                  src={friend.profilePhoto || "https://via.placeholder.com/150"}
                  alt={friend.firstName}
                  className="request-photo clickable"
                  onClick={() => navigate(`/profile/${friend._id}`)}
                />
                <div
                  className="request-info clickable"
                  onClick={() => navigate(`/profile/${friend._id}`)}
                >
                  <h4>
                    {friend.firstName} {friend.lastName}
                  </h4>
                  <p>{friend.school}</p>
                </div>
                <div className="request-actions">
                  <button
                    className="btn-remove"
                    onClick={() => removeFriend(friend._id)}
                    style={{
                      backgroundColor: "#ff4d4d",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Remove Friend
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">You haven't added any friends yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
