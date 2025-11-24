import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, calculateTimeDifference } from '../utils';
import { HEALTH_TIMELINE } from '../constants';
import { Clock, IndianRupee, Heart, Cigarette } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SmokeFree: React.FC = () => {
  const { smokingStats, updateSmokingStats } = useStore();
  const [timeElapsed, setTimeElapsed] = useState({ days: 0, hours: 0, minutes: 0, totalDays: 0 });
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [cost, setCost] = useState(smokingStats.costPerPack);
  const [perDay, setPerDay] = useState(smokingStats.cigarettesPerDay);

  useEffect(() => {
    if (!smokingStats.quitDate) return;
    
    const updateTimer = () => {
      setTimeElapsed(calculateTimeDifference(smokingStats.quitDate!));
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [smokingStats.quitDate]);

  const handleStartQuit = () => {
    updateSmokingStats({
      ...smokingStats,
      quitDate: new Date().toISOString()
    });
  };

  const handleSaveSettings = () => {
    updateSmokingStats({
      ...smokingStats,
      costPerPack: Number(cost),
      cigarettesPerDay: Number(perDay)
    });
    setIsEditing(false);
  };

  // Calculations
  const moneySaved = smokingStats.quitDate 
    ? (timeElapsed.totalDays * (smokingStats.cigarettesPerDay / 20) * smokingStats.costPerPack) 
    : 0;
    
  const cigsNotSmoked = smokingStats.quitDate 
    ? Math.floor(timeElapsed.totalDays * smokingStats.cigarettesPerDay) 
    : 0;

  // Chart Data (Mock projection)
  const chartData = [
    { name: 'Day 0', saved: 0 },
    { name: 'Day 7', saved: ((smokingStats.cigarettesPerDay/20) * smokingStats.costPerPack) * 7 },
    { name: 'Day 14', saved: ((smokingStats.cigarettesPerDay/20) * smokingStats.costPerPack) * 14 },
    { name: 'Day 30', saved: ((smokingStats.cigarettesPerDay/20) * smokingStats.costPerPack) * 30 },
  ];

  if (!smokingStats.quitDate && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full">
            <Cigarette size={64} className="text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Ready to quit?</h2>
        <p className="text-slate-500 max-w-md">Start your journey today. Track your progress, money saved, and health recovery.</p>
        <button 
          onClick={handleStartQuit}
          className="bg-primary hover:bg-indigo-700 text-white text-lg px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-500/30"
        >
          I Stopped Smoking Just Now
        </button>
        <button onClick={() => setIsEditing(true)} className="text-primary underline">Configure settings first</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Quit Journey</h2>
        <button onClick={() => setIsEditing(!isEditing)} className="text-sm text-slate-500 hover:text-primary">
          {isEditing ? 'Cancel' : 'Edit Settings'}
        </button>
      </div>

      {isEditing && (
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white">Settings</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-slate-500">Cost per Pack (₹)</label>
                    <input type="number" value={cost} onChange={e => setCost(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                </div>
                <div>
                    <label className="text-xs text-slate-500">Cigs per Day</label>
                    <input type="number" value={perDay} onChange={e => setPerDay(Number(e.target.value))} className="w-full p-2 border rounded dark:bg-slate-900 dark:border-slate-600 dark:text-white" />
                </div>
            </div>
            <div className="flex gap-2">
                <button onClick={handleSaveSettings} className="bg-primary text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => updateSmokingStats({...smokingStats, quitDate: null})} className="text-red-500 px-4 py-2">Reset Quit Date</button>
            </div>
        </div>
      )}

      {/* Main Counter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-2xl text-center shadow-xl">
          <p className="text-slate-400 font-medium mb-2 uppercase tracking-wider">Smoke Free For</p>
          <div className="flex justify-center gap-4 text-4xl md:text-6xl font-bold font-mono">
            <div className="flex flex-col">
              <span>{timeElapsed.days}</span>
              <span className="text-xs md:text-sm font-sans font-normal text-slate-400">DAYS</span>
            </div>
            <span className="text-slate-600">:</span>
            <div className="flex flex-col">
              <span>{timeElapsed.hours}</span>
              <span className="text-xs md:text-sm font-sans font-normal text-slate-400">HRS</span>
            </div>
            <span className="text-slate-600">:</span>
            <div className="flex flex-col">
              <span>{timeElapsed.minutes}</span>
              <span className="text-xs md:text-sm font-sans font-normal text-slate-400">MINS</span>
            </div>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Money Saved</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{formatCurrency(moneySaved, smokingStats.currency)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <Heart size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Life Regained</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{(cigsNotSmoked * 11 / 60).toFixed(1)} hrs</p>
            <p className="text-xs text-slate-400">Based on 11mins/cig</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-full">
            <Cigarette size={24} className="rotate-45" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Not Smoked</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{cigsNotSmoked}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Savings Projection</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="saved" stroke="#10b981" fillOpacity={1} fill="url(#colorSaved)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Health Timeline */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Health Recovery</h3>
        <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {HEALTH_TIMELINE.map((item, index) => (
            <div key={index} className="relative pl-8">
              <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-slate-800"></div>
              <p className="text-sm font-bold text-primary">{item.time}</p>
              <p className="text-slate-600 dark:text-slate-400">{item.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmokeFree;