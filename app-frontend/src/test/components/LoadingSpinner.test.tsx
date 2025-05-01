import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "@/components/LoadingSpinner";


describe('LoadingSpinner', () => {
  it('deve renderizar corretamente o componente', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument(); 
  });
});
