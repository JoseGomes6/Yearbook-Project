import React from "react";

export default function Register({ onSwitch, onRegister }) {
  return (
    <div className="container">
      <h1>Create Account</h1>
      <input type="text" placeholder="Username" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <input type="password" placeholder="Confirm Password" />
      <button onClick={onRegister}>Get Started</button>
      <p style={{ textAlign: "left", marginTop: "10px" }}>
        Already have an account?{" "}
        <span className="link-text" onClick={() => onSwitch("login")}>
          Sign In
        </span>
      </p>
    </div>
  );
}
