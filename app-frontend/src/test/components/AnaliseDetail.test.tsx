import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import AnaliseDetail from '@/components/AnaliseDetail';
import useAvaliacao from '@/hooks/useAvaliacao';
import useRecomendacoes from '@/hooks/useRecomendacoes';
import { useRouter } from 'next/navigation';
import 'resize-observer-polyfill';

global.ResizeObserver = require('resize-observer-polyfill');

// Mocks
vi.mock('@/hooks/useAvaliacao');
vi.mock('@/hooks/useRecomendacoes');
const mockColocarEmPendencia = vi.fn(() => Promise.resolve());

vi.mock('@/hooks/useFormulario', () => ({
  useFormulario: vi.fn(() => ({
    colocarEmPendencia: mockColocarEmPendencia,
  })),
}));

vi.mock('@/components/Sidebar', () => ({
  default: () => <div>Sidebar</div>
}));
vi.mock('@/components/LoadingSpinner', () => ({
  default: () => <div>Loading...</div>
}));
vi.mock('@/components/ErrorMessage', () => ({
  default: ({ message }: { message: string }) => <div>{message}</div>
}));
vi.mock('next/navigation', () => ({
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

describe('AnaliseDetail Component', () => {
  const empresaId = "123";

  beforeEach(() => {
    useAvaliacao.mockReturnValue({
      data: {
        subcategorias: [],
        categorias: [{ sigla: "ID", categoria: "Identificação" }],
      },
      loading: false,
      error: null,
    });
    useRecomendacoes.mockReturnValue({
      recomendacoes: [],
      recomendacoesPorCategoria: {},
      adicionarRecomendacao: vi.fn(),
      atualizarRecomendacao: vi.fn(),
      removerRecomendacao: vi.fn(),
    });
    localStorage.setItem("formularioAnaliseCompleto", JSON.stringify({ nome_cliente: "Cliente Teste" }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders with data and sidebar', () => {
    render(<AnaliseDetail empresaId={empresaId} />);
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText(/Análise de Cybersegurança/i)).toBeInTheDocument();
    expect(screen.getByText(/Cliente Teste/)).toBeInTheDocument();
  });



  it('opens the pendência modal when clicking "Pendência"', async () => {
    render(<AnaliseDetail empresaId={empresaId} />);
    const pendenciaButton = screen.getByRole('button', { name: /Pendência/i });
    fireEvent.click(pendenciaButton);
    await waitFor(() => {
      expect(screen.getByText('Adicionar Pendência')).toBeInTheDocument();
    });
    expect(screen.getByText(/Categoria com Pendência/i)).toBeInTheDocument();
  });

  it('displays save button and triggers salvar', () => {
    render(<AnaliseDetail empresaId={empresaId} />);
    const saveButton = screen.getByRole('button', { name: /Salvar/i });
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    // Aqui, o botão está apenas com `console.log`, não tem ação real
  });

  it('handles checkbox click inside modal', async () => {
    render(<AnaliseDetail empresaId={empresaId} />);
    const pendenciaButton = screen.getByRole('button', { name: /Pendência/i });
    fireEvent.click(pendenciaButton);

    await waitFor(() => {
      const checkbox = screen.getByLabelText(/Identificação \(ID\)/i);
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });
  it('renders loading state correctly', () => {
    useAvaliacao.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });
  
    render(<AnaliseDetail empresaId="123" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  it('renders error message on error', () => {
    useAvaliacao.mockReturnValue({
      data: null,
      loading: false,
      error: 'Erro de API',
    });
  
    render(<AnaliseDetail empresaId="123" />);
    expect(screen.getByText(/Erro: Erro de API/)).toBeInTheDocument();
  });
  it('renders message when no data is available', () => {
    useAvaliacao.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
  
    render(<AnaliseDetail empresaId="123" />);
    expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
  });

  it('deve definir o nome do cliente a partir do localStorage', async () => {
    const mockCliente = { nome_cliente: "Cliente Teste" };
    localStorage.setItem("formularioAnaliseCompleto", JSON.stringify(mockCliente));
    
    render(<AnaliseDetail empresaId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Cliente Teste/)).toBeInTheDocument();
    });
  });
  it('deve renderizar sem nome do cliente se não existir no localStorage', async () => {
    localStorage.removeItem("formularioAnaliseCompleto");
    
    render(<AnaliseDetail empresaId="123" />);
    
    await waitFor(() => {
      expect(screen.queryByText(/Cliente Teste/)).not.toBeInTheDocument();
      expect(screen.getByText(/Análise de Cybersegurança/)).toBeInTheDocument();
    });
  });
  it('deve renderizar o componente RadarNistCsf', async () => {
    render(<AnaliseDetail empresaId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Análise de Cybersegurança/)).toBeInTheDocument();
    });
  });

});
