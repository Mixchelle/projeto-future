"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { FiHome, FiFileText, FiMenu, FiPaperclip, FiCheck, FiX, FiCheckCircle, FiCircle, FiChevronDown } from "react-icons/fi";import { useFormulario } from "@/hooks/useFormulario";
import { useRouter } from "next/navigation";
import QuestionMap from "@/components/QuestionMap";

interface RespostaPergunta {
  politica: string;
  pratica: string;
  informacoesAdicionais: string;
  anexo: string;
  codigo?: string;
}

export default function NistPage() {
 // Começa fechado no mobile, aberto no desktop
  const [activeSection, setActiveSection] = useState<string>("GV. Governança");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [respostas, setRespostas] = useState<{ [key: number]: RespostaPergunta }>({});
  const [progresso, setProgresso] = useState<number>(0);
  const [progressoTotal, setProgressoTotal] = useState<number>(0);
  const [totalPerguntas, setTotalPerguntas] = useState<number>(0);
  const [perguntasRespondidasTotal, setPerguntasRespondidasTotal] = useState<number>(0);
  const {     formularios,
    categorias,
    perguntas,
    formularioRespondido,
    formulariosEmAndamento,
    getFormularios,
    getCategoriasByFormulario,
    getQuestoesByCategoria,
    getFormularioRespondido,
    saveFormularioRespondido,
    updateFormularioById,
   } = useFormulario();


  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [atualizarCategorias, setAtualizarCategorias] = useState<boolean>(false);

  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [categoriasIncompletas, setCategoriasIncompletas] = useState<string[]>([]);
    const router = useRouter();
    const [showQuestionMap, setShowQuestionMap] = useState<boolean>(true);
    const [categoriasCompletas, setCategoriasCompletas] = useState<{ [key: number]: boolean }>({});
    const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState(false);
    const [menuAberto, setMenuAberto] = useState<boolean>(!isMobile);


    useEffect(() => {
      console.log('formulariosEmAndamento', formulariosEmAndamento);
    
      const status = localStorage.getItem('statusFormulario');
      console.log('status', status);
    
      // Se não houver status direto no localStorage
      if (!status) {
        const formulariosRaw = localStorage.getItem('formulariosEmAndamento');
    
        if (formulariosRaw) {
          try {
            const formularios: any[] = JSON.parse(formulariosRaw);
    
            const formulario = formularios.find(
              (f) => f.id === formularioRespondido?.id
            );
    
            if (formulario?.status) {
              // Salva o status encontrado no localStorage
              localStorage.setItem('statusFormulario', formulario.status);
    
              if (formulario.status === 'em_analise' || formulario.status === 'concluido') {
                setIsFormDisabled(true);
              }
            }
    
          } catch (error) {
            console.error('Erro ao parsear formulariosEmAndamento', error);
          }
        }
      } else {
        // Se o status existir diretamente no localStorage
        if (status === 'em_analise' || status === 'concluido') {
          setIsFormDisabled(true);
        }
      }
    
    }, [formularioRespondido]);
    
    
    
useEffect(() => {
  const novasCompletas: { [key: number]: boolean } = {};

  categorias.forEach((categoria) => {
    novasCompletas[categoria.id] = isCategoriaCompleta(categoria.id);
  });

  setCategoriasCompletas(novasCompletas);
}, [respostas, formularioRespondido, perguntas, categorias]);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768); // você pode ajustar o breakpoint
    setMenuAberto(!isMobile); // Fecha o menu no mobile
  };

  handleResize(); // chama na primeira renderização
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);




  const formularioId = 1;
  const localStorageKey = `formulario_${formularioId}`;
  const clienteId = 2;

  const saveToLocalStorage = (data: any) => {
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  };

  const loadFromLocalStorage = () => {
    const data = localStorage.getItem(localStorageKey);
    return data ? JSON.parse(data) : {};
  };

  const loadFromTotalLocalStorage = () => {
    const id = localStorage.getItem('selectedFormularioId');
    const data = localStorage.getItem(`formulario_${id}_total`);
    const total = data ? JSON.parse(data) : 1;
    return total;
  };

  useEffect(() => {
    const total = loadFromTotalLocalStorage();
    if (total) {
      setTotalPerguntas(total);
    }
  }, []);

  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setRespostas(savedData.respostas || {});
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      respostas,
    };
    saveToLocalStorage(dataToSave);
  }, [respostas]);

  useEffect(() => {
    getCategoriasByFormulario(formularioId);
  }, []);

  // Buscas o formulario respondido 
  useEffect(() => {
    getFormularioRespondido(formularioId, clienteId);
  }, [formularioId, clienteId]);
  
  // Este useEffect será executado quando formularioRespondido mudar
  useEffect(() => {
    if (formularioRespondido) {
      
      formularioRespondido.categorias.forEach((categoria) => {
        categoria.perguntas.forEach((pergunta) => {
          if (pergunta.resposta) {
            const respostaFormatada: RespostaPergunta = {
              politica: pergunta.resposta.politica,
              pratica: pergunta.resposta.pratica,
              informacoesAdicionais: pergunta.resposta.info_complementar || "",
              anexo: pergunta.resposta.anexos || "",
              codigo: pergunta.codigo
            };
  
            setRespostas((prev) => ({
              ...prev,
              [pergunta.id]: respostaFormatada
            }));
          }
        });
      });
    }
  }, [formularioRespondido]);

  useEffect(() => {
    if (categorias.length > 0) {
      const primeiraCategoria = categorias[0]; 
      setActiveSection(primeiraCategoria.nome); 
      getQuestoesByCategoria(primeiraCategoria.id); 
    }
  }, [categorias]); 

  useEffect(() => {
    const categoriaAtiva = categorias.find((cat) => cat.nome === activeSection);
    if (categoriaAtiva) {
      getQuestoesByCategoria(categoriaAtiva.id);
    }
  }, [activeSection, categorias]);

  // Verifica quais categorias estão incompletas
  const verificarCategoriasIncompletas = () => {
    const categoriasFaltantes: {[key: string]: {codigos: string[], ids: number[]}} = {}; 
    const todasRespostas = Object.values(respostas);
    const perguntasCompletas = todasRespostas.filter(
      resposta => resposta.politica && resposta.pratica
    ).length;
    let totalFaltando = (totalPerguntas - 1) - perguntasCompletas;
  
    categorias.forEach(categoria => {
      const perguntasDaCategoria = perguntas.filter(p => p.categoria === categoria.id);
      const codigosFaltantes: string[] = [];
      const idsFaltantes: number[] = [];
  
      perguntasDaCategoria.forEach(pergunta => {
        const resposta = respostas[pergunta.id];
        if (!resposta || !resposta.politica || !resposta.pratica) {
          codigosFaltantes.push(pergunta.codigo);
          idsFaltantes.push(pergunta.id);
          totalFaltando++;
        }
      });
  
      if (codigosFaltantes.length > 0) {
        categoriasFaltantes[categoria.nome] = {
          codigos: codigosFaltantes,
          ids: idsFaltantes
        };
      }
    });
  
    return {
      total: (totalPerguntas - 1) - perguntasCompletas,
      categorias: categoriasFaltantes
    };
  };


  const encontrarPrimeiraPerguntaIncompleta = () => {
    if (formularioRespondido?.categorias) {
      for (const categoria of formularioRespondido.categorias) {
        for (const pergunta of categoria.perguntas) {
          const resposta = respostas[pergunta.id];
          if (!resposta || !resposta.politica || !resposta.pratica) {
            return pergunta.id; // Retorna o ID da primeira pergunta incompleta
          }
        }
      }
    }
    return null; // Retorna null se todas as perguntas estiverem completas
  };

  // Atualiza o progresso da categoria atual
  useEffect(() => {
    if (perguntas.length > 0) {
      const perguntasRespondidas = perguntas.filter(pergunta => {
        const resposta = respostas[pergunta.id];
        return resposta && resposta.politica && resposta.pratica;
      }).length;

      const novoProgresso = (perguntasRespondidas / perguntas.length) * 100;
      setProgresso(novoProgresso);
    }
  }, [respostas, perguntas]);

  // Atualiza o progresso total do formulário
  useEffect(() => {
    if (totalPerguntas > 0) {
      const todasRespostas = Object.values(respostas);
      const perguntasCompletas = todasRespostas.filter(
        resposta => resposta.politica && resposta.pratica
      ).length;
      
      setPerguntasRespondidasTotal(perguntasCompletas);
      const novoProgressoTotal = (perguntasCompletas / (totalPerguntas - 1)) * 100;
      setProgressoTotal(novoProgressoTotal);
    }
  }, [respostas, totalPerguntas]);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const handleSectionClick = (sectionName: string) => {
    const categoriaAtual = categorias.find(cat => cat.nome === activeSection);
    
    setActiveSection(sectionName);
    setCurrentQuestionIndex(0);
    getQuestoesByCategoria(categorias.find(cat => cat.nome === sectionName)?.id || 0);
  };

  const handlePoliticaChange = async (perguntaId: number, value: string) => {
    // Atualiza o estado local primeiro
    setRespostas((prev) => ({
      ...prev,
      [perguntaId]: {
        ...prev[perguntaId],
        politica: value,
        pergunta: perguntaId // Garante que o ID da pergunta está incluído
      },
    }));
    setAtualizarCategorias(prev => !prev);
    // Prepara a resposta para o backend
    const respostaParaBackend = {
      pergunta: perguntaId,
      politica: value,
      pratica: respostas[perguntaId]?.pratica || "", // Mantém o valor existente
      info_complementar: respostas[perguntaId]?.informacoesAdicionais || "",
      anexos: respostas[perguntaId]?.anexo || null
    };
  
    const data = []
    data.push(respostaParaBackend)
    try {
      await saveFormularioRespondido(data, 'rascunho');
    } catch (error) {
      console.error("Erro ao salvar política:", error);
      // Opcional: Reverter o estado em caso de erro
    }
  };
  
  const handlePraticaChange = async (perguntaId: number, value: string) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaId]: {
        ...prev[perguntaId],
        pratica: value,
        pergunta: perguntaId
      },
    }));
    setAtualizarCategorias(prev => !prev);
  
    const respostaParaBackend = {
      pergunta: perguntaId,
      politica: respostas[perguntaId]?.politica || "",
      pratica: value,
      info_complementar: respostas[perguntaId]?.informacoesAdicionais || "",
      anexos: respostas[perguntaId]?.anexo || null
    };
    const data = []
    data.push(respostaParaBackend)
    try {
      await saveFormularioRespondido(data, 'rascunho');
    } catch (error) {
      console.error("Erro ao salvar prática:", error);
    }
  };
  
  const handleInformacoesAdicionaisChange = async (perguntaId: number, value: string) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaId]: {
        ...prev[perguntaId],
        informacoesAdicionais: value,
        pergunta: perguntaId
      },
    }));
  
    const respostaParaBackend = {
      pergunta: perguntaId,
      politica: respostas[perguntaId]?.politica || "",
      pratica: respostas[perguntaId]?.pratica || "",
      info_complementar: value,
      anexos: respostas[perguntaId]?.anexo || null
    };
    const data = []
  data.push(respostaParaBackend)
    try {
      await saveFormularioRespondido(data, 'rascunho');
    } catch (error) {
      console.error("Erro ao salvar informações adicionais:", error);
    }
  };


  useEffect(() => {
    const atualizaCategorias = () => {
      const novas = categorias.reduce((acc, cat) => {
        acc[cat.id] = isCategoriaCompleta(cat.id);
        return acc;
      }, {} as { [key: number]: boolean });
  
      setCategoriasCompletas(novas);
    };

    atualizaCategorias();
  }, [respostas, formularioRespondido, perguntas]);
  
  
  const handleAnexoChange = async (perguntaId: number, file: File | null) => {
    const nomeAnexo = file ? file.name : "";
    
    setRespostas((prev) => ({
      ...prev,
      [perguntaId]: {
        ...prev[perguntaId],
        anexo: nomeAnexo,
        pergunta: perguntaId
      },
    }));
  
    // Aqui você precisaria primeiro fazer upload do arquivo se necessário
    // e obter o caminho/URL para enviar ao backend
  
    const respostaParaBackend = {
      pergunta: perguntaId,
      politica: respostas[perguntaId]?.politica || "",
      pratica: respostas[perguntaId]?.pratica || "",
      info_complementar: respostas[perguntaId]?.informacoesAdicionais || "",
      anexos: nomeAnexo // Ou o caminho/URL após upload
    };
  
    try {
      await saveFormularioRespondido([respostaParaBackend], 'rascunho');
    } catch (error) {
      console.error("Erro ao salvar anexo:", error);
    }
  };
  const handleProximaPergunta = () => {
    // Verifica se é a última pergunta da categoria atual
    if (currentQuestionIndex < perguntas.length - 1) {
      // Ainda há perguntas na categoria - vai para a próxima
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Última pergunta - vamos para a próxima categoria
      const categoriaAtual = categorias.find(cat => cat.nome === activeSection);
      if (!categoriaAtual) return;
      
  
      // Verifica se a categoria atual está completa
   
      const categoriaCompleta = isCategoriaCompleta(categoriaAtual.id);

// Atualiza o estado da categoria como completa/incompleta
      setCategoriasCompletas((prev) => ({
      ...prev,
      [categoriaAtual.id]: categoriaCompleta,
      }));


      // Encntra o índice da categoria atual
      const currentCategoryIndex = categorias.findIndex(cat => cat.id === categoriaAtual.id);
      
      // Verifica se há próxima categoria
      if (currentCategoryIndex < categorias.length - 1) {
        const proximaCategoria = categorias[currentCategoryIndex + 1];
        setActiveSection(proximaCategoria.nome);
        setCurrentQuestionIndex(0); // Reseta para a primeira pergunta
        getQuestoesByCategoria(proximaCategoria.id); // Carrega as perguntas da próxima categoria
      } else {
        // Última categoria - mostra mensagem ou ação final
        setSnackbarMessage("Você completou todas as categorias!");
        setShowSnackbar(true);
      }
    }
  };


  useEffect(() => {
  }, [atualizarCategorias]);

  const handlePerguntaAnterior = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleEnviarFormulario = async () => {
    const primeiraPerguntaIncompletaId = encontrarPrimeiraPerguntaIncompleta();

    if (primeiraPerguntaIncompletaId) {
      // Encontrar a categoria e a pergunta correspondente pelo ID
      let categoriaIncompletaNome = "";
      let indexPerguntaIncompleta = -1;

      formularioRespondido?.categorias.forEach((categoria) => {
        const index = categoria.perguntas.findIndex(p => p.id === primeiraPerguntaIncompletaId);
        if (index !== -1) {
          categoriaIncompletaNome = categoria.nome;
          indexPerguntaIncompleta = index;
        }
      });

      if (categoriaIncompletaNome) {
        await getQuestoesByCategoria(
          categorias.find((cat) => cat.nome === categoriaIncompletaNome)?.id || 0
        );
        setCurrentQuestionIndex(indexPerguntaIncompleta);
        setActiveSection(categoriaIncompletaNome);
        setSnackbarMessage(`Atenção: A pergunta ${
          perguntas.find(p => p.id === primeiraPerguntaIncompletaId)?.codigo || primeiraPerguntaIncompletaId
        } não foi respondida.`);
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 5000);
        return;
      } else {
        setSnackbarMessage("Ainda há questões para responder.");
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 5000);
        return;
      }
    }

    // Se `primeiraPerguntaIncompletaId` for null, significa que todas as perguntas estão OK
    try {
      // Preparar todas as respostas para envio
      const respostasParaEnvio = Object.entries(respostas).map(([perguntaId, resposta]) => ({
        pergunta: parseInt(perguntaId),
        politica: resposta.politica,
        pratica: resposta.pratica,
        info_complementar: resposta.informacoesAdicionais || "",
        anexos: resposta.anexo || null
      }));

      // Enviar todas as respostas e atualizar status para "em_analise"
      await saveFormularioRespondido(respostasParaEnvio, 'em_analise');

      // Atualizar status no localStorage
      const formularioId = localStorage.getItem('selectedFormularioId');
      const formulariosRespondidos = JSON.parse(localStorage.getItem('formulariosRespondidos') || '{}');
      const nomeFormulario = localStorage.getItem('nomeFormulario') || '';

      formulariosRespondidos[formularioId] = {
        nome: nomeFormulario,
        status: 'em_analise',
        data: new Date().toISOString()
      };

      localStorage.setItem('formulariosRespondidos', JSON.stringify(formulariosRespondidos));

      // Mostrar mensagem de sucesso
      setSnackbarMessage('Formulário enviado com sucesso para análise!');
      setShowSnackbar(true);

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push('/cliente/');
      }, 3000);

    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSnackbarMessage('Erro ao enviar formulário. Por favor, tente novamente.');
      setShowSnackbar(true);
    }
  };
  
  const todasQuestoesRespondidas = () => {
    return perguntasRespondidasTotal === totalPerguntas;
  };

  useEffect(() => {
    if (showSnackbar) {
      const timer = setTimeout(() => {
        setShowSnackbar(false);
      }, 5000); // Fecha após 5 segundos
      
      return () => clearTimeout(timer);
    }
  }, [showSnackbar, snackbarMessage]);

  const isCategoriaCompleta = (categoriaId: number) => {
    // Verifica se temos o formulário respondido carregado
    if (!formularioRespondido) {
      // Se não tiver o formulário respondido carregado, usa o estado local como fallback
      const perguntasDaCategoria = perguntas.filter(p => p.categoria === categoriaId);
      return perguntasDaCategoria.every(pergunta => {
        const resposta = respostas[pergunta.id];
        return resposta && resposta.politica && resposta.pratica;
      });
    }
  
    // Encontra a categoria no formulário respondido
    const categoriaRespondida = formularioRespondido.categorias.find(
      cat => cat.id === categoriaId
    );

    if (!categoriaRespondida) {
      return false;
    }
  
    // Verifica se todas as perguntas da categoria têm respostas completas
    return categoriaRespondida.perguntas.every(pergunta => {
      return (
        pergunta.resposta &&
        pergunta.resposta.politica &&
        pergunta.resposta.pratica
      );
    });
  };

  const className = isMobile
  ? "form-mobile" 
  :  "main-content flex"; 

  const classCategorias = isMobile
  ? "categorias-mobile"
  : `section-sidebar ${menuAberto ? "normal" : "collapse"} fixed`;

  const classQuestion = isMobile
  ? "question-mobile"
  : `${menuAberto ? "normal-form" : "collapse-form"} fixed`;

  
  return (
    <div className="form-container flex min-h-screen bg-gray-100" data-testid="nist-page">
      <Sidebar
        menuItems={[
          { name: "Home", icon: <FiHome size={20} />, path: "/cliente" },
          { name: "Formulario", icon: <FiFileText size={20} />, path: "/cliente/formulario" },
        ]}
      />
      <div className={`${className}`}>
      <div className={`${classCategorias}`}>
      {isMobile ? (
         null
      ) :     
        <button
      className="fixed-btn menu-button mb-4"
      onClick={toggleMenu}
      aria-label={menuAberto ? "Recolher menu" : "Expandir menu"}
      aria-expanded={menuAberto}
      data-testid="menu-toggle-button"
    >
      <FiMenu size={24} color="orange" aria-hidden="true" />
    </button>}

       <div className="section-list-container">
       {isMobile ? (
  <div className="mobile-nav-siglas">
  {categorias.map((categoria) => {
    let sigla;
    const match = categoria.nome.match(/\(([^)]+)\)/);
    if (match) {
      sigla = match[1];
    } else {
      const parts = categoria.nome.split(' ');
      sigla = parts[0];
    }

    return (
      <button
        key={categoria.id}
        className={`sigla-button ${activeSection === categoria.nome ? "active" : ""}`}
        onClick={() => handleSectionClick(categoria.nome)}
      >
        {sigla}
      </button>
    );
  })}
</div>
) :  
 <ul className="section-list">

<div className="categorias">
{categorias.map((categoria) => {
  let sigla, nome;

  const match = categoria.nome.match(/\(([^)]+)\)/);
  if (match) {
    sigla = match[1];
    nome = categoria.nome.replace(/\([^)]+\)/, '').trim();
  } else {
    const parts = categoria.nome.split(' ');
    sigla = parts[0];
    nome = parts.slice(1).join(' ');
  }

  const completa = categoriasCompletas[categoria.id];

  return (
    <li key={categoria.id} className="section-item">
      <button
        className={`section-button ${activeSection === categoria.nome ? "active" : ""} ${
          completa ? "completed" : ""
        }`}
        onClick={() => handleSectionClick(categoria.nome)}
        data-testid={`section-button-${categoria.id}`}
      >
        <span className="section-sigla">{sigla}</span>
        {menuAberto && (
          <>
            <span className="section-text">{nome}</span>
            {completa ? (
              <FiCheckCircle className="ml-2" />
            ) : (
              <FiCircle className="ml-2 text-gray-400" />
            )}
          </>
        )}
      </button>
    </li>
  );
})}
</div>

<div className="fixed-question">
{menuAberto && (
  <>
    <br /><hr />
    <QuestionMap 
      perguntas={perguntas} 
      respostas={respostas} 
      currentQuestionIndex={currentQuestionIndex} 
      setCurrentQuestionIndex={setCurrentQuestionIndex} 
    />
  </>
)}
</div>
</ul>

}
        

        </div>

        </div>


        {/* Formulário */}
          {/* Barra de Progresso da Categoria Atual */}
          <div className={`${classQuestion } `}>

          {/* Barra de Progresso da Categoria Atual */}
          <div className="progresso-container mb-6 flex items-center justify-between">
            <div className="barra-progresso flex-1 mr-4 bg-gray-200 rounded-full h-4">
              <div
                className="progresso-preenchido bg-blue-500 h-4 rounded-full"
                style={{ width: `${progressoTotal}%` }}></div>
            </div>
            <div className="indicador-progresso flex items-center">
              <span className="text-sm font-medium text-gray-700">{Math.round(progressoTotal)}% concluído</span>
              <span className="mx-2 text-sm font-medium text-gray-700">|</span>
              <span className="text-sm font-medium text-gray-700">
              {perguntasRespondidasTotal}/{totalPerguntas} 
              </span>
            </div>
          </div>
          <h1 
            className="main-title text-2xl font-bold mb-6 text-gray-800"
            data-testid="active-section-title"
          >
            {activeSection}
          </h1>

          {/* Exibir a pergunta atual */}
          {perguntas.length > 0 && (
            <div className="question-container mb-6" data-testid="question-container">
              <label className="question-label flex items-center space-x-2">
                <span 
                  className={`question-text text-sm font-medium ${
                    respostas[perguntas[currentQuestionIndex].id]?.politica && 
                    respostas[perguntas[currentQuestionIndex].id]?.pratica
                      ? "text-green-600"
                      : "text-gray-700"
                  }`}
                  data-testid="question-text"
                >
                  {perguntas[currentQuestionIndex].codigo}: {perguntas[currentQuestionIndex].questao}
                  {respostas[perguntas[currentQuestionIndex].id]?.politica && 
                  respostas[perguntas[currentQuestionIndex].id]?.pratica && (
                    <FiCheck className="ml-2 text-green-500 inline" />
                  )}
                </span>
              </label>
              <span></span>
              <div className="selectors-container flex space-x-4 mb-6">
                <div className="politica-selector flex-1">
                  <label 
                    className="selector-label block text-sm font-medium text-gray-700 mb-1"
                    data-testid="politica-label"
                  >
                    Política
                  </label>
                  <select
                    disabled={isFormDisabled}
                    value={respostas[perguntas[currentQuestionIndex].id]?.politica || ""}
                    onChange={(e) => handlePoliticaChange(perguntas[currentQuestionIndex].id, e.target.value)}
                    className="selector-input w-full p-2 border-2 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    data-testid="politica-select"
                  >
                    <option value="" disabled>
                      Selecione uma opção
                    </option>
                    <option value="Inicial">1-Inicial</option>
                    <option value="Repetido">2-Repetido</option>
                    <option value="Definido">3-Definido</option>
                    <option value="Gerenciado">4-Gerenciado</option>
                    <option value="Otimizado">5-Otimizado</option>
                  </select>
                </div>

                <div className="pratica-selector flex-1">
                  <label 
                    className="selector-label block text-sm font-medium text-gray-700 mb-1"
                    data-testid="pratica-label"
                  >
                    Prática
                  </label>
                  <select
                    disabled={isFormDisabled}
                    value={respostas[perguntas[currentQuestionIndex].id]?.pratica || ""}
                    onChange={(e) => handlePraticaChange(perguntas[currentQuestionIndex].id, e.target.value)}
                    className="selector-input w-full p-2 border-2 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    data-testid="pratica-select"
                  >
                    <option value="" disabled>
                      Selecione uma opção
                    </option>
                    <option value="Inicial">1-Inicial</option>
                    <option value="Repetido">2-Repetido</option>
                    <option value="Definido">3-Definido</option>
                    <option value="Gerenciado">4-Gerenciado</option>
                    <option value="Otimizado">5-Otimizado</option>
                  </select>
                </div>
              </div>

              <div className="additional-info-container mb-6">
  
                <label 
                  className="additional-info-label block text-sm font-medium text-gray-700 mb-1"
                  data-testid="info-adicionais-label"
                >
                  Informações adicionais
                </label>
          
                <div className="flex items-center space-x-2">
       
                  <textarea
                   disabled={isFormDisabled}
                    placeholder="Comece a digitar sua mensagem..."
                    rows={3}
                    value={respostas[perguntas[currentQuestionIndex].id]?.informacoesAdicionais || ""}
                    onChange={(e) => handleInformacoesAdicionaisChange(perguntas[currentQuestionIndex].id, e.target.value)}
                    className="additional-info-textarea w-full p-3 border-2 border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    data-testid="info-adicionais-textarea"
                  ></textarea>
         
                </div>
                <label className="cursor-pointer file">
                    <input
                      disabled={isFormDisabled}
                      type="file"
                      className="hidden"
                      onChange={(e) => handleAnexoChange(perguntas[currentQuestionIndex].id, e.target.files?.[0] || null)}
                      data-testid="anexo-input"
                      
                    />
                    <FiPaperclip size={24} className="text-gray-500 hover:text-blue-500" />
                  </label>
                {respostas[perguntas[currentQuestionIndex].id]?.anexo && (
  <div className="anexo-container">
    <div className="anexo-card">
      <div className="anexo-icon">
        <FiFileText size={24} />
      </div>
      <div className="anexo-info">
        <span className="anexo-nome">
          {respostas[perguntas[currentQuestionIndex].id]?.anexo}
        </span>
    
      </div>
      <button
       disabled={isFormDisabled}
        className="anexo-remover"
        onClick={() => handleAnexoChange(perguntas[currentQuestionIndex].id, null)}
        title="Remover arquivo"
      >
        <FiX size={18} />
      </button>
    </div>
  </div>
)}
              </div>
            </div>
          )}

          {/* Navegação entre perguntas */}
          <div className="footer_question flex justify-between items-center mt-6">
            <button
              onClick={handlePerguntaAnterior}
              disabled={currentQuestionIndex === 0}
              className="flex items-center justify-center cursor-pointer transition-all duration-300 ease-linear rounded-lg border border-pink-300 px-4 py-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              data-testid="anterior-button"
            >
              <span>Anterior</span>
            </button>

            <span 
              className="text-sm text-gray-700"
              data-testid="progresso-indicator"
            >
              {currentQuestionIndex + 1} de {perguntas.length}
            </span>

            <button
  onClick={handleProximaPergunta}
  className={`flex items-center justify-center cursor-pointer transition-all duration-300 ease-linear rounded-lg border border-pink-300 px-4 py-2 ${
    // Desabilita apenas se for a última pergunta da última categoria
    (currentQuestionIndex === perguntas.length - 1 && 
     categorias.findIndex(cat => cat.nome === activeSection) === categorias.length - 1)
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "hover:bg-pink-100"
  }`}
  data-testid="proxima-button"
>
  {currentQuestionIndex === perguntas.length - 1 ? 
    (categorias.findIndex(cat => cat.nome === activeSection) < categorias.length - 1 
      ? "Próxima Categoria" 
      : "Última Pergunta") 
    : "Próxima"}
</button>
          </div>
          <br />
          
          {/* Botão de enviar */}
          {isFormDisabled ? (
  <p className="text-red-500 mb-2">
    Este formulário está em análise e não pode ser editado.
  </p>
) : (
  <button 
    disabled={isFormDisabled}
    onClick={handleEnviarFormulario}
    className={`btn px-4 py-2 rounded-lg ${
      todasQuestoesRespondidas() 
        ? "bg-blue-500 text-white hover:bg-blue-600" 
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
    data-testid="enviar-formulario-button"
  >
    Enviar Formulário
  </button>
)}


        </div>
      </div>

      {/* Snackbar para mostrar mensagens */}
      {showSnackbar && (
  <div className="snackbar">
    <div className="snackbar-content">
      <span>{snackbarMessage}</span>
    </div>
    <button 
      className="snackbar-close-btn"
      onClick={() => setShowSnackbar(false)}
      aria-label="Fechar notificação"
    >
      <FiX size={18} />
    </button>
  </div>
)}
    </div>
  );
}