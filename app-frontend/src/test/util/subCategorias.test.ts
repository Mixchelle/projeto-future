// Arquivo de teste: utils.test.ts
import { describe, it, expect } from "vitest";
import { getDescricaoSubcategoria, agruparPorCategoria, subcategorias } from "@/util/subCategorias";  // Ajuste o caminho conforme necessário

describe('getDescricaoSubcategoria', () => {
  it('deve retornar a descrição correta para uma sigla válida', () => {
    const resultado = getDescricaoSubcategoria('GV.OC');
    expect(resultado).toBe('Contexto organizacional GV.OC');
  });

  it('deve retornar uma mensagem de erro quando a sigla não for encontrada', () => {
    const resultado = getDescricaoSubcategoria('XYZ');
    expect(resultado).toBe('XYZnao achei');
  });
});

describe('agruparPorCategoria', () => {
  it('deve agrupar os itens corretamente por categoria', () => {
    const resultado = agruparPorCategoria(subcategorias);

    // Verificando se as categorias estão presentes no resultado
    expect(resultado.GV).toBeDefined();
    expect(resultado.ID).toBeDefined();
    expect(resultado.PR).toBeDefined();
    expect(resultado.DE).toBeDefined();
    expect(resultado.RS).toBeDefined();
    expect(resultado.RC).toBeDefined();

    // Verificando se as subcategorias estão agrupadas corretamente
    expect(resultado.GV.length).toBe(6); // Espera 6 itens para GV
    expect(resultado.ID.length).toBe(4); // Espera 4 itens para ID
  });

  it('deve retornar um objeto vazio se não houver dados', () => {
    const resultado = agruparPorCategoria({});
    expect(resultado).toEqual({});
  });
});
