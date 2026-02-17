import React from 'react';
import './Styles.css'; // O CSS fica isolado aqui

// O componente recebe "props" para saber qual cor e texto mostrar
export default function SummaryCard({ title, value, subtext, icon: Icon, colorVariant = 'blue' }) {
  
  // Mapeamento de cores para não encher de if/else
  const colors = {
    blue: { border: '#3b82f6', bg: '#dbeafe', text: '#3b82f6' },
    red: { border: '#ef4444', bg: '#fee2e2', text: '#ef4444' },
    green: { border: '#10b981', bg: '#d1fae5', text: '#10b981' }
  };

  const theme = colors[colorVariant] || colors.blue;

  return (
    <div className="summary-card" style={{ borderLeft: `5px solid ${theme.border}` }}>
      
      {/* Marca d'água no fundo */}
      <div className="watermark">
        <Icon size={100} color={theme.border} />
      </div>

      <div className="card-header">
        <span className="card-title">{title}</span>
        <div className="icon-bubble" style={{ backgroundColor: theme.bg }}>
           <Icon size={20} color={theme.text} />
        </div>
      </div>

      <div className="summary-value" style={{ color: theme.text }}>
        {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </div>

      <p className="subtext">{subtext}</p>
    </div>
  );
}