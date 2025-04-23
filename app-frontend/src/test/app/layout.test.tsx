import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import RootLayout from '@/app/layout';

describe('RootLayout', () => {
  it('renderiza corretamente os filhos e aplica classes no body', () => {
    const { getByText } = render(
      <RootLayout>
        <div>Conteúdo de teste</div>
      </RootLayout>
    );

    // Verifica se o conteúdo foi renderizado
    expect(getByText('Conteúdo de teste')).toBeInTheDocument();

    // Verifica se as classes foram aplicadas no body
    expect(document.body).toHaveClass('bg-brown-500');
    expect(document.body).toHaveClass('text-white');
  });
});
