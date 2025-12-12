import React, { useState } from "react";

export default function GetStarted() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <div className="getstarted-main">
      {/* Título e subtítulo */}
      <div className="getstarted-header">
        <h1>WELCOME TO YOUR YEARBOOK!</h1>
        <h4>Let’s complete your profile so others can get to know you.</h4>
      </div>

      {/* Cover Photo e Profile Photo */}
      <div className="cover-photo-container">
        <div className="cover-photo">
          <span className="cover-text">Cover Photo</span>
        </div>
        <div className="profile-photo">Profile</div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {["personal", "class", "achievements", "quote"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "personal"
              ? "Personal Information"
              : tab === "class"
              ? "Class/Year"
              : tab === "achievements"
              ? "Achievements"
              : "Quote"}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba */}
      <div className="tab-content">
        {activeTab === "personal" && (
          <div className="tab personal">
            {/* Coluna esquerda */}
            <div className="column">
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="Last Name" />
              <input type="email" placeholder="Email Address" />
              <input type="text" placeholder="Phone Number" />
            </div>

            {/* Coluna direita */}
            <div className="column">
              <input type="text" placeholder="Date of Birth" />
              <input type="text" placeholder="Hometown" />
              <input type="text" placeholder="City" />
              <input type="text" placeholder="Address" />
            </div>
          </div>
        )}
        {activeTab === "class" && (
          <div className="tab class">
            <div className="column">
              <input type="text" placeholder="School/University" />
              <input type="text" placeholder="Year/Graduation" />
            </div>
            <div className="column">
              <input type="text" placeholder="Course/Program" />
              <input type="text" placeholder="Section/Group" />
            </div>
          </div>
        )}
        {activeTab === "achievements" && (
          <div className="tab achievements">
            <p>Add your achievements here</p>
          </div>
        )}
        {activeTab === "quote" && (
          <div className="tab quote">
            <p>Add your favorite quote here</p>
          </div>
        )}
      </div>

      {/* Botão Continue apenas na aba Personal Info */}
      {activeTab === "personal" && (
        <button className="btn-continue">Continue</button>
      )}
    </div>
  );
}
