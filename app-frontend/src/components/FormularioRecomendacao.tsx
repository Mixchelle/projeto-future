import React from "react";

interface FormData {
  nome: string;
  categoria: string;
  tecnologia: string;
  nist: string;
  prioridade: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
  detalhes: string;
  investimentos: string;
  riscos: string;
  justificativa: string;
  observacoes: string;
  impacto: string;
  gravidade: string;
  Meses: string;
}

interface Props {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  subcategorias?: Record<string, any[]>;
}

const FormularioRecomendacao: React.FC<Props> = ({ formData, onChange, onSubmit, subcategorias }) => {
  const opcoesCategoria = ["Governança", "Identificação", "Proteção", "Detecção", "Resposta", "Recuperação"];
  const impactoGravidadeOpcoes = ["1", "2", "3", "4", "5"];

  const nistOpcoes = formData.categoria && subcategorias?.[formData.categoria]
    ? subcategorias[formData.categoria].map((sub) => sub.sigla || sub.id)
    : [];

  return (
    <form onSubmit={onSubmit} className="form-recomendacao">
      <h1 className="form-titulo">Nome do Projeto</h1>
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
  <h2 className="form-subtitulo">NIST</h2>
  <input
    type="text"
    name="nist"
    list="nist-options"
    value={formData.nist}
    onChange={onChange}
    required
    className="form-input"
    placeholder="EX. GV.RM"
  />
  <datalist id="nist-options">
    {nistOpcoes.map((sigla) => (
      <option key={sigla} value={sigla} />
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
          <h2 className="form-subtitulo">Impacto</h2>
          <select
            name="impacto"
            value={formData.impacto}
            onChange={onChange}
            className="form-input"
          >
            <option value="">Selecione o impacto</option>
            {impactoGravidadeOpcoes.map((n) => (
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
            {impactoGravidadeOpcoes.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>



    

        <div className="form-group">
          <h2 className="form-subtitulo">Data Início</h2>
          <input
            type="date"
            name="dataInicio"
            value={formData.dataInicio}
            onChange={onChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <h2 className="form-subtitulo">Data Fim</h2>
          <input
            type="date"
            name="dataFim"
            value={formData.dataFim}
            onChange={onChange}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <h2 className="form-subtitulo">Meses</h2>
          <input
            type="text"
            name="responsavel"
            placeholder="Ex: 6"
            value={formData.Meses}
            onChange={onChange}
            required
            className="form-input"
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
          <h2 className="form-subtitulo">Investimentos previstos</h2>
          <input
            type="text"
            name="responsavel"
            placeholder="Ex: R$500,00"
            value={formData.investimentos}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>
       
      

        
      </div>

      <div className="form-detalhes">
        <h2 className="form-titulo-secao">Detalhes do projeto</h2>
        <div className="form-group">
          <h2 className="form-subtitulo">Descrição do projeto</h2>
          <textarea
            name="detalhes"
            placeholder="Detalhes do projeto"
            value={formData.detalhes}
            onChange={onChange}
            className="form-input"
          />
        </div>


        <div className="form-textarea-group">
          <h3 className="form-subtitulo">Riscos envolvidos</h3>
          <textarea
            name="riscos"
            placeholder="Riscos envolvidos"
            value={formData.riscos}
            onChange={onChange}
            className="form-textarea"
          />
        </div>

        <div className="form-textarea-group">
          <h3 className="form-subtitulo">Justificativa da recomendação</h3>
          <textarea
            name="justificativa"
            placeholder="Justificativa da recomendação"
            value={formData.justificativa}
            onChange={onChange}
            className="form-textarea"
          />
        </div>

        <div className="form-textarea-group">
          <h3 className="form-subtitulo">Observações adicionais</h3>
          <textarea
            name="observacoes"
            placeholder="Observações adicionais"
            value={formData.observacoes}
            onChange={onChange}
            className="form-textarea"
          />
        </div>
      </div>

      <button
        type="submit"
        className="form-botao"
      >
        Salvar Recomendação
      </button>
    </form>
  );
};

export default FormularioRecomendacao;