
import React from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getColorByIndex, formatNumber } from '@/utils/chartUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface BarChartProps {
  data: Array<{ label: string; value: number }>;
  title: string;
  className?: string;
  loading?: boolean;
  horizontal?: boolean;
}

export function BarChart({ 
  data, 
  title, 
  className, 
  loading = false,
  horizontal = false 
}: BarChartProps) {
  // Prepare data for recharts
  const chartData = data.map(item => ({
    name: item.label,
    value: item.value
  }));

  if (loading) {
    return (
      <div className={cn("w-full h-full min-h-[300px] rounded-xl bg-white p-4 flex flex-col", className)}>
        <Skeleton className="h-7 w-3/4 mb-6" />
        <div className="flex-1">
          <div className="grid grid-cols-6 gap-2 h-[200px] items-end">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className={`w-full h-[${Math.random() * 100 + 50}px]`} />
            ))}
          </div>
          <Skeleton className="h-5 w-full mt-4" />
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
            <RechartsBarChart
              data={chartData}
              layout={horizontal ? 'vertical' : 'horizontal'}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              {horizontal ? (
                <>
                  <XAxis type="number" tickFormatter={formatNumber} />
                  <YAxis type="category" dataKey="name" width={120} />
                </>
              ) : (
                <>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatNumber} />
                </>
              )}
              <Tooltip 
                formatter={(value: number) => [formatNumber(value), 'Value']}
                contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                fill={getColorByIndex(0)} 
                animationBegin={0}
                animationDuration={800}
                radius={[4, 4, 0, 0]}
                className="animate-fade-in"
              />
            </RechartsBarChart>
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
