export const formatarMoeda = (valor) => {
  // Converte para string para evitar erro de .replace em números
  const valorString = String(valor);
  
  // Remove tudo que não é dígito
  const apenasNumeros = valorString.replace(/\D/g, "");

  // Se não tiver números, retorna vazio
  if (apenasNumeros === "") return "";

  // Divide por 100 para criar os centavos
  const numero = Number(apenasNumeros) / 100;

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
};

export const limparMoeda = (valorFormatado) => {
  if (!valorFormatado) return 0;
  const valorString = String(valorFormatado);
  
  // Mantém apenas dígitos e vírgula
  const apenasNumeros = valorString.replace(/[^\d,]/g, "");
  
  // Troca vírgula por ponto
  const numeroFinal = apenasNumeros.replace(",", ".");
  
  return parseFloat(numeroFinal) || 0;
};