import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Cliente from '@/app/cliente/page';
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
const mockGetFormularioRespondido = vi.fn();
const mockGetFormulariosEmAndamento = vi.fn(() => Promise.resolve()); // Mock para simular a chamada assíncrona
vi.mock('@/hooks/useFormulario', () => ({
  useFormulario: vi.fn(() => ({
    formularios: [],
    getFormularioRespondido: mockGetFormularioRespondido,
    getFormulariosEmAndamento: mockGetFormulariosEmAndamento,
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

// Mock do componente FloatingSocialMenu
vi.mock('@/components/FloatingSocialMenu', () => {
  return {
    default: vi.fn(() => <div data-testid="floating-social-menu">FloatingSocialMenu</div>),
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

describe('Cliente', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });


  it('deve renderizar a FloatingSocialMenu', () => {
    render(<Cliente />);
    expect(screen.getByTestId('floating-social-menu')).toBeInTheDocument();
  });

  it('deve buscar o ID do cliente do localStorage na montagem', () => {
    localStorageMock.setItem('user', JSON.stringify({ tipo: 'cliente', id: 123 }));
    render(<Cliente />);
    expect(useFormulario().getFormularioRespondido).toHaveBeenCalledWith(1, 123);
    expect(useFormulario().getFormulariosEmAndamento).toHaveBeenCalledWith(123);
  });

  it('deve buscar o ID do subcliente do localStorage na montagem', () => {
    localStorageMock.setItem('user', JSON.stringify({ tipo: 'subcliente', cliente: { id: 456 } }));
    render(<Cliente />);
    expect(useFormulario().getFormularioRespondido).toHaveBeenCalledWith(1, 456);
    expect(useFormulario().getFormulariosEmAndamento).toHaveBeenCalledWith(456);
  });

  it('deve buscar os formulários em andamento na montagem', async () => {
    localStorageMock.setItem('user', JSON.stringify({ tipo: 'cliente', id: 789 }));
    render(<Cliente />);
    await waitFor(() => expect(useFormulario().getFormulariosEmAndamento).toHaveBeenCalledWith(789));
  });

  it('deve exibir o card de formulário respondido se houver dados no localStorage', () => {
    localStorageMock.setItem('formulariosEmAndamento', JSON.stringify({ 1: { id: 1, nome: 'Formulário Teste', status: 'aguardando_analise', data: new Date().toISOString() } }));
    render(<Cliente />);
    expect(screen.getByText('Formulário Teste')).toBeInTheDocument();
    expect(screen.getByText('Status: aguardando_analise')).toBeInTheDocument();
  });



  it('deve exibir o modal do NIST CSF ao clicar no botão', () => {
    render(<Cliente />);
    const botaoNist = screen.getByText('Sobre o NIST CSF');
    fireEvent.click(botaoNist);
    expect(screen.getByText('Nota Técnica – NIST CSF 2.0')).toBeInTheDocument();
  });

  it('deve fechar o modal do NIST CSF ao clicar no botão de fechar', () => {
    render(<Cliente />);
    const botaoNist = screen.getByText('Sobre o NIST CSF');
    fireEvent.click(botaoNist);
    const botaoFecharModal = screen.getByText('×');
    fireEvent.click(botaoFecharModal);
    expect(screen.queryByText('Nota Técnica – NIST CSF 2.0')).not.toBeInTheDocument();
    expect(screen.queryByRole('document', { name: 'PDF NIST' })).not.toBeInTheDocument();
  });
  it('deve exibir o modal PDF quando o botão "Sobre o NIST CSF" for clicado', () => {
    render(<Cliente />);
    const botaoNist = screen.getByText('Sobre o NIST CSF');
    fireEvent.click(botaoNist);
    expect(screen.getByText('Nota Técnica – NIST CSF 2.0')).toBeInTheDocument();
    expect(screen.getByTitle('PDF NIST')).toBeInTheDocument();
  });
  
  it('deve fechar o modal PDF ao clicar no botão de fechar', () => {
    render(<Cliente />);
    const botaoNist = screen.getByText('Sobre o NIST CSF');
    fireEvent.click(botaoNist);
    const botaoFecharModal = screen.getByText('×');
    fireEvent.click(botaoFecharModal);
    expect(screen.queryByText('Nota Técnica – NIST CSF 2.0')).not.toBeInTheDocument();
  });
  
  it('deve buscar os dados corretamente ao carregar o clienteId', () => {
    localStorageMock.setItem('user', JSON.stringify({ tipo: 'cliente', id: 123 }));
    render(<Cliente />);
    expect(useFormulario().getFormularioRespondido).toHaveBeenCalledWith(1, 123);
    expect(useFormulario().getFormulariosEmAndamento).toHaveBeenCalledWith(123);
  });
  it('não deve tentar buscar dados quando o localStorage está vazio', () => {
    localStorageMock.clear(); // Limpa o localStorage
    render(<Cliente />);
    expect(useFormulario().getFormularioRespondido).not.toHaveBeenCalled();
    expect(useFormulario().getFormulariosEmAndamento).not.toHaveBeenCalled();
  });
  
  it('deve exibir o nome e o status do formulário respondido', () => {
    localStorageMock.setItem('formulariosEmAndamento', JSON.stringify({ 1: { id: 1, nome: 'Formulário Teste', status: 'aguardando_analise', data: new Date().toISOString() } }));
    render(<Cliente />);
    expect(screen.getByText('Formulário Teste')).toBeInTheDocument();
    expect(screen.getByText('Status: aguardando_analise')).toBeInTheDocument();
  });


  
});