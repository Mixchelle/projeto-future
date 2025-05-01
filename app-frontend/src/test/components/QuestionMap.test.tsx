import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QuestionMap from "@/components/QuestionMap";

// Mock de dados para perguntas e respostas
const perguntasMock = [
  { id: 1, codigo: "Q1", questao: "Questão 1" },
  { id: 2, codigo: "Q2", questao: "Questão 2" },
  { id: 3, codigo: "Q3", questao: "Questão 3" },
];

const respostasMock = {
  1: { politica: "Sim", pratica: "Sim" },
  2: { politica: "Sim", pratica: "Sim" },
};

describe('QuestionMap', () => {
  it('deve renderizar todos os botões de questões corretamente', () => {
    render(
      <QuestionMap
        perguntas={perguntasMock}
        respostas={respostasMock}
        currentQuestionIndex={0}
        setCurrentQuestionIndex={vi.fn()}
      />
    );

    // Verifica se os botões com as questões estão na tela
    perguntasMock.forEach((pergunta) => {
      expect(screen.getByLabelText(`Questão ${pergunta.id}: ${pergunta.codigo}`)).toBeInTheDocument();
    });
  });

  it('deve alterar o índice da questão atual ao clicar em um botão', () => {
    const setCurrentQuestionIndex = vi.fn();
    
    render(
      <QuestionMap
        perguntas={perguntasMock}
        respostas={respostasMock}
        currentQuestionIndex={0}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />
    );
    
    // Clica no botão da segunda questão
    fireEvent.click(screen.getByLabelText('Questão 2: Q2'));
    
    // Verifica se a função setCurrentQuestionIndex foi chamada com o índice correto
    expect(setCurrentQuestionIndex).toHaveBeenCalledWith(1);
  });


  
  it('deve mostrar o texto correto nas questões não respondidas', () => {
    render(
      <QuestionMap
        perguntas={perguntasMock}
        respostas={respostasMock}
        currentQuestionIndex={2}
        setCurrentQuestionIndex={vi.fn()}
      />
    );
    
    // Verifica se o número da questão é exibido corretamente para questões não respondidas
    expect(screen.getByText("3")).toBeInTheDocument(); // Questão 3
  });


  it('deve mostrar um ícone de check para questões respondidas', () => {
    render(
      <QuestionMap
        perguntas={perguntasMock}
        respostas={respostasMock}
        currentQuestionIndex={1}
        setCurrentQuestionIndex={vi.fn()}
      />
    );
    
    // Verifica se o ícone de check está presente para questões respondidas
    expect(screen.getByRole('button', { name: /Questão 1: Q1/i })).toContainHTML('<svg'); // Verifica se o ícone de check está presente no botão da questão 1
    expect(screen.getByText("2")).toBeInTheDocument(); // Questão 2 (não respondida)
  });
});
