import "../styles/pendingSale.css"
function pendingSale({nome, valor, telefone, endereco}){
  return(
    <div>
      <div className="payments-details">
          <p>{nome}</p>
          <p>{valor}</p>
          <p>{telefone}</p>
          <p>{endereco}</p>
      </div>
    </div>
  )
}

export default pendingSale;