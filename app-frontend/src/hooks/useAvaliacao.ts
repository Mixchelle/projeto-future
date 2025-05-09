import { getBaseUrl } from '@/util/baseUrl';
import { getDescricaoSubcategoria } from '@/util/subCategorias';
import { useState, useEffect } from 'react';

export interface Subcategoria {
  id: string;
  subcategoria: string;
  politica: number;
  pratica: number;
  objetivo: number;
  perguntas?: string[];
}

export interface Categoria {
  subcategorias: any[];
  categoria: string;
  sigla: string;
  media: number;
  politica: number;
  pratica: number;
  objetivo: number;
  status: string;
  tipo: "CATEGORIA";
  subcateroria?: string[];
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
  mediaEmpresa: {
    mediaTotal: number;
    mediaPolitica: number;
    mediaPratica: number;
  };
}


const useAvaliacao = (formularioRespondidoId: number | null) => {
  const [data, setData] = useState<AvaliacaoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const mediaEmpresaCalculo = (funcoes: Funcao[]) => {
    return funcoes.reduce((acc, funcao) => {
      // Acumula as somas das médias
      acc.mediaTotal += ensureNumber(funcao.media);
      acc.mediaPolitica += ensureNumber(funcao.politica);
      acc.mediaPratica += ensureNumber(funcao.pratica);
      return acc;
    }, {
      mediaTotal: 0,    
      mediaPolitica: 0,
      mediaPratica: 0,
    });
    };
  
  const ensureNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };




  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!formularioRespondidoId) {
          throw new Error('ID do formulário não fornecido');
        }

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error('Token de autenticação não encontrado');
        }
        const url = `${getBaseUrl()}/maturity-results/maturity-results/${formularioRespondidoId}/`

        const response = await fetch(
          url,
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
        console.log('responseData ------------------------------->', responseData);


        const formuarioEmAnaliseId = responseData.formulario.id;
         console.log('formuarioEmAnaliseId', formuarioEmAnaliseId);
          localStorage.setItem("formularioEmAnaliseId", formuarioEmAnaliseId);
          const cliente = responseData.formulario.cliente;
  
          ;
          localStorage.setItem("cliente_formulario_analise_id", cliente.id);
          console.log('cliente', cliente);
        // Verificar se funcoes é um objeto e transformar em um array
        const funcoes: Funcao[] = Object.values(responseData.funcoes);

       const formulario = responseData.formulario.formulario_completo;

       console.log('formulario', formulario);
        console.log('funcoes', funcoes[0]);

        if (funcoes.length === 0) {
          throw new Error('Nenhuma função encontrada ou formato inválido');
        }

        const categoriasProcessadas: Categoria[] = [];
        const subcategoriasProcessadas: Record<string, Subcategoria[]> = {};
        
        const  mediaEmpresa = mediaEmpresaCalculo(funcoes);
        const formularioCompleto = responseData.formulario.formulario_completo;

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
            subcategorias: funcao.categorias || [],
          });

          // Processar as subcategorias (agora você vai mapear as perguntas de forma correta)
          funcao.categorias.forEach((cat) => {
            const sigla =cat.sigla;  // Corrigir a sigla, se necessário
            const descricaoSubcategoria = getDescricaoSubcategoria(sigla) || cat.sigla;

            // Verificar se a chave existe no objeto subcategoriasProcessadas
            if (!subcategoriasProcessadas[sigla]) {
              subcategoriasProcessadas[sigla] = [];
            }

            const perguntasComInfo = cat.subcategorias.map((pergunta: any) => {
              // Encontrar info_complementar com base no id da pergunta
              const perguntaFormulario = formularioCompleto.categorias
              .find((c: any) => {
                const siglaCategoria = c.nome.match(/\(([^)]+)\)/)?.[1]; // Ex: 'RS'
                const siglaComparar = cat.sigla.split('.')[0];           // Ex: 'RS.MI' → 'RS'
            
                return siglaCategoria === siglaComparar;
              })?.perguntas
              .find((p: any) => {
                return p.codigo === pergunta.id;
              });
            
        
              const infoComplementar = perguntaFormulario?.resposta?.info_complementar
              || '';
              return {
                ...pergunta,
                info_complementar: infoComplementar
              };
            });     

            console.log('perguntasComInfo', perguntasComInfo);
            
            
            // Adicionar a subcategoria à lista da chave correta
            subcategoriasProcessadas[sigla].push({
              id: cat.sigla,
              subcategoria: descricaoSubcategoria,
              politica: ensureNumber(cat.politica),
              pratica: ensureNumber(cat.pratica),
              objetivo: ensureNumber(cat.objetivo, 3.0),
              perguntas: perguntasComInfo,
            });
          });
        });

        const processedData: AvaliacaoData = {
          categorias: categoriasProcessadas,
          subcategorias: subcategoriasProcessadas,
          mediaEmpresa: {
            mediaTotal: parseFloat((mediaEmpresa.mediaTotal / funcoes.length).toFixed(2)),
            mediaPolitica: parseFloat((mediaEmpresa.mediaPolitica / funcoes.length).toFixed(2)),
            mediaPratica: parseFloat((mediaEmpresa.mediaPratica / funcoes.length).toFixed(2)),
          },
        };

        console.log('processedData', processedData);
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


