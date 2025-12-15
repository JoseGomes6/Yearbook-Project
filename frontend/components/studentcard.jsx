import React from "react";

// Este componente representa um único cartão de estudante na lista.
export default function StudentCard({ student }) {
  return (
    <div className="student-card">
      {/* Foto de perfil mockada */}
      <div
        className="card-photo"
        style={{
          backgroundImage: `url(https://i.pravatar.cc/100?u=${student.id})`,
        }}
      />
      <div className="card-info">
        <h4 className="student-name">{student.name}</h4>
        <p className="student-course">{student.course}</p>
        <p className="student-year">Grad. {student.graduationYear}</p>
        {/* Botão de exemplo */}
        <button className="btn-view-profile">View Profile</button>
      </div>
    </div>
  );
}
