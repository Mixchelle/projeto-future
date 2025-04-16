"use client";
import React from "react";
import { FiCheck } from "react-icons/fi";

interface QuestionMapProps {
  perguntas: Array<{
    id: number;
    codigo: string;
    questao: string;
  }>;
  respostas: Record<number, {
    politica?: string;
    pratica?: string;
  }>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
}

const QuestionMap: React.FC<QuestionMapProps> = ({
  perguntas,
  respostas,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}) => {
  return (
    <div className="question-map-container">
      {perguntas.map((pergunta, index) => {
        const respondida = respostas[pergunta.id]?.politica && respostas[pergunta.id]?.pratica;
        const isCurrent = currentQuestionIndex === index;
        
        return (
          <button
            key={pergunta.id}
            onClick={() => setCurrentQuestionIndex(index)}
            className={`question-dot ${
              isCurrent ? 'current' : respondida ? 'answered' : 'unanswered'
            }`}
            title={`${pergunta.codigo}: ${pergunta.questao.substring(0, 30)}${pergunta.questao.length > 30 ? '...' : ''}`}
            aria-label={`Questão ${index + 1}: ${pergunta.codigo}`}
          >
            {respondida && !isCurrent ? (
              <FiCheck className="check-icon" aria-hidden="true" />
            ) : (
              index + 1
            )}
          </button>
        );
      })}
    </div>
  );
};

export default QuestionMap;