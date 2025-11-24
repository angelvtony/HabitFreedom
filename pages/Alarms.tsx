import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Bell, BellOff, Clock, Plus, Trash2 } from 'lucide-react';
import { generateId, checkNotificationPermission } from '../utils';
import Modal from '../components/Modal';

const Alarms: React.FC = () => {
  const { alarms, addAlarm, deleteAlarm, toggleAlarm } = useStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [time, setTime] = useState('09:00');
  const [label, setLabel] = useState('Daily Check-in');
  const [permissionGranted, setPermissionGranted] = useState(Notification.permission === 'granted');

  const handleEnableNotifications = async () => {
    const granted = await checkNotificationPermission();
    setPermissionGranted(granted);
    if (!granted) {
      alert("Please enable notifications in your browser settings to use this feature.");
    }
  };

  const handleAddAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    addAlarm({
      id: generateId(),
      time,
      label,
      enabled: true
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Notifications</h2>
        <button 
          onClick={() => setModalOpen(true)}
          disabled={!permissionGranted}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition ${
            permissionGranted ? 'bg-primary hover:bg-indigo-600' : 'bg-slate-400 cursor-not-allowed'
          }`}
        >
          <Plus size={18} />
          <span>Add Alert</span>
        </button>
      </div>

      {!permissionGranted && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3 text-yellow-800 dark:text-yellow-200">
            <BellOff size={24} />
            <p className="font-medium">Notifications are disabled</p>
          </div>
          <button 
            onClick={handleEnableNotifications}
            className="text-sm font-semibold bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 px-3 py-1.5 rounded-lg"
          >
            Enable Now
          </button>
        </div>
      )}

      {permissionGranted && (
        <p className="text-sm text-slate-500 italic">
          * Ensure this tab remains open to receive notifications at your set times.
        </p>
      )}

      <div className="space-y-3">
        {alarms.length === 0 && (
          <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <Bell size={48} className="mx-auto mb-2 opacity-50" />
            <p>No alarms set. Add a trigger time for cravings.</p>
          </div>
        )}
        
        {alarms.map(alarm => (
          <div 
            key={alarm.id} 
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${alarm.enabled ? 'bg-indigo-100 text-primary dark:bg-indigo-900' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}>
                <Clock size={24} />
              </div>
              <div>
                <p className={`text-2xl font-bold font-mono ${alarm.enabled ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                  {alarm.time}
                </p>
                <p className="text-sm text-slate-500">{alarm.label}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={alarm.enabled} onChange={() => toggleAlarm(alarm.id)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
              <button onClick={() => deleteAlarm(alarm.id)} className="text-slate-400 hover:text-red-500 transition">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Set Trigger Warning">
        <form onSubmit={handleAddAlarm} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Time</label>
            <input 
              type="time" 
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Label</label>
            <input 
              type="text" 
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Morning Craving"
              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent dark:text-white"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition"
          >
            Save Alarm
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Alarms;
