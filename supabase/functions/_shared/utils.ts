/**
 * Funções utilitárias compartilhadas entre edge functions
 */

/**
 * Gera um hash simples para validação de integridade dos dados
 */
export function generateHash(data: any): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Valida CPF (11 dígitos)
 */
export function validarCPF(cpf: string): boolean {
  const numeros = cpf.replace(/\D/g, '');
  if (numeros.length !== 11) return false;
  if (/^(\d)\1+$/.test(numeros)) return false; // Todos iguais
  
  // Validação dos dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros.charAt(10))) return false;
  
  return true;
}

/**
 * Valida CNPJ (14 dígitos)
 */
export function validarCNPJ(cnpj: string): boolean {
  const numeros = cnpj.replace(/\D/g, '');
  if (numeros.length !== 14) return false;
  if (/^(\d)\1+$/.test(numeros)) return false;
  
  // Validação primeiro dígito
  let tamanho = numeros.length - 2;
  let numeros_base = numeros.substring(0, tamanho);
  const digitos = numeros.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros_base.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  // Validação segundo dígito
  tamanho = tamanho + 1;
  numeros_base = numeros.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros_base.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
}

/**
 * Valida data no formato YYYY-MM-DD
 */
export function validarData(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const date = new Date(data);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Valida se uma data é futura em relação a outra
 */
export function validarDataPosterior(dataInicial: string, dataFinal: string): boolean {
  const d1 = new Date(dataInicial);
  const d2 = new Date(dataFinal);
  return d2 > d1;
}

/**
 * Formata valor monetário
 */
export function formatarValor(valor: number): string {
  return valor.toFixed(2);
}

/**
 * Limpa caracteres especiais de CPF/CNPJ
 */
export function limparCPFCNPJ(documento: string): string {
  return documento.replace(/\D/g, '');
}
