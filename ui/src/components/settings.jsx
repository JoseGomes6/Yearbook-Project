import React, { useState, useEffect } from "react";
import "../styles/main.css";

export default function Settings({ userId, onLogout, navigate }) {
  const [loadingAction, setLoadingAction] = useState(false); // Para o botão de delete
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Simula um carregamento inicial para mostrar o Skeleton
    const timer = setTimeout(() => setInitialLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // 1. Função para Logout
  const handleLogoutClick = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      onLogout();
    }
  };

  // 2. Função para Apagar Conta
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "CRITICAL WARNING: This will permanently remove your account and all your profile data. This action cannot be undone. Are you sure?"
    );

    if (confirmDelete) {
      setLoadingAction(true);
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
        alert("Server connection failed.");
      } finally {
        setLoadingAction(false);
      }
    }
  };

  // RENDERIZAÇÃO DO SKELETON
  if (initialLoading) {
    return (
      <div className="page settings-page-container">
        <div className="skeleton-line skeleton-title skeleton-shimmer"></div>

        <section className="settings-section">
          <div className="skeleton-line skeleton-subtitle skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-text-full skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-button-settings skeleton-shimmer"></div>
        </section>

        <hr className="settings-divider" />

        <section className="settings-section">
          <div className="skeleton-line skeleton-subtitle skeleton-shimmer danger-skeleton"></div>
          <div className="skeleton-line skeleton-text-full skeleton-shimmer"></div>
          <div className="skeleton-line skeleton-button-settings skeleton-shimmer danger-skeleton"></div>
        </section>
      </div>
    );
  }

  // RENDERIZAÇÃO REAL
  return (
    <div className="page settings-page-container">
      <h1 className="settings-title">Settings</h1>

      {/* SESSION SECTION */}
      <section className="settings-section">
        <h2 className="settings-section-title">Session Management</h2>
        <p className="settings-description">
          Ready to leave? Click below to securely sign out of your account.
        </p>
        <button className="btn-logout-black" onClick={handleLogoutClick}>
          LOG OUT
        </button>
      </section>

      <hr className="settings-divider" />

      {/* DANGER ZONE SECTION */}
      <section className="settings-section">
        <h2 className="settings-section-title danger-text">Danger Zone</h2>
        <p className="settings-description">
          Deleting your account is permanent. All your photos, achievements, and
          messages will be wiped from the system.
        </p>
        <button
          className="btn-delete-red"
          onClick={handleDeleteAccount}
          disabled={loadingAction}
        >
          {loadingAction ? "DELETING ACCOUNT..." : "DELETE PERMANENTLY"}
        </button>
      </section>
    </div>
  );
}
