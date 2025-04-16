"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { FiHome, FiFileText } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useFormulario } from "@/hooks/useFormulario";

export default function FormularioPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const { formularios, getFormularios } = useFormulario();

  useEffect(() => {
    getFormularios();
  }, []);

  const handleFormularioClick = (formulario: { id: number; nome: string }) => {
    // Salva o ID do formulário no localStorage
    localStorage.setItem('selectedFormularioId', formulario.id.toString());
    localStorage.setItem('nomefomulario', formulario.nome.toString());

    const nomeFormatado = formulario.nome.toLowerCase().split(" ")[0]; 
    router.push(`/cliente/formulario/${nomeFormatado}`);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        menuItems={[
          { name: "Home", icon: <FiHome size={20} />, path: "/cliente" },
          { name: "Formulario", icon: <FiFileText size={20} />, path: "/cliente/formulario" },
        ]}
      />

      {/* Conteúdo Principal */}
      <div className={`fundo flex-1 flex flex-col transition-all duration-300 main-content ${isSidebarOpen ? "" : "collapsed"}`}>
        {/* Conteúdo da página */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formularios.map((formulario) => (
              <div
                key={formulario.id}
                className="cardForm bg-orange-500 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-orange-600 transition"
                onClick={() => handleFormularioClick(formulario)}
                
              >
                <h2 className="text-lg font-semibold">{formulario.nome}</h2>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}