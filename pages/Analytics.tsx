import React from 'react';
import { useStore } from '../context/StoreContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getTodayStr } from '../utils';

const Analytics: React.FC = () => {
  const { habits } = useStore();
  
  // Prepare data for completion chart (Last 7 days)
  const getLast7Days = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const last7Days = getLast7Days();
  const barData = last7Days.map(date => {
    const completedCount = habits.filter(h => h.completedDates.includes(date)).length;
    // Format date MM-DD
    const label = date.slice(5); 
    return { date: label, completed: completedCount };
  });

  // Calculate generic stats
  const totalCompleted = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  // Heatmap Logic (Simplified 35 day grid)
  const heatmapDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    const dateStr = d.toISOString().split('T')[0];
    const completionLevel = habits.length > 0 
        ? habits.filter(h => h.completedDates.includes(dateStr)).length / habits.length 
        : 0;
    return { date: dateStr, level: completionLevel };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics</h2>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <h3 className="text-3xl font-bold text-primary">{totalCompleted}</h3>
            <p className="text-slate-500 text-sm">Total Check-ins</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <h3 className="text-3xl font-bold text-secondary">{bestStreak}</h3>
            <p className="text-slate-500 text-sm">Best Streak</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Last 7 Days Activity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
              <Tooltip 
                 cursor={{fill: 'rgba(255,255,255,0.1)'}}
                 contentStyle={{ borderRadius: '8px', border: 'none', background: '#1e293b', color: '#fff' }}
              />
              <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#6366f1" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Consistency Map</h3>
        <div className="grid grid-cols-7 gap-2">
            {heatmapDays.map((day, i) => {
                // Color intensity based on completion level
                let bgColor = 'bg-slate-100 dark:bg-slate-700';
                if(day.level > 0) bgColor = 'bg-indigo-200 dark:bg-indigo-900';
                if(day.level > 0.4) bgColor = 'bg-indigo-400 dark:bg-indigo-700';
                if(day.level > 0.7) bgColor = 'bg-indigo-600 dark:bg-indigo-500';

                return (
                    <div key={i} className="aspect-square relative group">
                        <div className={`w-full h-full rounded-md ${bgColor} transition-colors`}></div>
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                            {day.date}
                        </div>
                    </div>
                )
            })}
        </div>
        <div className="flex justify-end items-center gap-2 mt-2 text-xs text-slate-500">
            <span>Less</span>
            <div className="w-3 h-3 bg-slate-100 dark:bg-slate-700 rounded"></div>
            <div className="w-3 h-3 bg-indigo-200 dark:bg-indigo-900 rounded"></div>
            <div className="w-3 h-3 bg-indigo-400 dark:bg-indigo-700 rounded"></div>
            <div className="w-3 h-3 bg-indigo-600 dark:bg-indigo-500 rounded"></div>
            <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
