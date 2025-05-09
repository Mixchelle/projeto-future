"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { FiHome, FiFileText, FiCheckCircle, FiClock, FiInstagram, FiYoutube, FiGlobe, FiFacebook, FiLinkedin } from "react-icons/fi";
import { useFormulario } from "@/hooks/useFormulario";
import FloatingSocialMenu from "@/components/FloatingSocialMenu";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";

// REMOVA ESTA LINHA SE ESTIVER USANDO CLASSES GLOBAIS
// import styles from '@/styles/forms.module.css';

export default function Cliente() {
  const isSidebarCollapsed = useSidebarCollapsed();
  const [formulariosRespondidos, setFormulariosRespondidos] = useState<any>({});
  const { formularios, getFormularioRespondido, getFormulariosEmAndamento } = useFormulario();
  const router = useRouter();
  const formularioId = 1;
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        const user = JSON.parse(userRaw);
        const id = user.tipo === 'subcliente' ? user.cliente?.id : user.id;
        setClienteId(id);
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // você pode ajustar o breakpoint

    };

    handleResize(); // chama na primeira renderização
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    const respondidos = JSON.parse(localStorage.getItem('formulariosEmAndamento') || '{}');
    setFormulariosRespondidos(respondidos);
  }, []);

  useEffect(() => {
    if (clienteId !== null) {
      getFormularioRespondido(formularioId, clienteId);
    }
  }, [formularioId, clienteId]);

  useEffect(() => {
    if (clienteId !== null) {
      const fetchFormularios = async () => {
        await getFormulariosEmAndamento(clienteId);
        const respondidos = JSON.parse(localStorage.getItem('formulariosEmAndamento') || '{}');
        setFormulariosRespondidos(respondidos);
      };

      fetchFormularios();
    }
  }, [clienteId]);

    const handleFormularioClick = (formularios: Array<{ id: number; nome: string; status: string}>) => {
      // Verifica se existe pelo menos um formulário
      if (!formularios || formularios.length === 0) {
        console.error('Nenhum formulário recebido');
        return;
      }

      const formulario = formularios[0]; // Pega o primeiro formulário do array

      try {
        localStorage.setItem('selectedFormularioId', formulario.id.toString());
        localStorage.setItem('nomeFormulario', formulario.nome);
        localStorage.setItem('statusFormulario', formulario.status);
        const nomeFormatado = formulario.nome.toLowerCase().split(" ")[0];
        router.push(`/cliente/formulario/${nomeFormatado}`);
      } catch (error) {
        console.error('Erro ao processar formulário:', error);
      }
    };


    const className = isMobile
    ? "sidebar-mobile"
    : isSidebarCollapsed
    ? "main-content-collapsed" : "main-content";

    // Função para determinar a classe CSS do título com base no status
    const getTitleClassName = (status: string) => {
      switch (status) {
        case 'pendente':
          return 'formTitlePendente';
        case 'analise':
        case 'aguardando_analise': // Assuming this maps to 'analise'
          return 'formTitleAnalise';
        case 'concluido':
          return 'formTitleConcluido';
        case 'rascunho':
          return 'formTitleRascunho';
        default:
          return ''; // Sem classe específica se o status for desconhecido
      }
    };

    // Função para determinar a classe CSS do ícone com base no status
    const getIconClassName = (status: string) => {
      switch (status) {
        case 'pendente':
          return 'iconPendente'; // Retorna a string do nome da classe
        case 'analise':
        case 'aguardando_analise':
          return 'iconAnalise'; // Retorna a string do nome da classe
        case 'concluido':
          return 'iconConcluido'; // Retorna a string do nome da classe
        case 'rascunho':
          return 'iconRascunho'; // Retorna a string do nome da classe
        default:
          return ''; // Sem classe específica
      }
    };


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
      <div className={` ${className }`}>
        {/* Conteúdo da página */}
        <main className="p-6 flex-1">
          <div className={`transition-all duration-300 ${className ? "ml-[220px]" : "ml-[80px]"}`} >
          <div className="titulo-cfor-cliente">
          <h3> Aqui você pode acompanhar seus formulários.</h3>
            </div>

            {/* Card de Formulários Respondidos */}
            {Object.keys(formulariosRespondidos).length > 0 && (
              <div className="card-cliente-form card mb-8"   onClick={() => handleFormularioClick(formulariosRespondidos)}>
                {Object.entries(formulariosRespondidos).map(([id, formulario]: [string, any]) => (
                  <div key={id} className="bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 border-blue-500">
                    <div className="flex items-start">
                      {/* Ícone com classe CSS dinâmica */}
                      {formulario.status === 'aguardando_analise' || formulario.status === 'analise' ? (
                        <FiClock className={`${getIconClassName(formulario.status)} text-xl mr-3 mt-1`} />
                      ) : formulario.status === 'concluido' ? (
                        <FiCheckCircle className={`${getIconClassName(formulario.status)} text-xl mr-3 mt-1`} />
                      ) : formulario.status === 'pendente' ? (
                        <FiClock className={`${getIconClassName(formulario.status)} text-xl mr-3 mt-1`} /> // Usando clock para pendente
                      ) : ( // Assumindo 'rascunho' ou outros status
                        <FiFileText className={`${getIconClassName(formulario.status)} text-xl mr-3 mt-1`} /> // Usando file icon para rascunho
                      )}

                      <div>
                        {/* Título com classe CSS dinâmica */}
                        <h4 className={`formTitle ${getTitleClassName(formulario.status)}`}>
                          {formulario.nome}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Status: {formulario.status}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                         Atualizado em: {new Date(formulario.data).toLocaleDateString()}
                        </p>
                        {/* Destaque para a pendência se o status for 'pendente' */}
                        {formulario.observacoes_pendencia && (
                           <span className={formulario.status === 'pendente' ? 'pendenciaDestaque' : ''}>
                             Pendencia:  {formulario.observacoes_pendencia}
                           </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
<div className="pdf">
<button className="botao-nist" onClick={() => setShowPdfModal(true)}>
  Sobre o NIST CSF
</button>
{isMobile && (
  <h3 className="aviso-desktop-only">
    Obs: esta ferramenta foi desenvolvida para uso exclusivo na versão desktop, conforme acordado com o cliente.
  </h3>
)}

{showPdfModal && (
  <div className="modal-overlay">
  <div className="modal-content">
      <button className="modal-close" onClick={() => setShowPdfModal(false)}>
        &times;
      </button>
      <h2 className="modal-title">Nota Técnica – NIST CSF 2.0</h2>
      <iframe
        src="/NotaTecnica.pdf"
        className="modal-pdf"
        title="PDF NIST"
      />

    </div>
  </div>
)}
</div>
          </div>
          <FloatingSocialMenu />

        </main>
      </div>
    </div>
  );
}