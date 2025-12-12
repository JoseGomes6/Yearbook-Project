import React from "react";

export default function Login({ onSwitch, onLogin }) {
  return (
    <div className="container">
      <h1>Login</h1>
      <input type="text" placeholder="Username" />
      <input type="password" placeholder="Password" />
      <p style={{ textAlign: "left" }}>
        <span className="link-text" onClick={() => alert("Forgot Password!")}>
          Forgot Password?
        </span>
      </p>
      <button onClick={onLogin}>Sign In</button>
      <p style={{ textAlign: "left", marginTop: "10px" }}>
        Don't have an account?{" "}
        <span className="link-text" onClick={() => onSwitch("register")}>
          Create Account
        </span>
      </p>
    </div>
  );
}
