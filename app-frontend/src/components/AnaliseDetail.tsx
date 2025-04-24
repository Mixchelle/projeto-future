// src/app/funcionario/analises/page.tsx
"use client";

import { useState, useEffect } from 'react';
import styles from './analises.module.css';
import Sidebar from "@/components/Sidebar";
import { FiHome, FiBarChart2, FiFileText, FiPlus, FiX, FiEdit2 } from "react-icons/fi";
import useAvaliacao from "@/hooks/useAvaliacao";
import useRecomendacoes from "@/hooks/useRecomendacoes";
import NistCsfTable from '@/components/NistTable';
import RadarNistCsf from "@/components/RadarNistCsf";
import { agruparPorCategoria } from '@/util/subCategorias';
import FormularioRecomendacao from './FormularioRecomendacao';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FiCheck, FiAlertCircle, FiSave } from "react-icons/fi";
import { useFormulario } from '@/hooks/useFormulario';
import React from 'react';

interface AnaliseDetailProps {
  empresaId: string;
}

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

export default function AnaliseDetail({ empresaId }: AnaliseDetailProps) {
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
    impacto: "",
    gravidade: "",
    meses: "1",
  });

  const [formularioRespondidoId, setFormularioRespondidoId] = useState<number>(Number(empresaId));
  const { data, loading, error } = useAvaliacao(formularioRespondidoId);
  const { 
    recomendacoes, 
    recomendacoesPorCategoria,
    adicionarRecomendacao, 
    atualizarRecomendacao,
    removerRecomendacao 
  } = useRecomendacoes();
  const [mostrarModalPendencia, setMostrarModalPendencia] = useState(false);
  const [categoriaPendente, setCategoriaPendente] = useState([]);
  const [observacoesPendencia, setObservacoesPendencia] = useState("");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const ordemCategorias = ["GV", "ID", "PR", "DE", "RS", "RC"];
  const [clienteName, setClienteName]= useState<string | null>(null);
  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditarRecomendacao = (recomendacao: any) => {
    setEditandoRecomendacao(recomendacao);
    setFormData({
      nome: recomendacao.nome,
      categoria: recomendacao.categoria, // Mantém o formato existente
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
      impacto: recomendacao.impacto,
      gravidade: recomendacao.gravidade,
      meses: recomendacao.meses.toString(),
    });
    setMostrarFormulario(recomendacao.categoria);
  };


  const handleColocarEmPendencia = async () => {
    if (!categoriaPendente || !observacoesPendencia.trim()) {
      alert("Selecione uma categoria e descreva a pendência");
      return;
    }
  
    try {
      // Aqui você implementaria a chamada API para atualizar o status
      console.log("Colocando em pendência:", {
        categoria: categoriaPendente,
        observacoes: observacoesPendencia
      });

      colocarEmPendencia(formularioRespondidoId,  categoriaPendente, observacoesPendencia)
      
      // Fechar modal e limpar campos
      setMostrarModalPendencia(false);
      setCategoriaPendente([""]);
      setObservacoesPendencia("");
      alert("Formulário colocado em pendência com sucesso!");
    } catch (error) {
      console.error("Erro ao colocar em pendência:", error);
      alert("Erro ao processar pendência");
    }
  };
  
  const handleMarcarComoConcluido = async () => {
    if (confirm("Tem certeza que deseja marcar esta análise como concluída?")) {
      try {
        // Implemente a chamada API para atualizar o status para "concluido"
        console.log("Marcando como concluído");
        alert("Análise concluída com sucesso!");
      } catch (error) {
        console.error("Erro ao concluir análise:", error);
        alert("Erro ao concluir análise");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria || !formData.nist) {
      alert('Preencha os campos obrigatórios: Nome, Categoria e NIST');
      return;
    }

    try {
      if (editandoRecomendacao) {
        await atualizarRecomendacao(editandoRecomendacao.id, formData);
        setEditandoRecomendacao(null);
      } else {
        await adicionarRecomendacao(formData);
      }
      
      setFormData({
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
        impacto: "",
        gravidade: "",
        meses: "1",
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
    const form = JSON.parse(localStorage.getItem("formularioAnaliseCompleto") || '{}');
    const clienteName = form.nome_cliente;
  if(clienteName){
  setClienteName(clienteName)
  }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 flex-1 flex main-content">
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
      <div className="flex min-h-screen bg-gray-100 flex-1 flex main-content">
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
      <div className="flex min-h-screen bg-gray-100 flex-1 flex main-content">
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
      <main className={`flex main-content ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
        <div className="container-avaliacao">
        <div className={styles.tituloPagina}>
        <div className="header-actions">
  <h3>Análise de Cybersegurança - {clienteName}</h3>
  <div className="flex btns" >
    <button 
      onClick={() => setMostrarModalPendencia(true)}
      className="btn btn-warning"
    >
      <FiAlertCircle /> Pendência
    </button>
    <button 
      onClick={() => console.log("Salvando...")}
      className="btn btn-primary"
    >
      <FiSave /> Salvar
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
            setCategoriaPendente("");
            setObservacoesPendencia("");
          }}
          className="btn btn-cancel"
        >
          Cancelar
        </button>
        <button 
          onClick={handleColocarEmPendencia}
          disabled={!categoriaPendente || !observacoesPendencia.trim()}
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
              <span>Visualização da performance de todas as subcategorias com base no framework NIST CSF</span><br/>
              <div className="container mx-auto p-4">
                <div className="graficos">
                  <RadarNistCsf />
                  <NistCsfTable />
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.card} mb-6`}>
            <h4 className={styles.tituloSecao}>Avaliação por Categorias</h4>
            <p className="mb-4">Médias de performance por categoria principal</p>
            
            <table className={styles.tabelaestilo}>
              <thead>
                <tr>
                  <td>Categoria</td>
                  <td>Média</td>
                  <td>Política</td>
                  <td>Pratica</td>
                  <td>Objetivo</td>
                  <td>Status</td>
                </tr>
              </thead>
              <tbody>
                {data.categorias.map((cat) => (
                  <tr key={cat.sigla}>
                    <td>{cat.categoria} ({cat.sigla})</td>
                    <td>{cat.media.toFixed(2)}</td>
                    <td>{cat.politica.toFixed(2)}</td>
                    <td>{cat.pratica.toFixed(2)}</td>
                    <td>{cat.objetivo.toFixed(2)}</td>
                    <td>{cat.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {Object.entries(subcategoria || {}).sort(([siglaA], [siglaB]) => {
            const indexA = ordemCategorias.indexOf(siglaA);
            const indexB = ordemCategorias.indexOf(siglaB);
            return indexA - indexB;
          }).map(([sigla, subcategorias]) => {
            const categoria = data.categorias.find(c => c.sigla === sigla);
            if (!categoria) return null;

            return (
              <div key={sigla} className={`${styles.card} mb-6`}>
                <h4 className={styles.tituloSecao}>{categoria.categoria} ({sigla})</h4>
                <h4 className="mb-4">Avaliação detalhada das subcategorias</h4>

                <table className={styles.tabelaestilo}>
                  <thead>
                    <tr>
                      <td>ID</td>
                      <td>Subcategoria</td>
                      <td>Política</td>
                      <td>Prática</td>
                      <td>Objetivo</td>
                    </tr>
                  </thead>
                  <tbody>
                    {subcategorias.map((sub) => (
                      <React.Fragment key={sub.id}>
                        <tr className="cursor-pointer" onClick={() => toggleRow(sub.id)}>
                          <td>
                            <button className='button-icone' title={expandedRows[sub.id] ? 'Recolher' : 'Expandir'}>
                              {expandedRows[sub.id] ? '➖' : '➕'}
                            </button> 
                            {sub.id}
                          </td>
                          <td>{sub.subcategoria}</td>
                          <td>{sub.politica?.toFixed(2) || '-'}</td>
                          <td>{sub.pratica?.toFixed(2) || '-'}</td>
                          <td>{sub.objetivo?.toFixed(2) || '-'}</td>
                        </tr>

                        {expandedRows[sub.id] && (
                          <tr>
                            <td colSpan={5}>
                              <table className={`${styles.tabelaestilo} w-full mt-2`}>
                                <thead>
                                  <tr>
                                    <td>ID</td>
                                    <td>Pergunta</td>
                                    <td>Política</td>
                                    <td>Prática</td>
                                    <td>Objetivo</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sub.perguntas?.map((p: any) => (
                                    <tr key={p.id}>
                                      <td>{p.id}</td>
                                      <td>{p.subcategoria}</td>
                                      <td>{p.politica}</td>
                                      <td>{p.pratica}</td>
                                      <td>{p.objetivo}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>

                {/* Seção de Recomendações */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold mb-4">Recomendações</h4>
                  
<button
          className={styles.toggleBtn}
          onClick={() => {
            setFormData(prev => ({
              ...prev,
              categoria: categoria.categoria + " (" + sigla + ")" // Pré-preenche a categoria
            }));
            setMostrarFormulario(mostrarFormulario === sigla ? null : sigla);
          }}
        >
          {mostrarFormulario === sigla ? (
            <>
              <FiX className="inline mr-2" /> Cancelar
            </>
          ) : (
            <>
              <FiPlus className="inline mr-2" /> Adicionar Recomendação
            </>
          )}
        </button>

        {recomendacoesPorCategoria[categoria.categoria]?.length > 0 ? (
  <table className="custom-table">
    <thead>
      <tr>
        <th>Nome</th>
        <th>Prioridade</th>
        <th>Tecnologia</th>
        <th>NIST</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {recomendacoesPorCategoria[categoria.categoria].map((rec: any) => (
        <tr key={rec.id}>
          <td>{rec.nome}</td>
          <td>
            <span className={`tag ${rec.prioridade}`}>
              {rec.prioridade_display}
            </span>
          </td>
          <td>{rec.tecnologia}</td>
          <td>{rec.nist}</td>
          <td>
            <div className="action-buttons">
              <button onClick={() => handleEditarRecomendacao(rec)} className="edit-btn">
                <FiEdit2 />
              </button>
              <button onClick={() => removerRecomendacao(rec.id)} className="delete-btn">
                <FiX />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p className="no-data">Nenhuma recomendação cadastrada para esta categoria.</p>
)}


                  {mostrarFormulario === sigla && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <FormularioRecomendacao
 formData={{ 
  ...formData, 
  categoria: categoria.categoria + " (" + sigla + ")" // Formato: "Governar (GV)"
}}                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}