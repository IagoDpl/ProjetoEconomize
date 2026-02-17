import { useState } from 'react';
import { Header } from './components/Header/Index';
import { DashboardPage } from './pages/Dashboard/Index';
import { HistoryPage } from './pages/History/Index';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [itemEditando, setItemEditando] = useState(null);

  // Função chamada quando clica no Lápis no Histórico
  function handleEditar(item) {
    setItemEditando(item);
    setActiveTab('dashboard'); // Joga o usuário para o formulário
  }

  // Função chamada quando salva com sucesso
  function handleSucesso() {
    setItemEditando(null);
    setActiveTab('history'); // Joga o usuário para ver a lista
  }

  return (
    <div className="app-container">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'dashboard' ? (
        <DashboardPage 
          itemParaEditar={itemEditando} 
          aoSalvarSucesso={handleSucesso}
        />
      ) : (
        <HistoryPage aoEditar={handleEditar} />
      )}
    </div>
  );
}