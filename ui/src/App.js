// 1. TODOS os imports no topo absoluto
import React, { useState, useEffect, Suspense, lazy } from "react";
import Sidebar from "./components/sidebar";
import "./styles/main.css";

// 2. Definição dos componentes Lazy (fora do array para facilitar o uso no fallback)
const Login = lazy(() => import("./components/login"));
const Yearbook = lazy(() => import("./components/yearbook"));

// 3. Definição das rotas
const routes = [
  { path: "/login", component: Login, public: true },
  {
    path: "/register",
    component: lazy(() => import("./components/register")),
    public: true,
  },
  { path: "/yearbook", component: Yearbook, private: true },
  {
    path: "/get-started",
    component: lazy(() => import("./components/getstarted")),
    private: true,
  },
  {
    path: "/friends",
    component: lazy(() => import("./components/friendslist")),
    private: true,
  },
  {
    path: "/settings",
    component: lazy(() => import("./components/settings")),
    private: true,
  },
  {
    path: "/edit-profile",
    component: lazy(() => import("./components/editprofile")),
    private: true,
  },
  {
    path: "/profile",
    component: lazy(() => import("./components/profile")),
    private: true,
    dynamic: true,
  },
];

export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const savedUser = localStorage.getItem("userSession");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem("userSession", JSON.stringify(loggedInUser));
      localStorage.setItem("userId", loggedInUser._id);
    } else {
      localStorage.removeItem("userSession");
      localStorage.removeItem("userId");
    }
  }, [loggedInUser]);

  const handleAuthSuccess = (userData, redirectPath = "/yearbook") => {
    setLoggedInUser(userData);
    navigate(redirectPath);
  };

  const handleLogout = () => {
    localStorage.clear();
    setLoggedInUser(null);
    navigate("/login");
  };

  const renderContent = () => {
    const route = routes.find((r) =>
      r.dynamic ? currentPath.startsWith(r.path) : r.path === currentPath
    );

    // CORREÇÃO AQUI: Usar os componentes lazy definidos acima, dentro de Suspense
    if (!route) {
      return (
        <Suspense fallback={<div>A carregar...</div>}>
          {loggedInUser ? (
            <Yearbook userId={loggedInUser._id} navigate={navigate} />
          ) : (
            <Login onLoginSuccess={handleAuthSuccess} navigate={navigate} />
          )}
        </Suspense>
      );
    }

    if (route.private && !loggedInUser) {
      navigate("/login");
      return null;
    }

    const Component = route.component;
    const props = {
      userId: loggedInUser?._id,
      navigate,
      onLoginSuccess: handleAuthSuccess,
      onRegisterSuccess: (data) => handleAuthSuccess(data, "/get-started"),
      onLogout: handleLogout,
      user: loggedInUser,
    };

    if (route.dynamic && currentPath.startsWith("/profile")) {
      const parts = currentPath.split("/");
      props.userId = parts[2] || loggedInUser?._id;
    }

    return (
      <Suspense fallback={<div className="loading">A carregar...</div>}>
        <Component {...props} />
      </Suspense>
    );
  };

  return (
    <div className="app-wrapper">
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
