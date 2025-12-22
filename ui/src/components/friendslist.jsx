import React, { useState, useEffect, useCallback } from "react";
// REMOVIDO: import { useNavigate } from "react-router-dom";
import "../styles/main.css";

export default function FriendsList({ userId, navigate }) {
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Definimos a função de busca com useCallback para poder ser usada no useEffect
  // e em outras funções como o acceptFriend sem causar loops ou avisos.
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const id = userId || localStorage.getItem("userId");
      if (!id) return;

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
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      if (response.ok) fetchData(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao aceitar amigo:", error);
    }
  };

  const declineFriendRequest = async (friendId) => {
    try {
      const response = await fetch(
        "http://localhost:5005/api/friends/decline",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: userId, // O teu ID (quem está a recusar)
            friendId: friendId, // O ID de quem enviou o pedido
          }),
        }
      );

      if (response.ok) {
        // Atualiza a lista de pedidos no ecrã removendo o que acabaste de recusar
        setRequests((prev) => prev.filter((req) => req._id !== friendId));
      } else {
        console.error("Erro ao recusar no servidor");
      }
    } catch (error) {
      console.error("Erro na ligação:", error);
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

  // Função para renderizar os Skeletons (Igual à tua)
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

  return (
    <div className="page friends-page-container">
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
                  <button
                    className="btn-decline"
                    onClick={() => declineFriendRequest(sender._id)} // Adiciona esta linha
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No pending requests.</p>
          )}
        </div>
      </section>

      <hr className="section-divider" />

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
