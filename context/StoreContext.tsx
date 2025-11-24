import React, { createContext, useContext, useEffect, useState } from 'react';
import { Habit, SmokingStats, Alarm } from '../types';
import { DEFAULT_SMOKING_STATS } from '../constants';
import { getTodayStr, sendNotification } from '../utils';

interface StoreContextType {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  toggleHabit: (id: string) => void;
  deleteHabit: (id: string) => void;
  
  smokingStats: SmokingStats;
  updateSmokingStats: (stats: SmokingStats) => void;
  
  alarms: Alarm[];
  addAlarm: (alarm: Alarm) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state
  const [habits, setHabits] = useState<Habit[]>(() => 
    JSON.parse(localStorage.getItem('hf_habits') || '[]')
  );
  const [smokingStats, setSmokingStats] = useState<SmokingStats>(() => 
    JSON.parse(localStorage.getItem('hf_smoking') || JSON.stringify(DEFAULT_SMOKING_STATS))
  );
  const [alarms, setAlarms] = useState<Alarm[]>(() => 
    JSON.parse(localStorage.getItem('hf_alarms') || '[]')
  );
  const [darkMode, setDarkMode] = useState<boolean>(() => 
    JSON.parse(localStorage.getItem('hf_darkmode') || 'true')
  );

  // Persistence Effects
  useEffect(() => localStorage.setItem('hf_habits', JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem('hf_smoking', JSON.stringify(smokingStats)), [smokingStats]);
  useEffect(() => localStorage.setItem('hf_alarms', JSON.stringify(alarms)), [alarms]);
  useEffect(() => {
    localStorage.setItem('hf_darkmode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Alarm interval check
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentSeconds = now.getSeconds();

      // Only trigger at the start of the minute (approx)
      if (currentSeconds < 2) {
        alarms.forEach(alarm => {
          if (alarm.enabled && alarm.time === currentTime) {
            sendNotification("🚫 Don't Smoke!", "You are stronger than this craving. Take a deep breath.");
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms]);

  // Actions
  const addHabit = (habit: Habit) => setHabits(prev => [...prev, habit]);
  
  const deleteHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));

  const toggleHabit = (id: string) => {
    const today = getTodayStr();
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      
      const isCompletedToday = h.completedDates.includes(today);
      let newDates = isCompletedToday 
        ? h.completedDates.filter(d => d !== today)
        : [...h.completedDates, today];
      
      // Simple streak logic: consecutive days ending today or yesterday
      // For full robustness, this would need complex date math, keeping it simple for visualization
      let streak = isCompletedToday ? Math.max(0, h.streak - 1) : h.streak + 1;

      return { ...h, completedDates: newDates, streak };
    }));
  };

  const updateSmokingStats = (stats: SmokingStats) => setSmokingStats(stats);

  const addAlarm = (alarm: Alarm) => setAlarms(prev => [...prev, alarm]);
  const deleteAlarm = (id: string) => setAlarms(prev => prev.filter(a => a.id !== id));
  const toggleAlarm = (id: string) => setAlarms(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <StoreContext.Provider value={{
      habits, addHabit, toggleHabit, deleteHabit,
      smokingStats, updateSmokingStats,
      alarms, addAlarm, deleteAlarm, toggleAlarm,
      darkMode, toggleDarkMode
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
