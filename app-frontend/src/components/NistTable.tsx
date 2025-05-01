"use client";

import React from 'react';
import useAvaliacao from '@/hooks/useAvaliacao';

const NistCsfTable: React.FC = () => {
  const formularioId = localStorage.getItem("formularioRespondidoId");
  const { data, loading, error } = useAvaliacao(Number(formularioId));

  if (loading) return <div className="nist-loading">Carregando...</div>;
  if (error) return <div className="nist-error">{error}</div>;
  if (!data) return <div className="nist-no-data">Nenhum dado disponível</div>;

  const getScoreClass = (value: number | undefined) => {
    if (value === undefined || value === null) return "";

    if (value >= 5) return "score-excellent"; // Verde escuro: excelente
    if (value >= 4) return "score-good";      // Verde claro: esperado
    if (value >= 3) return "score-ok";        // Amarelo: aceitável
    if (value >= 2) return "score-low";       // Laranja: precisa melhorar
    return "score-critical";                  // Vermelho: crítico
  };

  const renderSub = (sigla: string, id: string, nome: string, showCategoria = false, rowspan = 1) => {
    const sub = data?.subcategorias[id]?.[0];

    return (
      <tr data-category={sigla}>
        {showCategoria && (
          <td className="category-cell" rowSpan={rowspan}>
            {sigla}
          </td>
        )}
        <td>{nome}</td>
        <td className="text-center">{sub?.objetivo?.toFixed(2)}</td>
        <td className={`text-center ${getScoreClass(sub?.politica)}`}>
          {sub?.politica?.toFixed(2) || "-"}
        </td>
        <td className={`text-center ${getScoreClass(sub?.pratica)}`}>
          {sub?.pratica?.toFixed(2) || "-"}
        </td>
      </tr>
    );
  };



  return (
    <div className="nist-csf-container">
      <p className="nist-csf-title">NIST CSF Versão 2.0</p>
      <div className="table-container-nist">
        <table className="nist-csf-table">
          <thead>
            <tr>
              <th></th>
              <th>Overall</th>
              <th>Objetivo</th>
              <th>Política</th>
              <th>Prática</th>
            </tr>
          </thead>
          <tbody>
            {/* GOV */}
            {renderSub("GV", "GV.OC", "Contexto organizacional GV.OC", true, 6)}
            {renderSub("GV", "GV.RM", "Estratégia de gerenciamento de riscos GV.RM")}
            {renderSub("GV", "GV.RR", "Papéis, Responsabilidades e Autoridades GV.RR")}
            {renderSub("GV", "GV.PO", "Política GV.PO")}
            {renderSub("GV", "GV.OV", "Fiscalização GV.OV")}
            {renderSub("GV", "GV.SC", "Gestão de Riscos da Cadeia de Suprimentos de Cibersegurança GV.SC")}

            {/* ID */}
            {renderSub("ID", "ID.AM", "Gestão de Ativos ID.AM", true, 3)}
            {renderSub("ID", "ID.RA", "Avaliação de Risco ID.RA")}
            {renderSub("ID", "ID.IM", "Melhoria ID.IM")}

            {/* PR */}
            {renderSub("PR", "PR.AA", "Gerenciamento de Identidade, Autenticação e Controle de Acesso PR.AA", true, 5)}
            {renderSub("PR", "PR.AT", "Conscientização e Treinamento PR.AT")}
            {renderSub("PR", "PR.DS", "Segurança de Dados PR.DS")}
            {renderSub("PR", "PR.PS", "Segurança de Plataforma PR.PS")}
            {renderSub("PR", "PR.IR", "Resiliência da Infraestrutura Tecnológica PR.IR")}

            {/* DE */}
            {renderSub("DE", "DE.CM", "Monitoramento contínuo DE.CM", true, 2)}
            {renderSub("DE", "DE.AE", "Análise de eventos adversos DE.AE")}

            {/* RS */}
            {renderSub("RS", "RS.MA", "Gerenciamento de incidentes RS.MA", true, 4)}
            {renderSub("RS", "RS.AN", "Análise de incidentes RS.AN")}
            {renderSub("RS", "RS.CO", "Comunicação e relatórios de resposta a incidentes RS.CO")}
            {renderSub("RS", "RS.MI", "Mitigação de incidentes RS.MI")}

            {/* RC */}
            {renderSub("RC", "RC.RP", "Execução do plano de recuperação de incidentes RC.RP", true, 2)}
            {renderSub("RC", "RC.CO", "Comunicação de recuperação de incidentes RC.CO")}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-center"><strong>Média Total</strong></td>
              <td className="text-center">
                <strong>{data?.mediaEmpresa?.mediaPolitica}</strong>
              </td>
              <td className="text-center">
              <strong>{data?.mediaEmpresa?.mediaPratica}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default NistCsfTable;
