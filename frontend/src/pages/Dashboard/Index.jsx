import React from 'react';
import { TrendingDown, TrendingUp, Trash2, Plus, Target, Save, DollarSign, Wallet } from 'lucide-react';

import Input from '../../components/Input';
import Button from '../../components/Button';
import SummaryCard from '../../components/SummaryCard/Index';

// 1. Importamos a lógica separada
import { useDashboard } from './useDashboard';
import './styles.css';

export function DashboardPage() {
  // 2. Destruturamos tudo que vem do Hook
  const { 
    states, setters, actions, computed, refs 
  } = useDashboard();

  return (
    <div className="dashboard-container">
      
      {/* === COLUNA ESQUERDA (INPUTS) === */}
      <div className="column-left">
        
        {/* CARD 1: RENDA E SALDO */}
        <div className="card">
          <h3>Renda & Saldo</h3>
          <div style={{display: 'flex', gap: 15, marginBottom: 20}}>
              <div style={{flex: 1}}>
                <Input 
                  label="Renda Mensal" 
                  placeholder="R$ 0,00"
                  value={states.rendaMensal} 
                  onChange={e => actions.handleChangeValor(e, setters.setRendaMensal)} 
                />
              </div>
              <div style={{flex: 1}}>
                <Input 
                  label="Saldo em Conta" 
                  placeholder="R$ 0,00"
                  value={states.meuSaldo} 
                  onChange={e => actions.handleChangeValor(e, setters.setMeuSaldo)} 
                />
              </div>
          </div>

          <div className="add-expense-group">
            <div className="input-wrapper">
              <Input 
                label="Nome da Despesa" 
                placeholder="Ex: Luz..."
                value={states.despesaNome} 
                onChange={e => setters.setDespesaNome(e.target.value)}
                onKeyDown={actions.onEnterPular} // Pula pro valor
              />
            </div>
            <div className="input-wrapper">
              <Input 
                ref={refs.inputValorRef} // Recebe o foco
                label="Valor" 
                placeholder="R$ 0,00"
                value={states.despesaValor} 
                onChange={e => actions.handleChangeValor(e, setters.setDespesaValor)}
                onKeyDown={actions.onEnterAdicionar} // Adiciona ao dar enter
              />
            </div>
            <div style={{marginBottom: 2}}>
                <Button onClick={actions.adicionarDespesa} title="Adicionar">
                    <Plus size={24} />
                </Button>
            </div>
          </div>
        </div>

        {/* CARD 2: LISTA */}
        <div className="card">
          <div className="card-header">
            <h3>Lista de Contas</h3>
            <span style={{fontSize: 12, color: '#999'}}>{states.listaGastos.length} itens</span>
          </div>

          <div className="expenses-list">
            {states.listaGastos.length === 0 ? (
              <p style={{color: '#ccc', textAlign: 'center', padding: 20}}>Nenhuma despesa.</p>
            ) : (
              states.listaGastos.map((item) => (
                <div key={item.idTemp} className="expense-item">
                  <div className="expense-info">
                    <div className="icon-bubble bg-red" style={{width: 24, height: 24, padding: 4}}>
                        <DollarSign size={14} color="#ef4444"/>
                    </div>
                    <span className="expense-name">{item.nome}</span>
                  </div>
                  <div className="expense-info">
                    <span className="expense-value">
                      {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <button className="btn-delete" onClick={() => actions.removerDespesa(item.idTemp)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* === COLUNA DIREITA (RESUMO) === */}
      <div className="column-right">
        
        <SummaryCard 
          title="Saldo Atual"
          value={computed.saldoVisual}
          subtext="Dinheiro em caixa"
          icon={Wallet}
          colorVariant="blue"
        />

        <SummaryCard 
          title="Despesas Totais"
          value={computed.totalGastos}
          subtext="Valor total comprometido"
          icon={TrendingDown}
          colorVariant="red"
        />

        <SummaryCard 
          title="Sobra Mensal"
          value={computed.sobra}
          subtext={computed.sobra >= 0 ? 'Disponível' : 'Faltou dinheiro.'}
          icon={TrendingUp}
          colorVariant={computed.sobra >= 0 ? 'green' : 'red'}
        />

        {/* CARD META */}
        <div className="card">
          <div className="card-header">
             <span className="card-title">Definir Meta</span>
             <Target size={20} color="#64748b"/>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 15}}>
            <Input 
              label="Qual seu objetivo?" 
              value={states.metaNome} 
              onChange={e => setters.setMetaNome(e.target.value)} 
            />
            <Input 
              label="Valor da Meta" 
              value={states.metaValor} 
              onChange={e => actions.handleChangeValor(e, setters.setMetaValor)} 
            />
            <div style={{marginTop: 10}}>
                <Button 
                    onClick={actions.salvarGeral} 
                    variant="success" 
                    title={
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8}}>
                            <Save size={18}/> 
                            {states.itemParaEditar ? "Atualizar" : "Salvar"}
                        </div>
                    }
                />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}