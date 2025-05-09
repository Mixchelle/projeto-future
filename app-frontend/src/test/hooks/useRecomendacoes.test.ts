import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import axios from 'axios';
import useRecomendacoes from '@/hooks/useRecomendacoes';
import type { Recomendacao, FormData } from '@/hooks/useRecomendacoes';

// Mock completo do axios
vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      create: vi.fn().mockReturnThis(),
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() },
      },
    },
  };
});

// Mock do localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Mock do módulo de baseUrl
vi.mock('@/util/baseUrl', () => ({
  getBaseUrl: () => 'http://localhost:8000',
}));

describe('useRecomendacoes', () => {
  const mockRecomendacoes = [
    {
      id: 1,
      cliente: 1,
      formulario_respondido: 1,
      analista: 1,
      nome: 'Recomendação Teste',
      categoria: 'Segurança (SG)',
      tecnologia: 'Tecnologia Teste',
      nist: 'NIST-123',
      prioridade: 'alta',
      data_inicio: '2023-01-01',
      data_fim: '2023-12-31',
      meses: '12',
      detalhes: 'Detalhes da recomendação',
      investimentos: 'Investimento necessário',
      riscos: 'Riscos envolvidos',
      justificativa: 'Justificativa técnica',
      observacoes: 'Observações adicionais',
      urgencia: 'Alto',
      gravidade: 'Grave',
      cumprida: false,
      data_cumprimento: null,
      comprovante: null,
      criado_em: '2023-01-01T00:00:00Z',
      atualizado_em: '2023-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    // Configurar mocks do localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    
    window.localStorage.setItem('token', 'mock-token');
    window.localStorage.setItem('cliente_formulario_analise_id', '1');
    window.localStorage.setItem('formularioEmAnaliseId', '1');

    // Configurar mocks do axios
    vi.mocked(axios.get).mockResolvedValue({ data: mockRecomendacoes });
    vi.mocked(axios.post).mockImplementation((_, data) => 
      Promise.resolve({ data: { ...data as FormData, id: 2 } })
    );
    vi.mocked(axios.patch).mockImplementation((url, data) => {
      const updated = { ...mockRecomendacoes[0], ...data };
      return Promise.resolve({ data: updated });
    });
    vi.mocked(axios.delete).mockResolvedValue({ status: 204 });
  });

  afterEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('deve buscar recomendações automaticamente ao inicializar', async () => {
    const { result } = renderHook(() => useRecomendacoes());

    expect(result.current.loading).toBe(true);
    expect(result.current.recomendacoes).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.recomendacoes).toEqual(mockRecomendacoes);
    });

    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:8000/recommendations/recomendacoes/1/1/',
      {
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
      }
    );
  });

  it('deve adicionar uma nova recomendação', async () => {
    const novaRecomendacao: FormData = {
      nome: 'Nova Recomendação',
      categoria: 'Continuidade',
      tecnologia: 'Nova Tecnologia',
      nist: 'NIST-456',
      prioridade: 'media',
      data_inicio: '2023-06-01',
      data_fim: '2023-12-31',
      meses: '7',
      detalhes: 'Novos detalhes',
      investimentos: 'Novo investimento',
      riscos: 'Novos riscos',
      justificativa: 'Nova justificativa',
      observacoes: 'Novas observações',
      urgencia: 'Médio',
      gravidade: 'Moderada',
    };

    const { result } = renderHook(() => useRecomendacoes());

    await waitFor(() => {
      expect(result.current.recomendacoes.length).toBe(1);
    });

    await act(async () => {
      await result.current.adicionarRecomendacao(novaRecomendacao);
    });

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/recommendations/recomendacoes/1/1/',
      novaRecomendacao,
      {
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
      }
    );

    await waitFor(() => {
      expect(result.current.recomendacoes.length).toBe(2);
    });
  });

  it('deve atualizar uma recomendação existente', async () => {
    const { result } = renderHook(() => useRecomendacoes());

    await waitFor(() => {
      expect(result.current.recomendacoes.length).toBe(1);
    });

    const atualizacao = { nome: 'Recomendação Atualizada', prioridade: 'baixa' };

    await act(async () => {
      await result.current.atualizarRecomendacao(1, atualizacao);
    });

    expect(axios.patch).toHaveBeenCalledWith(
      'http://localhost:8000/recommendations/recomendacoes/1/',
      atualizacao,
      {
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
      }
    );

    await waitFor(() => {
      expect(result.current.recomendacoes[0].nome).toBe('Recomendação Atualizada');
      expect(result.current.recomendacoes[0].prioridade).toBe('baixa');
    });
  });

  it('deve lidar com erro ao buscar recomendações', async () => {
    vi.mocked(axios.get).mockRejectedValue({
      response: { data: { detail: 'Erro ao buscar recomendações' } },
    });

    const { result } = renderHook(() => useRecomendacoes());

    await waitFor(() => {
      expect(result.current.error).toBe('Erro ao buscar recomendações');
      expect(result.current.loading).toBe(false);
    });
  });

  it('deve agrupar recomendações por categoria corretamente', async () => {
    const recomendacoesMultiplas = [
      ...mockRecomendacoes,
      {
        ...mockRecomendacoes[0],
        id: 2,
        nome: 'Outra Recomendação',
        categoria: 'Continuidade (CI)',
      },
    ];

    vi.mocked(axios.get).mockResolvedValueOnce({ data: recomendacoesMultiplas });

    const { result } = renderHook(() => useRecomendacoes());

    await waitFor(() => {
      const agrupadas = result.current.recomendacoesPorCategoria;
      expect(Object.keys(agrupadas)).toEqual(['Segurança', 'Continuidade']);
      expect(agrupadas['Segurança'].length).toBe(1);
      expect(agrupadas['Continuidade'].length).toBe(1);
    });
  });

  it('não deve buscar recomendações se cliente ou formulário estiverem ausentes', async () => {
    window.localStorage.removeItem('cliente_formulario_analise_id');
    window.localStorage.removeItem('formularioEmAnaliseId');
  
    const { result } = renderHook(() => useRecomendacoes());
  
    await waitFor(() => {
      expect(result.current.recomendacoes).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  
    expect(axios.get).not.toHaveBeenCalled();
  });
  it('deve deletar uma recomendação com sucesso', async () => {
    const { result } = renderHook(() => useRecomendacoes());
  
    await waitFor(() => expect(result.current.recomendacoes.length).toBe(1));
  
    await act(async () => {
      await result.current.removerRecomendacao(1);
    });
  
    expect(axios.delete).toHaveBeenCalledWith(
      'http://localhost:8000/recommendations/recomendacoes/1/',
      expect.any(Object)
    );
  
    await waitFor(() => expect(result.current.recomendacoes.length).toBe(0));
  });

  
  it('deve agrupar recomendações corretamente com múltiplas categorias', async () => {
    const recomendacoesComMultiplasCategorias = [
      ...mockRecomendacoes,
      {
        ...mockRecomendacoes[0],
        id: 2,
        categoria: 'Segurança (SG)',
      },
    ];
  
    vi.mocked(axios.get).mockResolvedValueOnce({ data: recomendacoesComMultiplasCategorias });
  
    const { result } = renderHook(() => useRecomendacoes());
  
    await waitFor(() => {
      const agrupadas = result.current.recomendacoesPorCategoria;
      expect(Object.keys(agrupadas)).toEqual(['Segurança']);
      expect(agrupadas['Segurança'].length).toBe(2);
    });
  });
  it('deve agrupar recomendações corretamente com múltiplas categorias', async () => {
    const recomendacoesComMultiplasCategorias = [
      ...mockRecomendacoes,
      {
        ...mockRecomendacoes[0],
        id: 2,
        categoria: 'Segurança (SG)',
      },
    ];
  
    vi.mocked(axios.get).mockResolvedValueOnce({ data: recomendacoesComMultiplasCategorias });
  
    const { result } = renderHook(() => useRecomendacoes());
  
    await waitFor(() => {
      const agrupadas = result.current.recomendacoesPorCategoria;
      expect(Object.keys(agrupadas)).toEqual(['Segurança']);
      expect(agrupadas['Segurança'].length).toBe(2);
    });
  });
  


  it('deve lidar com erro ao remover recomendação', async () => {
    vi.mocked(axios.delete).mockRejectedValue({
      response: { data: { detail: 'Erro ao remover recomendação' } },
    });
  
    const { result } = renderHook(() => useRecomendacoes());
  
    await waitFor(() => expect(result.current.recomendacoes.length).toBe(1));
  
    await act(async () => {
      try {
        await result.current.removerRecomendacao(1);
      } catch (error) {
        // Verificando se o erro foi corretamente setado no estado
        expect(result.current.error).toBe(null);
      }
    });
  
    expect(axios.delete).toHaveBeenCalledWith(
      'http://localhost:8000/recommendations/recomendacoes/1/',
      expect.any(Object)
    );
  });
  
  it('deve marcar uma recomendação como concluída', async () => {
    const { result } = renderHook(() => useRecomendacoes());
  
    const atualizacao = { cumprida: true, data_cumprimento: '2023-07-01' };
  
    await act(async () => {
      await result.current.marcarComoConcluida(1, atualizacao);
    });
  

    
    await waitFor(() => {
      expect(result.current.recomendacoes[0].cumprida).toBe(true);
      const expectedTime = new Date('2025-04-27T02:08:20.341qZ').getTime();
    });
  });

 
  
  
});