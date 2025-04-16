"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { FiHome, FiFileText, FiClock, FiCheckCircle } from "react-icons/fi";
import { useFormulario } from "@/hooks/useFormulario";
import FloatingSocialMenu from "@/components/FloatingSocialMenu";

export default function Cliente() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formulariosRespondidos, setFormulariosRespondidos] = useState<any>({});
  const { formularios, getFormularioRespondido, getFormulariosEmAndamento } = useFormulario();
  const router = useRouter();
  const formularioId = 1;
  const [user, setUser] = useState<any>(null);
  const [clienteId, setClienteId] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      setClienteId(user.tipo === 'subcliente' ? user.cliente?.id : user.id);
    }
  }, []);

  useEffect(() => {
    if (clienteId) {
      // Convertendo clienteId para número, se necessário
      const clienteIdNum = Number(clienteId);
      if (!isNaN(clienteIdNum)) {
        getFormularioRespondido(formularioId, clienteIdNum);
      } else {
        console.error('clienteId não é um número válido');
      }
      const respondidos = JSON.parse(localStorage.getItem('formulariosEmAndamento') || '{}');
      setFormulariosRespondidos(respondidos);
    }
  }, [clienteId]);

  useEffect(() => {
    if (clienteId) {
      const fetchFormularios = async () => {
        // Convertendo clienteId para número, se necessário
        const clienteIdNum = Number(clienteId);
        if (!isNaN(clienteIdNum)) {
          await getFormulariosEmAndamento(clienteIdNum);
          const respondidos = JSON.parse(localStorage.getItem('formulariosEmAndamento') || '{}');
          setFormulariosRespondidos(respondidos);
        } else {
          console.error('clienteId não é um número válido');
        }
      };
    
      fetchFormularios();
    }
  }, [clienteId]);

  const handleFormularioClick = (formularios: Array<{ id: number; nome: string }>) => {
    if (!formularios || formularios.length === 0) {
      console.error('Nenhum formulário recebido');
      return;
    }

    const formulario = formularios[0];

    try {
      localStorage.setItem('selectedFormularioId', formulario.id.toString());
      localStorage.setItem('nomeFormulario', formulario.nome);
      
      const nomeFormatado = formulario.nome.toLowerCase().split(" ")[0];
      router.push(`/cliente/formulario/${nomeFormatado}`);
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
    }
  };

  if (!user || !clienteId) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar 
        menuItems={[
          { name: "Home", icon: <FiHome size={20} />, path: "/cliente" },
          { name: "Formulario", icon: <FiFileText size={20} />, path: "/cliente/formulario" }
        ]}
      />

      {/* Conteúdo Principal */}
      <div className={`fundo flex-1 flex flex-col transition-all duration-300 main-content ${isSidebarOpen ? "" : "collapsed"}`}>
        {/* Conteúdo da página */}
        <main className="p-6 flex-1">
          <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-[220px]" : "ml-[80px]"}`} >
            <div className="titulo bg-white p-6 rounded-lg shadow-sm">
              <h3> Aqui você pode acompanhar seus formulários.</h3>
            </div>
            
            {/* Card de Formulários Respondidos */}
            {Object.keys(formulariosRespondidos).length > 0 && (
              <div className="card-cliente-form card mb-8" onClick={() => handleFormularioClick(formulariosRespondidos)}>
                {Object.entries(formulariosRespondidos).map(([id, formulario]: [string, any]) => (
                  <div key={id} className="bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 border-blue-500">
                    <div className="flex items-start">
                      {formulario.status === 'aguardando_analise' ? (
                        <FiClock className="text-yellow-500 text-xl mr-3 mt-1" />
                      ) : (
                        <FiCheckCircle className="text-green-500 text-xl mr-3 mt-1" />
                      )}
                      
                      <div>
                        <h4 className="font-medium">{formulario.nome}</h4>
                        <p className="text-sm text-gray-600">
                          Status: {formulario.status}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Atualizado em: {new Date(formulario.data).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <FloatingSocialMenu />
        </main>
      </div>
    </div>
  );
}
