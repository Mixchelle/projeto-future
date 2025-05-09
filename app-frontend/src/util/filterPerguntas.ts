// src/util/filterPerguntas.ts

interface Pergunta {
  id: string;
  subcategoria: string;
  politica: number | null;
  pratica: number | null;
  objetivo: number | null;
  info_complementar?: string | null;
  anexos?: any[];
}

interface Recomendacao {
  id: string;
  perguntaId: string; // Para ligar a recomendação à pergunta
  nome: string;
  categoria: string;
  tecnologia: string;
  nist: string;
  prioridade: string;
  responsavel: string;
  data_inicio: string;
  data_fim: string;
  detalhes: string;
  investimentos: string;
  riscos: string;
  justificativa: string;
  observacoes: string;
  impacto: number | null; // Pode ser null ou number
  gravidade: number | null; // Pode ser null ou number
  meses: number | null; // Pode ser null ou number
  prioridade_display?: string;
}


/**
 * Filtra uma lista de perguntas com base nas notas de política ou prática.
 * @param perguntas O array de objetos de pergunta.
 * @param filterLowScoresOnly Se verdadeiro, retorna apenas perguntas onde política ou prática é menor que 3. Se falso, retorna todas as perguntas.
 * @returns Um array de objetos de pergunta filtrados.
 */
export const filterPerguntasByScore = (
  perguntas: Pergunta[],
  filterLowScoresOnly: boolean
): Pergunta[] => {
  if (!filterLowScoresOnly) {
    return perguntas; // Retorna todas as perguntas se o filtro estiver desativado
  }

  return perguntas.filter(pergunta =>
    (pergunta.politica !== null && pergunta.politica < 3) ||
    (pergunta.pratica !== null && pergunta.pratica < 3)
  );
};

/**
 * Verifica se uma pergunta tem nota baixa (Política ou Prática < 3).
 * @param pergunta O objeto de pergunta.
 * @returns Verdadeiro se a pergunta tiver nota baixa, falso caso contrário.
 */
const isLowScore = (pergunta: Pergunta): boolean => {
  return (pergunta.politica !== null && pergunta.politica < 3) ||
         (pergunta.pratica !== null && pergunta.pratica < 3);
};

/**
 * Calcula o progresso de recomendação para perguntas com notas baixas.
 * Conta quantas perguntas com nota baixa possuem pelo menos uma recomendação.
 * @param perguntas Todas as perguntas (geralmente filtradas ou de uma seção específica).
 * @param recomendacoes Todas as recomendações disponíveis.
 * @returns Um objeto com o percentual de progresso, a contagem de perguntas com nota baixa e a contagem daquelas que têm recomendação.
 */
export const calculateRecommendationProgress = (
  perguntas: Pergunta[],
  recomendacoes: Recomendacao[]
): { percentage: number; addressedCount: number; totalLowScoreCount: number } => {
  if (!perguntas || perguntas.length === 0) {
    // Se não há perguntas na lista fornecida, o "progresso" é 100% se não havia nada para corrigir.
    return { percentage: 100, addressedCount: 0, totalLowScoreCount: 0 };
  }

  const lowScorePerguntas = perguntas.filter(isLowScore);
  const totalLowScoreCount = lowScorePerguntas.length;

  if (totalLowScoreCount === 0) {
     // Se não há perguntas com nota baixa na lista fornecida, 100%
     return { percentage: 100, addressedCount: 0, totalLowScoreCount: 0 };
  }

  let addressedCount = 0;
  lowScorePerguntas.forEach(pergunta => {
      // Verifica se existe PELO MENOS UMA recomendação para esta pergunta
      const hasRecommendation = recomendacoes.some(rec => rec.perguntaId === pergunta.id);
      if (hasRecommendation) {
          addressedCount++;
      }
  });

  const percentage = (addressedCount / totalLowScoreCount) * 100;

  return { percentage, addressedCount, totalLowScoreCount };
};