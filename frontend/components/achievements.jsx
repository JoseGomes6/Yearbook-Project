import React, { useState } from "react";

const Achievements = ({ achievements, addAchievement }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const save = () => {
    if (!title || !desc) return alert("Fill all fields");
    addAchievement(title, desc);
    setTitle("");
    setDesc("");
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>+ Add Achievement</button>

      {showModal && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Add Achievement</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
            />
            <button onClick={save}>Save</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        {achievements.map((a, i) => (
          <div
            key={i}
            style={{
              background: "#3a4a5a",
              padding: "10px",
              margin: "5px",
              borderRadius: "8px",
            }}
          >
            <strong>{a.title}</strong>
            <p>{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
