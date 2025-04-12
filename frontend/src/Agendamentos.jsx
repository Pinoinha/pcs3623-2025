import React, { useState, useEffect } from "react";
import { CiEdit, CiEraser } from "react-icons/ci";
import Modal from "react-modal";
import axios from "axios";

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

function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [novoAgendamento, setNovoAgendamento] = useState({
    crm: "",
    cpf: "",
    data: "",
  });

  const [agendamentoEditado, setAgendamentoEditado] = useState({
    crm: "",
    data: "",
  });

  const [editar, setEditar] = useState(false);
  const [idEditar, setIdEditar] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const carregarAgendamentos = async () => {
    const resposta = await axios.get("http://localhost:8000/agendamentos/");
    setAgendamentos(resposta.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post("http://localhost:8000/agendamentos/", novoAgendamento)
      .then((resposta) => console.log(resposta));
    carregarAgendamentos();
  };

  const handleEditar = async (id) => {
    const agendamento = agendamentos.find((c) => c.id === id);
    setAgendamentoEditado(agendamento);
    setIdEditar(id);
    setEditar(true);
    setModalAberto(true);
  };

  const handleAtualizar = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:8000/agendamentos/${idEditar}`,
      agendamentoEditado,
    );
    carregarAgendamentos();
    setEditar(false);
    setModalAberto(false);
  };

  const handleExcluir = async (cpf) => {
    await axios.delete(`http://localhost:8000/agendamentos/${cpf}`);
    carregarAgendamentos();
  };

  return (
    <div>
      <h2>Agendamentos</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="crm"
          value={novoAgendamento.crm}
          maxLength={7}
          onChange={(e) =>
            setNovoAgendamento({ ...novoAgendamento, crm: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="cpf"
          value={editar ? "" : novoAgendamento.cpf}
          maxLength={11}
          onChange={(e) =>
            setNovoAgendamento({ ...novoAgendamento, cpf: e.target.value })
          }
        />
        <input
          type="date"
          placeholder="Data"
          value={novoAgendamento.data}
          onChange={(e) =>
            setNovoAgendamento({ ...novoAgendamento, data: e.target.value })
          }
        />
        <button type="submit">Adicionar</button>
      </form>

      {editar && (
        <form onSubmit={handleAtualizar}>
          <input
            type="text"
            placeholder="CPF"
            value={agendamentoEditado.cpf}
            disabled
          />
          <input
            type="text"
            placeholder="CRM"
            value={agendamentoEditado.crm}
            onChange={(e) =>
              setAgendamentoEditado({
                ...agendamentoEditado,
                crm: e.target.value,
              })
            }
          />
          <input
            type="date"
            placeholder="Data"
            value={agendamentoEditado.data}
            onChange={(e) =>
              setAgendamentoEditado({
                ...agendamentoEditado,
                data: e.target.value,
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
            Id do Agendamento <br />
            <input
              type="text"
              placeholder="Id"
              value={agendamentoEditado.id}
              disabled
            />
          </label>
          <hr />
          <label>
            CPF do Cliente <br />
            <input
              type="text"
              placeholder="CPF"
              value={agendamentoEditado.cpf}
              disabled
            />
          </label>
          <hr />
          <label>
            CRM do Médico <br />
            <input
              type="text"
              placeholder="CRM"
              value={agendamentoEditado.crm}
              onChange={(e) =>
                setAgendamentoEditado({
                  ...agendamentoEditado,
                  crm: e.target.value,
                })
              }
            />
          </label>
          <hr />
          <label>
            Data de realização do procedimento <br />
            <input
              type="date"
              placeholder="Data"
              value={agendamentoEditado.data}
              onChange={(e) =>
                setAgendamentoEditado({
                  ...agendamentoEditado,
                  data: e.target.value,
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
        {agendamentos.map((agendamento) => (
          <li key={agendamento.id}>
            Id: {agendamento.id} | Médico: {agendamento.crm} | Cliente:{" "}
            {agendamento.cpf} | Data de realização: {agendamento.data}
            <button onClick={() => handleEditar(agendamento.id)}>
              <CiEdit />
            </button>
            <button onClick={() => handleExcluir(agendamento.id)}>
              <CiEraser />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Agendamentos;
