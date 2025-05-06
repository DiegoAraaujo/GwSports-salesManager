import "./productDate.css"

function ProductDate(){
  return(
    <div className="product-stock">
      <div className="product-stock-header"> 
        <h3>Chuteira: Mizuno ztx</h3>
      </div>
      <ul className="product-stock-body">
        <li><strong>Tamanho</strong>: 39/40</li>
        <li><strong>Valor</strong>: 300 R$</li>
        <li><strong>Quantidade disponivel</strong>: 20</li>
        <li><strong>Marca</strong>: Nike</li>
      </ul>
    </div>
  )
}

export default ProductDate;