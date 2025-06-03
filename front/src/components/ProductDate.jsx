import "../styles/productDate.css"

function ProductDate(props) {
  return (
    <div className="product-stock">
      <div className="product-stock-header"> 
        <h3>Chuteira: {props.nome}</h3>
      </div>
      <ul className="product-stock-body">
        <li><strong>Tamanho</strong>: {props.tamanho}</li>
        <li><strong>Valor</strong>: {props.valor} R$</li>
        <li><strong>Quantidade disponível</strong>: {props.quantidade}</li>
        <li><strong>Marca</strong>: {props.marca}</li>
      </ul>
    </div>
  );
}

export default ProductDate;
