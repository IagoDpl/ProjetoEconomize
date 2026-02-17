import { useState, useEffect } from 'react';
import api from '../services/api';

export function useFinance() {
    const [saldoBanco, setSaldoBanco] = useState(0);
    const [historico, setHistorico] = useState([]);

    // --- FUNÇÕES DE FORMATAÇÃO ---
    const formatarValor = (valor) => {
        const nums = String(valor).replace(/\D/g, "");
        if (nums === "") return "";
        return (Number(nums) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    const converterParaNumero = (str) => {
        if (!str) return 0;
        const nums = String(str).replace(/\D/g, "");
        return Number(nums) / 100;
    };

    // --- API DO SALDO ---
    async function carregarSaldo() {
        try {
            const res = await api.get('/carteira');
            setSaldoBanco(res.data.saldo);
        } catch (e) { console.error(e); }
    }

    async function atualizarSaldoBanco(valor) {
        try {
            await api.post('/carteira', { saldo: valor });
            setSaldoBanco(valor); // Atualiza na tela
        } catch (e) { console.error(e); }
    }

    // --- API DO HISTÓRICO ---
    async function carregarHistorico() {
        try {
            const res = await api.get('/planejamento');
            setHistorico(res.data);
        } catch (e) { console.error(e); }
    }

    // --- FUNÇÃO SALVAR (CORRIGIDA) ---
    async function salvar(payload, idEdicao = null) {
        try {
            // PROTEÇÃO TRIPLA: Tenta pegar a lista com qualquer nome possível
            const listaOriginal = payload.listaGastos || payload.listaDeDespesa || payload.ListaDeDespesa || [];

            if (listaOriginal.length === 0) {
                alert("Atenção: A lista de despesas está vazia antes de enviar!");
            }

            const dadosParaEnviar = {
                objetivoNome: payload.objetivoNome,
                salario: payload.salario,
                objetivoValor: payload.objetivoValor,
                gastosMensais: payload.gastosMensais,

                // Envia para o C# com o nome exato que configuramos no DTO
                listaDeDespesa: listaOriginal.map(item => ({
                    nome: item.nome,
                    valor: item.valor
                }))
            };

            console.log("Enviando para C#:", dadosParaEnviar);

            if (idEdicao) {
                await api.put(`/planejamento/${idEdicao}`, dadosParaEnviar);
            } else {
                await api.post('/planejamento', dadosParaEnviar);
            }

            await carregarHistorico();
            return true;
        } catch (error) {
            console.error("Erro detalhado:", error.response?.data || error.message);
            alert("Erro ao salvar: " + JSON.stringify(error.response?.data));
            return false;
        }
    }

    async function excluir(id) {
        if (!confirm("Tem certeza?")) return;
        try {
            await api.delete(`/planejamento/${id}`);
            await carregarHistorico();
        } catch (e) { console.error(e); }
    }

    useEffect(() => {
        carregarSaldo();
        carregarHistorico();
    }, []);

    return {
        historico,
        saldoBanco,
        atualizarSaldoBanco,
        salvar,
        excluir,
        formatarValor,
        converterParaNumero
    };
}