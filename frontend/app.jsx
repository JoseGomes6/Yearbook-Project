import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import Login from "./components/Login";
import Register from "./components/Register";
import GetStarted from "./components/GetStarted";

import "./styles/main.css";

function App() {
  const [page, setPage] = useState("login");

  const handleSwitch = (target) => setPage(target);
  const handleLogin = () => setPage("getstarted");
  const handleRegister = () => setPage("getstarted");

  return (
    <div className="app-wrapper">
      {page === "login" && (
        <Login onSwitch={handleSwitch} onLogin={handleLogin} />
      )}
      {page === "register" && (
        <Register onSwitch={handleSwitch} onRegister={handleRegister} />
      )}
      {page === "getstarted" && <GetStarted />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
