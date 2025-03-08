import { useState } from "react";
import "./login.css";

const Login = ({ onLogin }) => {
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message,setMessage] = useState("")

  const handleLogin = async () => {
    const res = await fetch("https://librarybackend-bixf.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_name, password }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_name", data.user_name); // Store user_name
      localStorage.setItem("id",data.id)
      onLogin(data.user_name,data.id); // Pass user_name to parent component
    } else {
      setMessage("Invalid credintials!")
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="user_name"
          value={user_name}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {message&& <p>{message}</p>}
      </div>
    </div>
  );
};

export default Login;
