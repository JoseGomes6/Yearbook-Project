import React, { useState } from "react";

export default function Login({ onLoginSuccess, navigate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");
  const [loading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data);
      } else {
        alert(data.message || "Erro no login");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert(
        "Não foi possível ligar ao servidor. Verifica se o backend está ativo."
      );
    }
  };

  return (
    <div className="container-wrapper">
      <form className="container login-bg" onSubmit={handleSubmit}>
        <h1>Sign In</h1>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

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
            type="password"
            placeholder="Password"
            autoComplete="current-password"
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
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/register")}
          >
            Create Account
          </span>
        </p>
      </form>
    </div>
  );
}
