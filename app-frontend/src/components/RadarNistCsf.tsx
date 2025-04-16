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
      objetivo: sub.objetivo ?? 0,  // Update this to get the real objective value
    }))
  );

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

          {/* Áreas de fundo por categoria */}
          {Object.entries(data.subcategorias).map(([categoria, subs], indexCategoria) => {
            const numSubcategorias = Object.values(data.subcategorias).flat().length;
            const startIndex = Object.values(data.subcategorias)
              .slice(0, indexCategoria)
              .flat()
              .length;

            return subs.map((sub, indexSubcategoria) => {
              const angleStart = -Math.PI / 2 + (2 * Math.PI * (startIndex + indexSubcategoria)) / numSubcategorias;
              const angleEnd = -Math.PI / 2 + (2 * Math.PI * (startIndex + indexSubcategoria + 1)) / numSubcategorias;
              const outerRadius = 180;
              const innerRadius = 0;

              return (
                <Sector
                  key={`sector-${categoria}-${sub.id}`}
                  cx={200}
                  cy={200}
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  startAngle={angleStart * (180 / Math.PI)}
                  endAngle={angleEnd * (180 / Math.PI)}
                  fill={categoriaCoresClaras[categoria]}
                  opacity={0.3}
                />
              );
            });
          })}

          {/* Gráfico real com cores personalizadas */}
          <Radar name="Política" dataKey="politica" stroke="#2980b9" fill="#2980b9" fillOpacity={0.3} />
          <Radar name="Prática" dataKey="pratica" stroke="#2ecc71" fill="#2ecc71" fillOpacity={0.3} />
          <Radar
            name="Objetivo"
            dataKey="objetivo"
            stroke="#ffcc80"
            fill="#ffcc80"
            fillOpacity={0.3}
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
