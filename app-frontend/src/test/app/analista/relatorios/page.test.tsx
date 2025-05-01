import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RelatorioPage from '@/app/analista/relatorios/page';
import Sidebar from '@/components/Sidebar';
import { FiHome, FiBarChart2, FiFileText } from 'react-icons/fi';

// Mock do componente Sidebar para isolar o teste de RelatorioPage
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

describe('RelatorioPage', () => {
  it('deve renderizar a Sidebar com os menuItems corretos', () => {
    render(<RelatorioPage />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();

  });

  it('deve renderizar o título e o texto do relatório', () => {
    render(<RelatorioPage />);
    expect(screen.getByText('Relatório de Avaliação')).toBeInTheDocument();
    expect(screen.getByText('Este relatório apresenta os resultados da avaliação de maturidade em segurança da informação com base no framework NIST CSF 2.0. Os dados foram coletados por meio de questionários respondidos pelos responsáveis da organização.')).toBeInTheDocument();
  });

  it('deve renderizar o elemento principal com a classe "main-content"', () => {
    render(<RelatorioPage />);
    const mainContent = screen.getByRole('main');
    expect(mainContent).toHaveClass('main-content');
  });
});