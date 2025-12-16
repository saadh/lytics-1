'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { MetricCard, MetricSectionHeader, MiniMetric } from './MetricCard';
import { EntityMetrics } from '@/types';
import { formatNumber, formatPercentage, getPercentageColor, cn } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  Zap,
  LogOut,
  ClipboardCheck,
  UtensilsCrossed,
  Bus,
  Users,
} from 'lucide-react';

interface ActivationSectionProps {
  metrics: EntityMetrics[];
  showComparison?: boolean;
}

export function ActivationSection({ metrics, showComparison = false }: ActivationSectionProps) {
  if (metrics.length === 0) return null;

  const aggregatedMetrics = metrics.length === 1 ? metrics[0] : aggregateActivationMetrics(metrics);

  if (showComparison && metrics.length > 1) {
    return (
      <div className="space-y-4">
        <MetricSectionHeader
          title="Activation"
          icon={<Zap className="w-5 h-5" />}
          description="Feature activation status (to date)"
        />

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-sm font-semibold text-gray-700 px-4 py-3">Entity</th>
                <th className="text-center text-sm font-semibold text-gray-700 px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <LogOut className="w-4 h-4" />
                    Dismissals
                  </div>
                </th>
                <th className="text-center text-sm font-semibold text-gray-700 px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <ClipboardCheck className="w-4 h-4" />
                    Attendance
                  </div>
                </th>
                <th className="text-center text-sm font-semibold text-gray-700 px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <UtensilsCrossed className="w-4 h-4" />
                    Canteen
                  </div>
                </th>
                <th className="text-center text-sm font-semibold text-gray-700 px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <Bus className="w-4 h-4" />
                    Transport
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {metrics.map((metric) => (
                <tr key={metric.entityId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{metric.entityName}</p>
                      <p className="text-xs text-gray-500">
                        {formatNumber(metric.activation.activeStudents)} students
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ComparisonCell
                      value={metric.activation.dismissalActivatedStudents}
                      percentage={metric.activation.dismissalActivationRate}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ComparisonCell
                      value={metric.activation.attendanceActivatedStudents}
                      percentage={metric.activation.attendanceActivationRate}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ComparisonCell
                      value={metric.activation.canteenActivatedStudents}
                      percentage={metric.activation.canteenActivationRate}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ComparisonCell
                      value={metric.activation.transportationActivatedStudents}
                      percentage={metric.activation.transportationActivationRate}
                      note={`of ${formatNumber(metric.activation.busEnrolledStudents)} enrolled`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MetricSectionHeader
        title="Activation"
        icon={<Zap className="w-5 h-5" />}
        description="Feature activation status (to date)"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Dismissals"
          icon={<LogOut className="w-5 h-5 text-blue-600" />}
          value={aggregatedMetrics.activation.dismissalActivatedStudents}
          total={aggregatedMetrics.activation.activeStudents}
          percentage={aggregatedMetrics.activation.dismissalActivationRate}
          description="Requested at least once"
        />

        <MetricCard
          title="Attendance"
          icon={<ClipboardCheck className="w-5 h-5 text-green-600" />}
          value={aggregatedMetrics.activation.attendanceActivatedStudents}
          total={aggregatedMetrics.activation.activeStudents}
          percentage={aggregatedMetrics.activation.attendanceActivationRate}
          description="Marked at least once"
        />

        <MetricCard
          title="Canteen"
          icon={<UtensilsCrossed className="w-5 h-5 text-orange-600" />}
          value={aggregatedMetrics.activation.canteenActivatedStudents}
          total={aggregatedMetrics.activation.activeStudents}
          percentage={aggregatedMetrics.activation.canteenActivationRate}
          description="Wallet created"
        />

        <MetricCard
          title="Transportation"
          icon={<Bus className="w-5 h-5 text-purple-600" />}
          value={aggregatedMetrics.activation.transportationActivatedStudents}
          total={aggregatedMetrics.activation.busEnrolledStudents}
          percentage={aggregatedMetrics.activation.transportationActivationRate}
          description="Notified at least once"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-gray-600 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Total Active Students: <strong className="text-gray-900">{formatNumber(aggregatedMetrics.activation.activeStudents)}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4" />
                <span>Bus Enrolled: <strong className="text-gray-900">{formatNumber(aggregatedMetrics.activation.busEnrolledStudents)}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActivationBar
                label="Dismissals"
                icon={<LogOut className="w-4 h-4" />}
                value={aggregatedMetrics.activation.dismissalActivatedStudents}
                total={aggregatedMetrics.activation.activeStudents}
                percentage={aggregatedMetrics.activation.dismissalActivationRate}
                color="bg-blue-500"
              />
              <ActivationBar
                label="Attendance"
                icon={<ClipboardCheck className="w-4 h-4" />}
                value={aggregatedMetrics.activation.attendanceActivatedStudents}
                total={aggregatedMetrics.activation.activeStudents}
                percentage={aggregatedMetrics.activation.attendanceActivationRate}
                color="bg-green-500"
              />
              <ActivationBar
                label="Canteen"
                icon={<UtensilsCrossed className="w-4 h-4" />}
                value={aggregatedMetrics.activation.canteenActivatedStudents}
                total={aggregatedMetrics.activation.activeStudents}
                percentage={aggregatedMetrics.activation.canteenActivationRate}
                color="bg-orange-500"
              />
              <ActivationBar
                label="Transportation"
                icon={<Bus className="w-4 h-4" />}
                value={aggregatedMetrics.activation.transportationActivatedStudents}
                total={aggregatedMetrics.activation.busEnrolledStudents}
                percentage={aggregatedMetrics.activation.transportationActivationRate}
                color="bg-purple-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ComparisonCellProps {
  value: number;
  percentage: number;
  note?: string;
}

function ComparisonCell({ value, percentage, note }: ComparisonCellProps) {
  return (
    <div className="text-center">
      <p className="font-semibold text-gray-900">{formatNumber(value)}</p>
      <p className={cn('text-sm font-medium', getPercentageColor(percentage))}>
        {formatPercentage(percentage)}
      </p>
      {note && <p className="text-xs text-gray-400 mt-0.5">{note}</p>}
    </div>
  );
}

interface ActivationBarProps {
  label: string;
  icon: React.ReactNode;
  value: number;
  total: number;
  percentage: number;
  color: string;
}

function ActivationBar({ label, icon, value, total, percentage, color }: ActivationBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gray-600">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {formatNumber(value)} / {formatNumber(total)}
          </span>
          <span className={cn('text-sm font-semibold', getPercentageColor(percentage))}>
            {formatPercentage(percentage)}
          </span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function aggregateActivationMetrics(metrics: EntityMetrics[]): EntityMetrics {
  const totalStudents = metrics.reduce((sum, m) => sum + m.activation.totalStudents, 0);
  const activeStudents = metrics.reduce((sum, m) => sum + m.activation.activeStudents, 0);
  const busEnrolled = metrics.reduce((sum, m) => sum + m.activation.busEnrolledStudents, 0);

  const dismissalActivated = metrics.reduce((sum, m) => sum + m.activation.dismissalActivatedStudents, 0);
  const attendanceActivated = metrics.reduce((sum, m) => sum + m.activation.attendanceActivatedStudents, 0);
  const canteenActivated = metrics.reduce((sum, m) => sum + m.activation.canteenActivatedStudents, 0);
  const transportationActivated = metrics.reduce((sum, m) => sum + m.activation.transportationActivatedStudents, 0);

  return {
    entityId: 'aggregated',
    entityName: 'All Selected',
    entityType: 'company',
    verification: metrics[0].verification,
    activation: {
      totalStudents,
      activeStudents,
      dismissalActivatedStudents: dismissalActivated,
      dismissalActivationRate: Math.round((dismissalActivated / activeStudents) * 100 * 10) / 10,
      attendanceActivatedStudents: attendanceActivated,
      attendanceActivationRate: Math.round((attendanceActivated / activeStudents) * 100 * 10) / 10,
      canteenActivatedStudents: canteenActivated,
      canteenActivationRate: Math.round((canteenActivated / activeStudents) * 100 * 10) / 10,
      busEnrolledStudents: busEnrolled,
      transportationActivatedStudents: transportationActivated,
      transportationActivationRate: Math.round((transportationActivated / busEnrolled) * 100 * 10) / 10,
    },
    adoption: metrics[0].adoption,
    staffPerformance: metrics[0].staffPerformance,
  };
}
