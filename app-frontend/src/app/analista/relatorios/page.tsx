// src/app/funcionario/relatorios/page.tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from '@/components/Sidebar';
import React from 'react';
import { FiHome, FiBarChart2, FiFileText } from "react-icons/fi";

export default function RelatorioPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">

            <Sidebar
        menuItems={[
          { name: "Home", icon: <FiHome size={20} />, path: "/analista" },
          { name: "Análises", icon: <FiBarChart2 size={20} />, path: "/analista/analises" },
          { name: "Relatórios", icon: <FiFileText size={20} />, path: "/analista/relatorios" },
        ]}
      />
    <main className={`fundo flex-1 flex flex-col transition-all duration-300 main-content ${isSidebarOpen ? "" : "collapsed"}`}>
      <h1 className="text-2xl font-bold mb-4">Relatório de Avaliação</h1>
      <p className="text-base">
        Este relatório apresenta os resultados da avaliação de maturidade em segurança da informação com base no framework NIST CSF 2.0. Os dados foram coletados por meio de questionários respondidos pelos responsáveis da organização.
      </p>
    </main>
    </div>
  );
}
