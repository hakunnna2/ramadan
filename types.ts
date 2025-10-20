export enum Tab {
  Calendar = 'calendar',
  Progress = 'progress',
  Info = 'info',
  Reminders = 'reminders',
}

export interface Reminder {
  id: number;
  date: string;
  time: string;
  message: string;
}
