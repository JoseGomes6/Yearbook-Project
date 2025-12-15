import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"; // npm install react-icons

// 🛑 A função 'onRegister' foi substituída por 'onRegisterSuccess'
// que deve ser executada se a chamada à API for bem-sucedida.
export default function Register({ onSwitch, onRegisterSuccess }) {
  // 1. Estados para capturar os dados do formulário
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. Função que lida com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setError("");

    // Validação básica frontend
    if (password !== confirmPassword) {
      setError("As passwords não são iguais!");
      return;
    }

    setLoading(true);

    try {
      // 🛑 AQUI: Chamada à rota de Registo do backend
      const response = await fetch("http://localhost:5005/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Enviamos apenas o username e a password, pois o backend
        // no momento só utiliza estes dois campos no modelo User.js
        body: JSON.stringify({
          username: username,
          password: password,
          email: email, // Podemos enviar o email, mas o backend não o guarda ainda.
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Se o registo for bem-sucedido (código 201 Created)
        alert(
          `Conta criada com sucesso para ${data.username}! Agora preencha o seu perfil.`
        );

        // 🛑 1. CHAMA PRIMEIRO: Chama a função que armazena o ID no App.jsx
        if (onRegisterSuccess) {
          onRegisterSuccess(data); // <-- ISTO GUARDA o ID no estado 'loggedInUser'
        }

        // 🛑 2. REDIRECIONA DEPOIS: Só navega DEPOIS de o ID estar guardado
        onSwitch("getstarted");
      } else {
        // Erro vindo do backend (ex: Username já existe - 400 Bad Request)
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
    // 🛑 Envolvemos o conteúdo num <form> e usamos o onSubmit
    <form className="container" onSubmit={handleSubmit}>
      <div>
        <h1>Create Account</h1>
        <h3>Fill in your details to get started.</h3>
      </div>

      {/* Exibe erros (validação frontend ou backend) */}
      {error && <p style={{ color: "red", margin: "10px 0" }}>{error}</p>}

      {/* 🛑 Username */}
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

      {/* 🛑 Email */}
      <div className="input-wrapper">
        <FaEnvelope className="input-icon" />
        <input
          type="email"
          placeholder="Email (Opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* 🛑 Password */}
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

      {/* 🛑 Confirm Password */}
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
