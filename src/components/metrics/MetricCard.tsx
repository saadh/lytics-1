'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { cn, formatNumber, formatPercentage, getPercentageColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  icon: ReactNode;
  value: number;
  total: number;
  percentage: number;
  description?: string;
  trend?: number;
  trendLabel?: string;
  className?: string;
  compact?: boolean;
}

export function MetricCard({
  title,
  icon,
  value,
  total,
  percentage,
  description,
  trend,
  trendLabel,
  className,
  compact = false,
}: MetricCardProps) {
  const TrendIcon =
    trend !== undefined
      ? trend > 0
        ? TrendingUp
        : trend < 0
        ? TrendingDown
        : Minus
      : null;

  const trendColor =
    trend !== undefined
      ? trend > 0
        ? 'text-green-600'
        : trend < 0
        ? 'text-red-600'
        : 'text-gray-500'
      : '';

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3 p-3 bg-gray-50 rounded-lg', className)}>
        <div className="p-2 rounded-lg bg-white shadow-sm">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">{formatNumber(value)}</span>
            <span className={cn('text-sm font-semibold', getPercentageColor(percentage))}>
              {formatPercentage(percentage)}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate">{title}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
            </div>
          </div>
          {trend !== undefined && TrendIcon && (
            <div className={cn('flex items-center gap-1 text-sm font-medium', trendColor)}>
              <TrendIcon className="w-4 h-4" />
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold text-gray-900">{formatNumber(value)}</span>
              <span className="text-sm text-gray-500 ml-2">/ {formatNumber(total)}</span>
            </div>
            <span className={cn('text-2xl font-bold', getPercentageColor(percentage))}>
              {formatPercentage(percentage)}
            </span>
          </div>

          <ProgressBar value={percentage} size="md" />

          {trendLabel && (
            <p className="text-xs text-gray-500 text-right">{trendLabel}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface MiniMetricProps {
  label: string;
  value: number;
  total: number;
  percentage: number;
  icon?: ReactNode;
}

export function MiniMetric({ label, value, total, percentage, icon }: MiniMetricProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-900">
          {formatNumber(value)}/{formatNumber(total)}
        </span>
        <span className={cn('text-sm font-semibold min-w-[52px] text-right', getPercentageColor(percentage))}>
          {formatPercentage(percentage)}
        </span>
      </div>
    </div>
  );
}

interface MetricSectionHeaderProps {
  title: string;
  icon: ReactNode;
  description?: string;
  action?: ReactNode;
}

export function MetricSectionHeader({ title, icon, description, action }: MetricSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
