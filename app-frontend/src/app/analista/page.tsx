"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FiHome, FiBarChart2, FiFileText } from "react-icons/fi";
import FloatingSocialMenu from "@/components/FloatingSocialMenu";

export default function Funcionario() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar 
        menuItems={[
          { name: "Home", icon: <FiHome size={20} />, path: "/analista" },
          { name: "Análises", icon: <FiBarChart2 size={20} />, path: "/analista/analises" },
          { name: "Relatórios", icon: <FiFileText size={20} />, path: "/analista/relatorios" }
        ]}
      />

      {/* Conteúdo Principal */}
      <div className={`fundo flex-1 flex flex-col transition-all duration-300 main-content ${isSidebarOpen ? "" : "collapsed"}`}>

        {/* Conteúdo da página */}
        <main className="p-6 mt-16">
          <h2 className="text-xl font-semibold">Bem-vindo(a), Analista</h2>
                   <FloatingSocialMenu />
        </main>
      </div>
    </div>
  );
}
