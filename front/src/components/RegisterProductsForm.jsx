import { Link } from "react-router-dom";
import Button from "./Button";
import "../styles/registerProduct.css"
function RegisterProductsForm() {
  return (
    <div className="register-products-section">
      <div className="register-or-edit-product">
        <h2 className="register-product">Cadastro de Produtos</h2>
        <Link to="/editPage">
          <h2 className="edit-product">Editar Produtos</h2>
        </Link>
      </div>
      <form className="register-products-form" autoComplete="off">
        <div className="product-data">
          <label htmlFor="name">Nome:</label>
          <input type="text" name="name" id="name" required />
        </div>
        <div className="product-data">
          <label htmlFor="category">Categoria:</label>
          <input type="text" name="category" id="category" required />
        </div>
        <div className="product-data">
          <label htmlFor="mark">Marca:</label>
          <input type="text" name="mark" id="mark" required />
        </div>
        <div className="product-data">
          <label htmlFor="original-price">Preço(original):</label>
          <input type="text" name="original-price" id="original-price" required />
        </div>
        <div className="product-data">
          <label htmlFor="release-price">Preço(revenda):</label>
          <input type="text" name="release-price" id="release-price" required />
        </div>
        <div className="product-data">
          <label htmlFor="size">Tamanho:</label>
          <input type="text" name="size" id="size" required />
        </div>
        <div className="product-data">
          <label htmlFor="size">Quantidade:</label>
          <input type="number" name="quantity" id="quantity" required />
        </div>
        <Button prop="Cadastrar Produto" />
      </form>
    </div>
  );
}

export default RegisterProductsForm;
