import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FormularioRecomendacao from "@/components/FormularioRecomendacao";
import { describe, it, expect, vi } from "vitest";

// Mock para os dados do formulário
const mockFormData = {
  nome: "",
  categoria: "",
  tecnologia: "",
  nist: "",
  prioridade: "baixa",
  responsavel: "",
  data_inicio: "",
  data_fim: "",
  detalhes: "",
  investimentos: "",
  riscos: "",
  justificativa: "",
  observacoes: "",
  urgencia: "",
  gravidade: "",
  meses: "",
};

// Função mock para a mudança dos dados no formulário
const mockOnChange = vi.fn();

// Função mock para o envio do formulário
const mockOnSubmit = vi.fn();

describe('FormularioRecomendacao', () => {

  it('deve chamar a função onChange quando um campo for alterado', () => {
    render(
      <FormularioRecomendacao
        formData={mockFormData}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const nomeInput = screen.getByPlaceholderText('Ex: Criptografia e Proteção de Dados');
    fireEvent.change(nomeInput, { target: { value: 'Novo nome do projeto' } });

    expect(mockOnChange).toHaveBeenCalled();
  });


  it('deve preencher o campo "Nome" corretamente', () => {
    render(
      <FormularioRecomendacao
        formData={{ ...mockFormData, nome: 'Criptografia e Proteção de Dados' }}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const nomeInput = screen.getByPlaceholderText('Ex: Criptografia e Proteção de Dados');
    expect(nomeInput).toHaveValue('Criptografia e Proteção de Dados');
  });



  it('deve exibir as opções de NIST baseadas na categoria selecionada', () => {
    const subcategorias = {
      "Governar (GV)": [{ id: "GV.RM", sigla: "GV.RM" }],
    };

    render(
      <FormularioRecomendacao
        formData={{ ...mockFormData, categoria: "Governar (GV)" }}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
        subcategorias={subcategorias}
      />
    );

    const nistInput = screen.getByPlaceholderText('EX. GV.RM');
    expect(nistInput).toBeInTheDocument();
    fireEvent.change(nistInput, { target: { value: 'GV.RM' } });
    expect(mockOnChange).toHaveBeenCalled();
  });



  it('deve preencher o campo "Meses" corretamente', () => {
    render(
      <FormularioRecomendacao
        formData={{ ...mockFormData, meses: '12' }}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const mesesInput = screen.getByPlaceholderText('Ex: 6');
    expect(mesesInput).toHaveValue('12');
  });

  it('deve preencher o campo "Investimentos previstos" corretamente', () => {
    render(
      <FormularioRecomendacao
        formData={{ ...mockFormData, investimentos: 'R$500,00' }}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const investimentosInput = screen.getByPlaceholderText('Ex: R$500,00');
    expect(investimentosInput).toHaveValue('R$500,00');
  });

  it('deve preencher os campos de descrição, riscos, justificativa e observações corretamente', () => {
    render(
      <FormularioRecomendacao
        formData={{
          ...mockFormData,
          detalhes: 'Descrição detalhada do projeto',
          riscos: 'Riscos envolvidos',
          justificativa: 'Justificativa para recomendação',
          observacoes: 'Observações adicionais',
        }}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const descricaoTextarea = screen.getByPlaceholderText('Detalhes do projeto');
    const riscosTextarea = screen.getByPlaceholderText('Riscos envolvidos');
    const justificativaTextarea = screen.getByPlaceholderText('Justificativa da recomendação');
    const observacoesTextarea = screen.getByPlaceholderText('Observações adicionais');

    expect(descricaoTextarea).toHaveValue('Descrição detalhada do projeto');
    expect(riscosTextarea).toHaveValue('Riscos envolvidos');
    expect(justificativaTextarea).toHaveValue('Justificativa para recomendação');
    expect(observacoesTextarea).toHaveValue('Observações adicionais');
  });


});
