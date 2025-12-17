import React, { useState, useEffect } from "react";
import "../styles/main.css";

export default function FriendsList({ userId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar os pedidos pendentes
  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:5005/api/friends/requests/${userId}`
      );
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchRequests();
  }, [userId]);

  // Função para aceitar o pedido
  const acceptFriend = async (friendId) => {
    try {
      const response = await fetch("http://localhost:5005/api/friends/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, friendId }),
      });

      if (response.ok) {
        alert("Agora são amigos!");
        fetchRequests(); // Atualiza a lista removendo quem aceitaste
      }
    } catch (error) {
      console.error("Erro ao aceitar amigo:", error);
    }
  };

  if (loading) return <div className="loading">A carregar pedidos...</div>;

  return (
    <div className="page friends-page-container">
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
          <p className="no-results">No pending requests at the moment.</p>
        )}
      </div>
    </div>
  );
}
