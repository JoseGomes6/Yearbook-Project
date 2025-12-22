import React, { useState } from "react";

// REMOVIDO: import { useNavigate } from "react-router-dom";

export default function Register({ onRegisterSuccess, navigate }) {
  // Recebemos 'navigate' como prop do App.js
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // REMOVIDO: const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As passwords não são iguais!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5005/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Primeiro avisamos o App.js que o registo foi bem-sucedido
        if (onRegisterSuccess) {
          onRegisterSuccess(data);
        }
      } else {
        setError(data.message || "Erro no registo.");
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      setError("Servidor offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-wrapper">
      <div className="container register-bg">
        <form className="auth-form-content" onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          <h3>Fill in your details to get started.</h3>

          {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-wrapper">
            <input
              type="email"
              placeholder="Email (Opcional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "A processar..." : "Get Started"}
          </button>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <span
              className="link-text"
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
