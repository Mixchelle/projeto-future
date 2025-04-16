"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FiHome, FiFileText } from "react-icons/fi";

export default function NistPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar 
        menuItems={[
          { name: "Home", icon: <FiHome size={20} />, path: "/cliente" },
          { name: "Formulário", icon: <FiFileText size={20} />, path: "/cliente/formulario" }
        ]}
      
      />

      {/* Conteúdo Principal */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "" : "collapsed"}`}>
        {/* Cabeçalho */}
        <header className="p-4 bg-white shadow-md">
          <h1 className="text-2xl font-bold">Formulário NIST</h1>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 p-6 bg-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          </div>
        </main>
      </div>
    </div>
  );
}
