import React, { useState, useEffect } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function postData(e) {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/login", {
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

    if (data.user) {
      localStorage.setItem("idx", data.idx);
      localStorage.setItem("token", data.user);
      alert("Login successful");
      window.location.href = "/dashboard";
    } else {
      console.log(localStorage.getItem("attempt"));
      alert("Please check your username and password");
      localStorage.setItem("attempt", Number(localStorage.getItem("attempt")) + 1);
      if (localStorage.getItem("attempt") == 3) {
        // Three times wrong login attempt situation
        alert("3 kez yanlış giriş yaptınız!!!");
      }
    }
  }

  return (
    <div>
      <h1
        style={{
          position: "absolute",
          left: "50%",
          top: "37%",
          transform: "translate(-50%, -50%)",
        }}
      >
        Login Page
      </h1>
      <form
        onSubmit={postData}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <br />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
