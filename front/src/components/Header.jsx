import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/header.css";
import LogoMarca from "../assets/logo-GwSports.svg";
import ProductSearched from "./ProductSearched";

function Header() {
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);

  // Hook para pegar a rota atual
  const location = useLocation();

  function handlePesquisa(evento) {
    const texto = evento.target.value;
    setTermoPesquisa(texto);

    if (texto.trim() === "") {
      setProdutosFiltrados([]);
      return;
    }

    const filtrados = produtos.filter((produto) =>
      produto.Nome.toLowerCase().includes(texto.toLowerCase())
    );

    setProdutosFiltrados(filtrados);
  }

function isActive(...paths) {
  return paths.includes(location.pathname) ? "icon-active" : "";
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
          onChange={handlePesquisa}
        />
        <ion-icon name="search-sharp"></ion-icon>

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
        <Link to="/">
          <div className={isActive("/", "/editPage")}>
            <ion-icon name="home"></ion-icon>
          </div>
        </Link>

        <Link to="/insightsPage">
          <div className={isActive("/insightsPage")}>
            <ion-icon name="bar-chart-sharp"></ion-icon>
          </div>
        </Link>

        <Link to="/config">
          <div className={isActive("/config")}>
            <ion-icon name="settings"></ion-icon>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
