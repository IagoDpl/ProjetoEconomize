import { useState } from 'react';
import { Trash2, Edit2, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { useFinance } from '../../hooks/useFinance';

export function HistoryPage({ aoEditar }) {
  const { historico, excluir } = useFinance();
  
  // Controla qual linha está aberta
  const [linhaExpandida, setLinhaExpandida] = useState(null);

  function toggleDetalhes(id) {
    setLinhaExpandida(linhaExpandida === id ? null : id);
  }

  // ---  FORMATAÇÃO ---

  function formatarBRL(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  // Lógica de tempo
  function calcularMeses(meta, sobra) {
    if (sobra <= 0) return "Nunca (Sobra Negativa)";
    if (meta <= 0) return "Concluído";
    
    const meses = Math.ceil(meta / sobra);
    
    if (meses > 1200) return "+100 anos";
    if (meses === 1) return "1 mês";
    return `${meses} meses`;
  }

  return (
    <div className="card">
      <h3 className="card-title">Histórico de Planejamentos</h3>
      
      {historico.length === 0 ? (
        <p style={{color: '#999', textAlign: 'center', padding: 20}}>Nenhum histórico salvo ainda.</p>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th style={{width: 50}}></th>
              <th>Objetivo</th>
              <th>Valor Meta</th>
              <th>Sobra Mensal</th>
              <th>Tempo Estimado</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {historico.map(item => {
              const sobra = item.salario - item.gastosMensais;
              const tempo = calcularMeses(item.objetivoValor, sobra);
              const estaAberto = linhaExpandida === item.id;

              // Tenta pegar a lista com qualquer nome que o Backend mande
              const listaReal = item.listaDeDespesa || item.ListaDeDespesa || [];

              return (
                <>
                  {/* LINHA PRINCIPAL */}
                  <tr key={item.id} style={{borderBottom: estaAberto ? 'none' : '1px solid #eee'}}>
                    <td>
                      <button 
                        onClick={() => toggleDetalhes(item.id)}
                        style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#2563eb'}}
                        title="Ver Despesas"
                      >
                        {estaAberto ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                      </button>
                    </td>
                    <td style={{fontWeight: 'bold'}}>{item.objetivoNome}</td>
                    
                    {/* FORMATAÇÃO */}
                    <td>{formatarBRL(item.objetivoValor)}</td>
                    
                    <td style={{color: sobra > 0 ? 'green' : 'red', fontWeight: 'bold'}}>
                      {formatarBRL(sobra)}
                    </td>
                    
                    <td>
                      <div style={{display: 'flex', alignItems: 'center', gap: 5, color: '#64748b'}}>
                        <Clock size={16}/> {tempo}
                      </div>
                    </td>
                    <td className="actions-cell">
                      <button className="btn-action" onClick={() => aoEditar(item)} title="Editar">
                        <Edit2 size={18}/>
                      </button>
                      <button className="btn-action delete" onClick={() => excluir(item.id)} title="Excluir">
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>

                  {/* LINHA EXPANDIDA (DETALHES) */}
                  {estaAberto && (
                    <tr style={{background: '#f8fafc'}}>
                      <td colSpan="6" style={{padding: '0 20px 20px 20px'}}>
                        <div style={{background: 'white', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0'}}>
                          <h4 style={{margin: '0 0 10px 0', fontSize: 14, color: '#475569'}}>
                            📋 Detalhamento das Despesas
                          </h4>
                          
                          {listaReal.length > 0 ? (
                            <table style={{width: '100%', fontSize: 13}}>
                              <thead>
                                <tr style={{textAlign: 'left', color: '#94a3b8'}}>
                                  <th>Despesa</th>
                                  <th style={{textAlign: 'right'}}>Valor</th>
                                </tr>
                              </thead>
                              <tbody>
                                {listaReal.map((gasto, index) => (
                                  <tr key={index} style={{borderBottom: '1px dashed #eee'}}>
                                    <td style={{padding: '5px 0'}}>{gasto.nome}</td>
                                    
                                    {/* FORMATAÇÃO NA LISTINHA */}
                                    <td style={{textAlign: 'right', color: '#ef4444'}}>
                                      {formatarBRL(gasto.valor)}
                                    </td>
                                  </tr>
                                ))}
                                
                                <tr style={{fontWeight: 'bold', borderTop: '1px solid #ddd'}}>
                                  <td style={{paddingTop: 10}}>Total Gastos</td>
                                  
                                  {/* FORMATAÇÃO NO TOTAL */}
                                  <td style={{paddingTop: 10, textAlign: 'right', color: '#ef4444'}}>
                                    {formatarBRL(item.gastosMensais)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          ) : (
                            <p style={{fontSize: 13, color: '#999', fontStyle: 'italic'}}>
                              Nenhuma despesa detalhada neste planejamento.
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}