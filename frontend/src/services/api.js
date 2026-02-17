import axios from 'axios';

// 1. Função que gera o CRACHÁ ÚNICO
const getMyId = () => {
  // Tenta ler do navegador
  let id = localStorage.getItem('finance_user_id');
  
  if (!id) {
    // Se não existir, cria um novo aleatório (Ex: user_abc123)
    id = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('finance_user_id', id); // Salva pra sempre
  }
  return id;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5026/api', 
});

// 2. O Interceptador (O Porteiro)
// Antes de qualquer requisição sair, ele cola o crachá no cabeçalho
api.interceptors.request.use((config) => {
  const clienteId = getMyId();
  config.headers['x-cliente-id'] = clienteId;
  return config;
});

export default api;