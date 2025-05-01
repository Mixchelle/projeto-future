import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormularioPage from '@/app/cliente/formulario/page';
import Sidebar from '@/components/Sidebar';
import { useFormulario } from '@/hooks/useFormulario';
import { useRouter } from 'next/navigation';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do useRouter
const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockRouterPush,
  })),
}));

// Mock do hook useFormulario
const mockGetFormularios = vi.fn(() => Promise.resolve([
  { id: 1, nome: 'Formulário de Satisfação' },
  { id: 2, nome: 'Questionário de Segurança' },
]));
vi.mock('@/hooks/useFormulario', () => ({
  useFormulario: vi.fn(() => ({
    formularios: [],
    getFormularios: mockGetFormularios,
  })),
}));

// Mock do componente Sidebar
vi.mock('@/components/Sidebar', () => {
  return {
    default: vi.fn(({ menuItems }) => (
      <div data-testid="sidebar">
        Sidebar Component
        {menuItems.map((item) => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>
    )),
  };
});

// Mock do localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('FormularioPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    (useFormulario as vi.Mock).mockReturnValue({
      formularios: [],
      getFormularios: mockGetFormularios,
    });
  });


  it('deve buscar os formulários na montagem', async () => {
    render(<FormularioPage />);
    await waitFor(() => expect(mockGetFormularios).toHaveBeenCalledTimes(1));
  });

  it('deve renderizar a lista de formulários', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      formularios: [
        { id: 1, nome: 'Formulário de Satisfação' },
        { id: 2, nome: 'Questionário de Segurança' },
      ],
      getFormularios: mockGetFormularios,
    });
    render(<FormularioPage />);
    expect(screen.getByText('Formulário de Satisfação')).toBeInTheDocument();
    expect(screen.getByText('Questionário de Segurança')).toBeInTheDocument();
  });

  it('deve salvar o ID e nome do formulário no localStorage e navegar ao clicar', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      formularios: [
        { id: 3, nome: 'Formulário de Teste' },
      ],
      getFormularios: mockGetFormularios,
    });
    render(<FormularioPage />);
    const formularioCard = screen.getByText('Formulário de Teste').closest('.cardForm');
    fireEvent.click(formularioCard!);
    expect(localStorage.getItem('selectedFormularioId')).toBe('3');
    expect(localStorage.getItem('nomefomulario')).toBe('Formulário de Teste');
    expect(mockRouterPush).toHaveBeenCalledWith('/cliente/formulario/formulário');
  });

  it('deve formatar o nome do formulário para a URL corretamente', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      formularios: [
        { id: 4, nome: 'Questionário de Segurança da Informação' },
      ],
      getFormularios: mockGetFormularios,
    });
    render(<FormularioPage />);
    const formularioCard = screen.getByText('Questionário de Segurança da Informação').closest('.cardForm');
    fireEvent.click(formularioCard!);
    expect(mockRouterPush).toHaveBeenCalledWith('/cliente/formulario/questionário');
  });
});