export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const getTodayStr = (): string => new Date().toISOString().split('T')[0];

export const formatCurrency = (amount: number, symbol: string) => {
  return `${symbol} ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const calculateTimeDifference = (startDate: string) => {
  const start = new Date(startDate).getTime();
  const now = new Date().getTime();
  const diff = now - start;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, totalDays: diff / (1000 * 60 * 60 * 24) };
};

export const checkNotificationPermission = async () => {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
    return false;
  }
  if (Notification.permission === "granted") {
    return true;
  }
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
};

export const sendNotification = (title: string, body: string) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: '/vite.svg' }); // utilizing default vite icon if present or fallback
  }
};