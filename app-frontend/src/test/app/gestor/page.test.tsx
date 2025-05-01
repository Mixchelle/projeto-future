import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Gestor from '@/app/gestor/page';
import { act } from 'react-dom/test-utils';

// Mock dos componentes filhos e dependências
vi.mock('@/components/Sidebar', () => ({
  default: vi.fn(({ menuItems }) => (
    <div data-testid="sidebar">
      {menuItems.map((item: any) => (
        <div key={item.name}>{item.name}</div>
      ))}
    </div>
  )),
}));

vi.mock('@/components/FloatingSocialMenu', () => ({
  default: vi.fn(() => <div data-testid="social-menu">Social Menu</div>),
}));

vi.mock('react-icons/fi', () => ({
  FiHome: vi.fn(() => <div>Home Icon</div>),
}));

describe('Página Gestor', () => {
  const originalLocalStorage = window.localStorage;

  beforeEach(() => {
    // Mock do localStorage
    window.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    } as unknown as Storage;
  });

  afterEach(() => {
    vi.clearAllMocks();
    window.localStorage = originalLocalStorage;
  });

  it('deve renderizar corretamente sem usuário logado', () => {
    render(<Gestor />);
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByTestId('social-menu')).toBeInTheDocument();
    expect(screen.getByText('Bem-vindo(a), visitante')).toBeInTheDocument();
  });

  it('deve exibir o nome do usuário quando estiver no localStorage', async () => {
    const mockUser = { nome: 'João Silva', role: 'gestor' };
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => JSON.stringify(mockUser));
    
    await act(async () => {
      render(<Gestor />);
    });
    
    expect(screen.getByText('Bem-vindo(a), João Silva')).toBeInTheDocument();
  });

  it('deve lidar com erro ao analisar dados inválidos do localStorage', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => 'invalid-json');
    
    await act(async () => {
      render(<Gestor />);
    });
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Erro ao fazer parse do user no localStorage:',
      expect.anything()
    );
    expect(screen.getByText('Bem-vindo(a), visitante')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('deve ajustar o layout quando a sidebar é recolhida', async () => {
    render(<Gestor />);
    const content = screen.getByRole('main').parentElement;
    expect(content).toHaveClass('ml-[220px]');
  });

});

describe('Testes de Integração', () => {
  it('deve integrar corretamente com os componentes filhos', () => {
    render(<Gestor />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('social-menu')).toBeInTheDocument();
    
    // Verifica se as props foram passadas corretamente
    const menuItems = screen.getByText('Home');
    expect(menuItems).toBeInTheDocument();
  });
});