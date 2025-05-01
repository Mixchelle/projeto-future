import { render, screen, fireEvent } from '@testing-library/react';
import ErrorMessage from '@/components/ErrorMessage';
import { describe, it, expect, vi } from 'vitest';

describe('ErrorMessage', () => {
  it('deve renderizar corretamente a mensagem de erro', () => {
    render(<ErrorMessage message="Algo deu errado!" />);

    const message = screen.getByText('Algo deu errado!');
    expect(message).toBeInTheDocument();
  });


  it('deve renderizar com estilo de warning quando type="warning"', async () => {
    render(<ErrorMessage message="Atenção!" type="warning" />);
    
    const container = screen.getByTestId('error-message-container');
    expect(container).toHaveClass('warning');
    expect(container).not.toHaveClass('error');
    expect(container).not.toHaveClass('info');
  });
  it('deve renderizar com estilo de warning quando type="warning"', () => {
    render(<ErrorMessage message="Atenção!" type="warning" />);
    
    const container = screen.getByTestId('error-message-container');
    expect(container).toHaveClass('warning');
    expect(container).not.toHaveClass('error');
    expect(container).not.toHaveClass('info');
  });

  // Test 3: Render with info type
  it('deve renderizar com estilo de info quando type="info"', () => {
    render(<ErrorMessage message="Informação importante" type="info" />);
    
    const container = screen.getByTestId('error-message-container');
    expect(container).toHaveClass('info');
  });

  // Test 4: Check if icon is rendered
  it('deve renderizar o ícone de alerta', () => {
    render(<ErrorMessage message="Com ícone" />);
    
    const icon = screen.getByTestId('error-message-icon');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe('svg'); // Verifica se é um ícone do react-icons
  });

  // Test 5: Render with retry button and click handler
  it('deve renderizar botão de tentar novamente e chamar onRetry quando clicado', () => {
    const mockRetry = vi.fn();
    render(<ErrorMessage message="Erro" onRetry={mockRetry} />);
    
    const retryButton = screen.getByTestId('error-message-retry-button');
    expect(retryButton).toBeInTheDocument();
    expect(retryButton).toHaveTextContent('Tentar novamente');
    
    fireEvent.click(retryButton);
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  // Test 6: Check if retry button has correct class based on type
  it('deve aplicar classes corretas ao botão de retry baseado no type', () => {
    const { rerender } = render(<ErrorMessage message="Teste" type="error" onRetry={() => {}} />);
    let retryButton = screen.getByTestId('error-message-retry-button');
    expect(retryButton).toHaveClass('error');
    
    rerender(<ErrorMessage message="Teste" type="warning" onRetry={() => {}} />);
    retryButton = screen.getByTestId('error-message-retry-button');
    expect(retryButton).toHaveClass('warning');
    
    rerender(<ErrorMessage message="Teste" type="info" onRetry={() => {}} />);
    retryButton = screen.getByTestId('error-message-retry-button');
    expect(retryButton).toHaveClass('info');
  });

  // Test 7: Check if custom className is applied
  it('deve aplicar className personalizado ao container', () => {
    render(<ErrorMessage message="Teste" className="custom-class" />);
    
    const container = screen.getByTestId('error-message-container');
    expect(container).toHaveClass('custom-class');
  });

  // Test 8: Verify accessibility attributes
  it('deve ter atributos de acessibilidade corretos', () => {
    render(<ErrorMessage message="Teste acessibilidade" />);
    
    const icon = screen.getByTestId('error-message-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
