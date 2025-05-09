"use client";

import Sidebar from "@/components/Sidebar";
import { FiHome, FiBarChart2, FiFileText } from "react-icons/fi";
import FloatingSocialMenu from "@/components/FloatingSocialMenu";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";

export default function Funcionario() {
  const isSidebarCollapsed = useSidebarCollapsed();

  return (
    <div className="flex h-screen">
      <Sidebar
        menuItems={[
          { name: "Home", icon: <FiHome size={20} />, path: "/analista" },
          { name: "Análises", icon: <FiBarChart2 size={20} />, path: "/analista/analises" },
          { name: "Relatórios", icon: <FiFileText size={20} />, path: "/analista/relatorios" },
        ]}
      />

      <div className={`${isSidebarCollapsed ? "main-content-collapsed" : "main-content"}`}>
        <main className="p-6 mt-16">
          <h2 className="text-xl font-semibold">Bem-vindo(a), Analista</h2>
          <FloatingSocialMenu />
        </main>
      </div>
    </div>
  );
}
