import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

export default function Yearbook({ userId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSchool, setFilterSchool] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5005/api/yearbook/profiles"
        );
        const data = await response.json();
        if (response.ok) {
          setMembers(data);
        }
      } catch (error) {
        console.error("Erro de conexão:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // 1. FUNÇÃO ATUALIZADA: Agora atualiza o estado local para o botão mudar na hora
  const addFriend = async (targetId) => {
    try {
      const response = await fetch(
        `http://localhost:5005/api/friends/request/${targetId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderId: userId }),
        }
      );

      if (response.ok) {
        alert("Pedido de amizade enviado!");

        // Atualiza a lista de membros localmente para incluir o teu ID nos pedidos dele
        // Isso faz o botão mudar para "Pendente" sem precisar de refresh
        setMembers((prevMembers) =>
          prevMembers.map((m) =>
            m._id === targetId
              ? { ...m, friendRequests: [...(m.friendRequests || []), userId] }
              : m
          )
        );
      } else {
        const errorData = await response.json();
        alert("Erro: " + errorData.message);
      }
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      alert("Erro ao conectar ao servidor.");
    }
  };

  // 2. NOVA LÓGICA DE ESTADO: Verifica se é Amigo, se está Pendente ou nada
  const getFriendshipStatus = (member) => {
    const currentId = userId || localStorage.getItem("userId");

    // 1. Verifica se o meu ID está na lista de amigos DELE
    if (member.friends && member.friends.includes(currentId)) {
      return "FRIENDS";
    }

    // 2. Verifica se o meu ID está na lista de pedidos pendentes DELE
    if (member.friendRequests && member.friendRequests.includes(currentId)) {
      return "PENDING";
    }

    return "NONE";
  };

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.firstName || ""} ${
      member.lastName || ""
    }`.toLowerCase();
    const nameMatch = fullName.includes(searchTerm.toLowerCase());
    const schoolMatch = filterSchool ? member.school === filterSchool : true;
    const levelMatch = filterYear
      ? member.course?.includes(filterYear) || member.year?.includes(filterYear)
      : true;
    return nameMatch && schoolMatch && levelMatch;
  });

  const schools = [...new Set(members.map((m) => m.school).filter(Boolean))];

  if (loading) return <div className="loading">Loading yearbook...</div>;

  return (
    <div className="page yearbook-page-container">
      <h1 className="yearbook-title">Search for members</h1>

      <div className="yearbook-filters">
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={filterSchool}
          onChange={(e) => setFilterSchool(e.target.value)}
        >
          <option value="">All Schools</option>
          {schools.map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </select>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="">All Levels</option>
          <option value="BSc">BSc / Undergraduate</option>
          <option value="MSc">MSc / Master</option>
          <option value="PhD">PhD</option>
        </select>
      </div>

      <div className="members-grid">
        {filteredMembers.map((member) => {
          const status = getFriendshipStatus(member); // Calcula o status uma vez por membro

          return (
            <div
              key={member._id}
              className="member-card clickable"
              onClick={() => navigate(`/profile/${member._id}`)}
            >
              <div className="member-info-left">
                <img
                  src={member.profilePhoto || "https://via.placeholder.com/150"}
                  alt={member.firstName}
                  className="member-photo"
                />
              </div>

              <div className="member-info-right">
                <h4 className="member-name">
                  {member.firstName} {member.lastName}
                </h4>
                <p className="member-detail">
                  <span className="detail-label">School:</span>{" "}
                  {member.school || "N/A"}
                </p>
                <p className="member-detail">
                  <span className="detail-label">Course:</span>{" "}
                  {member.course || "N/A"}
                </p>

                {/* Lógica de Amizade: Só uma destas opções será renderizada */}
                {member._id !== userId && (
                  <div className="friendship-status-container">
                    {status === "FRIENDS" ? (
                      <span className="badge-status friends">✅ Friends</span>
                    ) : status === "PENDING" ? (
                      <span className="badge-status pending">⏳ Pendente</span>
                    ) : (
                      <button
                        className="btn-add-friend"
                        onClick={(e) => {
                          e.stopPropagation();
                          addFriend(member._id);
                        }}
                      >
                        + Add Friend
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
