import { renderHook, act } from '@testing-library/react';
import { useExample } from '@/hooks/useExample'; // ajusta o caminho conforme seu projeto
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useExample', () => {
  it('deve inicializar com estado nulo', () => {
    const { result } = renderHook(() => useExample());
    expect(result.current.state).toBeNull();
  });

  it('deve atualizar o estado corretamente', () => {
    const { result } = renderHook(() => useExample());

    act(() => {
      result.current.setState('novo valor');
    });

    expect(result.current.state).toBe('novo valor');
  });
});
