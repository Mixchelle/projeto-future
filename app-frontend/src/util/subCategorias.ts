export const subcategorias = {
    "GV": [
      { id: "GV.OC", subcategoria: "Contexto organizacional GV.OC" },
      { id: "GV.RM", subcategoria: "Estratégia de gerenciamento de riscos GV.RM" },
      { id: "GV.RR", subcategoria: "Funções, responsabilidades e autoridades GV.RR" },
      { id: "GV.PO", subcategoria: "Política GV.PO" },
      { id: "GV.OV", subcategoria: "Supervisão GV.OV" },
      { id: "GV.SC", subcategoria: "Segurança cibernética Gerenciamento de riscos da cadeia de suprimentos GV.SC" },
    ],
    "ID": [
      { id: "ID.AM", subcategoria: "Gestão de Ativos ID.AM" },
      { id: "ID.RA", subcategoria: "Avaliação de Risco ID.RA" },
      { id: "ID.IM", subcategoria: "Melhoria ID.IM" },
      { id: "ID.BE", subcategoria: "Comportamento da organização ID.BE" },
    ],
    "PR": [
      { id: "PR.AA", subcategoria: "Gerenciamento de Identidade, Autenticação e Controle de Acesso PR.AA" },
      { id: "PR.AT", subcategoria: "Conscientização e Treinamento PR.AT" },
      { id: "PR.DS", subcategoria: "Segurança de Dados PR.DS" },
      { id: "PR.PS", subcategoria: "Segurança de Plataforma PR.PS" },
      { id: "PR.IR", subcategoria: "Resiliência da Infraestrutura Tecnológica PR.IR" },
      { id: "PR.AC", subcategoria: "Gerenciamento de identidade, autenticação e controle de acesso PR.AC" },
      { id: "PR.IP", subcategoria: "Processos e procedimentos de proteção da informação PR.IP" },
      { id: "PR.MA", subcategoria: "Manutenção PR.MA" },
      { id: "PR.PT", subcategoria: "Tecnologia de proteção PR.PT" },
    ],
    "DE": [
      { id: "DE.CM", subcategoria: "Monitoramento Contínuo DE.CM" },
      { id: "DE.AE", subcategoria: "Análise de Eventos Adversos DE.AE" },
      { id: "DE.DP", subcategoria: "Processos de detecção DE.DP" },
    ],
    "RS": [
      { id: "RS.MA", subcategoria: "Gestão de Incidentes RS.MA" },
      { id: "RS.AN", subcategoria: "Análise de Incidentes RS.AN" },
      { id: "RS.CO", subcategoria: "Relatório e Comunicação de Resposta a Incidentes RS.CO" },
      { id: "RS.MI", subcategoria: "Mitigação de Incidentes RS.MI" },
      { id: "RS.RP", subcategoria: "Planejamento de resposta RS.RP" },
      { id: "RS.IM", subcategoria: "Melhorias RS.IM" },
    ],
    "RC": [
      { id: "RC.RP", subcategoria: "Execução do Plano de Recuperação de Incidentes RC.RP" },
      { id: "RC.CO", subcategoria: "Comunicação de Recuperação de Incidentes RC.CO" },
      { id: "RC.IM", subcategoria: "Melhorias RC.IM" },
    ],
  };
  
  // Função utilitária que recebe a sigla e retorna a descrição da subcategoria
  export function getDescricaoSubcategoria(sigla: string): string | undefined {
    for (const categoria in subcategorias) {
      const subcategoria = subcategorias[categoria].find(item => item.id === sigla);
      if (subcategoria) {
        return subcategoria.subcategoria;
      }
    }
    return `${sigla}nao achei`; // Caso a sigla não seja encontrada
  }

  const ordemCategorias = ["GV", "ID", "PR", "DE", "RS", "RC"];


  export function agruparPorCategoria(dados) {
    const resultado = {};
  
    // Percorre cada chave do objeto
    Object.keys(dados).forEach(chave => {
      const itemArray = dados[chave];
  
      // Extrai a categoria (parte antes do ponto no ID)
      itemArray.forEach(item => {
        const categoria = item.id.split('.')[0];
  
        // Se a categoria ainda não existe no resultado, cria um array vazio para ela
        if (!resultado[categoria]) {
          resultado[categoria] = [];
        }
  
        // Adiciona o item ao array da categoria correspondente
        resultado[categoria].push(item);
      });
    });
  
    return resultado;
  }
  
  