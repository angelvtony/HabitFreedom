export type HabitType = 'build' | 'quit';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  frequency: 'daily'; // Simplified for this demo
  streak: number;
  completedDates: string[]; // ISO Date strings YYYY-MM-DD
  createdAt: string;
}

export interface SmokingStats {
  quitDate: string | null; // ISO Timestamp
  cigarettesPerDay: number;
  costPerPack: number;
  currency: string;
}

export interface Alarm {
  id: string;
  time: string; // HH:MM (24h format)
  enabled: boolean;
  label: string;
}

export interface AppState {
  habits: Habit[];
  smokingStats: SmokingStats;
  alarms: Alarm[];
  darkMode: boolean;
}
