// src/components/AnaliseDetail.tsx
"use client";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import styles from './analises.module.css'; // Certifique-se de que o seu CSS está neste caminho
import Sidebar from "@/components/Sidebar";
import { FiHome, FiBarChart2, FiFileText, FiPlus, FiX, FiEdit2, FiCheck, FiAlertCircle, FiSave, FiCheckCircle, FiCircle } from "react-icons/fi";
import useAvaliacao from "@/hooks/useAvaliacao";
import useRecomendacoes from "@/hooks/useRecomendacoes";
import NistCsfTable from '@/components/NistTable';
import RadarNistCsf from "@/components/RadarNistCsf";
import { agruparPorCategoria } from '@/util/subCategorias';
import FormularioRecomendacao from './FormularioRecomendacao'; // Mantenha a importação se o formulário ainda for gerenciado aqui ou se PerguntaCard o importar
import ErrorMessage from '@/components/ErrorMessage';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useFormulario } from '@/hooks/useFormulario';
import React from 'react';
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { filterPerguntasByScore } from '@/util/filterPerguntas'; // Importe a função de utilidade

export interface FormDataType {
  nome: string;
  categoria: string;
  tecnologia: string;
  nist: string;
  prioridade: string;
  data_inicio: string;
  data_fim: string;
  meses: string;
  detalhes: string;
  investimentos: string;
  riscos: string;
  justificativa: string;
  observacoes: string;
  urgencia: string;
  gravidade: string;
  perguntaId: string;
}
// Importar o novo componente da tabela detalhada
import SubcategoryDetailTable from './SubcategoryDetailTable';


interface AnaliseDetailProps {
  empresaId: string;
}

// Interfaces podem ser movidas para um arquivo de tipos se forem usadas em múltiplos lugares
interface Subcategoria {
  perguntas: any;
  subcategoria: string;
  id: string;
  nome: string;
  media: number;
  politica: number;
  pratica: number;
  objetivo: number;
  status: string;
}

interface Categoria {
    sigla: string;
    categoria: string;
    media: number;
    politica: number;
    pratica: number;
    objetivo: number;
    status: string;
}


export default function AnaliseDetail({ empresaId }: AnaliseDetailProps) {
  const isSidebarCollapsed = useSidebarCollapsed();

  // Estados principais mantidos em AnaliseDetail
  const [mostrarFormulario, setMostrarFormulario] = useState<string | null>(null);
  const [subcategoria, setSubcategoria] = useState<Record<string, Subcategoria[]> | null>(null);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
  const [editandoRecomendacao, setEditandoRecomendacao] = useState<any>(null);
  const { colocarEmPendencia } = useFormulario();
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    tecnologia: "",
    nist: "",
    prioridade: "",
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
    meses: "1",
    perguntaId: "" ,
  });
  const[ progressoTotal, setProgressoTotal] = useState(20);
  const [formularioRespondidoId, setFormularioRespondidoId] = useState<number>(Number(empresaId));
  const { data, loading, error } = useAvaliacao(formularioRespondidoId); // data.categorias e data.subcategorias
  const {
    recomendacoes,
    // recomendacoesPorCategoria, // Removido se não usado
    adicionarRecomendacao,
    atualizarRecomendacao,
    removerRecomendacao
  } = useRecomendacoes();
  const [mostrarModalPendencia, setMostrarModalPendencia] = useState(false);
  const [categoriaPendente, setCategoriaPendente] = useState<string[]>([]);
  const [observacoesPendencia, setObservacoesPendencia] = useState("");
  const [filterLowScoresOnly, setFilterLowScoresOnly] = useState<{ [key: string]: boolean }>({}); // Estado do filtro por subcategoria

  // const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Removido se não usado
  const ordemCategorias = ["GV", "ID", "PR", "DE", "RS", "RC"];
  const [clienteName, setClienteName]= useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>("GV");


  // --- Função para alternar a expansão da linha e definir o filtro ---
  const toggleRow = (id: string) => {
    setExpandedRows(prev => {
      const isCurrentlyExpanded = !!prev[id];
      const newExpandedState = {
         ...prev,
         [id]: !isCurrentlyExpanded,
      };

      // Se a linha está sendo expandida (de false para true)
      if (!isCurrentlyExpanded) {
        // Define o filtro padrão para mostrar apenas notas baixas para esta subcategoria
        setFilterLowScoresOnly(prevFilter => ({
          ...prevFilter,
          [id]: true // true significa "filtrar, mostrar apenas notas baixas"
        }));
      }
       // Opcional: Se quiser resetar o filtro ao recolher, descomente abaixo
       /*
       else {
          setFilterLowScoresOnly(prevFilter => {
             const newState = { ...prevFilter };
             delete newState[id];
             return newState;
          });
       }
       */

      return newExpandedState;
    });
  };

  // Função para atualizar o estado de filtro Low Scores Only
  const handleFilterLowScoresOnlyChange = (subcategoryId: string, filterState: boolean) => {
     setFilterLowScoresOnly(prevFilter => ({
        ...prevFilter,
        [subcategoryId]: filterState
     }));
     console.log("Filter state for subcategory", subcategoryId, "changed to", filterState);
  };


  const handlerTab = (sigla: string) => {
    setActiveTab(sigla);
    console.log('Mudando aba para:', sigla);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditarRecomendacao = (recomendacao: any) => {
    setEditandoRecomendacao(recomendacao);
    setFormData({
      nome: recomendacao.nome,
      categoria: recomendacao.categoria,
      tecnologia: recomendacao.tecnologia,
      nist: recomendacao.nist,
      prioridade: recomendacao.prioridade,
      responsavel: recomendacao.responsavel || "",
      data_inicio: recomendacao.data_inicio,
      data_fim: recomendacao.data_fim,
      detalhes: recomendacao.detalhes,
      investimentos: recomendacao.investimentos,
      riscos: recomendacao.riscos,
      justificativa: recomendacao.justificativa,
      observacoes: recomendacao.observacoes,
      urgencia: recomendacao.impacto,
      gravidade: recomendacao.gravidade,
      meses: recomendacao.meses.toString(),
      perguntaId: recomendacao.perguntaId || ""
    });
    // Quando editar, mostre o formulário na pergunta correta
    setMostrarFormulario(recomendacao.perguntaId);
  };

   const handleCancelForm = () => {
       setMostrarFormulario(null);
       setEditandoRecomendacao(null);
       // Opcional: Limpar formData ao cancelar
       setFormData({
           nome: "", categoria: "", tecnologia: "", nist: "", prioridade: "",
           responsavel: "", data_inicio: "", data_fim: "", detalhes: "",
           investimentos: "", riscos: "", justificativa: "", observacoes: "",
           urgencia: "", gravidade: "", meses: "1", perguntaId: ""
       });
   };


  const handleColocarEmPendencia = async () => {
    if (categoriaPendente.length === 0 || !observacoesPendencia.trim()) {
      alert("Selecione uma categoria e descreva a pendência");
      return;
    }

    try {
      await colocarEmPendencia(formularioRespondidoId, categoriaPendente, observacoesPendencia)

      setMostrarModalPendencia(false);
      setCategoriaPendente([]);
      setObservacoesPendencia("");
      alert("Formulário colocado em pendência com sucesso!");
    } catch (error) {
      console.error("Erro ao colocar em pendência:", error);
      alert("Erro ao processar pendência");
    }
  };

  // Função handleMarcarComoConcluido (mantida)
  const handleMarcarComoConcluido = async () => {
    if (confirm("Tem certeza que deseja marcar esta análise como concluída?")) {
      try {
        console.log("Marcando como concluído");
        // Implementar lógica de conclusão aqui
        alert("Análise concluída com sucesso!");
      } catch (error) {
        console.error("Erro ao concluir análise:", error);
        alert("Erro ao concluir análise");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.categoria || !formData.nist || !formData.perguntaId) {
      alert('Preencha os campos obrigatórios: Nome, Categoria, NIST e selecione a Pergunta');
      return;
    }

    try {
      if (editandoRecomendacao) {
        await atualizarRecomendacao(editandoRecomendacao.id, formData);
        setEditandoRecomendacao(null);
      } else {
        await adicionarRecomendacao(formData);
      }

      // Limpa o formulário e esconde
      setFormData({
        nome: "", categoria: "", tecnologia: "", nist: "", prioridade: "",
        responsavel: "", data_inicio: "", data_fim: "", detalhes: "",
        investimentos: "", riscos: "", justificativa: "", observacoes: "",
        urgencia: "", gravidade: "", meses: "1", perguntaId: ""
      });
      setMostrarFormulario(null);
    } catch (error) {
      console.error("Erro ao enviar recomendação:", error);
    }
  };

  useEffect(() => {
    if (data?.subcategorias) {
      const subcategoriasAgrupadas = agruparPorCategoria(data.subcategorias);
      setSubcategoria(subcategoriasAgrupadas);
    } else {
      setSubcategoria({});
    }
  }, [data]);

  useEffect(() => {
    if (empresaId) {
      const parsedId = Number(empresaId);
      if (!isNaN(parsedId)) {
        setFormularioRespondidoId(parsedId);
      }
    }
  }, [empresaId]);

  useEffect(() => {
    // Buscar o nome do cliente do localStorage
    const form = JSON.parse(localStorage.getItem("formularioAnaliseCompleto") || '{}');
    const name = form.nome_cliente;
    if(name){
        setClienteName(name);
    }
  }, []); // Removida a dependência [clienteName] para buscar apenas uma vez

  // Função para obter as subcategorias da aba ativa (usada para passar para o componente da tabela)
  const getSubcategoriasAtivas = () => {
    if (!subcategoria || !activeTab) return [];
    return subcategoria[activeTab] || [];
  };

  // Função para obter as recomendações da aba ativa (usada para passar para o componente da tabela)
  const getRecomendacoesAtivas = () => {
     if (!recomendacoes || !activeTab) return [];
     // Filtra as recomendações pela sigla da categoria ativa
     // Adapte esta lógica se a 'categoria' na recomendação não for apenas a sigla
     return recomendacoes.filter(rec => rec.categoria.includes(`(${activeTab})`));
  };
  const [categoriasCompletas, setCategoriasCompletas] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (!data) return;
  
    const completas: Record<string, boolean> = {};
  
    data.categorias.forEach((categoria) => {
      const subcats = data.subcategorias[categoria.sigla] || [];
  
      // Verifica se TODAS têm info_complementar (ajuste a lógica conforme seus dados)
      const todasCompletas = subcats.every((sub) => {
        // Aqui você pode ajustar o campo de validação, se for outro
        return sub.perguntas && sub.perguntas.length > 0 && sub.perguntas.some((p: any) => p?.resposta?.info_complementar);
      });
  
      completas[categoria.sigla] = todasCompletas;
    });
  
    setCategoriasCompletas(completas);
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 flex-1 main-content">
        <Sidebar
          menuItems={[
            { name: "Home", icon: <FiHome size={20} />, path: "/analista" },
            { name: "Análises", icon: <FiBarChart2 size={20} />, path: "/analista/analises" },
            { name: "Relatórios", icon: <FiFileText size={20} />, path: "/analista/relatorios" }
          ]}
        />
        <div className="flex justify-center items-center w-full h-full">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100 flex-1 main-content">
        <Sidebar
          menuItems={[
            { name: "Home", icon: <FiHome size={20} />, path: "/analista" },
            { name: "Análises", icon: <FiBarChart2 size={20} />, path: "/analista/analises" },
            { name: "Relatórios", icon: <FiFileText size={20} />, path: "/analista/relatorios" }
          ]}
        />
        <div className="flex justify-center items-center w-full h-full">
          <ErrorMessage message={`Erro: ${error}`} type="error" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen bg-gray-100 flex-1 main-content">
        <Sidebar
          menuItems={[
            { name: "Home", icon: <FiHome size={20} />, path: "/analista" },
            { name: "Análises", icon: <FiBarChart2 size={20} />, path: "/analista/analises" },
            { name: "Relatórios", icon: <FiFileText size={20} />, path: "/analista/relatorios" }
          ]}
        />
        <div className="flex justify-center items-center w-full h-full">
          <ErrorMessage message="Nenhum dado disponível" type="info" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex analise">
      <Sidebar
        menuItems={[
          { name: "Home", icon: <FiHome size={20} />, path: "/analista" },
          { name: "Análises", icon: <FiBarChart2 size={20} />, path: "/analista/analises" },
          { name: "Relatórios", icon: <FiFileText size={20} />, path: "/analista/relatorios" }
        ]}
      />
      {/* isSidebarOpen não está sendo usado, mantido por compatibilidade com o código original */}
      <main className={`${isSidebarCollapsed ? "main-content-collapsed" : "main-content"}`}>
        <div className="container-avaliacao">
          <div className="tituloPagina">
            <div className="header-actions">
              <h4>Análise de Cybersegurança <span>{clienteName}</span></h4>
              <div className="headerButtons">

                <button
                  onClick={() => setMostrarModalPendencia(true)}
                  className="btn-pendencia"
                >
                  <FiAlertCircle /> Pendência
                </button>
                <button
                  onClick={() => console.log("Salvando...")} // Implemente a lógica de salvar aqui
                  className="btn-finalizar"
                >
                  <FiSave /> Finalizar
                </button>
              </div>
            </div>
          </div>

          {mostrarModalPendencia && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Adicionar Pendência</h3>
                </div>

                <div className="modal-body">
                  <div className="categorias-container">
                    <label className="title">Categoria com Pendência</label>
                    <div className="categorias-list">
                      {data.categorias.map((cat) => (
                        <label key={cat.sigla} className="categoria-item">
                          <input
                            type="checkbox"
                            value={cat.sigla}
                            checked={categoriaPendente.includes(cat.sigla)}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (categoriaPendente.includes(value)) {
                                setCategoriaPendente(categoriaPendente.filter((v) => v !== value));
                              } else {
                                setCategoriaPendente([...categoriaPendente, value]);
                              }
                            }}
                          />
                          <span>{cat.categoria} ({cat.sigla})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Descrição da Pendência</label>
                    <textarea
                      value={observacoesPendencia}
                      onChange={(e) => setObservacoesPendencia(e.target.value)}
                      placeholder="Descreva detalhadamente o que precisa ser corrigido..."
                      className="modal-textarea"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    onClick={() => {
                      setMostrarModalPendencia(false);
                      setCategoriaPendente([]);
                      setObservacoesPendencia("");
                    }}
                    className="btn btn-cancel"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleColocarEmPendencia}
                    disabled={categoriaPendente.length === 0 || !observacoesPendencia.trim()}
                    className="btn btn-confirm"
                  >
                    Confirmar Pendência
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={`${styles.card} mb-6`}>
            <h4 className={styles.tituloSecao}>Análise de Performance por Subcategoria</h4>
            <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="container mx-auto p-4">
                <div className="graficos">
                  <RadarNistCsf />
                  <NistCsfTable />
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Avaliação por Categorias (Mantida inline ou componentizada separadamente) */}
          <div className={`${styles.card} mb-6`}>
            <h4 className={styles.tituloSecao}>Avaliação por Categorias</h4>
            <p className="mb-4">Médias de performance por categoria principal</p>

            <table className={styles.tabelaestilo}>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Média</th>
                  <th>Política</th>
                  <th>Prática</th>
                  <th>Objetivo</th>

                </tr>
              </thead>
              <tbody>
                {data?.categorias?.map((cat) => (
                  <tr key={cat?.sigla}>
                    <td>{cat?.categoria} ({cat?.sigla})</td>
                    <td className={cat?.media !== null && cat?.media < 3 ? styles.notaBaixa : styles.notaAlta}>{cat?.media?.toFixed(2)}</td>
                    <td className={cat?.politica !== null && cat?.politica < 3 ? styles.notaBaixa : styles.notaAlta}>{cat?.politica?.toFixed(2)}</td>
                    <td className={cat?.pratica !== null && cat?.pratica < 3 ? styles.notaBaixa : styles.notaAlta}>{cat?.pratica?.toFixed(2)}</td>
                    <td>{cat?.objetivo?.toFixed(2)}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          <div className="progresso-container">
          <div className="progresso-header">
    <span className="progresso-title">Progresso geral</span>
    <span className="progresso-contador">
      {recomendacoes.length}/{recomendacoes.length} 
      </span>
   </div>
  
  <div className="barra-progresso">
    <div
      className="progresso-preenchido"
      style={{ width: `${progressoTotal}%` }}
    ></div>
  </div>
  
  <div className="progresso-percentual">
    {Math.round(progressoTotal)}% concluído
  </div>
          </div>
          {/* --- Seção com Abas para Categorias Detalhadas --- */}
          <div className={`${styles.card} mb-6`}>
              <h4 className={styles.tituloSecao}>Avaliação Detalhada por Categorias</h4>

              {/* Container das Abas */}
              <div className="tabContainer">
                  {ordemCategorias.map(sigla => {
                      const categoria = data.categorias.find(c => c.sigla === sigla);
                      if (!categoria) return null;
                      const completa = false;

                      return (
                          <button
                              key={sigla}
                              className={`tabButton ${activeTab === sigla ? 'activeTab' : ''}`}
                              onClick={() => handlerTab(sigla)}
                          >
         {categoria.categoria} ({sigla}){' '}
            {completa ? (
              <FiCheckCircle className="ml-2" />
            ) : (
              <FiCircle className="ml-2 text-gray-400" />
            )}                      </button>
                      );
                  })}
              </div>

              {/* Conteúdo da Aba Ativa - Usando o novo componente da tabela */}
              <div className='tabContent'>
                  {activeTab && data?.categorias && data.categorias.length > 0 && (
                      <div key={activeTab}>
                          <h4 className="mb-4">{data.categorias.find(c => c.sigla === activeTab)?.categoria} ({activeTab})</h4>

                          {/* Renderiza o componente da tabela detalhada */}
                          <SubcategoryDetailTable
                              subcategories={getSubcategoriasAtivas()} // Passa as subcategorias da aba ativa
                              recomendacoes={getRecomendacoesAtivas()} // Passa as recomendações da aba ativa
                              expandedRows={expandedRows}
                              filterLowScoresOnly={filterLowScoresOnly}
                              mostrarFormulario={mostrarFormulario}
                              editandoRecomendacao={editandoRecomendacao}
                              formData={formData}
                              activeTab={activeTab}
                              categoriasData={data.categorias} // Passa os dados das categorias para contexto do formulário
                              onToggleRow={toggleRow} // Passa o handler do pai
                              onFilterLowScoresOnlyChange={handleFilterLowScoresOnlyChange} // Passa o novo handler do pai
                              onHandleEditarRecomendacao={handleEditarRecomendacao} // Passa o handler do pai
                              onRemoverRecomendacao={removerRecomendacao} // Passa o handler do pai
                              onSetMostrarFormulario={setMostrarFormulario} // Passa o setter do pai
                              onSubmitForm={handleSubmit} // Passa o handler do pai
                              onInputChangeForm={handleInputChange} // Passa o handler do pai
                              onCancelForm={handleCancelForm} // Passa o handler do pai
                              onSetFormData={setFormData} // Passa o setter do pai
                          />
                      </div>
                  )}
                   {/* Mensagem se não houver categorias ou subcategorias */}
                  {activeTab && (!data?.categorias || data.categorias.length === 0) && (
                     <p className="text-center text-gray-500">Dados de categorias não disponíveis.</p>
                  )}
                   {activeTab && data?.categorias.find(c => c.sigla === activeTab) && getSubcategoriasAtivas().length === 0 && (
                       <p className="text-center text-gray-500">Nenhuma subcategoria disponível para esta categoria.</p>
                   )}
              </div>
          </div>

        </div>
      </main>
    </div>
  );
}