import { getDescricaoSubcategoria } from '@/util/subCategorias';
import { useState, useEffect } from 'react';

export interface Subcategoria {
  id: string;
  subcategoria: string;
  politica: number;
  pratica: number;
  objetivo: number;
}

export interface Categoria {
  categoria: string;
  sigla: string;
  media: number;
  politica: number;
  pratica: number;
  objetivo: number;
  status: string;
  tipo: "CATEGORIA";
}

export interface Funcao {
  objetivo: any;
  nome: string;
  sigla: string;
  media: number;
  politica: number;
  pratica: number;
  status: string;
  categorias: Categoria[];
}

interface AvaliacaoData {
  categorias: Categoria[];
  subcategorias: Record<string, Subcategoria[]>;
}



const useAvaliacao = (formularioRespondidoId: number | null) => {
  const [data, setData] = useState<AvaliacaoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ensureNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (!formularioRespondidoId) {
          throw new Error('ID do formulário não fornecido');
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }

        const response = await fetch(
          `http://ip172-18-0-139-cvvh40291nsg009e3c4g-8000.direct.labs.play-with-docker.com/api/maturity-results/maturity-results/${formularioRespondidoId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('responseData', responseData);

       const cliente = responseData.formulario.cliente;
        // Verificar se funcoes é um objeto e transformar em um array
        const funcoes = Object.values(responseData.funcoes);
        if (funcoes.length === 0) {
          throw new Error('Nenhuma função encontrada ou formato inválido');
        }

        const categoriasProcessadas: Categoria[] = [];
        const subcategoriasProcessadas: Record<string, Subcategoria[]> = {};

        funcoes.forEach((funcao: Funcao) => {

          // Adicionar a categoria
          categoriasProcessadas.push({
            categoria: funcao.nome,
            sigla: funcao.sigla,
            media: ensureNumber(funcao.media),
            politica: ensureNumber(funcao.politica),
            pratica: ensureNumber(funcao.pratica),
            objetivo: ensureNumber(funcao.objetivo, 3.0),
            status: funcao.status || 'Não Avaliado',
            tipo: "CATEGORIA",
          });

          // Processar as subcategorias (agora você vai mapear as perguntas de forma correta)
          funcao.categorias.forEach((cat) => {
            
            const sigla = cat.sigla;  // Corrigir a sigla, se necessário
            const descricaoSubcategoria = getDescricaoSubcategoria(sigla) || cat.sigla;

            // Verificar se a chave existe no objeto subcategoriasProcessadas
            if (!subcategoriasProcessadas[sigla]) {
              subcategoriasProcessadas[sigla] = [];
            }

            // Adicionar a subcategoria à lista da chave correta
            subcategoriasProcessadas[sigla].push({
              id: cat.sigla,
              subcategoria: descricaoSubcategoria,
              politica: ensureNumber(cat.politica),
              pratica: ensureNumber(cat.pratica),
              objetivo: ensureNumber(cat.objetivo, 3.0),
            });
          });
        });

        const processedData: AvaliacaoData = {
          categorias: categoriasProcessadas,
          subcategorias: subcategoriasProcessadas,
        };

        setData(processedData);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formularioRespondidoId]);

  return { data, loading, error };
};

export default useAvaliacao;
