// src/components/Button.jsx
import "../styles/button.css";

// Adicionamos a prop 'onClick' e 'type' ao componente Button para flexibilidade
function Button({ prop, onClick, type = "button" }) {
  // 'type' padrão para 'button' para evitar submissão de formulário indesejada
  return (
    // Passamos a função onClick e type diretamente para o elemento <button>
    <button type={type} className="button" onClick={onClick}>
      {prop}
    </button>
  );
}

export default Button;
