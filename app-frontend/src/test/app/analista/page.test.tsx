import { render, screen, fireEvent } from '@testing-library/react';
import Funcionario from '@/app/analista/page';
import { describe, it, expect, vi } from 'vitest';
import { useRouter } from 'next/navigation';

// Mock do useRouter
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
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

// Mock do FloatingSocialMenu
vi.mock('@/components/FloatingSocialMenu', () => ({
  default: () => <div data-testid="floating-social-menu" />,
}));

describe('Página do Analista', () => {
  it('deve renderizar corretamente', () => {
    render(<Funcionario />);
    
    // Verifica se o título principal está presente
    expect(screen.getByText('Bem-vindo(a), Analista')).toBeInTheDocument();
    
    // Verifica se a sidebar foi renderizada
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    
    // Verifica se os itens do menu estão presentes
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Análises')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
    
    // Verifica se o menu social flutuante está presente
    expect(screen.getByTestId('floating-social-menu')).toBeInTheDocument();
  });

  it('deve renderizar a estrutura principal corretamente', () => {
    const { container } = render(<Funcionario />);
    
    // Verifica a estrutura do layout
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex');
    expect(mainDiv).toHaveClass('h-screen');
    
    // Verifica se o conteúdo principal tem a classe correta
    const contentDiv = screen.getByRole('main').parentElement;
    expect(contentDiv).toHaveClass('flex-1');
    expect(contentDiv).toHaveClass('flex');
    expect(contentDiv).toHaveClass('flex-col');
  });

  it('deve passar os itens de menu corretos para o Sidebar', () => {
    render(<Funcionario />);
    
    // Verifica se os itens do menu foram passados corretamente
    const menuItems = [
      { name: 'Home', path: '/analista' },
      { name: 'Análises', path: '/analista/analises' },
      { name: 'Relatórios', path: '/analista/relatorios' }
    ];
    
    menuItems.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
    });
  });

  it('deve renderizar o conteúdo principal com padding correto', () => {
    render(<Funcionario />);
    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveClass('p-6');
    expect(mainContent).toHaveClass('mt-16');
  });

  
});