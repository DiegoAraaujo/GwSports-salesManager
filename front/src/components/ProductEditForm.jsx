import React, { useEffect, useState, useCallback } from "react";

import axios from "axios";

import { Link } from "react-router-dom";

import Button from "./Button";

import "../styles/ProductEditForm.css";

// Componente simples de Modal

const Modal = ({ message, type, onConfirm, onClose }) => {
  if (!message) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",

        top: 0,

        left: 0,

        right: 0,

        bottom: 0,

        backgroundColor: "rgba(0, 0, 0, 0.5)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        zIndex: 1000,
      }}
    >
           {" "}
      <div
        className="modal-content"
        style={{
          backgroundColor: "white",

          padding: "20px",

          borderRadius: "8px",

          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",

          textAlign: "center",

          maxWidth: "400px",

          width: "90%",
        }}
      >
               {" "}
        <p style={{ marginBottom: "20px", fontSize: "1.1em" }}>{message}</p>   
           {" "}
        {type === "confirm" ? (
          <div
            className="modal-actions"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
                        <Button prop="Sim" onClick={onConfirm} type="button" />
                        <Button prop="Não" onClick={onClose} type="button" />   
                 {" "}
          </div>
        ) : (
          <Button prop="Ok" onClick={onClose} type="button" />
        )}
             {" "}
      </div>
         {" "}
    </div>
  );
};

function ProductEditForm() {
  const [produtos, setProdutos] = useState([]);

  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState("");

  const [novoPrecoOriginal, setNovoPrecoOriginal] = useState("");

  const [novoPrecoRevenda, setNovoPrecoRevenda] = useState("");

  const [novaQuantidade, setNovaQuantidade] = useState("");

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState(null);

  const [modalMessage, setModalMessage] = useState("");

  const [modalType, setModalType] = useState("");

  const [confirmAction, setConfirmAction] = useState(null);

  const carregarProdutos = useCallback(async () => {
    setCarregando(true);

    setErro(null);

    try {
      const response = await axios.get("http://localhost:3000/produtos");

      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);

      setErro("Erro ao carregar produtos. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  useEffect(() => {
    if (produtoSelecionadoId) {
      const produto = produtos.find(
        (p) => p.id === parseInt(produtoSelecionadoId)
      );

      if (produto) {
        setNovoPrecoOriginal(produto.preco_original.toString());

        setNovoPrecoRevenda(produto.preco_revenda.toString());

        setNovaQuantidade(produto.quantidade.toString());
      }
    } else {
      limparFormulario();
    }
  }, [produtoSelecionadoId, produtos]);

  const limparFormulario = () => {
    setProdutoSelecionadoId("");

    setNovoPrecoOriginal("");

    setNovoPrecoRevenda("");

    setNovaQuantidade("");
  };

  const fecharModal = () => {
    setModalMessage("");

    setModalType("");

    setConfirmAction(null);
  };

  const handleAtualizarProduto = async (evento) => {
    evento.preventDefault();

    if (!produtoSelecionadoId) {
      setModalMessage("Selecione um produto para editar.");

      setModalType("error");

      return;
    }

    const dadosAtualizados = {};

    if (novoPrecoOriginal !== "")
      dadosAtualizados.preco_original = parseFloat(novoPrecoOriginal);

    if (novoPrecoRevenda !== "")
      dadosAtualizados.preco_revenda = parseFloat(novoPrecoRevenda);

    if (novaQuantidade !== "")
      dadosAtualizados.quantidade = parseInt(novaQuantidade);

    if (Object.keys(dadosAtualizados).length === 0) {
      setModalMessage("Preencha pelo menos um campo para atualizar.");

      setModalType("error");

      return;
    }

    setCarregando(true);

    try {
      await axios.put(
        `http://localhost:3000/produtos/${produtoSelecionadoId}`,

        dadosAtualizados
      );

      setModalMessage("Produto atualizado com sucesso!");

      setModalType("success");

      await carregarProdutos();

      limparFormulario();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);

      setModalMessage(
        "Erro ao atualizar produto. Verifique o console para mais detalhes."
      );

      setModalType("error");
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluirProduto = () => {
    if (!produtoSelecionadoId) {
      setModalMessage("Selecione um produto para excluir.");

      setModalType("error");

      return;
    }

    setModalMessage("Tem certeza que deseja excluir este produto?");

    setModalType("confirm");

    setConfirmAction(() => async () => {
      setCarregando(true); // Ativar carregamento para a operação de exclusão

      try {
        await axios.delete(
          `http://localhost:3000/produtos/${produtoSelecionadoId}`
        );

        setModalMessage("Produto excluído com sucesso!");

        setModalType("success"); // ATUALIZAÇÃO DE LÓGICA AQUI: // 1. Remove o produto do estado local para atualização imediata do UI

        setProdutos((prevProdutos) =>
          prevProdutos.filter((p) => p.id !== parseInt(produtoSelecionadoId))
        ); // 2. Limpa o formulário, pois o produto selecionado foi excluído

        limparFormulario(); // 3. Opcional: Chama carregarProdutos() para re-sincronizar com o backend // Isso é uma medida de segurança, mas a atualização otimista já deve ter resolvido. // Se a lista de produtos é usada em outros componentes na mesma página e não há um // gerenciamento de estado global, esta chamada ainda é útil. // await carregarProdutos(); // Descomente se ainda houver problemas de sincronização
      } catch (error) {
        console.error("Erro ao excluir produto:", error);

        setModalMessage(
          "Erro ao excluir produto. Verifique o console para mais detalhes."
        );

        setModalType("error");
      } finally {
        fecharModal();

        setCarregando(false); // Desativar carregamento
      }
    });
  };

  return (
    <div className="register-products-section">
           {" "}
      <div className="register-or-edit-product">
                <h2 className="edit-productt">Editar Produtos</h2>       {" "}
        <Link to="/">
                    <h2 className="register-productt">Cadastro de Produtos</h2> 
               {" "}
        </Link>
             {" "}
      </div>
           {" "}
      <form className="edit-products-form" onSubmit={handleAtualizarProduto}>
                {carregando && <p>Carregando produtos...</p>}       {" "}
        {erro && <p className="error-message">{erro}</p>}       {" "}
        <div>
                    <label>Selecione um produto: </label>         {" "}
          <select
            value={produtoSelecionadoId}
            onChange={(e) => setProdutoSelecionadoId(e.target.value)}
            disabled={carregando}
          >
                        <option value="">-- Escolha --</option>           {" "}
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                                {produto.nome} ({produto.marca})              {" "}
              </option>
            ))}
                     {" "}
          </select>
                 {" "}
        </div>
               {" "}
        <div>
                    <label>Novo preço original: </label>         {" "}
          <input
            type="number"
            value={novoPrecoOriginal}
            onChange={(e) => setNovoPrecoOriginal(e.target.value)}
            placeholder="Deixe em branco para não alterar"
            step="0.01"
          />
                 {" "}
        </div>
               {" "}
        <div>
                    <label>Novo preço de revenda: </label>         {" "}
          <input
            type="number"
            value={novoPrecoRevenda}
            onChange={(e) => setNovoPrecoRevenda(e.target.value)}
            placeholder="Deixe em branco para não alterar"
            step="0.01"
          />
                 {" "}
        </div>
               {" "}
        <div>
                    <label>Nova quantidade: </label>         {" "}
          <input
            type="number"
            value={novaQuantidade}
            onChange={(e) => setNovaQuantidade(e.target.value)}
            placeholder="Deixe em branco para não alterar"
            min="0"
          />
                 {" "}
        </div>
               {" "}
        <div>
                    <Button prop="SALVAR" type="submit" disabled={carregando} />
                   {" "}
          <button
            type="button"
            className="deleteProductButton"
            onClick={handleExcluirProduto}
            disabled={carregando} // Mantenho os estilos inline aqui pois o foco é a lógica
            style={{
              marginLeft: "10px",

              padding: "3px 7px",

              borderRadius: "20px",

              border: "1px solid #dc3545",

              backgroundColor: "#dc3545",

              color: "white",

              cursor: "pointer",

              boxShadow: "1px 1px 3px black",
            }}
          >
                        Excluir produto          {" "}
          </button>
                 {" "}
        </div>
             {" "}
      </form>
           {" "}
      <Modal
        message={modalMessage}
        type={modalType}
        onConfirm={confirmAction}
        onClose={fecharModal}
      />
         {" "}
    </div>
  );
}

export default ProductEditForm;
