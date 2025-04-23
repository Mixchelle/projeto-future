import { render } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import Home from '@/app/page';
import { useRouter } from 'next/navigation';

// Mock do useRouter
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('Home Page', () => {
  const push = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as vi.Mock).mockReturnValue({ push });

    // Limpando localStorage mockado
    global.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('redireciona para /gestor quando o usuário é gestor', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ role: 'gestor' }));

    render(<Home />);

    expect(push).toHaveBeenCalledWith('/gestor');
  });

  it('redireciona para /analista quando o usuário é funcionario', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ role: 'funcionario' }));

    render(<Home />);

    expect(push).toHaveBeenCalledWith('/analista');
  });

  it('redireciona para /cliente quando o usuário é cliente', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ role: 'cliente' }));

    render(<Home />);

    expect(push).toHaveBeenCalledWith('/cliente');
  });

  it('redireciona para /login se não houver token', () => {
    localStorage.removeItem('token');
    localStorage.setItem('user', JSON.stringify({ role: 'cliente' }));

    render(<Home />);

    expect(push).toHaveBeenCalledWith('/login');
  });

  it('redireciona para /login se user for inválido', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', 'invalid-json');

    render(<Home />);

    expect(push).toHaveBeenCalledWith('/login');
  });

  it('redireciona para /cliente quando o usuário é subcliente', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify({ role: 'subcliente' }));

    render(<Home />);

    expect(push).toHaveBeenCalledWith('/cliente');
  });

});
