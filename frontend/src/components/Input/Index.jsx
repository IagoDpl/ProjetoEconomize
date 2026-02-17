import './Styles.css';

function Input({ label, ...rest }) {
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <input className="input-field" {...rest} />
    </div>
  );
}

export default Input;