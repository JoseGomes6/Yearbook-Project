import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

export default function Settings({ userId, onLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 1. Function to Logout
  const handleLogoutClick = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      onLogout();
      navigate("/login");
    }
  };

  // 2. Function to Delete Account from Database
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "CRITICAL WARNING: This will permanently remove your account and all your profile data from our database. This action cannot be undone. Are you sure?"
    );

    if (confirmDelete) {
      setLoading(true);
      try {
        const id = userId || localStorage.getItem("userId");

        const response = await fetch(
          `http://localhost:5005/api/user/delete/${id}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          alert("Account successfully deleted.");
          localStorage.clear();
          if (onLogout) onLogout();
          navigate("/register");
        } else {
          const errorData = await response.json();
          alert("Error: " + (errorData.message || "Could not delete account."));
        }
      } catch (error) {
        console.error("Connection error:", error);
        alert("Server connection failed. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="page settings-page-container"
      style={{ textAlign: "left", padding: "40px" }}
    >
      <h1
        className="settings-title"
        style={{ marginBottom: "30px", fontSize: "2rem" }}
      >
        Settings
      </h1>

      {/* SESSION SECTION */}
      <section className="settings-section" style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
          Session Management
        </h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Ready to leave? Click below to securely sign out of your account.
        </p>
        <button
          className="btn-logout"
          onClick={handleLogoutClick}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          LOG OUT
        </button>
      </section>

      <hr
        style={{
          border: "0",
          borderTop: "1px solid #eee",
          marginBottom: "40px",
        }}
      />

      {/* DANGER ZONE SECTION */}
      <section className="sett ings-section">
        <h2
          style={{ fontSize: "1.5rem", color: "#d93025", marginBottom: "10px" }}
        >
          Danger Zone
        </h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Deleting your account is permanent. All your photos, achievements, and
          messages will be wiped from the system.
        </p>
        <button
          className="btn-delete-account"
          onClick={handleDeleteAccount}
          disabled={loading}
          style={{
            backgroundColor: "#d93025",
            color: "#fff",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            fontSize: "14px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "DELETING ACCOUNT..." : "DELETE PERMANENTLY"}
        </button>
      </section>
    </div>
  );
}
