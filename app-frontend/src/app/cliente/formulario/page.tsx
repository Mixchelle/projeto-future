"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { FiHome, FiFileText } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useFormulario } from "@/hooks/useFormulario";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";

interface Formulario {
  id: number;
  nome: string;
  status: string;  // Add status here
}


export default function FormularioPage() {
  const isSidebarCollapsed = useSidebarCollapsed();
  const router = useRouter();
  const { formularios, getFormularios } = useFormulario();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    getFormularios();
  }, []);

  const handleFormularioClick = (formulario: { id: number; nome: string ; status: string}) => {
    // Salva o ID do formulário no localStorage
    localStorage.setItem('selectedFormularioId', formulario.id.toString());
    localStorage.setItem('nomefomulario', formulario.nome.toString());

    localStorage.setItem('statusFormulario', formulario.status);

    const nomeFormatado = formulario.nome.toLowerCase().split(" ")[0]; 
    router.push(`/cliente/formulario/${nomeFormatado}`);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // você pode ajustar o breakpoint
  
    };
  
    handleResize(); // chama na primeira renderização
    window.addEventListener("resize", handleResize);
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const className = isMobile
  ? "sidebar-mobile" 
  : isSidebarCollapsed    
  ? "main-content-collapsed" : "main-content"; 

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        menuItems={[
          { name: "Home", icon: <FiHome size={20} />, path: "/cliente" },
          { name: "Formulario", icon: <FiFileText size={20} />, path: "/cliente/formulario" },
        ]}
      />

      {/* Conteúdo Principal */}
      <div className={`${className}`}>
        {/* Conteúdo da página */}
        <main className="">
          <div className="cards-list">
            {formularios.map((formulario: Formulario) => (
              <div
                key={formulario.id}
                className="cardForm "
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