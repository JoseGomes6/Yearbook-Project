import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

// Importações dos teus componentes
import Login from "./components/Login";
import Register from "./components/Register";
import GetStarted from "./components/getstarted";
import Yearbook from "./components/Yearbook";
import Sidebar from "./components/sidebar";
import Profile from "./components/profile";
import FriendsList from "./components/friendslist";
import Settings from "./components/settings";
import EditProfile from "./components/editprofile";
import "./styles/main.css";

function App() {
  // 1. Estado de Autenticação
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem("userSession");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 2. Estado de Navegação (Router Manual)
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // 3. Função Navigate (Nativa - substitui o useNavigate do Router)
  const navigate = (path) => {
    window.history.pushState({}, "", path); // Altera o URL sem refresh
    setCurrentPath(path); // Força o React a renderizar a nova página
  };

  // 4. Lidar com os botões "Voltar/Avançar" do Browser
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 5. Persistência de Sessão
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem("userSession", JSON.stringify(loggedInUser));
      localStorage.setItem("userId", loggedInUser._id);
    } else {
      localStorage.removeItem("userSession");
      localStorage.removeItem("userId");
    }
  }, [loggedInUser]);

  const handleAuthSuccess = (userData) => {
    setLoggedInUser(userData);
    navigate("/yearbook");
  };

  const handleLogout = () => {
    localStorage.clear();
    setLoggedInUser(null);
    navigate("/login");
  };

  // 6. Lógica de Renderização (O teu "Switch" manual)
  const renderContent = () => {
    // Páginas Públicas
    if (!loggedInUser) {
      if (currentPath === "/register")
        return (
          <Register onRegisterSuccess={handleAuthSuccess} navigate={navigate} />
        );
      return <Login onLoginSuccess={handleAuthSuccess} navigate={navigate} />;
    }

    // Páginas Privadas
    if (currentPath === "/yearbook")
      return <Yearbook userId={loggedInUser._id} navigate={navigate} />;
    if (currentPath === "/get-started")
      return <GetStarted userId={loggedInUser._id} navigate={navigate} />;
    if (currentPath === "/friends")
      return <FriendsList userId={loggedInUser._id} navigate={navigate} />;
    if (currentPath === "/settings")
      return (
        <Settings
          userId={loggedInUser._id}
          onLogout={handleLogout}
          navigate={navigate}
        />
      );
    if (currentPath === "/edit-profile")
      return <EditProfile userId={loggedInUser._id} navigate={navigate} />;

    // Rota Dinâmica para Perfil (/profile/ID_DO_USER)
    if (currentPath.startsWith("/profile")) {
      const parts = currentPath.split("/");
      const profileId = parts[2] || loggedInUser._id;
      return <Profile userId={profileId} navigate={navigate} />;
    }

    // Rota padrão (Home)
    return <Yearbook userId={loggedInUser._id} navigate={navigate} />;
  };

  return (
    <div className="app-wrapper">
      {/* Sidebar agora recebe a função navigate */}
      {loggedInUser && (
        <Sidebar
          user={loggedInUser}
          onLogout={handleLogout}
          navigate={navigate}
          currentPath={currentPath}
        />
      )}

      <div
        className={loggedInUser ? "content-area sidebar-layout" : "auth-layout"}
      >
        {renderContent()}
      </div>

      {!loggedInUser && (
        <div className="auth-image-side">
          <img
            src="/BackgroundPhoto.jpg"
            alt="Background"
            className="auth-bg-image"
          />
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
