import "./main.css";
import ProductDate from "./ProductDate";
import Button from "./Button";
function Main() {
  return (
    <main className="container">
      <section className="stock-section">
        <h2>Estoque</h2>
        <div>
          <ProductDate />
          <ProductDate />
          <ProductDate />
          <ProductDate />
          <ProductDate />
        </div>
      </section>

      <section className="registration-and-control-section">
        <div className="register-products-section">
          <h2>Cadastro de Produtos</h2>
          <form className="register-products-form" autoComplete="off">
            <div className="product-data">
              <label htmlFor="name"> Nome:</label>
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
              <input
                type="text"
                name="original-price"
                id="original-price"
                required
              />
            </div>
            <div className="product-data">
              <label htmlFor="release-price">Preço(revenda):</label>
              <input
                type="text"
                name="release-price"
                id="release-price"
                required
              />
            </div>
            <div className="product-data">
              <label htmlFor="size">Tamanho:</label>
              <input type="text" name="size" id="size" required />
            </div>
            <Button prop="Cadastrar Produto" />
          </form>
        </div>

        <div className="sales-section">
          <h2>Controle de estoque</h2>
          <div>
            <form className="sales-form">
              <div>
                <label htmlFor="selected-product">Selecionar produto</label>
                <select id="selected-product">
                  <option value="0" selected>
                    chuteira
                  </option>
                  <option value="1">roupa</option>
                  <option value="2">x</option>
                  <option value="3">y</option>
                </select>
              </div>

              <div>
                <label htmlFor="payment-list">Método de pagamento</label>
                <select id="payment-list">
                  <option value="0" selected>
                    Dinheiro
                  </option>
                  <option value="1">Pix</option>
                  <option value="2">Cartão de crédito</option>
                  <option value="3">Cartão de débito</option>
                  <option value="4">Carteira digital</option>
                  <option value="5">Cheque</option>
                  <option value="6">Pagar mais tarde</option>
                </select>
              </div>

              <div>
                <label htmlFor="customer-name">Cliente:</label>
                <input
                  type="text"
                  name="customer-name"
                  id="customer-name"
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <label htmlFor="customer-phone-number"> Numero de telefone:</label>
                <input
                  type="text"
                  name="customer-phone-number"
                  id="customer-phone-number"
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="customer-address">Endereço:</label>
                <input
                  type="text"
                  name="customer-address"
                  id="customer-address"
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="date">Data:</label>
                <input type="date" name="date" id="date"/>
              </div>

              <Button prop="vender" />
            </form>

            <div className="money-box">
              <h3>Caixa</h3>
              <p>Faturamento: 0 R$</p>
              <p>Ganho liquido: 0 R$</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Main;
