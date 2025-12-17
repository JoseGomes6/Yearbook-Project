import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";

// 🛑 O componente agora recebe apenas onSwitch e assume que o onLogin
// fará a chamada à API internamente.
export default function Login({ onSwitch, onLoginSuccess }) {
  // 1. Estados para capturar os dados do formulário
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Função para lidar com o envio do formulário
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
        // ✅ 1. IMPORTANTE: Guardar o ID no localStorage para o Profile.jsx conseguir ler
        // O teu backend envia o ID como _id
        localStorage.setItem("userId", data._id);

        // ✅ 2. CORREÇÃO: Passar os dados certos para a App.js
        // No teu backend não tens 'data.user', tens os dados diretamente no 'data'
        onLoginSuccess(data);

        alert("Login bem-sucedido!");
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
    // 🛑 Envolvemos o conteúdo num <form> e usamos o onSubmit
    <form className="container login-bg" onSubmit={handleSubmit}>
      <h1>Sign In</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Input Username */}
      <div className="input-wrapper">
        <FaUser className="input-icon" />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // 3. Atualiza o estado
          required
        />
      </div>

      {/* Input Password */}
      <div className="input-wrapper">
        <FaLock className="input-icon" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // 3. Atualiza o estado
          required
        />
      </div>

      <p style={{ textAlign: "left" }}>
        <span className="link-text" onClick={() => alert("Forgot Password!")}>
          Forgot Password?
        </span>
      </p>

      {/* 🛑 O botão agora faz submit do formulário */}
      <button type="submit" disabled={loading}>
        {loading ? "A Entrar..." : "Sign In"}
      </button>

      <p style={{ textAlign: "left", marginTop: "150px" }}>
        Don't have an account?{" "}
        <span className="link-text" onClick={() => onSwitch("register")}>
          Create Account
        </span>
      </p>
    </form>
  );
}
