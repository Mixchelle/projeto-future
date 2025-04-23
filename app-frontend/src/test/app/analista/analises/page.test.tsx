import { render, screen, waitFor } from '@testing-library/react';
import AnalisesList from '@/app/analista/analises/page';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFormulario } from '@/hooks/useFormulario';

// Mock do hook useFormulario
vi.mock('@/hooks/useFormulario', () => ({
  useFormulario: vi.fn(),
}));

// Mock do componente Sidebar
vi.mock('@/components/Sidebar', () => ({
  default: ({ menuItems }: { menuItems: any[] }) => (
    <div data-testid="sidebar">
      {menuItems.map((item) => (
        <div key={item.name}>{item.name}</div>
      ))}
    </div>
  ),
}));

// Mock do localStorage e window.location
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};
const locationMock = {
  href: '',
};

beforeEach(() => {
  global.localStorage = localStorageMock as any;
  global.window.location = locationMock as any;
  
  // Reset mocks
  vi.clearAllMocks();
});

describe('Página de Análises do Analista', () => {
  it('deve renderizar o estado de loading corretamente', () => {
    (useFormulario as any).mockReturnValue({
      formulariosEmAnalise: [],
      loadingFormulariosEmAnalise: true,
      buscarFormulariosEmAnalise: vi.fn(),
    });

    render(<AnalisesList />);
    expect(screen.getByText('Carregando avaliações...')).toBeInTheDocument();
  });

  it('deve mostrar mensagem quando não há formulários para analisar', () => {
    (useFormulario as any).mockReturnValue({
      formulariosEmAnalise: [],
      loadingFormulariosEmAnalise: false,
      buscarFormulariosEmAnalise: vi.fn(),
    });

    render(<AnalisesList />);
    expect(screen.getByText('Nenhuma avaliação pendente no momento.')).toBeInTheDocument();
  });

  it('deve listar os formulários em análise corretamente', async () => {
    const mockFormularios = [
      {
        id_formulario_respondido: 1,
        nome_formulario: 'Formulário de Segurança',
        nome_cliente: 'Cliente A',
      },
      {
        id_formulario_respondido: 2,
        nome_formulario: 'Formulário de Privacidade',
        nome_cliente: 'Cliente B',
      },
    ];

    (useFormulario as any).mockReturnValue({
      formulariosEmAnalise: mockFormularios,
      loadingFormulariosEmAnalise: false,
      buscarFormulariosEmAnalise: vi.fn(),
    });

    render(<AnalisesList />);

    await waitFor(() => {
      expect(screen.getByText('Avaliaçoes')).toBeInTheDocument();
      expect(screen.getByText('Formulário de Segurança')).toBeInTheDocument();
      expect(screen.getByText('Formulário de Privacidade')).toBeInTheDocument();
      expect(screen.getByText('Cliente A')).toBeInTheDocument();
      expect(screen.getByText('ID Respondido: 1')).toBeInTheDocument();
    });
  });

  it('deve chamar localStorage.setItem e redirecionar ao clicar em um card', async () => {
    const mockFormularios = [
      {
        id_formulario_respondido: 1,
        nome_formulario: 'Formulário Teste',
        nome_cliente: 'Cliente Teste',
      },
    ];

    (useFormulario as any).mockReturnValue({
      formulariosEmAnalise: mockFormularios,
      loadingFormulariosEmAnalise: false,
      buscarFormulariosEmAnalise: vi.fn(),
    });

    render(<AnalisesList />);

    const card = await screen.findByText('Formulário Teste');
    card.click();

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'formularioRespondidoId',
      '1'
    );
    expect(window.location.href).toBe('/analista/analises/analiseDetalhada/1');
  });

  it('deve renderizar a sidebar com os itens corretos', () => {
    (useFormulario as any).mockReturnValue({
      formulariosEmAnalise: [],
      loadingFormulariosEmAnalise: false,
      buscarFormulariosEmAnalise: vi.fn(),
    });

    render(<AnalisesList />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Análises')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });

  it('deve aplicar classes CSS corretamente baseado no estado da sidebar', () => {
    (useFormulario as any).mockReturnValue({
      formulariosEmAnalise: [],
      loadingFormulariosEmAnalise: false,
      buscarFormulariosEmAnalise: vi.fn(),
    });

    const { container } = render(<AnalisesList />);
    
    const mainElement = container.querySelector('.main-content');
    expect(mainElement).toHaveClass('sidebar-open');
  });
});