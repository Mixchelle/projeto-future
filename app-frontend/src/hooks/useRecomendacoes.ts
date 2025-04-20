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
  impacto: string;
  gravidade: string;
  cumprida: boolean;
  data_cumprimento: string | null;
  comprovante: string | null;
  criado_em: string;
  atualizado_em: string;
}

interface FormData {
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
  impacto: string;
  gravidade: string;
}

const API_URL = `${getBaseUrl()}/recommendations/recomendacoes/`; // Ajuste conforme sua URL base

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
  
  const analista = JSON.parse(localStorage.getItem("user") || "{}"); 

  const formularioId = localStorage.getItem("formularioEmAnaliseId");
  const cliente = JSON.parse(localStorage.getItem("cliente_formulario_analise_id") || "{}");

  const formatPayload = (formData: FormData) => ({
    nome: formData.nome,
    categoria: formData.categoria,
    tecnologia: formData.tecnologia,
    nist: formData.nist,
    prioridade: formData.prioridade,
    data_inicio: formData.data_inicio,
    data_fim: formData.data_fim,
    meses: formData.meses,
    detalhes: formData.detalhes,
    investimentos: formData.investimentos,
    riscos: formData.riscos,
    justificativa: formData.justificativa,
    observacoes: formData.observacoes,
    impacto: formData.impacto,
    gravidade: formData.gravidade,
    cliente: cliente,
    formulario_respondido: Number(formularioId),
    analista: analista.id,
  });

  const fetchRecomendacoes = async () => {
    if (!cliente || !formularioId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}${cliente}/${formularioId}/`,
        getAuthConfig()
      );
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
      alert('Ainda nao implemntado no backend')
      return;
      const payload = formatPayload(formData);
      console.log('Payload para adicionar recomendação:', payload);
      const response = await axios.post(
        `${API_URL}${cliente}/${formularioId}/`,
        payload,
        getAuthConfig()
      );
      
      setRecomendacoes(prev => [...prev, response.data]);
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

  const atualizarRecomendacao = async (id: number, formData: Partial<FormData>) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `${API_URL}${id}/`,
        formData,
        getAuthConfig()
      );
      
      setRecomendacoes(prev => 
        prev.map(r => r.id === id ? response.data : r)
      );
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
      await axios.delete(`${API_URL}${id}/`, getAuthConfig());
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
      const formData = new FormData();
      formData.append('cumprida', 'true');
      formData.append('data_cumprimento', new Date().toISOString());
      if (comprovante) {
        formData.append('comprovante', comprovante);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.patch(
        `${API_URL}${id}/`,
        formData,
        config
      );
      
      setRecomendacoes(prev => 
        prev.map(r => r.id === id ? response.data : r)
      );
      return response.data;
    } catch (err: any) {
      console.error('Erro ao marcar como concluída:', err);
      setError(err.response?.data?.detail || err.message || 'Erro ao marcar como concluída');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecomendacoes();
  }, [cliente, formularioId]);

  return {
    recomendacoes,
    loading,
    error,
    fetchRecomendacoes,
    adicionarRecomendacao,
    atualizarRecomendacao,
    removerRecomendacao,
    marcarComoConcluida
  };
};

export default useRecomendacoes;