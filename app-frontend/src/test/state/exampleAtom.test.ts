import { describe, it, expect } from "vitest";
import { atom } from "jotai";
import { createStore } from "jotai/vanilla";
import { exampleAtom } from "@/state/exampleAtom"; // Ajuste o caminho conforme necessário

describe('exampleAtom', () => {
  it('deve ter valor inicial nulo', () => {
    const store = createStore();
    const value = store.get(exampleAtom);
    expect(value).toBeNull(); // Verifica se o valor inicial é null
  });

  it('deve atualizar o valor corretamente', () => {
    const store = createStore();
    store.set(exampleAtom, "novo valor"); // Atualiza o valor do atom
    const value = store.get(exampleAtom);
    expect(value).toBe("novo valor"); // Verifica se o valor foi atualizado
  });
});
