import './styles.css';

// Agora o botão aceita "...rest", ou seja, style, disabled, id, etc.
function Button({ title, variant = 'primary', ...rest }) {
  return (
    <button 
      className={`btn btn-${variant}`} 
      {...rest} // Aqui espalhamos todas as propriedades extras no botão HTML
    >
      {title}
    </button>
  );
}

export default Button;