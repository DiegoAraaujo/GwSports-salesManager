import "../../styles/insightsPage.css";
import Img from "../../assets/graphic.svg";
import PendingSale from "../PendingSale";
import Button from "../Button";

function InsightsPage() {
  return (
    <main className="container container-insightsPage">
      <section className="smartsection">
        <div className="report-container">
          <h2>Relatorio</h2>
          <div>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </div>
        </div>
        <div className="graphic-container">
          <h2>Grafico de vendas</h2>
          <div>
            <img src={Img} alt="" />
          </div>
        </div>
      </section>
      <section className="pending-payments-section">
        <h2>Pagamentos pendentes</h2>
        <div className="pending-list-columns">
          <p>Nome</p>
          <p>Valor</p>
          <p>Telefone</p>
          <p>Endereço</p>
        </div>
        <ul className="pending-list">
          <li>
            <div>
              <PendingSale
                nome="Diego"
                valor="30"
                telefone="888888"
                endereco="st"
              />
            </div>
            <Button prop="Marcar como pago"/>
          </li>
          <li>
            <PendingSale
              nome="arthur"
              valor="300"
              telefone="55555"
              endereco="tp"
            />
            <Button prop="Marcar como pago"/>
          </li>
        </ul>
      </section>
    </main>
  );
}

export default InsightsPage;
