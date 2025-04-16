import { useState, useEffect } from "react";
import axios from "axios";

interface Formulario {
  id: number;
  nome: string;
  total?: string;
}

interface Categoria {
  id: number;
  nome: string;
  formulario: number;
}

interface Pergunta {
  id: number;
  questao: string;
  codigo: string;
  categoria: number;
  formulario: number;
}

interface Resposta {
  pergunta: number;
  politica: string;
  pratica: string;
  info_complementar?: string;
  anexos?: File | null | string;
}

interface FormularioRespondido {
  id: number;
  formulario: number;
  cliente: number;
  status: string;
  progresso: number;
  versao: number;
  criado_em: string;
  responsavel?: number;
  respostas?: {
    pergunta: number;
    politica: string;
    pratica: string;
    info_complementar?: string;
    anexos?: string | null;
  }[];
}

type NivelMaturidade = "Inicial" | "Repetido" | "Definido" | "Gerenciado" | "Otimizado";

interface RespostaPergunta {
  pergunta: number; // ID da pergunta
  politica: NivelMaturidade;
  pratica: NivelMaturidade;
  info_complementar: string;
  anexos: string | null;
}

interface Pergunta {
  id: number;
  questao: string;
  codigo: string;
  resposta: RespostaPergunta | null;
}

interface Categorias {
  id: number;
  nome: string;
  perguntas: Pergunta[];
}

interface FormularioCompleto {
  id: number;
  nome: string;
  categorias: Categorias[];
}

interface FormularioEmAndamento {
  id: number;
  formulario: number;
  formulario_nome: string;
  status: string;
  atualizado_em: string;
  versao: number;
  progresso: number;
}

interface FormularioEmAnaliseExibicao {
  id_formulario_respondido: number;
  id_cliente: number;
  nome_cliente: string;
  id_formulario: number;
  nome_formulario: string;
}


const API_URL = "http://localhost:8000/form";

export const useFormulario = () => {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [formularioRespondido, setFormularioRespondido] = useState<FormularioCompleto | null>(null);
  const [formulariosEmAndamento, setFormulariosEmAndamento] = useState<FormularioEmAndamento[]>([]);
  const [loadingFormulariosEmAndamento, setLoadingFormulariosEmAndamento] = useState(false);
  const [errorFormulariosEmAndamento, setErrorFormulariosEmAndamento] = useState<string | null>(null);

  const [formulariosEmAnalise, setFormulariosEmAnalise] = useState<FormularioEmAnaliseExibicao[]>([]);
  const [loadingFormulariosEmAnalise, setLoadingFormulariosEmAnalise] = useState(false);
  const [errorFormulariosEmAnalise, setErrorFormulariosEmAnalise] = useState<string | null>(null);
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  async function getFormularios() {
    try {
      const response = await axios.get(`${API_URL}/formularios/`, getAuthConfig());
      setFormularios(response.data);
      
      response.data.forEach((formulario: { id: number; total: number }) => {
        localStorage.setItem(`formulario_${formulario.id}_total`, formulario.total.toString());
      });
      
    } catch (error) {
      console.error("Erro ao buscar formulários:", error);
    }
  }

  const getCategoriasByFormulario = async (formularioId: number) => {
    try {
      const response = await axios.get(
        `${API_URL}/formularios/${formularioId}/categorias/`,
        getAuthConfig()
      );
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const getQuestoesByCategoria = async (categoriaId: number) => {
    try {
      const response = await axios.get(
        `${API_URL}/categorias/${categoriaId}/perguntas/`,
        getAuthConfig()
      );
      setPerguntas(response.data);
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
    }
  };

  const getFormularioRespondido = async (formid: number, id: number) => {
    try {
      console.log('atualizou o formalario respondido');
      const formularioId = localStorage.getItem("selectedFormularioId");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const clienteId = user.id;

      const response = await axios.get(
        `${API_URL}/formularios/${formularioId}/clientes/${clienteId}/`,
        getAuthConfig()
      );
  
      const formulariosRespondidos = JSON.parse(localStorage.getItem('formulariosRespondidos') || '{}');
  
      formulariosRespondidos[formularioId] = {
        nome: response.data.formulario?.nome,
        status:  response.data.status,
        data: new Date().toISOString()
      };

      localStorage.setItem('formulariosRespondidos', JSON.stringify(formulariosRespondidos));
      setFormularioRespondido(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar formulário respondido:", error);
      return null;
    }
  };
  

  const saveFormularioRespondido = async (
    respostas: Resposta[], 
    status: string = "rascunho",
  ) => {
    try {
      const formularioId = localStorage.getItem("selectedFormularioId");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const clienteId = user.id;
      
      const data = {
        formulario: formularioId,
        cliente: clienteId,
        responsavel: user.id,
        status: status,
        respostas: respostas.map(resposta => ({
          pergunta: resposta.pergunta,
          politica: resposta.politica,
          pratica: resposta.pratica,
          info_complementar: resposta.info_complementar || "",
          anexos: resposta.anexos || null
        }))
      };
  
      const response = await axios.post(
        `${API_URL}/formularios/${formularioId}/clientes/${clienteId}/`,
        data,
        getAuthConfig()
      );
  
      // Atualiza o formulário respondido após salvar
      await getFormularioRespondido(Number(formularioId), clienteId);
  
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
      throw error;
    }
  };
  


  const updateFormularioById = async (id: number, data: Partial<Formulario>) => {
    try {
      const response = await axios.patch(
        `${API_URL}/formularios/${id}/`,
        data,
        getAuthConfig()
      );
      setFormularios((prev) =>
        prev.map((form) => (form.id === id ? { ...form, ...response.data } : form))
      );
    } catch (error) {
      console.error("Erro ao atualizar formulário:", error);
    }
  };

  useEffect(() => {
    getFormularios();
  }, []);

  const getFormulariosEmAndamento = async (clienteId: number) => {
    try {
      setLoadingFormulariosEmAndamento(true);
      setErrorFormulariosEmAndamento(null);
      
      const response = await axios.get(
        `${API_URL}/clientes/${clienteId}/formularios-em-andamento/`,
        getAuthConfig()
      );

      setFormulariosEmAndamento(response.data);
      
      // Atualiza também no localStorage se necessário
      const emAndamento = response.data.map((form: FormularioEmAndamento) => ({
        id: form.id,
        nome: form.formulario_nome,
        status: form.status,
        data: form.atualizado_em,
        progresso: form.progresso
      }));
      
      localStorage.setItem('formulariosEmAndamento', JSON.stringify(emAndamento));
      
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar formulários em andamento:", error);
      setErrorFormulariosEmAndamento("Erro ao carregar formulários em andamento");
      throw error;
    } finally {
      setLoadingFormulariosEmAndamento(false);
    }
  };

  const buscarFormulariosEmAnalise = async () => {
    setLoadingFormulariosEmAnalise(true);
    setErrorFormulariosEmAnalise(null);

    try {
      const response = await axios.get(
        `${API_URL}/formularios-em-analise/`,
        getAuthConfig()
      );

      const data = response.data;
      const formulariosArray: FormularioEmAnaliseExibicao[] = Object.entries(data).map(
        ([id, formulario]) => {
          const f = formulario as FormularioEmAnaliseExibicao;
      
          return {
            id_formulario_respondido: parseInt(id),
            id_cliente: f.id_cliente,
            nome_cliente: f.nome_cliente,
            id_formulario: f.id_formulario,
            nome_formulario: f.nome_formulario,
          };
        }
      );
      

      setFormulariosEmAnalise(formulariosArray);
      return formulariosArray;
    } catch (error: any) {
      console.error("Erro ao buscar formulários em análise:", error);
      setErrorFormulariosEmAnalise("Erro ao carregar formulários em análise.");
      return null;
    } finally {
      setLoadingFormulariosEmAnalise(false);
    }
  };

  useEffect(() => {
    buscarFormulariosEmAnalise();
  }, []);


  return {
    formularios,
    categorias,
    perguntas,
    formularioRespondido,
    formulariosEmAnalise,
    loadingFormulariosEmAnalise,
    errorFormulariosEmAnalise,
    getFormularios,
    getCategoriasByFormulario,
    getQuestoesByCategoria,
    getFormularioRespondido,
    saveFormularioRespondido,
    updateFormularioById,
    getFormulariosEmAndamento,

    buscarFormulariosEmAnalise,
  };
};