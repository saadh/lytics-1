import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

export function formatPercentage(value: number): string {
  return value.toFixed(1) + '%';
}

export function getPercentageColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  if (percentage >= 40) return 'text-orange-500';
  return 'text-red-500';
}

export function getPercentageBgColor(percentage: number): string {
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-yellow-500';
  if (percentage >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

export function getProgressBarColor(percentage: number): string {
  if (percentage >= 80) return 'bg-gradient-to-r from-green-400 to-green-600';
  if (percentage >= 60) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
  if (percentage >= 40) return 'bg-gradient-to-r from-orange-400 to-orange-600';
  return 'bg-gradient-to-r from-red-400 to-red-600';
}

export function getChartColors(): string[] {
  return [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#06B6D4', // cyan
    '#84CC16', // lime
    '#F97316', // orange
    '#6366F1', // indigo
  ];
}
