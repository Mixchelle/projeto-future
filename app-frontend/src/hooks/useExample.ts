import { useState } from 'react'; export function useExample() { const [state, setState] = useState(null); return { state, setState }; }
// const mockData: AvaliacaoData = {
//   formulario: {
//     id: 1,
//     nome: "Avaliação de Maturidade em Segurança Cibernética",
//     cliente: 1,
//     categorias: [
//       { categoria: "Governança", sigla: "GV", media: 2.1, politica: 3, pratica: 1.2, objetivo: 3.0, status: "Atenção" },
//       { categoria: "Identificar", sigla: "ID", media: 1.8, politica: 2, pratica: 1.6,objetivo: 3.0, status: "Crítico" },
//       { categoria: "Proteger", sigla: "PR", media: 3.5, politica: 4, pratica: 3, objetivo: 3.0, status: "Bom" },
//       { categoria: "Detectar", sigla: "DE", media: 2.5, politica: 3.2, pratica: 1.8, objetivo: 3.0, status: "Regular" },
//       { categoria: "Responder", sigla: "RS", media: 4.0, politica: 4.5, pratica: 3.5, objetivo: 3.0, status: "Excelente" },
//       { categoria: "Recuperar", sigla: "RC", media: 3.0, politica: 3.8, pratica: 2.2,objetivo: 3.0, status: "Atenção" },
//     ],
//     subcategorias: {
//       "GV": [
//         { id: "GV.OC", subcategoria: "Contexto organizacional GV.OC", politica: 2.5, pratica: 3.0, objetivo: 3.0},
//         { id: "GV.RM", subcategoria: "Estratégia de gerenciamento de riscos GV.RM", politica: 2.0, pratica: 2.5, objetivo: 3.0 },
//         { id: "GV.RR", subcategoria: "Funções, responsabilidades e autoridades GV.RR", politica: 3.0, pratica: 3.5, objetivo: 3.0 },
//         { id: "GV.PO", subcategoria: "Política GV.PO", politica: 1.5, pratica: 2.0, objetivo: 3.0 },
//         { id: "GV.OV", subcategoria: "Supervisão GV.OV", politica: 2.8, pratica: 3.2, objetivo: 3.0 },
//         { id: "GV.SC", subcategoria: "Segurança cibernética Gerenciamento de riscos da cadeia de suprimentos GV.SC", politica: 1.0, pratica: 1.5, objetivo: 3.0 },
//       ],
//       "ID": [
//         { id: "ID.RA", subcategoria: "Gerenciamento de riscos ID.RA", politica: 1.8, pratica: 2.2, objetivo: 3.0 },
//         { id: "ID.AM", subcategoria: "Ameaças e vulnerabilidades ID.AM", politica: 1.5, pratica: 1.9, objetivo: 3.0 },
//         { id: "ID.BE", subcategoria: "Comportamento da organização ID.BE", politica: 2.0, pratica: 2.4, objetivo: 3.0 },
//       ],
//       "PR": [
//         { id: "PR.AC", subcategoria: "Gerenciamento de identidade, autenticação e controle de acesso PR.AC", politica: 3.5, pratica: 3.8, objetivo: 3.0 },
//         { id: "PR.AT", subcategoria: "Conscientização e treinamento PR.AT", politica: 4.0, pratica: 4.2, objetivo: 3.0 },
//         { id: "PR.DS", subcategoria: "Segurança de dados PR.DS", politica: 3.0, pratica: 3.3, objetivo: 3.0 },
//         { id: "PR.IP", subcategoria: "Processos e procedimentos de proteção da informação PR.IP", politica: 3.8, pratica: 4.0, objetivo: 3.0 },
//         { id: "PR.MA", subcategoria: "Manutenção PR.MA", politica: 2.5, pratica: 2.8, objetivo: 3.0 },
//         { id: "PR.PT", subcategoria: "Tecnologia de proteção PR.PT", politica: 3.2, pratica: 3.5, objetivo: 3.0 },
//       ],
//       "DE": [
//         { id: "DE.AE", subcategoria: "Anomalias e eventos DE.AE", politica: 2.8, pratica: 3.0, objetivo: 3.0 },
//         { id: "DE.CM", subcategoria: "Monitoramento contínuo de segurança DE.CM", politica: 2.5, pratica: 2.7, objetivo: 3.0 },
//         { id: "DE.DP", subcategoria: "Processos de detecção DE.DP", politica: 2.2, pratica: 2.4, objetivo: 3.0 },
//       ],
//       "RS": [
//         { id: "RS.RP", subcategoria: "Planejamento de resposta RS.RP", politica: 4.0, pratica: 4.3, objetivo: 3.0 },
//         { id: "RS.CO", subcategoria: "Comunicações RS.CO", politica: 3.5, pratica: 3.8, objetivo: 3.0 },
//         { id: "RS.AN", subcategoria: "Análise RS.AN", politica: 3.0, pratica: 3.3, objetivo: 3.0 },
//         { id: "RS.MI", subcategoria: "Mitigação RS.MI", politica: 4.2, pratica: 4.5, objetivo: 3.0 },
//         { id: "RS.IM", subcategoria: "Melhorias RS.IM", politica: 3.8, pratica: 4.0, objetivo: 3.0 },
//       ],
//       "RC": [
//         { id: "RC.RP", subcategoria: "Planejamento de recuperação RC.RP", politica: 3.2, pratica: 3.5, objetivo: 3.0 },
//         { id: "RC.IM", subcategoria: "Melhorias RC.IM", politica: 2.8, pratica: 3.0, objetivo: 3.0 },
//         { id: "RC.CO", subcategoria: "Comunicações RC.CO", politica: 3.5, pratica: 3.7, objetivo: 3.0 },
//       ],
//     },
//   };  };