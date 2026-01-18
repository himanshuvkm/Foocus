export type TimerMode = 'work' | 'short_break' | 'long_break';

export interface TimerSettings {
  workDuration: number; // in seconds
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  longBreakInterval: number; // number of pomodoros before long break
}

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  pomodorosEstimated: number;
  pomodorosCompleted: number;
  status: 'active' | 'completed';
  priority: Priority;
  tags: string[];
  dueDate?: number; // timestamp
  createdAt: number;
  updatedAt: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  timer: TimerSettings;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  soundEnabled: true,
  notificationsEnabled: true,
  timer: {
    workDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    autoStartBreaks: false,
    autoStartWork: false,
    longBreakInterval: 4,
  },
};
