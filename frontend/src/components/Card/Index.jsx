import './styles.css';

export function ExpenseCard({ nome, valor, categoria, onRemove }) {
  return (
    <div className="expense-card">
      <div className="card-info">
        <span className="card-name">{nome}</span>
        <span className="card-category">{categoria}</span>
      </div>
      <div className="card-actions">
        <span className="card-value">R$ {valor.toFixed(2)}</span>
        {onRemove && (
          <button className="btn-remove" onClick={onRemove}>
            Remover
          </button>
        )}
      </div>
    </div>
  );
}