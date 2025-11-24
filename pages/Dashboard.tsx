import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle, Circle, Plus, Trash2, Zap } from 'lucide-react';
import { getTodayStr, generateId } from '../utils';
import { TIPS } from '../constants';
import { motion } from 'framer-motion';
import Modal from '../components/Modal';

const Dashboard: React.FC = () => {
  const { habits, toggleHabit, deleteHabit, addHabit } = useStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitType, setNewHabitType] = useState<'build' | 'quit'>('build');

  const todayStr = getTodayStr();
  const todayTip = TIPS[new Date().getDate() % TIPS.length];

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    addHabit({
      id: generateId(),
      name: newHabitName,
      type: newHabitType,
      frequency: 'daily',
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString()
    });
    setNewHabitName('');
    setModalOpen(false);
  };

  const completionRate = habits.length > 0
    ? Math.round((habits.filter(h => h.completedDates.includes(todayStr)).length / habits.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header & Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
          <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
          <p className="opacity-90 mb-4">You have completed {completionRate}% of your goals today.</p>
          <div className="w-full bg-black/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-secondary mb-2 font-semibold">
            <Zap size={18} />
            <span>Tip of the Day</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 italic">"{todayTip}"</p>
        </div>
      </div>

      {/* Habits List */}
      <div className="flex items-center justify-between mt-8">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Today's Habits</h3>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          <Plus size={18} />
          <span>New Habit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-400">
                <p>No habits tracked yet. Start today!</p>
            </div>
        )}
        {habits.map((habit) => {
          const isCompleted = habit.completedDates.includes(todayStr);
          return (
            <motion.div
              layout
              key={habit.id}
              className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                isCompleted 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleHabit(habit.id)}
                  className={`transition-transform active:scale-90 ${
                    isCompleted ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  {isCompleted ? <CheckCircle size={32} fill="currentColor" className="text-white dark:text-slate-900" /> : <Circle size={32} />}
                </button>
                <div>
                  <h4 className={`font-semibold ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-white'}`}>
                    {habit.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className={`px-2 py-0.5 rounded-full ${habit.type === 'quit' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                      {habit.type.toUpperCase()}
                    </span>
                    <span>🔥 {habit.streak} day streak</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => deleteHabit(habit.id)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create New Habit">
        <form onSubmit={handleAddHabit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Habit Name</label>
            <input 
              type="text" 
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="e.g. Read 10 pages, No Smoking..."
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white focus:ring-2 focus:ring-primary outline-none"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Type</label>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setNewHabitType('build')}
                className={`flex-1 py-2 rounded-lg border ${newHabitType === 'build' ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' : 'border-slate-300 dark:border-slate-600 text-slate-500'}`}
              >
                Build
              </button>
              <button 
                type="button"
                onClick={() => setNewHabitType('quit')}
                className={`flex-1 py-2 rounded-lg border ${newHabitType === 'quit' ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900 dark:text-red-300' : 'border-slate-300 dark:border-slate-600 text-slate-500'}`}
              >
                Quit
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition"
          >
            Create Habit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;