import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginc from "./Loginc";
import App from "../App";
import Dashboard from "./Dashboard";
import CreateProblem from "./CreateProblem ";
import Yourcode from "./Yourcode";
import ProblemAdder from "./ProblemAdder";
import Problem_Page from "./Problem_Page";
import Graph from "./Graph";
import GraphProvider from "./GraphProvider";
import Home from "./Home";
export default function Rout() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/play" element={<App />} />
        <Route path="/login" element={<Loginc />} />
        <Route path="/create" element={<CreateProblem />} />
        <Route path="/yourcode" element={<Yourcode />} />
        <Route path="/add" element={<ProblemAdder />} />
        <Route path="/home" element={<Dashboard />} />
        <Route
          path="/problem/:id"
          element={
            <GraphProvider>
              <Problem_Page />
            </GraphProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
