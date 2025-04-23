'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from 'recharts';
import useAvaliacao from '@/hooks/useAvaliacao';

const categoriaCoresClaras: Record<string, string> = {
  GV: '#a7d9ed',
  ID: '#aeecca',
  PR: '#d2b4de',
  DE: '#f5cba7',
  RS: '#f2b4b4',
  RC: '#a2ded0'
};

const RadarNistCsf: React.FC = () => {
  const formularioId = localStorage.getItem("formularioRespondidoId");
  const { data, loading, error } = useAvaliacao(Number(formularioId));
  
  if (loading || error || !data) return null;

  // Map table data into radar chart data format
  const radarData = Object.entries(data.subcategorias).flatMap(([categoria, subs]) =>
    subs.map(sub => ({
      categoria,
      nome: sub.subcategoria,
      politica: sub.politica ?? 0,
      pratica: sub.pratica ?? 0,
      objetivo: sub.objetivo ?? 0,
    }))
  );

  // Agrupar subcategorias por categoria principal
  const categoriasPrincipais = data.categorias.map(cat => ({
    sigla: cat.sigla,
    nome: cat.categoria,
    subcategorias: data.subcategorias[cat.sigla] || []
  }));

  return (
    <div className="radar-nist-container p-4 bg-white shadow rounded-md max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">Radar NIST CSF</h2>
      <ResponsiveContainer width="100%" height={600}>
        <RadarChart outerRadius={180} data={radarData}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="nome"
            tick={{ fontSize: 10 }}
            stroke="#333"
          />
          <PolarRadiusAxis angle={90} domain={[0, 5]} tickCount={6} />
          {/* Gráfico real com cores personalizadas */}
          <Radar name="Política" dataKey="politica" stroke="#1f77b4" fill="#1f77b4" fillOpacity={0.2} />
          <Radar name="Prática" dataKey="pratica" stroke="#8e44ad" fill="#8e44ad" fillOpacity={0.2} />
          <Radar
            name="Objetivo"
            dataKey="objetivo"
            stroke="#2ca02c"
            fill="#2ca02c"
            fillOpacity={0.1}
            strokeWidth={2}
          />

          <Tooltip />
          <Legend verticalAlign="top" />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarNistCsf;