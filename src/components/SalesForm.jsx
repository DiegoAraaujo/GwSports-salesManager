// SalesForm.js
import Button from "./Button";
import "../styles/salesSection.css"
function SalesForm() {
  return (
    <form className="sales-form">
      <div>
        <label htmlFor="selected-product">Selecionar produto</label>
        <select id="selected-product" defaultValue="0">
          <option value="0">chuteira</option>
          <option value="1">roupa</option>
          <option value="2">x</option>
          <option value="3">y</option>
        </select>
      </div>

      <div>
        <label htmlFor="payment-list">Método de pagamento</label>
        <select id="payment-list" defaultValue="0">
          <option value="0">Dinheiro</option>
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
        <input type="text" name="customer-name" id="customer-name" autoComplete="off" required />
      </div>

      <div>
        <label htmlFor="customer-phone-number">Número de telefone:</label>
        <input type="text" name="customer-phone-number" id="customer-phone-number" autoComplete="off" />
      </div>

      <div>
        <label htmlFor="customer-address">Endereço:</label>
        <input type="text" name="customer-address" id="customer-address" autoComplete="off" />
      </div>

      <div>
        <label htmlFor="date">Data:</label>
        <input type="date" name="date" id="date" />
      </div>

      <Button prop="vender" />
    </form>
  );
}

export default SalesForm;
