import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"; // npm install react-icons

export default function Register({ onSwitch, onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setError("");

    if (password !== confirmPassword) {
      setError("As passwords não são iguais!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5005/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          email: email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `Conta criada com sucesso para ${data.username}! Agora preencha o seu perfil.`
        );

        if (onRegisterSuccess) {
          onRegisterSuccess(data); // <-- ISTO GUARDA o ID no estado 'loggedInUser'
        }

        onSwitch("getstarted");
      } else {
        setError(data.message || "Erro no registo. Tente outro Username.");
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      setError("Não foi possível conectar ao servidor. Verifique o backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="container register-bg" onSubmit={handleSubmit}>
      <div>
        <h1>Create Account</h1>
        <h3>Fill in your details to get started.</h3>
      </div>

      {error && <p style={{ color: "red", margin: "10px 0" }}>{error}</p>}

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
        <FaEnvelope className="input-icon" />
        <input
          type="email"
          placeholder="Email (Opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <div className="input-wrapper">
        <FaLock className="input-icon" />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      {/* O botão faz o submit do formulário */}
      <button type="submit" disabled={loading}>
        {loading ? "A Registar..." : "Get Started"}
      </button>

      <p style={{ textAlign: "left", marginTop: "65px" }}>
        Already have an account?{" "}
        <span className="link-text" onClick={() => onSwitch("login")}>
          Sign In
        </span>
      </p>
    </form>
  );
}
