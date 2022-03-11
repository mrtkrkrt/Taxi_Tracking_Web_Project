import React, { useState, useEffect } from "react";
const fs = require("fs");
const { parse } = require("csv-parse");

let parser = parse({ columns: true }, function (err, records) {
  console.log(records);
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Get csv coord and save it.
    for (let i = 0; i < 4; i++) {
      let csvPath = "../api/vehicle_" + Number.toString(i + 1) + ".csv";

      fs.createReadStream(__dirname + "/" + csvPath).pipe(parser);
    }
  }, []);

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
      localStorage.setItem("token", data.user);
      alert("Login successful");
      window.location.href = "/dashboard";
    } else {
      alert("Please check your username and password");
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
