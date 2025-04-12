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

function ProdutoAgendamentos() {
  const [produtoAgendamentos, setProdutoAgendamentos] = useState([]);
  const [novoProdutoAgendamento, setNovoProdutoAgendamento] = useState({
    id_agendamento: "",
    id_produto: "",
  });

  const [produtoAgendamentoEditado, setProdutoAgendamentoEditado] = useState({
    id_agendamento: "",
    id_produto: "",
  });

  const [editar, setEditar] = useState(false);
  const [idEditar, setIdEditar] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    carregarProdutoAgendamentos();
  }, []);

  const carregarProdutoAgendamentos = async () => {
    const resposta = await axios.get(
      "http://localhost:8000/produtoAgendamentos/",
    );
    setProdutoAgendamentos(resposta.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        "http://localhost:8000/produtoAgendamentos/",
        novoProdutoAgendamento,
      )
      .then((resposta) => console.log(resposta));
    carregarProdutoAgendamentos();
  };

  return (
    <div>
      <h2>ProdutoAgendamentos</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="id_agendamento"
          value={novoProdutoAgendamento.id_agendamento}
          maxLength={7}
          onChange={(e) =>
            setNovoProdutoAgendamento({
              ...novoProdutoAgendamento,
              id_agendamento: e.target.value,
            })
          }
        />
        <input
          type="text"
          placeholder="id_produto"
          value={editar ? "" : novoProdutoAgendamento.id_produto}
          maxLength={11}
          onChange={(e) =>
            setNovoProdutoAgendamento({
              ...novoProdutoAgendamento,
              id_produto: e.target.value,
            })
          }
        />
        <button type="submit">Adicionar</button>
      </form>

      <ul>
        {produtoAgendamentos.map((produtoAgendamento) => (
          <li key={produtoAgendamento.id}>
            Id do Agendamento: {produtoAgendamento.id_agendamento} | Id do
            Produto: {produtoAgendamento.id_produto}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProdutoAgendamentos;
