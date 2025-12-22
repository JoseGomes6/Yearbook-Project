import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // IMPORTANTE: Para navegar

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Inicializar o hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5005/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Notifica o App.jsx para guardar a sessão no estado e localStorage
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }

        // 2. Navega para o Yearbook usando o Router
        navigate("/yearbook");
      } else {
        setError(data.message || "Credenciais inválidas. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro de conexão ou servidor:", err);
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-wrapper">
      <form className="container login-bg" onSubmit={handleSubmit}>
        <h1>Sign In</h1>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <div className="input-wrapper">
          <FaUser className="input-icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-wrapper">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <p style={{ textAlign: "left" }}>
          <span className="link-text" onClick={() => alert("Forgot Password!")}>
            Forgot Password?
          </span>
        </p>

        <button type="submit" disabled={loading}>
          {loading ? "A Entrar..." : "Sign In"}
        </button>

        <p style={{ textAlign: "left", marginTop: "150px" }}>
          Don't have an account?{" "}
          <span
            className="link-text"
            onClick={() => navigate("/register")} // MUDANÇA: Usar navigate em vez de onSwitch
          >
            Create Account
          </span>
        </p>
      </form>
    </div>
  );
}
