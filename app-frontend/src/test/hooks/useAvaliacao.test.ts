import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import  useAvaliacao  from '@/hooks/useAvaliacao';
import { getBaseUrl } from '@/util/baseUrl';
import { getDescricaoSubcategoria } from '@/util/subCategorias';

// Mock das dependências
vi.mock('@/util/baseUrl', () => ({
  getBaseUrl: vi.fn(() => 'http://localhost:8000'),
}));

vi.mock('@/util/subCategorias', () => ({
  getDescricaoSubcategoria: vi.fn((sigla) => `Descrição mockada para ${sigla}`),
}));

// Mock do localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};

  return {
    getItem: function(key: string) {
      return store[key] || null;
    },
    setItem: function(key: string, value: string) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock do fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useAvaliacao', () => {
  const mockToken = 'mock-token';
  const mockFormularioId = 123;
  const mockClienteId = '456';

  const mockResponseData = {
    formulario: {
      id: mockFormularioId,
      cliente: {
        id: mockClienteId,
      },
    },
    funcoes: {
      func1: {
        nome: 'Função 1',
        sigla: 'F1',
        media: 3.5,
        politica: 4.0,
        pratica: 3.0,
        status: 'Avaliado',
        categorias: [
          {
            sigla: 'C1',
            politica: 4.0,
            pratica: 3.5,
            objetivo: 3.0,
            status: 'Avaliado',
            subcategorias: ['Pergunta 1', 'Pergunta 2'],
          },
        ],
      },
      func2: {
        nome: 'Função 2',
        sigla: 'F2',
        media: 2.5,
        politica: 3.0,
        pratica: 2.0,
        status: 'Parcial',
        categorias: [
          {
            sigla: 'C2',
            politica: 3.0,
            pratica: 2.0,
            objetivo: 3.0,
            status: 'Parcial',
            subcategorias: ['Pergunta 3', 'Pergunta 4'],
          },
        ],
      },
    },
  };

  beforeEach(() => {
    localStorage.setItem('token', mockToken);
    mockFetch.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('deve retornar estado inicial corretamente', () => {
    const { result } = renderHook(() => useAvaliacao(null));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("ID do formulário não fornecido");

  });

  it('deve retornar estado inicial passando id corretamente', () => {
    const { result } = renderHook(() => useAvaliacao(1));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('deve lidar com erro quando não há token', async () => {
    localStorage.clear();

    const { result } = renderHook(() => useAvaliacao(mockFormularioId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Token de autenticação não encontrado');
      expect(result.current.data).toBeNull();
    });
  });

  it('deve lidar com erro quando não há ID do formulário', async () => {
    const { result } = renderHook(() => useAvaliacao(null));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('ID do formulário não fornecido');
      expect(result.current.data).toBeNull();
    });
  });

  it('deve fazer a requisição corretamente e processar os dados', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    });

    const { result } = renderHook(() => useAvaliacao(mockFormularioId));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data).not.toBeNull();
    });

    // Verifica se o fetch foi chamado corretamente
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      `${getBaseUrl()}/maturity-results/maturity-results/${mockFormularioId}/`,
      {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      }
    );

    // Verifica se os dados foram processados corretamente
    const processedData = result.current.data;
    expect(processedData?.categorias).toHaveLength(2);
    expect(processedData?.subcategorias).toHaveProperty('C1');
    expect(processedData?.subcategorias).toHaveProperty('C2');
    expect(processedData?.mediaEmpresa.mediaTotal).toBe(3.0); // (3.5 + 2.5) / 2
    expect(processedData?.mediaEmpresa.mediaPolitica).toBe(3.5); // (4.0 + 3.0) / 2
    expect(processedData?.mediaEmpresa.mediaPratica).toBe(2.5); // (3.0 + 2.0) / 2

    // Verifica se os dados do localStorage foram setados
    expect(localStorage.getItem('formularioEmAnaliseId')).toBe(mockFormularioId.toString());
    expect(localStorage.getItem('cliente_formulario_analise_id')).toBe(mockClienteId);
  });

  it('deve lidar com erro na requisição', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useAvaliacao(mockFormularioId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Erro na requisição: 404');
      expect(result.current.data).toBeNull();
    });
  });

  it('deve lidar com formato inválido de funções', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockResponseData, funcoes: {} }),
    });

    const { result } = renderHook(() => useAvaliacao(mockFormularioId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Nenhuma função encontrada ou formato inválido');
      expect(result.current.data).toBeNull();
    });
  });

  it('deve usar valores padrão quando números são inválidos', async () => {
    const mockDataWithInvalidNumbers = {
      ...mockResponseData,
      funcoes: {
        func1: {
          ...mockResponseData.funcoes.func1,
          media: 'invalid',
          politica: null,
          pratica: undefined,
        },
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDataWithInvalidNumbers,
    });

    const { result } = renderHook(() => useAvaliacao(mockFormularioId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.data?.categorias[0].media).toBe(0);
      expect(result.current.data?.categorias[0].politica).toBe(0);
      expect(result.current.data?.categorias[0].pratica).toBe(0);
    });
  });

it('deve chamar getDescricaoSubcategoria para cada subcategoria', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponseData,
    });

    // Resetar o mock para contar apenas as chamadas deste teste
    vi.mocked(getDescricaoSubcategoria).mockClear();

    const { result } = renderHook(() => useAvaliacao(mockFormularioId));

    await waitFor(() => {
      // Verifica se foi chamada pelo menos para C1 e C2
      expect(getDescricaoSubcategoria).toHaveBeenCalledWith('C1');
      expect(getDescricaoSubcategoria).toHaveBeenCalledWith('C2');
      
      // Verifica se a descrição mockada foi usada
      expect(result.current.data?.subcategorias['C1'][0].subcategoria).toBe(
        'Descrição mockada para C1'
      );
    });

    // Verifica o número exato de chamadas (ajuste conforme necessário)
    expect(getDescricaoSubcategoria).toHaveBeenCalledTimes(2);
});
});