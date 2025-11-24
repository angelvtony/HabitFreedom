import { SmokingStats } from './types';

export const DEFAULT_SMOKING_STATS: SmokingStats = {
  quitDate: null,
  cigarettesPerDay: 10,
  costPerPack: 330, // Approx cost in INR
  currency: '₹',
};

export const TIPS = [
  "Craving lasts only 3-5 minutes. Distract yourself!",
  "Drink a glass of water slowly when you feel the urge.",
  "Remind yourself: Not one puff, no matter what.",
  "Exercise releases dopamine, the same chemical nicotine releases.",
  "Visualize your lungs healing with every breath you take.",
  "Money saved today is financial freedom tomorrow.",
  "Delay, Distract, Deep breathe, Drink water.",
];

export const HEALTH_TIMELINE = [
  { time: '20 mins', benefit: 'Heart rate drops to normal.' },
  { time: '8 hours', benefit: 'Carbon monoxide levels in blood drop to normal.' },
  { time: '24 hours', benefit: 'Risk of heart attack begins to decrease.' },
  { time: '48 hours', benefit: 'Nerve endings regrow; taste and smell improve.' },
  { time: '2 weeks', benefit: 'Circulation improves; lung function increases.' },
  { time: '1 year', benefit: 'Risk of coronary heart disease is half that of a smoker.' },
];