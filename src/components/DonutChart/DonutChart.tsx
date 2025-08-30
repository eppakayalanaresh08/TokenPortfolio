import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: string;
}

interface DonutChartProps {
  data: ChartData[];
}

export const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  // Show all tokens, including those with 0 value
  // This ensures ALL tokens are displayed in the chart
  const validData = data.filter(item => item.value >= 0); // Include all tokens with 0 or positive values
  
  // For tokens with 0 value, give them a minimal value so they're visible
  const chartData = validData.map(item => ({
    ...item,
    value: item.value === 0 ? 0.01 : item.value // Minimal value for 0% tokens
  }));
  
  return (
    <div className="relative w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] lg:w-[280px] lg:h-[280px] ">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={95}
            paddingAngle={chartData.length > 1 ? 1 : 0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Center text showing total items */}
      {validData.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm sm:text-base font-medium" style={{ color: '#A1A1AA' }}>
              {/* {validData.length} Token{validData.length !== 1 ? 's' : ''} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};