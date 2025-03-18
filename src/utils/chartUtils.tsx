
import React from 'react';

// Paleta de cores para gráficos
export const chartColors = [
  'rgba(59, 130, 246, 0.8)', // Azul
  'rgba(99, 102, 241, 0.8)', // Índigo
  'rgba(139, 92, 246, 0.8)', // Roxo
  'rgba(236, 72, 153, 0.8)', // Rosa
  'rgba(239, 68, 68, 0.8)',  // Vermelho
  'rgba(249, 115, 22, 0.8)', // Laranja
  'rgba(245, 158, 11, 0.8)', // Âmbar
  'rgba(16, 185, 129, 0.8)', // Esmeralda
  'rgba(20, 184, 166, 0.8)', // Turquesa
  'rgba(6, 182, 212, 0.8)',  // Ciano
];

// Obtém uma cor com base no índice (cicla pela paleta para conjuntos de dados maiores)
export const getColorByIndex = (index: number): string => {
  return chartColors[index % chartColors.length];
};

// Formata números grandes para serem mais legíveis
export const formatNumber = (num: number): string => {
  if (num === null || isNaN(num)) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else if (Number.isInteger(num)) {
    return num.toString();
  } else {
    return num.toFixed(2);
  }
};

// Gera dados para gráfico de pizza no recharts
export const generatePieChartData = (
  data: Array<{ label: string; value: number }>,
  maxSlices: number = 5
) => {
  if (data.length <= maxSlices) {
    return data.map((item, index) => ({
      ...item,
      fill: getColorByIndex(index),
    }));
  }
  
  // Se tivermos mais fatias do que maxSlices, combine as menores em "Outros"
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const mainSlices = sortedData.slice(0, maxSlices - 1);
  const otherSlices = sortedData.slice(maxSlices - 1);
  
  const otherValue = otherSlices.reduce((sum, item) => sum + item.value, 0);
  
  return [
    ...mainSlices.map((item, index) => ({
      ...item,
      fill: getColorByIndex(index),
    })),
    {
      label: 'Outros',
      value: otherValue,
      fill: getColorByIndex(maxSlices - 1),
    },
  ];
};

// Gera conteúdo de tooltip personalizado para gráficos
export const customTooltipFormatter = (value: number, name: string): [string, string] => {
  return [formatNumber(value), name];
};

// Formata porcentagem para gráficos de pizza
export const renderCustomizedPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};
