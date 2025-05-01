import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import RadarNistCsf from "@/components/RadarNistCsf";
import useAvaliacao from "@/hooks/useAvaliacao";

// Mocking the useAvaliacao hook
vi.mock('@/hooks/useAvaliacao', () => ({
  __esModule: true, // Ensures it's treated as an ES module
  default: vi.fn(), // Mocking the default export of useAvaliacao
}));

// Mock ResizeObserver to avoid errors in tests
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('RadarNistCsf', () => {
  it('deve renderizar o componente corretamente quando os dados estiverem carregados', async () => {
    const mockData = {
      categorias: [
        { sigla: 'GV', categoria: 'Governança' },
        { sigla: 'ID', categoria: 'Identificação' },
      ],
      subcategorias: {
        GV: [
          { subcategoria: 'Subcat 1', politica: 3, pratica: 4, objetivo: 5 },
        ],
        ID: [
          { subcategoria: 'Subcat 2', politica: 2, pratica: 3, objetivo: 4 },
        ],
      },
    };

    // Mocking the hook to return data
    useAvaliacao.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<RadarNistCsf />);

    // Add your assertions to verify the rendered content
    expect(screen.getByText('Radar NIST CSF')).toBeInTheDocument();
  });

 
});
