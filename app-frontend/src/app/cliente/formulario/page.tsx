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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    getFormularios();
  }, []);

  const handleFormularioClick = (formulario: { id: number; nome: string ;}) => {
    // Salva o ID do formulário no localStorage
    localStorage.setItem('selectedFormularioId', formulario.id.toString());
    localStorage.setItem('nomefomulario', formulario.nome.toString());


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
    ? "content-mobile" 
    : isSidebarOpen    
      ? "main-content fundo flex-1 flex flex-col transition-all duration-300 "  
      : "collapsed main-content fundo flex-1 flex flex-col transition-all duration-300 "; 

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
            {formularios.map((formulario) => (
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