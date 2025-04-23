// __tests__/hooks/useLogin.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useLogin } from '@/hooks/useLogin';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";

vi.mock('axios');
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('useLogin', () => {
  const mockPush = vi.fn();
  const mockSetItem = vi.fn();

  beforeEach(() => {
    (useRouter as vi.Mock).mockReturnValue({ push: mockPush });
    vi.stubGlobal('localStorage', {
      setItem: mockSetItem,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('faz login com sucesso e redireciona com base na role', async () => {
    const mockResponse = {
      data: {
        access: 'token-de-acesso',
        refresh: 'token-de-refresh',
        user: { id: 1, name: 'Michelle', role: 'gestor' },
      },
    };

    (axios.post as vi.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useLogin());

    await act(() =>
      result.current.login('michelle@example.com', 'senha123')
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.token).toBe('token-de-acesso');
    expect(result.current.user).toEqual({ id: 1, name: 'Michelle', role: 'gestor' });

    expect(mockSetItem).toHaveBeenCalledWith('token', 'token-de-acesso');
    expect(mockSetItem).toHaveBeenCalledWith('refreshToken', 'token-de-refresh');
    expect(mockSetItem).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.data.user));
    expect(mockPush).toHaveBeenCalledWith('/gestor');
  });

  it('exibe mensagem de erro ao falhar o login', async () => {
    (axios.post as vi.Mock).mockRejectedValueOnce({
      response: { data: { detail: 'Credenciais inválidas' } },
    });

    const { result } = renderHook(() => useLogin());

    await act(() =>
      result.current.login('invalido@example.com', 'errada')
    );

    expect(result.current.error).toBe('Credenciais inválidas');
    expect(result.current.loading).toBe(false);
    expect(mockPush).not.toHaveBeenCalled();
  });
  it('redireciona gestor para /gestor', async () => {
    (axios.post as vi.Mock).mockResolvedValueOnce({
      data: {
        access: 'token',
        refresh: 'refresh',
        user: { id: 1, name: 'Gestor', role: 'gestor' },
      },
    });
  
    const { result } = renderHook(() => useLogin());
    await act(() => result.current.login('a@a.com', '123'));
  
    expect(mockPush).toHaveBeenCalledWith('/gestor');
  });
  
  it('redireciona funcionario para /analista', async () => {
    (axios.post as vi.Mock).mockResolvedValueOnce({
      data: {
        access: 'token',
        refresh: 'refresh',
        user: { id: 2, name: 'Funcionario', role: 'funcionario' },
      },
    });
  
    const { result } = renderHook(() => useLogin());
    await act(() => result.current.login('b@b.com', '123'));
  
    expect(mockPush).toHaveBeenCalledWith('/analista');
  });
  
  it('redireciona cliente para /cliente', async () => {
    (axios.post as vi.Mock).mockResolvedValueOnce({
      data: {
        access: 'token',
        refresh: 'refresh',
        user: { id: 3, name: 'Cliente', role: 'cliente' },
      },
    });
  
    const { result } = renderHook(() => useLogin());
    await act(() => result.current.login('c@c.com', '123'));
  
    expect(mockPush).toHaveBeenCalledWith('/cliente');
  });
  
  it('redireciona subcliente para /cliente', async () => {
    (axios.post as vi.Mock).mockResolvedValueOnce({
      data: {
        access: 'token',
        refresh: 'refresh',
        user: { id: 4, name: 'Subcliente', role: 'subcliente' },
      },
    });
  
    const { result } = renderHook(() => useLogin());
    await act(() => result.current.login('d@d.com', '123'));
  
    expect(mockPush).toHaveBeenCalledWith('/cliente');
  });
  
  it('redireciona role indefinido para /cliente (default)', async () => {
    (axios.post as vi.Mock).mockResolvedValueOnce({
      data: {
        access: 'token',
        refresh: 'refresh',
        user: { id: 5, name: 'Outro', role: 'indefinido' },
      },
    });
  
    const { result } = renderHook(() => useLogin());
    await act(() => result.current.login('e@e.com', '123'));
  
    expect(mockPush).toHaveBeenCalledWith('/cliente');
  });
  it('deve exibir erro quando a requisição de login falha', async () => {
    const mockError = { response: { data: { detail: 'Credenciais inválidas' } } };
    (axios.post as vi.Mock).mockRejectedValueOnce(mockError);
  
    const { result } = renderHook(() => useLogin());
    await act(() => result.current.login('wrong@wrong.com', 'wrongpassword'));
  
    // Verifica se o erro foi setado corretamente
    expect(result.current.error).toBe('Credenciais inválidas');
  });
  
});
