import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, Activity, Wind, Bell, Settings, Sun, Moon, Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
  const { darkMode, toggleDarkMode } = useStore();

  const navItems = [
    { icon: <Home size={22} />, label: 'Dashboard', path: '/' },
    { icon: <Wind size={22} />, label: 'Quit Tracker', path: '/smoke-free' },
    { icon: <Activity size={22} />, label: 'Analytics', path: '/analytics' },
    { icon: <Bell size={22} />, label: 'Alarms', path: '/alarms' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar / Bottom Nav */}
      <nav className="fixed md:relative bottom-0 w-full md:w-64 h-16 md:h-screen bg-white/80 dark:bg-slate-900/90 backdrop-blur-lg border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-800 z-50 flex md:flex-col items-center justify-between p-2 md:p-6 shadow-2xl md:shadow-none">
        
        <div className="hidden md:flex items-center gap-3 mb-8 w-full">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
            HF
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            HabitFreedom
          </h1>
        </div>

        <div className="flex md:flex-col w-full justify-around md:justify-start gap-1 md:gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-indigo-300 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400'}
              `}
            >
              {item.icon}
              <span className="hidden md:block">{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex flex-col gap-4 w-full mt-auto">
          <button 
            onClick={toggleDarkMode}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto mb-16 md:mb-0">
         {/* Mobile Header */}
         <div className="md:hidden flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">HabitFreedom</h1>
            <button onClick={toggleDarkMode} className="p-2 bg-slate-200 dark:bg-slate-800 rounded-full">
               {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
         </div>

         <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
         >
           <Outlet />
         </motion.div>
      </main>
    </div>
  );
};

export default Layout;
