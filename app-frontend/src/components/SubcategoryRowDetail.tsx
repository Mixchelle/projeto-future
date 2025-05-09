// src/components/SubcategoryRowDetail.tsx
import React from 'react';
import PerguntaCard from './PerguntaCard';
import { filterPerguntasByScore } from '@/util/filterPerguntas'; // Importe a função de utilidade

// Importe seus estilos CSS Modules se SubcategoryRowDetail tiver estilos específicos
// import styles from './SubcategoryRowDetail.module.css'; // Exemplo

interface SubcategoryRowDetailProps {
  sub: any; // Ajuste o tipo conforme a estrutura real da sua subcategoria
  recomendacoes: any[]; // Recomendações para a aba ativa (filtradas no pai)
  filterLowScoresOnly: boolean; // Estado do filtro para esta subcategoria
  mostrarFormulario: string | null;
  editandoRecomendacao: any;
  formData: any;
  activeTab: string;
  categoriasData: any[]; // Dados das categorias (para contexto no formulário)

  // Funções de interação
  onFilterLowScoresOnlyChange: (subcategoryId: string, filterState: boolean) => void;
  onHandleEditarRecomendacao: (recomendacao: any) => void;
  onRemoverRecomendacao: (id: string) => void;
  onSetMostrarFormulario: (perguntaId: string | null) => void;
  onSubmitForm: (e: React.FormEvent) => Promise<void>;
  onInputChangeForm: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCancelForm: () => void;
   onSetFormData: (data: any) => void; // Função para atualizar o formData no pai
}

const SubcategoryRowDetail: React.FC<SubcategoryRowDetailProps> = ({
  sub,
  recomendacoes,
  filterLowScoresOnly,
  mostrarFormulario,
  editandoRecomendacao,
  formData,
  activeTab,
  categoriasData,
  onFilterLowScoresOnlyChange,
  onHandleEditarRecomendacao,
  onRemoverRecomendacao,
  onSetMostrarFormulario,
  onSubmitForm,
  onInputChangeForm,
  onCancelForm,
  onSetFormData
}) => {

  // Filtra as perguntas usando a função de utilidade e o estado local do filtro
  const perguntasVisiveis = filterPerguntasByScore(sub.perguntas || [], filterLowScoresOnly);

  return (
    <tr>
      {/* Colspan precisa abranger todas as colunas da tabela principal da subcategoria */}
      <td colSpan={5}> {/* Ajuste o colspan conforme o número de colunas da tabela pai */}
        <div className="perguntas-container">
          {/* Adicionar o toggle para o filtro */}
 {/* Este div agora usará a classe 'filter-options' com estilos CSS puros */}
 <div className="filter-options">
            {/* Este label agora usará a classe 'toggle-container' com estilos CSS puros */}
            <label className="toggle-container">
              <input
                type="checkbox"
                // Marcado quando o filtro de "notas baixas" está DESATIVADO (mostrar todas)
                checked={!filterLowScoresOnly}
                onChange={(e) => {
                  // Chama a função do pai para atualizar o estado de filtro para esta subcategoria
                  onFilterLowScoresOnlyChange(sub.id, !e.target.checked);
                }}
                className="toggle-checkbox" // Classe para esconder o checkbox
              />
              {/* ESTE É O ELEMENTO QUE VAMOS ESTILIZAR COMO SWITCH */}
              <span className="toggle-slider"></span>

              {/* O texto */}
              <span className="toggle-text">Mostrar Todas as Perguntas</span>

            </label>
      </div>

          {/* Mapeia sobre as perguntas VISÍVEIS */}
          {perguntasVisiveis?.map((pergunta: any) => {
            // Filtra as recomendações para esta pergunta específica
            const recomendacoesDaPerguntaAtual = recomendacoes.filter(
              rec => rec.perguntaId === pergunta.id
            );
            console.log('Recomendações encontradas:', recomendacoesDaPerguntaAtual);

            return (
              <PerguntaCard
                key={pergunta.id}
                pergunta={pergunta}
                recomendacoes={recomendacoesDaPerguntaAtual}
                mostrarFormulario={mostrarFormulario}
                editandoRecomendacao={editandoRecomendacao}
                formData={formData}
                activeTab={activeTab}
                categoriasData={categoriasData}
                onHandleEditarRecomendacao={onHandleEditarRecomendacao}
                onRemoverRecomendacao={onRemoverRecomendacao}
                onSetMostrarFormulario={onSetMostrarFormulario}
                onSubmitForm={onSubmitForm}
                onInputChangeForm={onInputChangeForm}
                onCancelForm={onCancelForm}
                onSetFormData={onSetFormData} // Passa a função para atualizar formData
                onViewRecomendacao={function (recomendacao: any): void {
                  throw new Error('Function not implemented.');
                } } onViewAnexos={function (perguntaId: string, anexos:  undefined): void {
                  throw new Error('Function not implemented.');
                } }              />
            );
          })}

          {/* Mensagem se não houver perguntas visíveis após a filtragem */}
          {perguntasVisiveis?.length === 0 && (
            <p className="text-center text-gray-500">
              {filterLowScoresOnly
               ? "Nenhuma pergunta com Política ou Prática abaixo de 3 nesta subcategoria."
               : "Nenhuma pergunta disponível nesta subcategoria."}
            </p>
          )}
        </div>
      </td>
    </tr>
  );
};

export default SubcategoryRowDetail;