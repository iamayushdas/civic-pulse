import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateComplaintId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `DL-${timestamp}${random}`;
}

export function getSlaDays(priority: string): number {
  if (priority === 'URGENT') return 2;
  if (priority === 'HIGH') return 5;
  if (priority === 'LOW') return 14;
  return 7;
}

export function getSlaDueAt(createdAt: Date, priority: string): Date {
  const dueAt = new Date(createdAt);
  dueAt.setDate(dueAt.getDate() + getSlaDays(priority));
  return dueAt;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'JUST NOW';
  if (diffMins < 60) return `${diffMins} MIN${diffMins > 1 ? 'S' : ''} AGO`;
  if (diffHours < 24) return `${diffHours} HOUR${diffHours > 1 ? 'S' : ''} AGO`;
  if (diffDays < 7) return `${diffDays} DAY${diffDays > 1 ? 'S' : ''} AGO`;
  return formatDate(d).toUpperCase();
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}
