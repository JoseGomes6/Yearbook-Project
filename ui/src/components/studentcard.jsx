import React from "react";

export default function StudentCard({ student }) {
  return (
    <div className="student-card">
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
        <button className="btn-view-profile">View Profile</button>
      </div>
    </div>
  );
}
