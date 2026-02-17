import { useState, useEffect, useRef } from 'react';
import { useFinance } from '../../hooks/useFinance';

export function useDashboard() {
    const { salvar } = useFinance(); // Pega dados globais

    // --- STATES (DADOS) ---
    const [metaNome, setMetaNome] = useState('');
    const [metaValor, setMetaValor] = useState('');
    const [rendaMensal, setRendaMensal] = useState('');
    const [meuSaldo, setMeuSaldo] = useState('');
    
    const [listaGastos, setListaGastos] = useState([]);
    const [despesaNome, setDespesaNome] = useState('');
    const [despesaValor, setDespesaValor] = useState('');
    
    const [itemParaEditar, setItemParaEditar] = useState(null);

    // Refs para navegação com Enter
    const inputValorRef = useRef(null);

    // --- EFEITOS ---
    useEffect(() => {
        if (itemParaEditar) {
            setMetaNome(itemParaEditar.objetivoNome);
            setRendaMensal(formatarValor((itemParaEditar.salario * 100).toFixed(0)));
            setMetaValor(formatarValor((itemParaEditar.objetivoValor * 100).toFixed(0)));
            setMeuSaldo(formatarValor((itemParaEditar.saldoAtual * 100).toFixed(0)));
            
            const listaFormatada = (itemParaEditar.listaDeDespesa || []).map(item => ({
                idTemp: item.id || Math.random(),
                nome: item.nome,
                valor: item.valor
            }));
            setListaGastos(listaFormatada);
        }
    }, [itemParaEditar]);

    // --- FUNÇÕES AUXILIARES ---
    const formatarValor = (valor) => {
        if (!valor) return '';
        const apenasNumeros = valor.replace(/\D/g, '');
        const numero = parseFloat(apenasNumeros) / 100;
        return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const converterParaNumero = (valorFormatado) => {
        if (!valorFormatado) return 0;
        if (typeof valorFormatado === 'number') return valorFormatado;
        const limpo = valorFormatado.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
        return parseFloat(limpo) || 0;
    };

    const handleChangeValor = (e, setFuncao) => {
        setFuncao(formatarValor(e.target.value));
    };

    // --- AÇÕES (HANDLERS) ---
    const adicionarDespesa = () => {
        if (!despesaNome || !despesaValor) return alert("Preencha nome e valor!");
        
        setListaGastos([...listaGastos, {
            idTemp: Math.random(),
            nome: despesaNome,
            valor: converterParaNumero(despesaValor)
        }]);
        
        setDespesaNome('');
        setDespesaValor('');
    };

    const removerDespesa = (id) => {
        setListaGastos(listaGastos.filter(item => item.idTemp !== id));
    };

    const salvarGeral = async () => {
        if (!metaNome || !rendaMensal) return alert("Preencha o Objetivo e Renda!");

        const totalDespesas = listaGastos.reduce((acc, i) => acc + i.valor, 0);
        
        const payload = {
            objetivoNome: metaNome,
            salario: converterParaNumero(rendaMensal),
            saldoAtual: converterParaNumero(meuSaldo), // Enviando o Saldo
            objetivoValor: converterParaNumero(metaValor),
            gastosMensais: totalDespesas,
            listaDeDespesa: listaGastos
        };

        const sucesso = await salvar(payload, itemParaEditar?.id);
        if (sucesso && !itemParaEditar) limparTudo();
    };

    const limparTudo = () => {
        setMetaNome(''); setMetaValor(''); setRendaMensal(''); setMeuSaldo('');
        setListaGastos([]); setItemParaEditar(null);
    };

    // --- NAVEGAÇÃO COM ENTER ---
    const onEnterPular = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputValorRef.current?.focus();
        }
    };

    const onEnterAdicionar = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            adicionarDespesa();
        }
    };

    // --- CÁLCULOS FINAIS ---
    const totalGastos = listaGastos.reduce((acc, item) => acc + item.valor, 0);
    const rendaNum = converterParaNumero(rendaMensal);
    const saldoNum = converterParaNumero(meuSaldo);
    
    // A sobra considera Renda - Gastos (O saldo é apenas informativo visualmente, ou soma se vc quiser)
    const sobra = rendaNum - totalGastos; 

    // Retornamos tudo que a tela precisa usar
    return {
        states: { 
            metaNome, metaValor, rendaMensal, meuSaldo, 
            listaGastos, despesaNome, despesaValor, itemParaEditar 
        },
        setters: { 
            setMetaNome, setMetaValor, setRendaMensal, setMeuSaldo, 
            setDespesaNome, setDespesaValor, setItemParaEditar 
        },
        actions: { 
            handleChangeValor, adicionarDespesa, removerDespesa, salvarGeral, 
            onEnterPular, onEnterAdicionar 
        },
        computed: { totalGastos, sobra, saldoVisual: saldoNum || 0 },
        refs: { inputValorRef }
    };
}