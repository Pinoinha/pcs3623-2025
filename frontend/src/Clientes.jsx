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

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [novoCliente, setNovoCliente] = useState({
    cpf: "",
    nome: "",
    idade: "",
  });

  const [clienteEditado, setClienteEditado] = useState({
    cpf: "",
    nome: "",
    idade: "",
  });

  const [editar, setEditar] = useState(false);
  const [cpfEditar, setCpfEditar] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    const resposta = await axios.get("http://localhost:8000/clientes/");
    setClientes(resposta.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/clientes/", novoCliente);
    carregarClientes();
  };

  const handleEditar = async (cpf) => {
    const cliente = clientes.find((c) => c.cpf === cpf);
    setClienteEditado(cliente);
    setCpfEditar(cpf);
    setEditar(true);
    setModalAberto(true);
  };

  const handleAtualizar = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:8000/clientes/${cpfEditar}`,
      clienteEditado,
    );
    carregarClientes();
    setEditar(false);
    setModalAberto(false);
  };

  const handleExcluir = async (cpf) => {
    await axios.delete(`http://localhost:8000/clientes/${cpf}`);
    carregarClientes();
  };

  return (
    <div>
      <h2>Clientes</h2>
      {!editar && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="CPF"
            value={editar ? "" : novoCliente.cpf}
            maxLength={11}
            onChange={(e) =>
              setNovoCliente({ ...novoCliente, cpf: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Nome"
            value={novoCliente.nome}
            onChange={(e) =>
              setNovoCliente({ ...novoCliente, nome: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Idade"
            value={novoCliente.idade}
            onChange={(e) =>
              setNovoCliente({ ...novoCliente, idade: e.target.value })
            }
          />
          <button type="submit">Adicionar</button>
        </form>
      )}

      {editar && (
        <form onSubmit={handleAtualizar}>
          <input
            type="text"
            placeholder="CPF"
            value={clienteEditado.cpf}
            disabled
          />
          <input
            type="text"
            placeholder="Nome"
            value={clienteEditado.nome}
            onChange={(e) =>
              setClienteEditado({ ...clienteEditado, nome: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Idade"
            value={clienteEditado.idade}
            onChange={(e) =>
              setClienteEditado({ ...clienteEditado, idade: e.target.value })
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
          <input
            type="text"
            placeholder="CPF"
            value={clienteEditado.cpf}
            disabled
          />
          <input
            type="text"
            placeholder="Nome"
            value={clienteEditado.nome}
            onChange={(e) =>
              setClienteEditado({ ...clienteEditado, nome: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Idade"
            value={clienteEditado.idade}
            onChange={(e) =>
              setClienteEditado({ ...clienteEditado, idade: e.target.value })
            }
          />
          <button type="submit">Atualizar</button>
        </form>
      </Modal>

      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.cpf}>
            Cliente: {cliente.nome} | CPF: {cliente.cpf} | Idade:{" "}
            {cliente.idade} anos
            <button onClick={() => handleEditar(cliente.cpf)}>
              <CiEdit />
            </button>
            <button onClick={() => handleExcluir(cliente.cpf)}>
              <CiEraser />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Clientes;
