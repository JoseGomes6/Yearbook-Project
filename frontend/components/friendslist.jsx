import React, { useState, useEffect } from "react";
import "../styles/main.css";

export default function FriendsList({ userId }) {
  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]); // Novo estado para a lista de amigos
  const [loading, setLoading] = useState(true);

  // Função para carregar tudo (Pedidos e Amigos)
  const fetchData = async () => {
    try {
      setLoading(true);
      const id = userId || localStorage.getItem("userId");

      // 1. Procurar Pedidos Pendentes
      const resRequests = await fetch(
        `http://localhost:5005/api/friends/requests/${id}`
      );
      const dataRequests = await resRequests.json();
      setRequests(dataRequests);

      // 2. Procurar Lista de Amigos (Ajusta o endpoint conforme o teu backend)
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

  // Função para aceitar o pedido
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

      if (response.ok) {
        fetchData(); // Atualiza as duas listas
      }
    } catch (error) {
      console.error("Erro ao aceitar amigo:", error);
    }
  };

  // Função para remover amigo
  const removeFriend = async (friendId) => {
    if (!window.confirm("Tens a certeza que queres remover este amigo?"))
      return;

    try {
      const response = await fetch("http://localhost:5005/api/friends/remove", {
        method: "POST", // Ou DELETE, dependendo do teu backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || localStorage.getItem("userId"),
          friendId,
        }),
      });

      if (response.ok) {
        // Remove da lista localmente para ser instantâneo
        setFriends(friends.filter((f) => f._id !== friendId));
      }
    } catch (error) {
      console.error("Erro ao remover amigo:", error);
    }
  };

  if (loading) return <div className="loading">A carregar...</div>;

  return (
    <div className="page friends-page-container">
      {/* SECÇÃO 1: PEDIDOS PENDENTES */}
      <section className="friends-section">
        <h1 className="friends-title">Friend Requests</h1>
        <div className="requests-list">
          {requests.length > 0 ? (
            requests.map((sender) => (
              <div key={sender._id} className="request-card">
                <img
                  src={sender.profilePhoto || "https://via.placeholder.com/150"}
                  alt={sender.firstName}
                  className="request-photo"
                />
                <div className="request-info">
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
          {friends.length > 0 ? (
            friends.map((friend) => (
              <div key={friend._id} className="request-card friend-card-active">
                <img
                  src={friend.profilePhoto || "https://via.placeholder.com/150"}
                  alt={friend.firstName}
                  className="request-photo"
                />
                <div className="request-info">
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
