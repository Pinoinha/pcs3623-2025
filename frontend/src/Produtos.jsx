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

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    tipo: "",
  });

  const [produtoEditado, setProdutoEditado] = useState({
    nome: "",
    tipo: "",
  });

  const [editar, setEditar] = useState(false);
  const [idEditar, setIdEditar] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    const resposta = await axios.get("http://localhost:8000/produtos/");
    setProdutos(resposta.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/produtos/", novoProduto);
    carregarProdutos();
  };

  const handleEditar = async (id) => {
    const produto = produtos.find((c) => c.id === id);
    setProdutoEditado(produto);
    setIdEditar(id);
    setEditar(true);
    setModalAberto(true);
  };

  const handleAtualizar = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:8000/produtos/${idEditar}`,
      produtoEditado,
    );
    carregarProdutos();
    setEditar(false);
    setModalAberto(false);
  };

  const handleExcluir = async (cpf) => {
    await axios.delete(`http://localhost:8000/produtos/${cpf}`);
    carregarProdutos();
  };

  return (
    <div>
      <h2>Produtos</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={novoProduto.nome}
          onChange={(e) =>
            setNovoProduto({ ...novoProduto, nome: e.target.value })
          }
        />
        <select
          onChange={(e) =>
            setNovoProduto({ ...novoProduto, tipo: e.target.value })
          }
        >
          <option value="Consulta">Consulta</option>
          <option value="Exame">Exame</option>
        </select>
        <button type="submit">Adicionar</button>
      </form>

      {editar && (
        <form onSubmit={handleAtualizar}>
          <input
            type="text"
            placeholder="id"
            value={produtoEditado.id}
            disabled
          />
          <input
            type="text"
            placeholder="Nome"
            value={produtoEditado.nome}
            onChange={(e) =>
              setProdutoEditado({
                ...produtoEditado,
                nome: e.target.value,
              })
            }
          />

          <select
            onChange={(e) =>
              setProdutoEditado({ ...novoProduto, tipo: e.target.value })
            }
          >
            <option value="Consulta">Consulta</option>
            <option value="Exame">Exame</option>
          </select>
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
            Id do Produto <br />
          </label>
          <input
            type="text"
            placeholder="Id"
            value={produtoEditado.id}
            disabled
          />
          <hr />
          <label>
            Nome do Produto <br />
            <input
              type="text"
              placeholder="Nome"
              value={produtoEditado.nome}
              onChange={(e) =>
                setProdutoEditado({
                  ...produtoEditado,
                  nome: e.target.value,
                })
              }
            />
          </label>
          <hr />
          <label>
            Tipo do Produto <br />
            <select
              onChange={(e) =>
                setProdutoEditado({ ...novoProduto, tipo: e.target.value })
              }
            >
              <option value="Consulta">Consulta</option>
              <option value="Exame">Exame</option>
            </select>
          </label>
          <br />
          <br />
          <button type="submit">Atualizar</button>
        </form>
      </Modal>

      <ul>
        {produtos.map((produto) => (
          <li key={produto.id}>
            Produto: {produto.nome} | Tipo: {produto.tipo}
            <button onClick={() => handleEditar(produto.id)}>
              <CiEdit />
            </button>
            <button onClick={() => handleExcluir(produto.id)}>
              <CiEraser />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Produtos;
