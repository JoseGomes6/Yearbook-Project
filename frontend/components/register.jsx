import React from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa"; // precisa de npm install react-icons

export default function Register({ onSwitch, onRegister }) {
  return (
    <div className="container">
      <div>
        <h1>Create Account</h1>
        <h3>Fill in your details to get started.</h3>
      </div>

      {/* Username */}
      <div className="input-wrapper">
        <FaUser className="input-icon" />
        <input type="text" placeholder="Username" />
      </div>

      {/* Email */}
      <div className="input-wrapper">
        <FaEnvelope className="input-icon" />
        <input type="email" placeholder="Email" />
      </div>

      {/* Password */}
      <div className="input-wrapper">
        <FaLock className="input-icon" />
        <input type="password" placeholder="Password" />
      </div>

      {/* Confirm Password */}
      <div className="input-wrapper">
        <FaLock className="input-icon" />
        <input type="password" placeholder="Confirm Password" />
      </div>

      <button onClick={onRegister}>Get Started</button>

      <p style={{ textAlign: "left", marginTop: "65px" }}>
        Already have an account?{" "}
        <span className="link-text" onClick={() => onSwitch("login")}>
          Sign In
        </span>
      </p>
    </div>
  );
}
