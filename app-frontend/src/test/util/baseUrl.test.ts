// Arquivo de teste: baseUrl.test.ts
import { describe, it, expect } from "vitest";

import { getBaseUrl } from "@/util/baseUrl";

describe('getBaseUrl', () => {
  it('deve retornar a URL definida em NEXT_PUBLIC_API_URL', () => {
    // Configura a variável de ambiente para um valor específico
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
    
    const baseUrl = getBaseUrl();
    
    expect(baseUrl).toBe('https://api.example.com');
  });

  it('deve retornar a URL padrão quando NEXT_PUBLIC_API_URL não estiver definida', () => {
    // Remove a variável de ambiente, garantindo que ela não esteja definida
    delete process.env.NEXT_PUBLIC_API_URL;
    
    const baseUrl = getBaseUrl();
    
    expect(baseUrl).toBe('http://localhost:8000');
  });
});
