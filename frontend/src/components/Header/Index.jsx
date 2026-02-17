import { LayoutDashboard, History, Wallet } from 'lucide-react';
import './Styles.css';

export function Header({ activeTab, onTabChange }) {
  return (
    <header className="header-nav">
      <div className="logo">
        <Wallet size={28} />
        <span>FinancePro</span>
      </div>
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onTabChange('dashboard')}
        >
          <LayoutDashboard size={18} style={{marginRight: 8, verticalAlign: 'middle'}}/>
          Painel
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => onTabChange('history')}
        >
          <History size={18} style={{marginRight: 8, verticalAlign: 'middle'}}/>
          Histórico
        </button>
      </div>
    </header>
  );
}