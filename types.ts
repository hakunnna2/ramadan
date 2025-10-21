export enum Tab {
  Calendar = 'calendar',
  Dashboard = 'dashboard',
  Info = 'info',
  Reminders = 'reminders',
}

export interface Reminder {
  id: number;
  date: string;
  time: string;
  message: string;
}
