"use client";

import { useEffect, useState } from "react";
import AnaliseDetail from "@/components/AnaliseDetail";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FiHome, FiBarChart2, FiFileText } from "react-icons/fi";

interface PageProps {
  params: { slug: string };

}

export default function AnaliseDetailPage() {
  const [formularioRespondidoId, setFormularioRespondidoId] = useState<number | null>(null);

  useEffect(() => {
      const storedId = localStorage.getItem("formularioRespondidoId");
      if (storedId && !isNaN(Number(storedId))) {
        setFormularioRespondidoId(Number(storedId));
      } else {
        console.warn("ID inválido");
      }
 
  }, []);

  if (formularioRespondidoId === null) return 
  <div className="flex min-h-screen bg-gray-100 flex-1 flex main-content">
  <Sidebar 
    menuItems={[
      { name: "Home", icon: <FiHome size={20} />, path: "/analista" },
      { name: "Análises", icon: <FiBarChart2 size={20} />, path: "/analista/analises" },
      { name: "Relatórios", icon: <FiFileText size={20} />, path: "/analista/relatorios" }
    ]}
  />
  <div className="flex justify-center items-center w-full h-full">
    <LoadingSpinner  />
  </div>
</div>;

  return <AnaliseDetail empresaId={formularioRespondidoId.toString()} />;
}
