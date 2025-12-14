import React, { useState } from "react";
import "../styles/main.css";
import "../styles/main.css";

const mockMembers = [
  {
    id: 1,
    name: "Alice Smith",
    school: "ULisboa",
    academicLevel: "MSc Computer Science",
    photo: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Bob Johnson",
    school: "FEUP",
    academicLevel: "BEng Electrical Eng.",
    photo: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Carlos Gomes",
    school: "ULisboa",
    academicLevel: "BSc Management",
    photo: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Diana Pires",
    school: "FEUP",
    academicLevel: "MSc Mechanical Eng.",
    photo: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "Eva Mendes",
    school: "ULisboa",
    academicLevel: "PhD Physics",
    photo: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Filipe Cruz",
    school: "FEUP",
    academicLevel: "BSc Architecture",
    photo: "https://i.pravatar.cc/150?img=6",
  },
];

export default function Yearbook() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSchool, setFilterSchool] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Lógica simples de filtragem (A ser aprimorada com o backend)
  const filteredMembers = mockMembers.filter((member) => {
    const nameMatch = member.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const schoolMatch = filterSchool ? member.school === filterSchool : true;
    // Simular filtro por ano, se tivéssemos essa propriedade
    const yearMatch = filterYear
      ? member.academicLevel.includes(filterYear)
      : true;

    return nameMatch && schoolMatch && yearMatch;
  });

  const schools = [...new Set(mockMembers.map((m) => m.school))];

  return (
    <div className="page yearbook-page-container">
      <h1 className="yearbook-title">Search for Members</h1>

      {/* Seção de Filtros */}
      <div className="yearbook-filters">
        {/* 1. Pesquisar por Nome */}
        <input
          type="text"
          placeholder="Search by Name..."
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

      {/* Lista de Membros (Três Colunas) */}
      <div className="members-grid">
        {filteredMembers.map((member) => (
          <div key={member.id} className="member-card">
            {/* Conteúdo do Retângulo */}
            <div className="member-info-left">
              {/* Foto Redonda à Esquerda */}
              <img
                src={member.photo}
                alt={member.name}
                className="member-photo"
              />
            </div>

            <div className="member-info-right">
              {/* Nome (Maior) */}
              <h4 className="member-name">{member.name}</h4>

              {/* School e Academic Level */}
              <p className="member-detail">
                <span className="detail-label">School:</span> {member.school}
              </p>
              <p className="member-detail">
                <span className="detail-label">Level:</span>{" "}
                {member.academicLevel}
              </p>

              {/* Botão Adicionar Amigo (Canto Inferior Direito) */}
              <button className="btn-add-friend">+ Add Friend</button>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <p className="no-results">No members found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
