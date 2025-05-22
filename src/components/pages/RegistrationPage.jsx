import "../../styles/main.css";
import ProductDate from "../ProductDate";
import RegisterProductsForm from "../RegisterProductsForm";
import SalesForm from "../SalesForm";
import MoneyBox from "../MoneyBox";

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
        <RegisterProductsForm />
        <div className="sales-section">
          <h2>Controle de estoque</h2>
          <div>
            <SalesForm />
            <MoneyBox />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Main;
