// src/hooks/useRecomendacoes.ts
import { useState } from 'react';
interface Recomendacao {
  id: string;
  nome: string;
  categoria: string;
  tecnologia: string;
  nist: string;
  prioridade: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
  detalhes: string;
  investimentos: string;
  riscos: string;
  justificativa: string;
  observacoes: string;
}

const useRecomendacoes = () => {
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([
    {
      id: '1',
      nome: 'Criptografia e Proteção de Dados',
      categoria: 'Governança',
      tecnologia: 'Agnóstico',
      nist: 'GV.RM',
      prioridade: 'Média',
      responsavel: 'TI/SI',
      dataInicio: '2023-01-01',
      dataFim: '2023-12-31',
      detalhes: 'Implementar criptografia de dados sensíveis em repouso e em trânsito',
      investimentos: 'R$ 50.000,00',
      riscos: 'Possível impacto no desempenho do sistema',
      justificativa: 'Proteção de dados sensíveis conforme LGPD',
      observacoes: 'Necessário treinamento da equipe'
    },
    {
      id: '2',
      nome: 'Integração e Coordenação',
      categoria: 'Identificar',
      tecnologia: 'Agnóstico',
      nist: 'ID.RA',
      prioridade: 'Média',
      responsavel: 'TI/SI',
      dataInicio: '2023-02-01',
      dataFim: '2023-11-30',
      detalhes: 'Implementar sistema integrado de gestão de riscos',
      investimentos: 'R$ 35.000,00',
      riscos: 'Dependência de fornecedor externo',
      justificativa: 'Melhorar a visibilidade dos riscos organizacionais',
      observacoes: 'Avaliar opções de mercado antes de implementar'
    }
  ]);

  const adicionarRecomendacao = (novaRecomendacao: Omit<Recomendacao, 'id'>) => {
    const novaRecomendacaoComId = {
      ...novaRecomendacao,
      id: Date.now().toString()
    };
    setRecomendacoes([...recomendacoes, novaRecomendacaoComId]);
  };

  const removerRecomendacao = (id: string) => {
    setRecomendacoes(recomendacoes.filter(r => r.id !== id));
  };

  return { recomendacoes, adicionarRecomendacao, removerRecomendacao };
};

export default useRecomendacoes;