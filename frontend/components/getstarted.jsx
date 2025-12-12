import React, { useState } from "react";
import "../styles/main.css"; // ajuste conforme seu caminho real

export default function GetStarted() {
  const [activeTab, setActiveTab] = useState("personal");

  return (
    <>
      {/* Cover Photo e Profile Photo */}
      <div className="cover-wrapper">
        <div className="cover-photo">
          <span>Cover Photo</span>
        </div>
        <div className="profile-photo">Profile</div>
      </div>

      {/* Conteúdo abaixo da cover */}
      <div className="getstarted-main">
        {/* Título e subtítulo */}
        <div className="getstarted-header">
          <h1>WELCOME TO YOUR YEARBOOK!</h1>
          <h4>Let’s complete your profile so others can get to know you.</h4>
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

        {/* Conteúdo das abas */}
        <div className="tab-content">
          {activeTab === "personal" && (
            <div className="tab personal">
              <div className="columns-wrapper">
                <div className="column">
                  <input type="text" placeholder="First Name" />
                  <input type="text" placeholder="Last Name" />
                  <input type="email" placeholder="Email Address" />
                  <input type="text" placeholder="Phone Number" />
                </div>
                <div className="column">
                  <input type="text" placeholder="Date of Birth" />
                  <input type="text" placeholder="Hometown" />
                  <input type="text" placeholder="City" />
                  <input type="text" placeholder="Address" />
                </div>
              </div>
            </div>
          )}
          {/* outras abas */}
        </div>

        {activeTab === "personal" && (
          <button className="btn-continue">Continue</button>
        )}
      </div>
    </>
  );
}
