import { useState, useEffect } from "react";
import Login from "./Component/Login";
import Dashboard from "./Component/Panel";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Vehicle from "./Component/Vehicle";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    localStorage.setItem("attempt", 0);
  }, []);

  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vehicle" element={<Vehicle />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
