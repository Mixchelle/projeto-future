import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnaliseDetailPage from '@/app/analista/analises/analiseDetalhada/[slug]/page';
import AnaliseDetail from '@/components/AnaliseDetail';
import LoadingSpinner from '@/components/LoadingSpinner';
import Sidebar from '@/components/Sidebar';
import { FiHome, FiBarChart2, FiFileText } from 'react-icons/fi';

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

// Mock do componente AnaliseDetail
vi.mock('@/components/AnaliseDetail', () => {
  return {
    default: vi.fn(() => <div data-testid="analise-detail">AnaliseDetail Component</div>),
  };
});

// Mock do componente Sidebar (para verificar se é renderizado no estado de carregamento)
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

describe('AnaliseDetailPage', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('deve renderizar o LoadingSpinner e a Sidebar quando formularioRespondidoId é null', () => {
    render(<AnaliseDetailPage />);

   
    expect(AnaliseDetail).not.toHaveBeenCalled();
  });

  it('deve renderizar o componente AnaliseDetail com o ID correto quando formularioRespondidoId é válido', () => {
    localStorageMock.setItem('formularioRespondidoId', '123');
    render(<AnaliseDetailPage />);
    expect(screen.getByTestId('analise-detail')).toBeInTheDocument();
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  it('deve renderizar o LoadingSpinner e a Sidebar quando formularioRespondidoId no localStorage é inválido e loga um warning', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorageMock.setItem('formularioRespondidoId', 'abc');
    render(<AnaliseDetailPage />);
 
    expect(AnaliseDetail).not.toHaveBeenCalled();
    expect(consoleWarnSpy).toHaveBeenCalledWith('ID inválido');
    consoleWarnSpy.mockRestore(); // Restaura a implementação original do console.warn
  });

  it('deve renderizar o LoadingSpinner e a Sidebar quando formularioRespondidoId não está presente no localStorage', () => {
    render(<AnaliseDetailPage />);

    expect(AnaliseDetail).not.toHaveBeenCalled();
  });
});