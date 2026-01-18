
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, ReferenceLine
} from 'recharts';

interface ForecastData {
  year: number;
  risk: number;
}

interface SHAPData {
  feature: string;
  impact: number;
}

export const RiskForecastChart: React.FC<{ data: ForecastData[] }> = ({ data }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="year" stroke="#64748b" />
        <YAxis domain={[0, 100]} stroke="#64748b" />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} dot={{ r: 6, fill: '#ef4444' }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const ExplainabilityChart: React.FC<{ data: SHAPData[] }> = ({ data }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart layout="vertical" data={data} margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
        <XAxis type="number" domain={[-1, 1]} stroke="#64748b" />
        <YAxis dataKey="feature" type="category" stroke="#64748b" />
        <Tooltip cursor={{ fill: '#f1f5f9' }} />
        <ReferenceLine x={0} stroke="#94a3b8" />
        <Bar dataKey="impact">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#ef4444' : '#22c55e'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);
