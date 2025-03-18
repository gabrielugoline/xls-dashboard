
import React, { useState, useEffect } from 'react';
import { PieChart as RechartsProPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { generatePieChartData, renderCustomizedPieLabel, customTooltipFormatter } from '@/utils/chartUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PieChartProps {
  data: Array<{ label: string; value: number }>;
  title: string;
  className?: string;
  loading?: boolean;
}

export function PieChart({ data, title, className, loading = false }: PieChartProps) {
  const [chartData, setChartData] = useState<Array<{ label: string; value: number; fill: string }>>([]);
  
  useEffect(() => {
    if (data) {
      setChartData(generatePieChartData(data));
    }
  }, [data]);

  if (loading) {
    return (
      <div className={cn("w-full h-full min-h-[300px] rounded-xl bg-white p-4 flex flex-col", className)}>
        <Skeleton className="h-7 w-3/4 mb-6" />
        <div className="flex-1 flex items-center justify-center">
          <Skeleton className="h-[200px] w-[200px] rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full min-h-[300px] rounded-xl bg-white p-4 flex flex-col", className)}>
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      <div className="flex-1">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsProPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedPieLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="label"
                animationBegin={0}
                animationDuration={800}
                className="animate-fade-in"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-90 transition-opacity" />
                ))}
              </Pie>
              <Tooltip formatter={customTooltipFormatter} />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
              />
            </RechartsProPieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}
