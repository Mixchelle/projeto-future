import { render, screen, fireEvent } from '@testing-library/react';
import FloatingSocialMenu from '@/components/FloatingSocialMenu';
import { describe, it, expect } from "vitest";

describe('FloatingSocialMenu', () => {
  it('deve renderizar o botão flutuante corretamente', () => {
    // Renderiza o componente
    render(<FloatingSocialMenu />);

    // Verifica se o botão flutuante está presente e com o texto "+"
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('+');
  });

  it('deve alternar entre "+" e "×" ao clicar no botão', () => {
    render(<FloatingSocialMenu />);

    const button = screen.getByRole('button');
    
    // Inicialmente, o texto do botão é "+"
    expect(button).toHaveTextContent('+');
    
    // Simula o clique no botão
    fireEvent.click(button);
    
    // Após o clique, o texto do botão deve ser "×"
    expect(button).toHaveTextContent('×');
    
    // Simula o clique novamente para verificar o retorno ao estado inicial
    fireEvent.click(button);
    expect(button).toHaveTextContent('+');
  });

  it('deve exibir as redes sociais quando o menu estiver aberto', () => {
    render(<FloatingSocialMenu />);

    const button = screen.getByRole('button');

    // Clica para abrir o menu
    fireEvent.click(button);

    // Verifica se o menu com as redes sociais está sendo exibido
    const menu = screen.getByText('Nossas Redes');
    expect(menu).toBeInTheDocument();

    // Verifica se os links das redes sociais estão sendo exibidos
    const redes = [
      'Instagram', 'YouTube', 'Site', 'Facebook', 'LinkedIn'
    ];
    redes.forEach(rede => {
      expect(screen.getByText(rede)).toBeInTheDocument();
    });
  });

  it('deve ter links corretos para as redes sociais', () => {
    render(<FloatingSocialMenu />);

    // Abre o menu de redes sociais
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Verifica se os links estão corretos
    const instagramLink = screen.getByText('Instagram').closest('a');
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/futuretechbr/');
    
    const youtubeLink = screen.getByText('YouTube').closest('a');
    expect(youtubeLink).toHaveAttribute('href', 'https://www.youtube.com/channel/UCWajNYhJCLLm6efWmUKOjNg');
    
    const siteLink = screen.getByText('Site').closest('a');
    expect(siteLink).toHaveAttribute('href', 'https://future.com.br/');
    
    const facebookLink = screen.getByText('Facebook').closest('a');
    expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/futureonface');
    
    const linkedinLink = screen.getByText('LinkedIn').closest('a');
    expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/company/futuretechnologiesbr');
  });
});
