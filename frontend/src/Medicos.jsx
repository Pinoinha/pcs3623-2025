import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { CiEdit, CiEraser } from "react-icons/ci";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function Medicos() {
  const [medicos, setMedicos] = useState([]);
  const [novoMedico, setNovoMedico] = useState({
    crm: "",
    nome: "",
  });

  const [medicoEditado, setMedicoEditado] = useState({
    crm: "",
    nome: "",
  });

  const [editar, setEditar] = useState(false);
  const [idEditar, setIdEditar] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    carregarMedicos();
  }, []);

  const carregarMedicos = async () => {
    const resposta = await axios.get("http://localhost:8000/medicos/");
    setMedicos(resposta.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/medicos/", novoMedico);
    carregarMedicos();
  };

  const handleEditar = async (id) => {
    const medico = medicos.find((c) => c.id === id);
    setMedicoEditado(medico);
    setIdEditar(id);
    setEditar(true);
    setModalAberto(true);
  };

  const handleAtualizar = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8000/medicos/${idEditar}`, medicoEditado);
    carregarMedicos();
    setEditar(false);
    setModalAberto(false);
  };

  const handleExcluir = async (cpf) => {
    await axios.delete(`http://localhost:8000/medicos/${cpf}`);
    carregarMedicos();
  };

  return (
    <div>
      <h2>Medicos</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="crm"
          value={editar ? "" : novoMedico.crm}
          maxLength={7}
          onChange={(e) =>
            setNovoMedico({ ...novoMedico, crm: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Nome"
          value={novoMedico.nome}
          maxLength={32}
          onChange={(e) =>
            setNovoMedico({ ...novoMedico, nome: e.target.value })
          }
        />
        <button type="submit">Adicionar</button>
      </form>

      {editar && (
        <form onSubmit={handleAtualizar}>
          <input
            type="text"
            placeholder="CRM"
            value={medicoEditado.cpf}
            disabled
          />
          <input
            type="text"
            placeholder="Nome"
            value={medicoEditado.nome}
            onChange={(e) =>
              setMedicoEditado({
                ...medicoEditado,
                nome: e.target.value,
              })
            }
          />
          <button type="submit">Atualizar</button>
        </form>
      )}

      <Modal
        isOpen={modalAberto}
        style={customStyles}
        onRequestClose={() => setModalAberto(false)}
      >
        <form onSubmit={handleAtualizar}>
          <label>
            CRM do Médico <br />
          </label>
          <input
            type="text"
            placeholder="CRM"
            value={medicoEditado.crm}
            disabled
          />
          <hr />
          <label>
            Nome do Médico <br />
            <input
              type="text"
              placeholder="Nome"
              value={medicoEditado.nome}
              onChange={(e) =>
                setMedicoEditado({
                  ...medicoEditado,
                  nome: e.target.value,
                })
              }
            />
          </label>
          <br />
          <br />
          <button type="submit">Atualizar</button>
        </form>
      </Modal>

      <ul>
        {medicos.map((medico) => (
          <li key={medico.crm}>
            Medico: {medico.nome} | CRM: {medico.crm}
            <button onClick={() => handleEditar(medico.id)}>
              <CiEdit />
            </button>
            <button onClick={() => handleExcluir(medico.id)}>
              <CiEraser />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Medicos;
