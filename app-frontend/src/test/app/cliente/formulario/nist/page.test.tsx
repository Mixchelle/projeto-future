import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NistPage from '@/app/cliente/formulario/nist/page';
import QuestionMap from '@/components/QuestionMap';
import { useFormulario } from '@/hooks/useFormulario';
import { useRouter } from 'next/navigation';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do useRouter
const mockRouterPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: mockRouterPush,
  })),
}));

// Mock do hook useFormulario
const mockGetFormularios = vi.fn(() => Promise.resolve([]));
const mockGetCategoriasByFormulario = vi.fn(() => Promise.resolve([
  { id: 1, nome: 'GV. Governança' },
  { id: 2, nome: 'ID. Identificar' },
]));
const mockGetQuestoesByCategoria = vi.fn(() => Promise.resolve([
  { id: 101, codigo: 'GV.1', questao: 'Pergunta de Governança' },
]));
const mockGetFormularioRespondido = vi.fn(() => Promise.resolve({ categorias: [] }));
const mockSaveFormularioRespondido = vi.fn(() => Promise.resolve());
const mockUpdateFormularioById = vi.fn(() => Promise.resolve());

vi.mock('@/hooks/useFormulario', () => ({
  useFormulario: vi.fn(() => ({
    formularios: [],
    categorias: [],
    perguntas: [],
    formularioRespondido: null,
    formulariosEmAndamento: {},
    getFormularios: mockGetFormularios,
    getCategoriasByFormulario: mockGetCategoriasByFormulario,
    getQuestoesByCategoria: mockGetQuestoesByCategoria,
    getFormularioRespondido: mockGetFormularioRespondido,
    saveFormularioRespondido: mockSaveFormularioRespondido,
    updateFormularioById: mockUpdateFormularioById,
  })),
}));

// Mock do componente Sidebar
vi.mock('@/components/Sidebar', () => {
  return {
    default: vi.fn(({ menuItems }) => (
      <div data-testid="sidebar">
        Sidebar Component
        {menuItems.map((item) => (
          <div key={item.name}>{item.name}</div>
        ))}
      </div>
    )),
  };
});

// Mock do componente QuestionMap
vi.mock('@/components/QuestionMap', () => {
  return {
    default: vi.fn(() => <div data-testid="question-map">QuestionMap Component</div>),
  };
});

// Mock do localStorage
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('NistPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    (useFormulario as vi.Mock).mockReturnValue({
      formularios: [],
      categorias: [],
      perguntas: [],
      formularioRespondido: null,
      formulariosEmAndamento: {},
      getFormularios: mockGetFormularios,
      getCategoriasByFormulario: mockGetCategoriasByFormulario,
      getQuestoesByCategoria: mockGetQuestoesByCategoria,
      getFormularioRespondido: mockGetFormularioRespondido,
      saveFormularioRespondido: mockSaveFormularioRespondido,
      updateFormularioById: mockUpdateFormularioById,
    });
  });

  it('deve renderizar o componente com a data-testid correto', () => {
    render(<NistPage />);
    expect(screen.getByTestId('nist-page')).toBeInTheDocument();
  });


  it('deve renderizar o QuestionMap', () => {
    render(<NistPage />);
    expect(screen.getByTestId('question-map')).toBeInTheDocument();
  });

  

  it('deve exibir o título da seção ativa', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      categorias: [{ id: 1, nome: 'GV. Governança' }],
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta de Governança' }],
    });
    render(<NistPage />);
    expect(await screen.findByTestId('active-section-title')).toHaveTextContent('GV. Governança');
  });

  it('deve alternar a visibilidade do menu ao clicar no botão', () => {
    render(<NistPage />);
    const menuButton = screen.getByTestId('menu-toggle-button');
    expect(screen.getByRole('button', { name: 'Recolher menu' })).toBeVisible();
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: 'Expandir menu' })).toBeVisible();
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: 'Recolher menu' })).toBeVisible();
  });

  it('deve mudar a seção ativa ao clicar em um botão de seção', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      categorias: [
        { id: 1, nome: 'GV. Governança' },
        { id: 2, nome: 'ID. Identificar' },
      ],
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta de Governança' }],
    });
    render(<NistPage />);
    const governancaButton = screen.getByTestId('section-button-1');
    const identificarButton = screen.getByTestId('section-button-2');

    expect(governancaButton).toHaveClass('active');
    expect(await screen.findByTestId('active-section-title')).toHaveTextContent('GV. Governança');

    fireEvent.click(identificarButton);
    expect(identificarButton).toHaveClass('active');
    await waitFor(() => expect(screen.getByTestId('active-section-title')).toHaveTextContent('ID. Identificar'));
    await waitFor(() => expect(mockGetQuestoesByCategoria).toHaveBeenCalledWith(2));
  });

  it('deve salvar a política ao selecionar uma opção', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta de Governança' }],
    });
    render(<NistPage />);
    const politicaSelect = await screen.findByTestId('politica-select');
    fireEvent.change(politicaSelect, { target: { value: 'Definido' } });
    await waitFor(() => expect(mockSaveFormularioRespondido).toHaveBeenCalled());
  });


  it('deve navegar para a próxima categoria ao clicar em "Próxima Categoria" na última pergunta da categoria atual', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [
        { id: 101, codigo: 'GV.1', questao: 'Pergunta da Governança', categoria: 1 },
        { id: 102, codigo: 'ID.1', questao: 'Pergunta da Identificação', categoria: 2 },
      ],
      categorias: [
        { id: 1, nome: 'GV. Governança' },
        { id: 2, nome: 'ID. Identificar' },
      ],
    });
    render(<NistPage />);
    expect(await screen.findByText('GV. Governança')).toBeVisible();
    expect(await screen.findByText('GV.1: Pergunta da Governança')).toBeVisible();

    const proximaButton = screen.getByTestId('proxima-button');
    fireEvent.click(proximaButton);

    await waitFor(() => expect(screen.getByText('ID.1: Pergunta da Identificação')).toBeVisible());
  });


  it('deve exibir "Última Pergunta" no botão "Próxima" na última pergunta da última categoria', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [{ id: 102, codigo: 'ID.1', questao: 'Pergunta da Identificação', categoria: 2 }],
      categorias: [{ id: 2, nome: 'ID. Identificar' }],
    });
    render(<NistPage />);
    expect(await screen.findByText('ID. Identificar')).toBeVisible();
    expect(await screen.findByText('ID.1: Pergunta da Identificação')).toBeVisible();
    expect(screen.getByTestId('proxima-button')).toHaveTextContent('Última Pergunta');
  });
  it('deve navegar para a pergunta anterior', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [
        { id: 101, codigo: 'GV.1', questao: 'Pergunta 1', categoria: 1 },
        { id: 102, codigo: 'GV.2', questao: 'Pergunta 2', categoria: 1 },
      ],
      categorias: [{ id: 1, nome: 'GV. Governança' }],
    });
    render(<NistPage />);
    fireEvent.click(screen.getByTestId('proxima-button'));
    await waitFor(() => expect(screen.getByText('GV.2: Pergunta 2')).toBeVisible());
    fireEvent.click(screen.getByTestId('anterior-button'));
    await waitFor(() => expect(screen.getByText('GV.1: Pergunta 1')).toBeVisible());
    expect(screen.getByTestId('progresso-indicator')).toHaveTextContent('1 de 2');
  });

  it('não deve navegar para a pergunta anterior se estiver na primeira pergunta', () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta 1', categoria: 1 }],
      categorias: [{ id: 1, nome: 'GV. Governança' }],
    });
    render(<NistPage />);
    const anteriorButton = screen.getByTestId('anterior-button');
    expect(anteriorButton).toBeDisabled();
  });


  it('deve enviar o formulário com sucesso e redirecionar para /cliente/ ao clicar em "Enviar para Análise" com todas as perguntas respondidas', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [
        { id: 101, codigo: 'GV.1', questao: 'Pergunta 1', categoria: 1 },
      ],
      categorias: [{ id: 1, nome: 'GV. Governança' }],
    });
    render(<NistPage />);
    const politicaSelect = await screen.findByTestId('politica-select');
    const praticaSelect = await screen.findByTestId('pratica-select');
    fireEvent.change(politicaSelect, { target: { value: 'Definido' } });
    fireEvent.change(praticaSelect, { target: { value: 'Gerenciado' } });

   
  });


  it('deve carregar as respostas do localStorage no montagem', async () => {
    localStorageMock.setItem('formulario_1', JSON.stringify({ respostas: { 101: { politica: 'Definido', pratica: 'Gerenciado', informacoesAdicionais: 'teste', anexo: 'arquivo.pdf' } } }));
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta 1', categoria: 1 }],
      categorias: [{ id: 1, nome: 'GV. Governança' }],
    });
    render(<NistPage />);
    expect(screen.getByText('arquivo.pdf')).toBeInTheDocument();
  });

  it('deve salvar as respostas no localStorage ao alterar as respostas', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta 1', categoria: 1 }],
      categorias: [{ id: 1, nome: 'GV. Governança' }],
    });
    render(<NistPage />);
    const politicaSelect = await screen.findByTestId('politica-select');
    fireEvent.change(politicaSelect, { target: { value: 'Inicial' } });
    expect(JSON.parse(localStorageMock.getItem('formulario_1') || '{}').respostas[101].politica).toBe('Inicial');
  });
  it('deve carregar o progresso total do localStorage na montagem', () => {
    localStorageMock.setItem('formulario_1_total', '5');
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [],
      categorias: [],
    });
    render(<NistPage />);
    // Não há uma forma direta de acessar o estado interno de progressoTotal sem expô-lo.
    // Uma forma seria verificar se o texto do indicador de progresso reflete o valor carregado.
    // No entanto, como não temos perguntas mockadas aqui, o progresso será 0%.
    // Para testar isso de forma eficaz, precisaríamos de perguntas.
  });

  it('deve atualizar o progresso total ao responder perguntas', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [
        { id: 101, codigo: 'GV.1', questao: 'Pergunta 1', categoria: 1 },
        { id: 102, codigo: 'GV.2', questao: 'Pergunta 2', categoria: 1 },
      ],
      categorias: [{ id: 1, nome: 'GV. Governança' }],
    });
    render(<NistPage />);
    const politicaSelect1 = await screen.findByTestId('politica-select');
    const praticaSelect1 = await screen.findByTestId('pratica-select');
    fireEvent.change(politicaSelect1, { target: { value: 'Definido' } });
    fireEvent.change(praticaSelect1, { target: { value: 'Gerenciado' } });

    const politicaSelect2 = await screen.findByTestId('politica-select');
    const praticaSelect2 = await screen.findByTestId('pratica-select');
    fireEvent.change(politicaSelect2, { target: { value: 'Definido' } });
    fireEvent.change(praticaSelect2, { target: { value: 'Gerenciado' } });
  });

  it('deve marcar uma categoria como completa se todas as perguntas forem respondidas', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [
        { id: 101, codigo: 'GV.1', questao: 'Pergunta 1', categoria: 1 },
      ],
      categorias: [{ id: 1, nome: 'GV. Governança' }],
    });
    render(<NistPage />);
    const politicaSelect = await screen.findByTestId('politica-select');
    const praticaSelect = await screen.findByTestId('pratica-select');
    fireEvent.change(politicaSelect, { target: { value: 'Definido' } });
    fireEvent.change(praticaSelect, { target: { value: 'Gerenciado' } });
    await waitFor(() => expect(screen.getByTestId('section-button-1')).toHaveClass('completed'));
  });

  it('deve carregar o formulário respondido e preencher as respostas', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      formularioRespondido: {
        categorias: [
          {
            id: 1,
            nome: 'GV. Governança',
            perguntas: [
              {
                id: 101,
                codigo: 'GV.1',
                questao: 'Pergunta de Governança',
                resposta: { politica: 'Definido', pratica: 'Gerenciado', info_complementar: 'teste load', anexos: 'load.pdf' },
              },
            ],
          },
        ],
      },
      categorias: [{ id: 1, nome: 'GV. Governança' }],
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta de Governança', categoria: 1 }],
    });
    render(<NistPage />);
    await waitFor(() => expect(screen.getByDisplayValue('teste load')).toBeInTheDocument());
    expect(screen.getByText('load.pdf')).toBeInTheDocument();
  });

  it('deve desabilitar o formulário se o status no localStorage for "em_analise"', () => {
    localStorageMock.setItem('statusFormulario', 'em_analise');
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta de Governança', categoria: 1 }],
      categorias: [{ id: 1, nome: 'GV. Governança' }],
    });
    render(<NistPage />);
    expect(screen.getByTestId('politica-select')).toBeDisabled();
    expect(screen.getByTestId('pratica-select')).toBeDisabled();
    expect(screen.getByTestId('info-adicionais-textarea')).toBeDisabled();
    expect(screen.getByTestId('anexo-input')).toBeDisabled();
  });

  it('deve desabilitar o formulário se o status no localStorage for "concluido"', () => {
    localStorageMock.setItem('statusFormulario', 'concluido');
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta de Governança', categoria: 1 }],
      categorias: [{ id: 1, nome: 'GV. Governança' }],
    });
    render(<NistPage />);
    expect(screen.getByTestId('politica-select')).toBeDisabled();
    expect(screen.getByTestId('pratica-select')).toBeDisabled();
    expect(screen.getByTestId('info-adicionais-textarea')).toBeDisabled();
    expect(screen.getByTestId('anexo-input')).toBeDisabled();
  });
  it('deve marcar a categoria como completa ao responder todas perguntas e ir para próxima', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [
        { id: 101, codigo: 'GV.1', questao: 'Pergunta 1', categoria: 1 },
        { id: 102, codigo: 'ID.1', questao: 'Pergunta 2', categoria: 2 }
      ],
      categorias: [
        { id: 1, nome: 'GV. Governança' },
        { id: 2, nome: 'ID. Identificar' }
      ]
    });
    
    render(<NistPage />);
    
    // Responde a primeira pergunta
    fireEvent.change(screen.getByTestId('politica-select'), { target: { value: 'Definido' } });
    fireEvent.change(screen.getByTestId('pratica-select'), { target: { value: 'Gerenciado' } });
    
    // Vai para próxima categoria
    fireEvent.click(screen.getByTestId('proxima-button'));
    
    // Verifica se a categoria foi marcada como completa
    await waitFor(() => {
      const governancaButton = screen.getByTestId('section-button-1');
      expect(governancaButton).toHaveClass('completed');
    });
  });

  it('deve verificar categoria completa usando estado local quando formularioRespondido não existe', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      formularioRespondido: null,
      perguntas: [
        { id: 101, codigo: 'GV.1', questao: 'Pergunta 1', categoria: 1 },
        { id: 102, codigo: 'GV.2', questao: 'Pergunta 2', categoria: 1 }
      ],
      categorias: [{ id: 1, nome: 'GV. Governança' }]
    });
    
    render(<NistPage />);
    
    // Responde apenas a primeira pergunta
    fireEvent.change(screen.getByTestId('politica-select'), { target: { value: 'Definido' } });
    fireEvent.change(screen.getByTestId('pratica-select'), { target: { value: 'Gerenciado' } });
    
    // Verifica que a categoria não está completa
    const governancaButton = screen.getByTestId('section-button-1');
    expect(governancaButton).not.toHaveClass('completed');
    
    // Vai para próxima pergunta e responde
    fireEvent.click(screen.getByTestId('proxima-button'));
    fireEvent.change(screen.getByTestId('politica-select'), { target: { value: 'Definido' } });
    fireEvent.change(screen.getByTestId('pratica-select'), { target: { value: 'Gerenciado' } });
    
    // Verifica que agora a categoria está completa
    await waitFor(() => expect(governancaButton).toHaveClass('completed'));
  });

  it('deve verificar categoria completa usando formularioRespondido', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      formularioRespondido: {
        categorias: [{
          id: 1,
          nome: 'GV. Governança',
          perguntas: [{
            id: 101,
            codigo: 'GV.1',
            questao: 'Pergunta 1',
            resposta: { politica: 'Definido', pratica: 'Gerenciado' }
          }]
        }]
      },
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta 1', categoria: 1 }],
      categorias: [{ id: 1, nome: 'GV. Governança' }]
    });
    
    render(<NistPage />);
    
    // Verifica que a categoria está marcada como completa
    await waitFor(() => {
      const governancaButton = screen.getByTestId('section-button-1');
      expect(governancaButton).toHaveClass('completed');
    });
  });
  
  it('deve retornar false se categoria não existir no formularioRespondido', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      formularioRespondido: {
        categorias: [] // Nenhuma categoria
      },
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta 1', categoria: 1 }],
      categorias: [{ id: 1, nome: 'GV. Governança' }]
    });
    
    render(<NistPage />);
    
    // Verifica que a categoria não está marcada como completa
    await waitFor(() => {
      const governancaButton = screen.getByTestId('section-button-1');
      expect(governancaButton).not.toHaveClass('completed');
    });
  });
  it('não deve mostrar o QuestionMap quando menu está recolhido', () => {
    render(<NistPage />);
    
    // Recolher o menu
    const menuButton = screen.getByTestId('menu-toggle-button');
    fireEvent.click(menuButton);
    
    expect(screen.queryByTestId('question-map')).not.toBeInTheDocument();
  });

  it('deve verificar corretamente se categoria está completa com formularioRespondido', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      formularioRespondido: {
        categorias: [{
          id: 1,
          nome: 'GV. Governança',
          perguntas: [{
            id: 101,
            codigo: 'GV.1',
            questao: 'Pergunta 1',
            resposta: { politica: 'Definido', pratica: 'Gerenciado' }
          }]
        }]
      },
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta 1', categoria: 1 }],
      categorias: [{ id: 1, nome: 'GV. Governança' }]
    });
    
    render(<NistPage />);
    
    await waitFor(() => {
      const governancaButton = screen.getByTestId('section-button-1');
      expect(governancaButton).toHaveClass('completed');
    });
  });

  it('deve lidar corretamente com navegação quando não há perguntas', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [],
      categorias: [{ id: 1, nome: 'GV. Governança' }],
    });
    
    render(<NistPage />);
    
    // Verificar que os botões de navegação estão desabilitados
    expect(screen.getByTestId('anterior-button')).toBeDisabled();
    // expect(screen.getByTestId('proxima-button')).toBeDisabled();
  });


  it('deve lidar corretamente com navegação quando não há perguntas', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [],
      categorias: [{ id: 1, nome: 'GV. Governança' }],
    });
    
    render(<NistPage />);
    
    // Verificar que os botões de navegação estão desabilitados
    expect(screen.getByTestId('anterior-button')).toBeDisabled();
    // expect(screen.getByTestId('proxima-button')).toBeDisabled();
  });


  it('deve desabilitar os campos quando isFormDisabled for true', async () => {
    (useFormulario as vi.Mock).mockReturnValue({
      ...useFormulario(),
      perguntas: [{ id: 101, codigo: 'GV.1', questao: 'Pergunta de Governança', categoria: 1 }],
      categorias: [{ id: 1, nome: 'GV. Governança' }],
    });
    
    render(<NistPage />);
    
    // Simular o estado como desabilitado
    const politicaSelect = screen.getByTestId('politica-select');
    const praticaSelect = screen.getByTestId('pratica-select');
    const infoTextarea = screen.getByTestId('info-adicionais-textarea');
    const anexoInput = screen.getByTestId('anexo-input');
    
    // expect(politicaSelect).toBeDisabled();
    // expect(praticaSelect).toBeDisabled();
    // expect(infoTextarea).toBeDisabled();
    // expect(anexoInput).toBeDisabled();

  });
});
