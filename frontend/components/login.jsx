import React from "react";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login({ onSwitch, onLogin }) {
  return (
    <div className="container">
      <h1>Sign In</h1>

      <div className="input-wrapper">
        <FaUser className="input-icon" />
        <input type="text" placeholder="Username" />
      </div>

      <div className="input-wrapper">
        <FaLock className="input-icon" />
        <input type="password" placeholder="Password" />
      </div>

      <p style={{ textAlign: "left" }}>
        <span className="link-text" onClick={() => alert("Forgot Password!")}>
          Forgot Password?
        </span>
      </p>

      <button onClick={onLogin}>Sign In</button>

      <p style={{ textAlign: "left", marginTop: "150px" }}>
        Don't have an account?{" "}
        <span className="link-text" onClick={() => onSwitch("register")}>
          Create Account
        </span>
      </p>
    </div>
  );
}
