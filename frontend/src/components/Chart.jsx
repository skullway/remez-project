import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// The tooltip is updated to show "Visits" and format the number
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-gray-800/90 rounded-lg shadow-xl border border-gray-600 backdrop-blur-sm">
        <p className="label text-base font-bold text-white">{label}</p>
        <p className="intro text-sm text-cyan-400">
          Visits: {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const Chart = ({ rawStats }) => {
  const [view, setView] = useState('daily');

  const chartData = useMemo(() => {
      if (!rawStats || rawStats.length === 0) return [];
      
      const sortedStats = [...rawStats].sort((a, b) => new Date(a.date) - new Date(b.date));

      if (view === 'daily') {
          return sortedStats.map(stat => ({
              visits: stat.visits,
              formattedDate: new Date(stat.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
              }),
          }));
      }

      // Aggregates data for weekly or monthly view.
      const aggregated = sortedStats.reduce((acc, stat) => {
          const date = new Date(stat.date);
          let key;

          if (view === 'weekly') {
              const day = date.getDay();
              const diff = date.getDate() - day + (day === 0 ? -6 : 1);
              const weekStartDate = new Date(new Date(date).setDate(diff));
              key = weekStartDate.toISOString().split('T')[0];
          } else { // 'monthly'
              key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
          }

          if (!acc[key]) {
              acc[key] = { date: new Date(key), visits: 0 };
          }
          acc[key].visits += stat.visits;
          return acc;
      }, {});
      
      return Object.values(aggregated).map(item => {
          let formattedDate;
          if (view === 'weekly') {
              formattedDate = `Week of ${item.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
          } else { // 'monthly'
              formattedDate = item.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          }
          return { visits: item.visits, formattedDate };
      });
  }, [rawStats, view]);

  const getButtonClass = (buttonView) => `px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${view === buttonView ? 'bg-cyan-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`;

  return (
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 transition-all duration-300 hover:shadow-cyan-500/20">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 px-2">
              <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0 text-center sm:text-left">
                  {`${view.charAt(0).toUpperCase() + view.slice(1)} Website Visits`}
              </h2>
              <div className="flex items-center space-x-2 bg-gray-900/50 p-1 rounded-lg">
                  <button onClick={() => setView('daily')} className={getButtonClass('daily')}>Daily</button>
                  <button onClick={() => setView('weekly')} className={getButtonClass('weekly')}>Weekly</button>
                  <button onClick={() => setView('monthly')} className={getButtonClass('monthly')}>Monthly</button>
              </div>
          </div>
          <div className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" strokeOpacity={0.4} />
                      <XAxis dataKey="formattedDate" stroke="#cbd5e1" tick={{ fill: '#a0aec0', fontSize: 12 }} angle={-10} textAnchor="end" height={50} />
                      <YAxis stroke="#cbd5e1" tick={{ fill: '#a0aec0' }} />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '3 3' }} />
                      <Area type="monotone" dataKey="visits" stroke="#06b6d4" fill="url(#areaGradient)" strokeWidth={3} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }}/>
                  </AreaChart>
              </ResponsiveContainer>
          </div>
      </div>
  );
};

export default Chart;