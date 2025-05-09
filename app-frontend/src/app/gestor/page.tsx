"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FiBarChart2, FiFileText, FiHome } from "react-icons/fi";
import FloatingSocialMenu from "@/components/FloatingSocialMenu";

export default function Gestor() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<{ name: string; type: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          name: parsedUser.nome,
          type: parsedUser.role,
        });
      } catch (error) {
        console.error("Erro ao fazer parse do user no localStorage:", error);
      }
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar 
        menuItems={[
         { name: "Home", icon: <FiHome size={20} />, path: "/gestor" },
                  { name: "Análises", icon: <FiBarChart2 size={20} />, path: "/gestor/analises" },
                  { name: "Relatórios", icon: <FiFileText size={20} />, path: "/gestor/relatorios" },
        ]}
      />

      {/* Conteúdo Principal */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-[220px]" : "ml-[80px]"
        }`}
      >
        <main className="p-6 mt-16">
          <h2 className="text-xl font-semibold">
            Bem-vindo(a), {user?.name || "visitante"}
          </h2>
                   <FloatingSocialMenu />
        </main>
      </div>
    </div>
  );
}
