// Arquivo de teste: dateUtils.test.ts
import { describe, it, expect } from "vitest";
import { formatDate } from "@/util/dateUtils";

describe('formatDate', () => {
  it('deve formatar corretamente uma data', () => {
    const date = new Date('2025-04-22T15:30:00Z'); // Data exemplo
    const formattedDate = formatDate(date);
    
    expect(formattedDate).toBe('2025-04-22');
  });

  it('deve lidar com uma data sem horário', () => {
    const date = new Date('2025-04-22'); // Data sem horário
    const formattedDate = formatDate(date);
    
    expect(formattedDate).toBe('2025-04-22');
  });

  it('deve formatar corretamente com fuso horário diferente', () => {
    const date = new Date('2025-04-22T15:30:00-03:00'); // Data com fuso horário -3
    const formattedDate = formatDate(date);
    
    expect(formattedDate).toBe('2025-04-22');
  });
});
