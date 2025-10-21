
export enum Tab {
  Calendar = 'calendar',
  Dashboard = 'dashboard',
  Info = 'info',
  PrayerTimes = 'prayerTimes',
}

// FIX: Added Reminder interface to resolve missing export error in RemindersTab.tsx.
export interface Reminder {
  id: number;
  date: string;
  time: string;
  message: string;
}
