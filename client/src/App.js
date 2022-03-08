import { useState, useEffect } from "react";
import Login from "./Component/Login";
import Dashboard from "./Component/Panel";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [data, setData] = useState("");

  return (
    <div className="App">
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
