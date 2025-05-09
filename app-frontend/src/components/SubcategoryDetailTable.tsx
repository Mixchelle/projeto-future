// src/components/SubcategoryDetailTable.tsx
import React from 'react';
import SubcategoryRowDetail from './SubcategoryRowDetail';
// Importe seus estilos CSS Modules
import styles from './analises.module.css'; // Assumindo que os estilos da tabela estão aqui

interface SubcategoryDetailTableProps {
  subcategories: any[]; // Subcategorias para a aba ativa
  recomendacoes: any[]; // Recomendações para a aba ativa
  expandedRows: { [key: string]: boolean };
  filterLowScoresOnly: { [key: string]: boolean };
  mostrarFormulario: string | null;
  editandoRecomendacao: any;
  formData: any;
  activeTab: string;
  categoriasData: any[]; // Dados das categorias (do data?.categorias)

  // Funções de interação
  onToggleRow: (id: string) => void;
  onFilterLowScoresOnlyChange: (subcategoryId: string, filterState: boolean) => void;
  onHandleEditarRecomendacao: (recomendacao: any) => void;
onRemoverRecomendacao: (id: string | number) => void;
  onSetMostrarFormulario: (perguntaId: string | null) => void;
  onSubmitForm: (e: React.FormEvent) => Promise<void>;
  onInputChangeForm: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCancelForm: () => void;
   onSetFormData: (data: any) => void; // Função para atualizar o formData no pai
}

const SubcategoryDetailTable: React.FC<SubcategoryDetailTableProps> = ({
  subcategories,
  recomendacoes,
  expandedRows,
  filterLowScoresOnly,
  mostrarFormulario,
  editandoRecomendacao,
  formData,
  activeTab,
  categoriasData,
  onToggleRow,
  onFilterLowScoresOnlyChange,
  onHandleEditarRecomendacao,
  onRemoverRecomendacao,
  onSetMostrarFormulario,
  onSubmitForm,
  onInputChangeForm,
  onCancelForm,
  onSetFormData
}) => {
  return (
    <table className={styles.tabelaestilo}> {/* Use os estilos da tabela */}
      <thead>
        <tr>
          <th>ID</th>
          <th>Subcategoria</th>
          <th>Política</th>
          <th>Prática</th>
          <th>Objetivo</th>
          {/* Pode adicionar um cabeçalho para ações futuras se necessário */}
        </tr>
      </thead>
      <tbody>
        {subcategories.map((sub) => (
          <React.Fragment key={sub.id}>
            <tr className="cursor-pointer" onClick={() => onToggleRow(sub.id)}>
              <td>
                <button className='buttonIcone' title={expandedRows[sub.id] ? 'Recolher' : 'Expandir'}>
                  {expandedRows[sub.id] ? '➖' : '➕'}
                </button>
                {sub.id}
              </td>
              {/* Aplicando estilos nas células da subcategoria */}
              <td className={sub.media !== null && sub.media < 3 ? styles.notaBaixa : styles.notaAlta}>{sub.subcategoria}</td>
              <td className={sub.politica !== null && sub.politica < 3 ? styles.notaBaixa : styles.notaAlta}>{sub.politica?.toFixed(2) || '-'}</td>
              <td className={sub.pratica !== null && sub.pratica < 3 ? styles.notaBaixa : styles.notaAlta}>{sub.pratica?.toFixed(2) || '-'}</td>
              <td>{sub.objetivo?.toFixed(2) || '-'}</td>
            </tr>

            {/* Renderiza o detalhe da linha expandida se estiver expandida */}
            {expandedRows[sub.id] && (
              <SubcategoryRowDetail
                sub={sub}
                // Passa as recomendações já filtradas no pai para esta aba
                recomendacoes={recomendacoes}
                // Passa o estado de filtro específico para esta subcategoria
                filterLowScoresOnly={filterLowScoresOnly[sub.id] !== false} // Default true (filtrar)
                mostrarFormulario={mostrarFormulario}
                editandoRecomendacao={editandoRecomendacao}
                formData={formData}
                activeTab={activeTab}
                categoriasData={categoriasData}
                onFilterLowScoresOnlyChange={onFilterLowScoresOnlyChange}
                onHandleEditarRecomendacao={onHandleEditarRecomendacao}
                onRemoverRecomendacao={onRemoverRecomendacao}
                onSetMostrarFormulario={onSetMostrarFormulario}
                onSubmitForm={onSubmitForm}
                onInputChangeForm={onInputChangeForm}
                onCancelForm={onCancelForm}
                onSetFormData={onSetFormData}
              />
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default SubcategoryDetailTable;