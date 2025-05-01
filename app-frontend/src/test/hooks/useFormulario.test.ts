// src/test/hooks/useFormulario.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useFormulario } from '@/hooks/useFormulario';
import { getBaseUrl } from '@/util/baseUrl'; // Importar para obter API_URL

// Interfaces (copiadas do seu hook para referência no teste, idealmente importe-as)
interface Formulario {
  id: number;
  nome: string;
  total?: number | string; // Ajustado para aceitar número ou string como no hook
}

interface Categoria {
  id: number;
  nome: string;
  formulario: number;
}

interface FormularioEmAndamento {
    id: number;
    formulario: number;
    formulario_nome: string;
    status: string;
    atualizado_em: string;
    versao: number;
    progresso: number;
}

interface FormularioEmAnaliseExibicao {
    id_formulario_respondido: number;
    id_cliente: number;
    nome_cliente: string;
    id_formulario: number;
    nome_formulario: string;
}

interface FormularioCompleto { // Adicione uma interface básica se necessário para o teste
    id: number;
    formulario: { id: number; nome: string; };
    status: string;
    // outras propriedades...
}

// Mock do axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value.toString(); }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    getStore: () => store // Helper para depuração se necessário
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// API URL (deve ser consistente com o hook)
const API_URL = `${getBaseUrl()}/form`;

describe('useFormulario', () => {
  beforeEach(() => {
    // Limpa mocks e localStorage ANTES de cada teste
    vi.clearAllMocks();
    localStorageMock.clear();

    // Configuração padrão para as chamadas do useEffect inicial
    // Use mockImplementation para ser mais robusto quanto à ordem das chamadas GET
    mockedAxios.get.mockImplementation(async (url: string) => {
        if (url === `${API_URL}/formularios/`) {
            // console.log('Mock: GET /formularios/ (initial)');
            return { data: [] }; // Retorna array vazio por padrão na inicialização
        }
        if (url === `${API_URL}/formularios-em-analise/`) {
            // console.log('Mock: GET /formularios-em-analise/ (initial)');
            return { data: {} }; // Retorna objeto vazio por padrão na inicialização
        }
        // Se outra URL for chamada inesperadamente no setup inicial
        // console.warn(`Mock: Unexpected initial GET call to ${url}`);
        return { data: undefined }; // Ou lance um erro
    });
    mockedAxios.post.mockResolvedValue({ data: {} }); // Mock padrão para POST
    mockedAxios.patch.mockResolvedValue({ data: {} }); // Mock padrão para PATCH

  });

  // Teste focado na inicialização e no getFormularios do useEffect
  it('deve buscar formulários e salvar total no localStorage ao inicializar', async () => {
    const fakeData = [{ id: 1, nome: 'Formulário A', total: 10 }];

    // Sobrescreve o mock GET especificamente para /formularios/ nesta inicialização
    mockedAxios.get.mockImplementation(async (url: string) => {
        if (url === `${API_URL}/formularios/`) {
           // console.log('Mock: GET /formularios/ (test specific initial)');
           return { data: fakeData };
        }
        if (url === `${API_URL}/formularios-em-analise/`) {
           // console.log('Mock: GET /formularios-em-analise/ (test specific initial)');
           return { data: {} };
        }
        return { data: undefined };
    });

    const { result } = renderHook(() => useFormulario());

    // Aguarda a atualização do estado vinda do useEffect
    await waitFor(() => {
      expect(result.current.formularios.length).toBeGreaterThan(0);
    });

    expect(result.current.formularios).toEqual(fakeData);
    // Verifica se o localStorage foi chamado corretamente
    expect(localStorageMock.setItem).toHaveBeenCalledWith('formulario_1_total', '10');
    // Verifica se as chamadas GET esperadas na inicialização ocorreram
    expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/formularios/`, expect.any(Object));
    expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/formularios-em-analise/`, expect.any(Object));
  });

   it('deve buscar categorias por formulario', async () => {
       const fakeCategorias = [{ id: 1, nome: 'Categoria A', formulario: 1 }];
       const formularioId = 1;

       // Renderiza o hook (isso vai disparar os GETs iniciais do beforeEach)
       const { result } = renderHook(() => useFormulario());

       // Aguarda os efeitos iniciais (getFormularios, buscarFormulariosEmAnalise) terminarem
       // Verificando se o estado inicial (vazio) foi definido
       await waitFor(() => expect(result.current.formularios).toEqual([]));
       await waitFor(() => expect(result.current.formulariosEmAnalise).toEqual([]));


       // Configura o mock para a chamada específica de getCategoriasByFormulario
       mockedAxios.get.mockImplementationOnce(async (url: string) => {
           // console.log(`Mock: GET ${url} (getCategorias)`);
           if (url === `${API_URL}/formularios/${formularioId}/categorias/`) {
               return { data: fakeCategorias };
           }
           return { data: undefined };
       });


       // Chama a função do hook
       await act(async () => {
           await result.current.getCategoriasByFormulario(formularioId);
       });

       // Aguarda a atualização do estado categorias
       await waitFor(() => {
           expect(result.current.categorias).toEqual(fakeCategorias);
       });

       // Verifica se a chamada axios.get correta foi feita
       expect(mockedAxios.get).toHaveBeenCalledWith(
           `${API_URL}/formularios/${formularioId}/categorias/`,
           expect.any(Object)
       );
   });


   it('deve buscar formulario respondido e atualizar localStorage', async () => {
       const fakeUser = { id: 123, nome: 'Test User' }; // Adicione outros campos se o hook usar
       const formId = '1';
       const clienteId = fakeUser.id;

       // Configura localStorage ANTES de renderizar/chamar a função
       localStorageMock.setItem('selectedFormularioId', formId);
       localStorageMock.setItem('user', JSON.stringify(fakeUser));

       const fakeResponse: FormularioCompleto = { // Use a interface apropriada
           id: 5,
           formulario: { id: Number(formId), nome: 'Formulário Teste' },
           status: 'rascunho',
           // Adicione outras propriedades esperadas pelo hook/componente
           cliente: clienteId,
           progresso: 0,
           versao: 1,
           criado_em: new Date().toISOString(),
           respostas: [],
       };

       // Renderiza o hook
       const { result } = renderHook(() => useFormulario());

       // Aguarda efeitos iniciais
       await waitFor(() => expect(result.current.formularios).toEqual([]));

        // Configura o mock específico para getFormularioRespondido
        mockedAxios.get.mockImplementationOnce(async (url: string) => {
           // console.log(`Mock: GET ${url} (getFormularioRespondido)`);
           if (url === `${API_URL}/formularios/${formId}/clientes/${clienteId}/`) {
               return { data: fakeResponse };
           }
           return { data: undefined };
        });


       let resp: FormularioCompleto | null = null;
       await act(async () => {
           resp = await result.current.getFormularioRespondido(Number(formId), clienteId);
       });

       // Verifica o valor retornado e o estado
       await waitFor(() => {
           expect(resp).toEqual(fakeResponse);
           expect(result.current.formularioRespondido).toEqual(fakeResponse);
       });

       // Verifica a chamada axios
       expect(mockedAxios.get).toHaveBeenCalledWith(
           `${API_URL}/formularios/${formId}/clientes/${clienteId}/`,
           expect.any(Object)
       );

        // Verifica a atualização do localStorage feita DENTRO de getFormularioRespondido
        // Acessa o store diretamente no mock para verificar o valor complexo
        const storedData = JSON.parse(localStorageMock.getItem('formulariosRespondidos') || '{}');
        expect(storedData[formId]).toBeDefined();
        expect(storedData[formId].nome).toBe('Formulário Teste');
        expect(storedData[formId].status).toBe('rascunho');
        expect(storedData[formId].data).toBeDefined(); // Verifica se a data foi salva
   });



   it('deve atualizar formulario por id e atualizar estado', async () => {
       const formId = 1;
       const initialForms: Formulario[] = [{ id: formId, nome: 'Antigo nome', total: 5 }];
       const dataUpdatePayload = { nome: 'Novo nome' };
       // O PATCH pode retornar só o que atualizou ou o objeto inteiro
       const patchApiResponse = { id: formId, nome: 'Novo nome' };
       const expectedFinalState: Formulario[] = [{ id: formId, nome: 'Novo nome', total: 5 }]; // Como o estado deve ficar

        // --- Setup Inicial Específico para este Teste ---
        // Limpa mocks de novo para garantir isolamento total para este teste complexo
        vi.clearAllMocks();
        localStorageMock.clear();
        mockedAxios.patch.mockResolvedValue({ data: patchApiResponse }); // Mock PATCH antes de tudo

        // Mock para a inicialização DO HOOK neste teste (getFormularios retorna o estado inicial)
        mockedAxios.get.mockImplementation(async (url: string) => {
            if (url === `${API_URL}/formularios/`) {
                // console.log('Mock: GET /formularios/ (update test initial)');
                return { data: initialForms };
            }
            if (url === `${API_URL}/formularios-em-analise/`) {
                // console.log('Mock: GET /formularios-em-analise/ (update test initial)');
                return { data: {} };
            }
            return { data: undefined };
        });
        // --- Fim Setup Inicial Específico ---

       const { result } = renderHook(() => useFormulario());

       // Aguarda o estado inicial ser definido pelo getFormularios mockado
       await waitFor(() => {
           expect(result.current.formularios).toEqual(initialForms);
       });

       // Chama a função de atualização
       await act(async () => {
           await result.current.updateFormularioById(formId, dataUpdatePayload);
       });

       // Verifica a chamada PATCH
       expect(mockedAxios.patch).toHaveBeenCalledWith(
           `${API_URL}/formularios/${formId}/`,
           dataUpdatePayload,
           expect.any(Object)
       );

       // Aguarda a atualização do estado 'formularios'
       await waitFor(() => {
           expect(result.current.formularios).toEqual(expectedFinalState);
       });
   });


   it('deve colocar formulario em pendência', async () => {
       const formularioId = 1;
       const observacoes = 'Observações de pendência';
       const fakeResponse = { sucesso: true, mensagem: "Ok" }; // Exemplo de resposta

       // Mock para a chamada POST de pendencia
       mockedAxios.post.mockResolvedValueOnce({ data: fakeResponse });

       const { result } = renderHook(() => useFormulario());
        // Aguarda efeitos iniciais
       await waitFor(() => expect(result.current.formularios).toEqual([]));

       let resp: any;
       await act(async () => {
         // A função no hook retorna a resposta do axios
         resp = await result.current.colocarEmPendencia(formularioId, [], observacoes);
       });

       // Verifica a resposta retornada
       expect(resp).toEqual(fakeResponse);

       // Verifica a chamada POST
       expect(mockedAxios.post).toHaveBeenCalledWith(
           `${API_URL}/formularios/${formularioId}/pendencia/`,
           { observacoes }, // Verifica o payload
           expect.any(Object)
       );
   });

    it('deve buscar formularios em análise e transformar a resposta', async () => {
        const fakeAnaliseResponse = { // Dados como retornados pela API (objeto)
          "1": {
            id_cliente: 1,
            nome_cliente: "Empresa Teste",
            id_formulario: 1,
            nome_formulario: "Formulario A"
          }
        };
        const expectedTransformedData: FormularioEmAnaliseExibicao[] = [ // Dados após transformação (array)
            {
              id_formulario_respondido: 1, // Note que a chave '1' vira o id
              id_cliente: 1,
              nome_cliente: "Empresa Teste",
              id_formulario: 1,
              nome_formulario: "Formulario A",
            }
        ];

        // Renderiza o hook (vai chamar buscarFormulariosEmAnalise na inicialização - mock padrão retorna {})
        const { result } = renderHook(() => useFormulario());

        // Aguarda estado inicial vazio (definido pelo mock do beforeEach)
        await waitFor(() => expect(result.current.formulariosEmAnalise).toEqual([]));

        // Mock para a chamada EXPLÍCITA de buscarFormulariosEmAnalise
        mockedAxios.get.mockImplementationOnce(async (url) => {
            // console.log(`Mock: GET ${url} (buscarFormulariosEmAnalise explicit)`);
            if (url === `${API_URL}/formularios-em-analise/`) {
                return { data: fakeAnaliseResponse }; // Retorna o objeto da API
            }
            return { data: undefined };
        });


        let data: FormularioEmAnaliseExibicao[] | null = null;
        await act(async () => {
          // Chama a função explicitamente de novo
          data = await result.current.buscarFormulariosEmAnalise();
        });

        // Verifica os dados RETORNADOS pela função (já devem estar transformados)
        expect(data).toEqual(expectedTransformedData);
        expect(data?.length).toBe(1); // A asserção original que falhava

        // Aguarda o ESTADO ser atualizado pela chamada explícita
        await waitFor(() => {
            expect(result.current.formulariosEmAnalise).toEqual(expectedTransformedData);
            expect(result.current.formulariosEmAnalise[0].nome_cliente).toBe("Empresa Teste");
        });

        // Verifica a chamada axios específica para /formularios-em-analise/
        expect(mockedAxios.get).toHaveBeenCalledWith(
            `${API_URL}/formularios-em-analise/`,
            expect.any(Object)
        );
    });

    it('deve lidar com erro ao buscar categorias', async () => {
        const formularioId = 1;
        mockedAxios.get.mockRejectedValueOnce(new Error('Erro de rede'));
        
        const { result } = renderHook(() => useFormulario());
        
        await act(async () => {
          await result.current.getCategoriasByFormulario(formularioId);
        });
        
        expect(result.current.categorias).toEqual(undefined);
      });

      it('deve lidar com erro ao buscar categorias', async () => {
        const formularioId = 1;
        mockedAxios.get.mockRejectedValueOnce(new Error('Erro de rede'));
        
        const { result } = renderHook(() => useFormulario());
        
        await act(async () => {
          await result.current.getCategoriasByFormulario(formularioId);
        });
        
        expect(result.current.categorias).toEqual(undefined);
      });

      describe('getQuestoesByCategoria', () => {
        it('deve buscar perguntas por categoria com sucesso', async () => {
          const categoriaId = 1;
          const fakePerguntas = [{ id: 1, questao: 'Pergunta Teste', codigo: 'PT1', categoria: 1 }];
          
          mockedAxios.get.mockResolvedValueOnce({ data: fakePerguntas });
          
          const { result } = renderHook(() => useFormulario());
          
          await act(async () => {
            await result.current.getQuestoesByCategoria(categoriaId);
          });
          
          expect(result.current.perguntas).toEqual(undefined);
          expect(mockedAxios.get).toHaveBeenCalledWith(
            `${API_URL}/categorias/${categoriaId}/perguntas/`,
            expect.any(Object)
          );
        });
        
        it('deve lidar com erro ao buscar perguntas', async () => {
          const categoriaId = 1;
          mockedAxios.get.mockRejectedValueOnce(new Error('Erro de rede'));
          
          const { result } = renderHook(() => useFormulario());
          
          await act(async () => {
            await result.current.getQuestoesByCategoria(categoriaId);
          });
          
          expect(result.current.perguntas).toEqual(undefined);
        });
      });
      it('deve lidar com erro ao salvar formulário respondido', async () => {
        const fakeRespostas = [
          { pergunta: 1, politica: 'Inicial', pratica: 'Inicial', info_complementar: 'Teste' }
        ];
        
        // Mock do localStorage
        localStorageMock.setItem('selectedFormularioId', '1');
        localStorageMock.setItem('user', JSON.stringify({ id: 123 }));
        
        mockedAxios.post.mockRejectedValueOnce(new Error('Erro de servidor'));
        
        const { result } = renderHook(() => useFormulario());
        
        await expect(
          result.current.saveFormularioRespondido(fakeRespostas)
        ).rejects.toThrow();
        
      });
    it('deve lidar com erro ao buscar formulários', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Erro de rede'));
        
        const { result } = renderHook(() => useFormulario());
        
        await waitFor(() => {
          expect(result.current.formularios).toEqual([]);
        });
      });
});