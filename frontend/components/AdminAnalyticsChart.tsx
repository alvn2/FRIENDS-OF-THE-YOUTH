import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  month: string;
  donations: number;
  volunteers: number;
}

interface AdminAnalyticsChartProps {
  data: ChartData[];
}

const AdminAnalyticsChart: React.FC<AdminAnalyticsChartProps> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-dark-card p-4 md:p-6 rounded-lg shadow-md h-96">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Monthly Trends</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="month" tick={{ fill: 'rgb(107 114 128)' }} fontSize={12} />
          <YAxis yAxisId="left" tickFormatter={(value) => `KES ${Number(value) / 1000}k`} tick={{ fill: '#8884d8' }} fontSize={12} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: '#82ca9d' }} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
            wrapperClassName="dark:!bg-dark-card/90 dark:!border-gray-600"
            labelStyle={{ color: '#333', fontWeight: 'bold' }}
            formatter={(value, name) => {
                if (name === 'Donations (KES)') {
                    return [`KES ${Number(value).toLocaleString()}`, name];
                }
                return [value, name];
            }}
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="donations" name="Donations (KES)" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
          <Line yAxisId="right" type="monotone" dataKey="volunteers" name="New Volunteers" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminAnalyticsChart;