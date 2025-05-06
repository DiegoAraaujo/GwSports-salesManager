import "./button.css"

function Button({prop}){
  return(
    <button type="submit" className="button">{prop}</button>
  )
}

export default Button;