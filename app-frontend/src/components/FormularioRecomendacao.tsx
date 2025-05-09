import React from "react";

interface FormData {
  nome: string;
  categoria: string;
  tecnologia: string;
  nist: string;
  prioridade: string;
  responsavel: string;
  data_inicio: string;
  data_fim: string;
  detalhes: string;
  investimentos: string;
  riscos: string;
  justificativa: string;
  observacoes: string;
  urgencia: string;
  gravidade: string;
  meses: string;
  perguntaId?: string;
}

interface Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  subcategorias?: Record<string, any[]>;
  isEditing?: boolean;
  onCancel: () => void;
}

const FormularioRecomendacao: React.FC<Props> = ({ formData, onChange, onSubmit, subcategorias, isEditing, onCancel }) => {
  const opcoesCategoria = [
    "Governar (GV)",
    "Identificar (ID)",
    "Proteger (PR)",
    "Detectar (DE)",
    "Responder (RS)",
    "Recuperar (RC)"
  ];
  const urgenciaGravidadeOpcoes = ["1", "2", "3", "4", "5"]; // Renomeado para clareza

  const siglaCategoria = formData.categoria ? formData.categoria.match(/\((.*?)\)/)?.[1] : null;

  const nistOpcoes = siglaCategoria && subcategorias?.[siglaCategoria]
    ? subcategorias[siglaCategoria].map((sub) => sub.sigla || sub.id)
    : [];


  return (
    <form data-testid="form-recomendacao" onSubmit={onSubmit} className="form-recomendacao">
      <h1 className="form-titulo">{isEditing ? 'Editar Recomendação' : 'Adicionar Nova Recomendação'}</h1>
      <input
        type="text"
        name="nome"
        placeholder="Ex: Criptografia e Proteção de Dados"
        value={formData.nome}
        onChange={onChange}
        required
        className="form-input-nome"
      />
      <div className="form-grid">
        <div className="form-group">
          <h2 className="form-subtitulo">Categoria</h2>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={onChange}
            required
            className="form-input"
          >
            <option value="">Selecione a categoria</option>
            {opcoesCategoria.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <h2 className="form-subtitulo">CODIGO</h2>
          <input
            type="text"
            name="perguntaId"
            value={formData.perguntaId || ''}
            onChange={onChange}
            required
            className="form-input"
            placeholder="EX. GV.RM.1"
            disabled={!!formData.perguntaId && !isEditing}
            title={!!formData.perguntaId && !isEditing ? "O ID da pergunta não pode ser alterado após a seleção inicial" : ""}
          />
        </div>
        <div className="form-group">
          <h2 className="form-subtitulo">NIST Referência</h2>
           <input
            type="text"
            name="nist"
            value={formData.nist}
            onChange={onChange}
            required
            className="form-input"
            placeholder="EX. GV.RM"
             list="nist-options-ref"
          />
           <datalist id="nist-options-ref">
               {nistOpcoes.map((option) => (
                   <option key={option} value={option} />
               ))}
           </datalist>
        </div>
        <div className="form-group">
          <h2 className="form-subtitulo">Tecnologia e Fabricante</h2>
          <input
            type="text"
            name="tecnologia"
            placeholder="Ex: Agnóstico"
            value={formData.tecnologia}
            onChange={onChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <h2 className="form-subtitulo">Prioridade</h2>
          <select
            name="prioridade"
            value={formData.prioridade}
            onChange={onChange}
            className="form-input"
          >
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div className="form-group">
          {/* Rótulo alterado de Impacto para Urgencia */}
          <h2 className="form-subtitulo">Urgencia</h2>
          <select
            name="urgencia" // Atributo name alterado de 'impacto' para 'urgencia'
            value={formData.urgencia} // Usando o campo 'urgencia' do formData
            onChange={onChange}
            className="form-input"
          >
            <option value="">Selecione a urgencia</option>
            {urgenciaGravidadeOpcoes.map((n) => ( // Usando a lista de opções
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <h2 className="form-subtitulo">Gravidade</h2>
          <select
            name="gravidade"
            value={formData.gravidade}
            onChange={onChange}
            className="form-input"
          >
            <option value="">Selecione a gravidade</option>
            {urgenciaGravidadeOpcoes.map((n) => ( // Usando a lista de opções
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <h2 className="form-subtitulo">Data Início</h2>
          <input
            type="date"
            name="data_inicio"
            value={formData.data_inicio}
            onChange={onChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <h2 className="form-subtitulo">Data Fim</h2>
          <input
            type="date"
            name="data_fim"
            value={formData.data_fim}
            onChange={onChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <h2 className="form-subtitulo">Meses Estimados</h2>
          <input
            type="number"
            name="meses"
            placeholder="Ex: 6"
            value={formData.meses}
            onChange={onChange}
            required
            className="form-input"
            min="0"
          />
        </div>
        <div className="form-group">
          <h2 className="form-subtitulo">Responsável</h2>
          <input
            type="text"
            name="responsavel"
            placeholder="Ex: TI/SI"
            value={formData.responsavel}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <h2 className="form-subtitulo">Investimentos Previstos</h2>
          <input
            type="text"
            name="investimentos"
            placeholder="Ex: R$500,00"
            value={formData.investimentos}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>
      </div>

      <div className="form-detalhes">
        <h2 className="form-titulo-secao">Detalhes da Recomendação</h2>
        <div className="form-group">
          <h2 className="form-subtitulo">Descrição Detalhada</h2>
          <textarea
            name="detalhes"
            placeholder="Descreva detalhadamente a recomendação e suas etapas"
            value={formData.detalhes}
            onChange={onChange}
            className="form-textarea"
          />
        </div>
        <div className="form-textarea-group">
          <h3 className="form-subtitulo">Riscos Envolvidos na Implementação</h3>
          <textarea
            name="riscos"
            placeholder="Quais os riscos ao implementar esta recomendação?"
            value={formData.riscos}
            onChange={onChange}
            className="form-textarea"
          />
        </div>
        <div className="form-textarea-group">
          <h3 className="form-subtitulo">Justificativa e Benefícios Esperados</h3>
          <textarea
            name="justificativa"
            placeholder="Por que esta recomendação é importante? Quais benefícios trará?"
            value={formData.justificativa}
            onChange={onChange}
            className="form-textarea"
          />
        </div>
        <div className="form-textarea-group">
          <h3 className="form-subtitulo">Observações Adicionais</h3>
          <textarea
            name="observacoes"
            placeholder="Alguma observação extra ou contexto?"
            value={formData.observacoes}
            onChange={onChange}
            className="form-textarea"
          />
        </div>
      </div>

      <div className="form-botoes">
          <button
            type="button"
            onClick={onCancel}
            className="form-botao form-botao-cancelar"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="form-botao form-botao-salvar"
            id="form-botao-recomendacao"
          >
             {isEditing ? 'Salvar Edição' : 'Salvar Recomendação'}
          </button>
      </div>
    </form>
  );
};

export default FormularioRecomendacao;