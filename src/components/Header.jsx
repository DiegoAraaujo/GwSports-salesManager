import { useState } from "react";
import "./header.css";
import LogoMarca from "../assets/logo-GwSports.svg";
import ProductSearched from "./ProductSearched";

function Header() {
  // Estado para armazenar o termo pesquisado
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);

  // Lista de produtos disponíveis
  const produtos = [
    {
      Nome: "Camiseta academia",
      categoria: "Roupas",
      marca: "nike",
      tamanho: "G",
      valor: 80,
      estoque: 200,
    },
    {
      Nome: "mercurial 2024",
      categoria: "chuteira",
      marca: "nike",
      tamanho: "40",
      valor: 400,
      estoque: 100,
    },
    {
      Nome: "faixa cabelo",
      categoria: "Roupas",
      marca: "nike",
      tamanho: "p",
      valor: 30,
      estoque: 10,
    },
  ];

  // Função para atualizar a pesquisa e filtrar os produtos
  function handlePesquisa(evento) {
    const texto = evento.target.value;
    setTermoPesquisa(texto);

    // Se o campo estiver vazio, a lista de produtos some
    if (texto.trim() === "") {
      setProdutosFiltrados([]); // Limpa a lista
      return;
    }

    // Filtra os produtos pelo nome
    const filtrados = produtos.filter((produto) =>
      produto.Nome.toLowerCase().includes(texto.toLowerCase())
    );

    setProdutosFiltrados(filtrados);
  }

  return (
    <header className="container">
      <img
        src={LogoMarca}
        alt="logo marca da empresa GW Sports"
        className="logoMarca"
      />

      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquise por um produto"
          value={termoPesquisa}
          onChange={handlePesquisa} // Chamamos a função ao digitar
        />
        <ion-icon name="search-sharp"></ion-icon>

        {/* Exibe a lista de produtos filtrados somente se houver resultados */}
        {produtosFiltrados.length > 0 && (
          <div className="list-productFound">
            {produtosFiltrados.map((produto, index) => (
              <ProductSearched
                key={index}
                nome={produto.Nome}
                unidades={produto.estoque}
                marca={produto.marca}
                categoria={produto.categoria}
                preco={produto.valor}
                tamanho={produto.tamanho}
              />
            ))}
          </div>
        )}
      </div>

      <div className="options-menu-navegation">
        <div className="icon-active">
          <ion-icon name="home"></ion-icon>
        </div>
        <div>
          <ion-icon name="bar-chart-sharp"></ion-icon>
        </div>
        <div>
          <ion-icon name="settings"></ion-icon>
        </div>
      </div>
    </header>
  );
}

export default Header;
