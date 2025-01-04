import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginc from "./Loginc";
import App from "../App";
import Dashboard from "./Dashboard";
import CreateProblem from "./CreateProblem ";

export default function Rout() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/home" element={<App />} />
        <Route path="/login" element={<Loginc />} />
        <Route path="/create" element={<CreateProblem />} />
        {/* <Route path="/page/:id" element={<Page />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
