import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Clientes from "./Clientes";
import Agendamentos from "./Agendamentos";
import Medicos from "./Medicos";
import Produtos from "./Produtos";
import ProdutoAgendamentos from "./ProdutoAgendamentos";

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", backgroundColor: "#f0f0f0" }}>
        <ul style={{ display: "flex", gap: "1rem", listStyle: "none" }}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/clientes">Clientes</Link>
          </li>
          <li>
            <Link to="/medicos">Médicos</Link>
          </li>
          <li>
            <Link to="/produtos">Produtos</Link>
          </li>
          <li>
            <Link to="/agendamentos">Agendamentos</Link>
          </li>
          <li>
            <Link to="/produtoAgendamentos">ProdutoAgendamentos</Link>
          </li>
        </ul>
      </nav>

      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/medicos" element={<Medicos />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route
            path="/produtoAgendamentos"
            element={<ProdutoAgendamentos />}
          />
          <Route
            path="/"
            element={<h2>Bem-vindo ao Sistema de Agendamentos</h2>}
          />
          <Route path="*" element={<h2>Página não encontrada</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
