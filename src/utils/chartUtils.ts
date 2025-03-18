
// Color palette for charts
export const chartColors = [
  'rgba(59, 130, 246, 0.8)', // Blue
  'rgba(99, 102, 241, 0.8)', // Indigo
  'rgba(139, 92, 246, 0.8)', // Purple
  'rgba(236, 72, 153, 0.8)', // Pink
  'rgba(239, 68, 68, 0.8)',  // Red
  'rgba(249, 115, 22, 0.8)', // Orange
  'rgba(245, 158, 11, 0.8)', // Amber
  'rgba(16, 185, 129, 0.8)', // Emerald
  'rgba(20, 184, 166, 0.8)', // Teal
  'rgba(6, 182, 212, 0.8)',  // Cyan
];

// Get a color based on index (cycles through the palette for larger datasets)
export const getColorByIndex = (index: number): string => {
  return chartColors[index % chartColors.length];
};

// Format large numbers to be more readable
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

// Generate recharts data for pie chart
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
  
  // If we have more slices than maxSlices, combine the smallest into "Other"
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
      label: 'Other',
      value: otherValue,
      fill: getColorByIndex(maxSlices - 1),
    },
  ];
};

// Generate custom tooltip content for charts
export const customTooltipFormatter = (value: number, name: string): [string, string] => {
  return [formatNumber(value), name];
};

// Format percentage for pie charts
export const renderCustomizedPieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
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
