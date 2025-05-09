import { getBaseUrl } from '@/util/baseUrl';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Recomendacao {
  id: number;
  cliente: number;
  formulario_respondido: number;
  analista: number;
  nome: string;
  categoria: string;
  categoria_display?: string;
  tecnologia: string;
  nist: string;
  prioridade: string;
  prioridade_display?: string;
  data_inicio: string;
  data_fim: string;
  meses: string;
  detalhes: string;
  investimentos: string;
  riscos: string;
  justificativa: string;
  observacoes: string;
  urgencia: string;
  gravidade: string;
  cumprida: boolean;
  data_cumprimento: string | null;
  comprovante: string | null;
  criado_em: string;
  atualizado_em: string;
  perguntaId: string;
}

export interface FormData {
  nome: string;
  categoria: string;
  tecnologia: string;
  nist: string;
  prioridade: string;
  data_inicio: string;
  data_fim: string;
  meses: string;
  detalhes: string;
  investimentos: string;
  riscos: string;
  justificativa: string;
  observacoes: string;
  urgencia: string;
  gravidade: string;
  perguntaId: string;
}

const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  };
};

const useRecomendacoes = () => {
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cliente = localStorage.getItem("cliente_formulario_analise_id");
  const formularioId = localStorage.getItem("formularioEmAnaliseId");

  const API_URL = `${getBaseUrl()}/recommendations/recomendacoes/${cliente}/${formularioId}/`;

  const fetchRecomendacoes = async () => {
    if (!cliente || !formularioId) return;

    setLoading(true);
    try {
      const response = await axios.get(API_URL, getAuthConfig());
      console.log('recoendaçoes vindo do back', response)
      setRecomendacoes(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Erro ao buscar recomendações:', err);
      setError(err.response?.data?.detail || err.message || 'Erro ao buscar recomendações');
    } finally {
      setLoading(false);
    }
  };

  const adicionarRecomendacao = async (formData: FormData) => {
    try {
      setLoading(true);
      const response = await axios.post(API_URL, formData, getAuthConfig());
      setRecomendacoes(prev => [...prev, response.data]);
      console.log('response', response)
      return response.data;
    } catch (err: any) {
      console.error('Erro ao adicionar recomendação:', err);
      const errorMessage = err.response?.data?.detail ||
        Object.values(err.response?.data || {}).join('\n') ||
        'Erro ao adicionar recomendação';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const atualizarRecomendacao = async (id: number, formData: Partial<FormData>, FormData?: { new(form?: HTMLFormElement, submitter?: HTMLElement | null): globalThis.FormData; prototype: globalThis.FormData; }) => {
    try {
      setLoading(true);
      const response = await axios.patch(`${getBaseUrl()}/recommendations/recomendacoes/${id}/`, formData, getAuthConfig());
      setRecomendacoes(prev => prev.map(r => r.id === id ? response.data : r));
      return response.data;
    } catch (err: any) {
      console.error('Erro ao atualizar recomendação:', err);
      const errorMessage = err.response?.data?.detail ||
        Object.values(err.response?.data || {}).join('\n') ||
        'Erro ao atualizar recomendação';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removerRecomendacao = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`${getBaseUrl()}/recommendations/recomendacoes/${id}/`, getAuthConfig());
      setRecomendacoes(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      console.error('Erro ao remover recomendação:', err);
      setError(err.response?.data?.detail || err.message || 'Erro ao remover recomendação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const marcarComoConcluida = async (id: number, comprovante?: File) => {
    try {
      setLoading(true);
      const data = {
        cumprida: true,
        data_cumprimento: new Date().toISOString(),
      };
  
      if (comprovante) {
        data['comprovante'] = comprovante;
      }
  
      const response = await axios.patch(
        `${getBaseUrl()}/recommendations/recomendacoes/${id}/`,
        data, 
        getAuthConfig()
      );
  
      setRecomendacoes(prev => prev.map(r => r.id === id ? response.data : r));
      return response.data;
    } catch (err: any) {
      console.error('Erro ao marcar como concluída:', err);
      setError(err.response?.data?.detail || err.message || 'Erro ao marcar como concluída');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  

  // Adicione esta função no final do arquivo, antes do export
  const agruparRecomendacoesPorCategoria = (recomendacoes: Recomendacao[]) => {
    console.log('recomendacoes', recomendacoes);
  
    const agrupada = recomendacoes.reduce((acc, recomendacao) => {
      // Extrai o nome base da categoria (remove a sigla entre parênteses se existir)
      let categoria = recomendacao.categoria;
      if (categoria.includes('(')) {
        categoria = categoria.split('(')[0].trim();
      }
      
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(recomendacao);
      return acc;
    }, {} as Record<string, Recomendacao[]>);
    
    console.log('agrupada', agrupada);
    return agrupada;
  };

// Modifique o retorno do hook para incluir a função de agrupamento


  useEffect(() => {
    fetchRecomendacoes();
  }, [cliente, formularioId]);

  return {
    recomendacoes,
    loading,
    error,
    recomendacoesPorCategoria: agruparRecomendacoesPorCategoria(recomendacoes),
    fetchRecomendacoes,
    adicionarRecomendacao,
    atualizarRecomendacao,
    removerRecomendacao,
    marcarComoConcluida
  };
};

export default useRecomendacoes;
