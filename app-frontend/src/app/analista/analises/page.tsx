"use client";

import { useState, useEffect } from "react";
import { useFormulario } from "@/hooks/useFormulario";
import { FiFileText, FiHome, FiBarChart2 } from "react-icons/fi";
import Sidebar from "@/components/Sidebar";

export default function AnalisesList() {
  const {
    formulariosEmAnalise,
    loadingFormulariosEmAnalise,
    buscarFormulariosEmAnalise,
  } = useFormulario();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    buscarFormulariosEmAnalise();
  }, []);

  return (
    <div className="app-container">
      <Sidebar 
        menuItems={[
          { name: "Home", icon: <FiHome size={20} />, path: "/analista" },
          { name: "Análises", icon: <FiBarChart2 size={20} />, path: "/analista/analises" },
          { name: "Relatórios", icon: <FiFileText size={20} />, path: "/analista/relatorios" }
        ]}

      />

      <main className={` flex main-content ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
        <div className="analises-section">
          <h2 className="section-title">Avaliaçoes</h2>

          {loadingFormulariosEmAnalise ? (
            <p className="loading-message">Carregando avaliações...</p>
          ) : formulariosEmAnalise.length === 0 ? (
            <p className="empty-message">Nenhuma avaliação pendente no momento.</p>
          ) : (
            <div className="analises-grid">
              {formulariosEmAnalise.map((form) => (
                <div
                  key={form.id_formulario_respondido}
                  className="analise-card"
                  onClick={() => {
                    localStorage.setItem("formularioRespondidoId", form.id_formulario_respondido.toString());
                    window.location.href = `/analista/analises/analiseDetalhada/${form.id_formulario_respondido}`;
                  }}
                >
                  <div className="card-header">
                    <FiFileText className="card-icon" />
                    <h3 className="card-title">{form.nome_formulario}</h3>
                  </div>
                  <div className="card-body">
                    <p className="card-info"><strong>Cliente:</strong> {form.nome_cliente}</p>
                    <p className="card-id">ID Respondido: {form.id_formulario_respondido}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

    </div>
  );
}