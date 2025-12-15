import React, { useState } from "react";
import "../styles/main.css"; // Garante que os estilos estão carregados

// 🛑 Dados Mockados (Simulados)
const mockStudents = [
  {
    id: 1,
    name: "Alice Smith",
    school: "ULisboa",
    academicLevel: "MSc Computer Science",
    photo: "https://i.pravatar.cc/150?img=1",
    isFriend: true,
  },
  {
    id: 2,
    name: "Bob Johnson",
    school: "FEUP",
    academicLevel: "BEng Electrical Eng.",
    photo: "https://i.pravatar.cc/150?img=2",
    isFriend: true,
  },
  {
    id: 3,
    name: "Carlos Gomes",
    school: "ULisboa",
    academicLevel: "BSc Management",
    photo: "https://i.pravatar.cc/150?img=3",
    isFriend: false,
  },
  {
    id: 4,
    name: "Diana Pires",
    school: "FEUP",
    academicLevel: "MSc Mechanical Eng.",
    photo: "https://i.pravatar.cc/150?img=4",
    isFriend: true,
  },
  {
    id: 5,
    name: "Eva Mendes",
    school: "ULisboa",
    academicLevel: "PhD Physics",
    photo: "https://i.pravatar.cc/150?img=5",
    isFriend: false,
  },
  {
    id: 6,
    name: "Filipe Cruz",
    school: "FEUP",
    academicLevel: "BSc Architecture",
    photo: "https://i.pravatar.cc/150?img=6",
    isFriend: true,
  },
];

export default function FriendsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSchool, setFilterSchool] = useState(""); // 🛑 NOVO ESTADO
  const [filterYear, setFilterYear] = useState(""); // 🛑 NOVO ESTADO

  // 1. PRIMEIRO FILTRO: Apenas Amigos
  const friendsOnly = mockStudents.filter((student) => student.isFriend);

  // 2. SEGUNDO FILTRO: Pesquisa e Filtros de Dropdown
  const filteredFriends = friendsOnly.filter((member) => {
    // Pesquisa por Nome
    const nameMatch = member.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filtro por Escola
    const schoolMatch = filterSchool ? member.school === filterSchool : true;

    // Filtro por Nível/Ano
    const yearMatch = filterYear
      ? member.academicLevel.includes(filterYear)
      : true;

    // Combina todos os filtros
    return nameMatch && schoolMatch && yearMatch;
  });

  // Lista de Escolas para preencher o dropdown
  const schools = [...new Set(mockStudents.map((m) => m.school))];

  return (
    <div className="page yearbook-page-container">
      <h1 className="yearbook-title">👥 My Friends List</h1>

      {/* 🛑 Secção de Filtros COMPLETA (Igual ao Yearbook) */}
      <div className="yearbook-filters">
        {/* 1. Pesquisar por Nome */}
        <input
          type="text"
          placeholder="Search friends by Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* 2. Filtrar por Escola */}
        <select
          value={filterSchool}
          onChange={(e) => setFilterSchool(e.target.value)}
        >
          <option value="">Filter by School (All)</option>
          {schools.map((school) => (
            <option key={school} value={school}>
              {school}
            </option>
          ))}
        </select>

        {/* 3. Filtrar por Ano/Nível (Simulação) */}
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        >
          <option value="">Filter by Year/Level (All)</option>
          <option value="BSc">BSc</option>
          <option value="MSc">MSc</option>
          <option value="PhD">PhD</option>
        </select>
      </div>
      {/* 🛑 Fim da Secção de Filtros */}

      <div className="members-grid">
        {filteredFriends.map((member) => (
          <div key={member.id} className="member-card">
            {/* Conteúdo do Retângulo (IDÊNTICO AO YEARBOOK) */}
            <div className="member-info-left">
              <img
                src={member.photo}
                alt={member.name}
                className="member-photo"
              />
            </div>

            <div className="member-info-right">
              <h4 className="member-name">{member.name}</h4>

              <p className="member-detail">
                <span className="detail-label">School:</span> {member.school}
              </p>
              <p className="member-detail">
                <span className="detail-label">Level:</span>{" "}
                {member.academicLevel}
              </p>

              {/* Botão Remover Amigo (ou Visitar Perfil) */}
              <button className="btn-remove-friend">Remove Friend</button>
            </div>
          </div>
        ))}

        {filteredFriends.length === 0 && (
          <p className="no-results">
            {searchTerm || filterSchool || filterYear
              ? "No friends match your search criteria."
              : "You haven't added any friends yet. Check the Yearbook!"}
          </p>
        )}
      </div>
    </div>
  );
}
