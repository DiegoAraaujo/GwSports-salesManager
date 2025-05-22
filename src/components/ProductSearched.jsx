import "../styles/ProductSearched.css";

function ProductSearched({ nome,unidades, categoria, marca,preco}) {
  return (
    <div className="productFound">
      <span>{categoria}</span> 
      <span>{nome}</span>
      <span>{marca}</span>
      <span>Estoque: {unidades}</span>
      <span>{preco} R$</span>
    </div>
  );
}

export default ProductSearched;
