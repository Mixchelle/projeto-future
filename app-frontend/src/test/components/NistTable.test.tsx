import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import NistCsfTable from "@/components/NistTable";
import useAvaliacao from "@/hooks/useAvaliacao";

// Mock the hook to control its behavior in tests
vi.mock('@/hooks/useAvaliacao', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('NistCsfTable', () => {
  it('deve renderizar corretamente quando está carregando', () => {
    useAvaliacao.mockReturnValue({ data: null, loading: true, error: null });

    render(<NistCsfTable />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('deve renderizar corretamente quando há um erro', () => {
    useAvaliacao.mockReturnValue({ data: null, loading: false, error: 'Erro ao carregar dados' });

    render(<NistCsfTable />);

    expect(screen.getByText('Erro ao carregar dados')).toBeInTheDocument();
  });

  it('deve renderizar corretamente quando não há dados', () => {
    useAvaliacao.mockReturnValue({ data: null, loading: false, error: null });

    render(<NistCsfTable />);

    expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
  });

  it('deve renderizar corretamente com os dados', async () => {
    const mockData = {
      subcategorias: {
        "GV.OC": [{ objetivo: 4.5, politica: 4.0, pratica: 3.5 }],
        "GV.RM": [{ objetivo: 3.5, politica: 3.0, pratica: 2.5 }],
      },
      mediaEmpresa: { mediaPolitica: 4.1, mediaPratica: 3.6 }
    };
    useAvaliacao.mockReturnValue({ data: mockData, loading: false, error: null });

    render(<NistCsfTable />);

    await waitFor(() => {
      expect(screen.getByText('Contexto organizacional GV.OC')).toBeInTheDocument();
      expect(screen.getByText('Estratégia de gerenciamento de riscos GV.RM')).toBeInTheDocument();
      expect(screen.getByText('Média Total')).toBeInTheDocument();
      expect(screen.getByText('4.1')).toBeInTheDocument();  // Política média
      expect(screen.getByText('3.6')).toBeInTheDocument();  // Prática média
    });
  });



  it('deve mostrar a categoria corretamente quando a flag showCategoria for verdadeira', () => {
    const mockData = {
      subcategorias: {
        "GV.OC": [{ objetivo: 4.5, politica: 4.0, pratica: 3.5 }],
      },
      mediaEmpresa: { mediaPolitica: 4.1, mediaPratica: 3.6 }
    };
    useAvaliacao.mockReturnValue({ data: mockData, loading: false, error: null });

    render(<NistCsfTable />);

    expect(screen.getByText('GV')).toBeInTheDocument();  // Categoria exibida
  });

  it('deve renderizar a tabela com as subcategorias corretamente', () => {
    const mockData = {
      subcategorias: {
        "GV.OC": [{ objetivo: 4.5, politica: 4.0, pratica: 3.5 }],
        "GV.RM": [{ objetivo: 3.5, politica: 3.0, pratica: 2.5 }],
      },
      mediaEmpresa: { mediaPolitica: 4.1, mediaPratica: 3.6 }
    };
    useAvaliacao.mockReturnValue({ data: mockData, loading: false, error: null });

    render(<NistCsfTable />);

    const contextCell = screen.getByText('Contexto organizacional GV.OC');
    const estrategiaCell = screen.getByText('Estratégia de gerenciamento de riscos GV.RM');

    expect(contextCell).toBeInTheDocument();
    expect(estrategiaCell).toBeInTheDocument();
  });
});
