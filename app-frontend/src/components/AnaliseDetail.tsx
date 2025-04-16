

// src/app/analista/analises/page.tsx
"use client";

import { useState, useEffect } from 'react';
import styles from './analises.module.css';
import Sidebar from "@/components/Sidebar";
import { FiHome, FiBarChart2, FiFileText, FiPlus, FiX, FiEdit2, FiFileText as FiReport } from "react-icons/fi";
import useAvaliacao from "@/hooks/useAvaliacao";
import useRecomendacoes from "@/hooks/useRecomendacoes";
import NistCsfTable from '@/components/NistTable';
import RadarNistCsf from "@/components/RadarNistCsf";
import { agruparPorCategoria } from '@/util/subCategorias';
import FormularioRecomendacao from './FormularioRecomendacao';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingSpinner from '@/components/LoadingSpinner';


interface AnaliseDetailProps {
  empresaId: string;
}

interface Subcategoria {
  id: number;
  subcategoria: string;
  politica?: number;
  pratica?: number;
  objetivo: number;
}


export default function AnaliseDetail({ empresaId }: AnaliseDetailProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState<string | null>(null);
  const [subcategoria, setSubcategoria] = useState<any>(null);

  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    tecnologia: "",
    nist: "",
    prioridade: "",
    responsavel: "",
    dataInicio: "",
    dataFim: "",
    detalhes: "",
    investimentos: "",
    riscos: "",
    justificativa: "",
    observacoes: "",
  impacto: "",
  gravidade: "",
  Meses: "",
  });

  // Convertendo o ID para número (Next.js passa como string)
  const [formularioRespondidoId, setFormularioRespondidoId] = useState<number>(Number(empresaId));
  const { data, loading, error } = useAvaliacao(formularioRespondidoId);
  const { recomendacoes, adicionarRecomendacao, removerRecomendacao } = useRecomendacoes();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  console.log("Dados da avaliação:", data);
  console.log('subcategorias:', data?.subcategorias);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (data?.subcategorias) {
      const subcategoriasAgrupadas = agruparPorCategoria(data.subcategorias);
      console.log("Subcategorias agrupadas:", subcategoriasAgrupadas);
      setSubcategoria(subcategoriasAgrupadas);
    } else {
      console.log("Subcategorias não encontradas:", data);
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
  
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarRecomendacao(formData);
    setFormData({
      nome: "",
      categoria: "",
      tecnologia: "",
      nist: "",
      prioridade: "",
      responsavel: "",
      dataInicio: "",
      dataFim: "",
      detalhes: "",
      investimentos: "",
      riscos: "",
      justificativa: "",
      observacoes: "",
      impacto: "",
      gravidade: "",  
      Meses: "",
    });
    setMostrarFormulario(null);
  };

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
    <div className="flex">
      <Sidebar 
        menuItems={[
          { name: "Home", icon: <FiHome size={20} />, path: "/analista" },
          { name: "Análises", icon: <FiBarChart2 size={20} />, path: "/analista/analises" },
          { name: "Relatórios", icon: <FiFileText size={20} />, path: "/analista/relatorios" }
        ]}
      />
      <main className={` flex main-content ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
        
        <div className="container-avaliacao ">
          <div className={styles.tituloPagina}>
            <h3>Análise de Cybersegurança - CLIENTE TESTE</h3>
          </div>

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

          {Object.entries(subcategoria).map(([sigla, subcategorias]) => {
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
                  {Object.entries(subcategoria).map(([sigla, subcategorias]) => {
  const categoria = data.categorias.find(c => c.sigla === sigla);
  if (!categoria) return null;

  const lista = subcategorias as Subcategoria[];

  return (
    <div key={sigla} className={`${styles.card} mb-6`}>
      ...
      <tbody>
        {lista.map((sub) => (
          <tr key={sub.id}>
            <td>{sub.id}</td>
            <td>{sub.subcategoria}</td>
            <td>{sub.politica?.toFixed(2) || '-'}</td>
            <td>{sub.pratica?.toFixed(2) || '-'}</td>
            <td>{sub.objetivo.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
      ...
    </div>
  );
})}

                  </tbody>
                </table>
                <br /><br />
                <div className={styles.containerForm}>
                  <h2 className="mb-4">Recomendações para {categoria.categoria} ({sigla})</h2>

                  <button
                    className={styles.toggleBtn}
                    onClick={() => setMostrarFormulario(mostrarFormulario === sigla ? null : sigla)}
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

                  {mostrarFormulario === sigla && (
          <FormularioRecomendacao
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          subcategorias={subcategoria}
        />
        
          
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
