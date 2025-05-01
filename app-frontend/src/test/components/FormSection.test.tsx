import { render, screen } from '@testing-library/react';
import FormSection from '@/components/FormSection';
import { describe, it, expect, vi } from "vitest";

describe('FormSection', () => {
  it('deve renderizar corretamente o título e o conteúdo', () => {
    const title = 'Título da Seção';
    const content = 'Conteúdo da seção aqui';

    // Renderiza o componente FormSection com título e conteúdo
    render(
      <FormSection title={title}>
        <p>{content}</p>
      </FormSection>
    );

    // Verifica se o título está sendo renderizado corretamente
    expect(screen.getByText(title)).toBeInTheDocument();

    // Verifica se o conteúdo está sendo renderizado corretamente
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('deve renderizar um título em negrito', () => {
    const title = 'Título da Seção';

    // Renderiza o componente FormSection
    render(
      <FormSection title={title}>
        <p>Conteúdo de teste</p>
      </FormSection>
    );

    // Verifica se o título está com a classe de negrito (font-semibold)
    const titleElement = screen.getByText(title);
    expect(titleElement).toHaveClass('font-semibold');
  });
});
