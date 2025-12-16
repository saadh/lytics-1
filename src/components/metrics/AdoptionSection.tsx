'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { MetricCard, MetricSectionHeader } from './MetricCard';
import { EntityMetrics } from '@/types';
import { formatNumber, formatPercentage, getPercentageColor, cn } from '@/lib/utils';
import {
  TrendingUp,
  LogOut,
  ClipboardCheck,
  UtensilsCrossed,
  Bus,
  Users,
  Calendar,
} from 'lucide-react';

interface AdoptionSectionProps {
  metrics: EntityMetrics[];
  showComparison?: boolean;
  dateRangeLabel?: string;
}

export function AdoptionSection({ metrics, showComparison = false, dateRangeLabel }: AdoptionSectionProps) {
  if (metrics.length === 0) return null;

  const aggregatedMetrics = metrics.length === 1 ? metrics[0] : aggregateAdoptionMetrics(metrics);

  if (showComparison && metrics.length > 1) {
    return (
      <div className="space-y-4">
        <MetricSectionHeader
          title="Adoption"
          icon={<TrendingUp className="w-5 h-5" />}
          description="Feature usage during selected period"
          action={
            dateRangeLabel && (
              <Badge variant="info" className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {dateRangeLabel}
              </Badge>
            )
          }
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
                        {formatNumber(metric.adoption.activeStudents)} students
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ComparisonCell
                      value={metric.adoption.dismissalAdoptedStudents}
                      percentage={metric.adoption.dismissalAdoptionRate}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ComparisonCell
                      value={metric.adoption.attendanceAdoptedStudents}
                      percentage={metric.adoption.attendanceAdoptionRate}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ComparisonCell
                      value={metric.adoption.canteenAdoptedStudents}
                      percentage={metric.adoption.canteenAdoptionRate}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <ComparisonCell
                      value={metric.adoption.transportationAdoptedStudents}
                      percentage={metric.adoption.transportationAdoptionRate}
                      note={`of ${formatNumber(metric.adoption.busEnrolledStudents)} enrolled`}
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
        title="Adoption"
        icon={<TrendingUp className="w-5 h-5" />}
        description="Feature usage during selected period"
        action={
          dateRangeLabel && (
            <Badge variant="info" className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {dateRangeLabel}
            </Badge>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Dismissals"
          icon={<LogOut className="w-5 h-5 text-blue-600" />}
          value={aggregatedMetrics.adoption.dismissalAdoptedStudents}
          total={aggregatedMetrics.adoption.activeStudents}
          percentage={aggregatedMetrics.adoption.dismissalAdoptionRate}
          description="Unique students requested"
        />

        <MetricCard
          title="Attendance"
          icon={<ClipboardCheck className="w-5 h-5 text-green-600" />}
          value={aggregatedMetrics.adoption.attendanceAdoptedStudents}
          total={aggregatedMetrics.adoption.activeStudents}
          percentage={aggregatedMetrics.adoption.attendanceAdoptionRate}
          description="Unique students marked"
        />

        <MetricCard
          title="Canteen"
          icon={<UtensilsCrossed className="w-5 h-5 text-orange-600" />}
          value={aggregatedMetrics.adoption.canteenAdoptedStudents}
          total={aggregatedMetrics.adoption.activeStudents}
          percentage={aggregatedMetrics.adoption.canteenAdoptionRate}
          description="Unique purchasers"
        />

        <MetricCard
          title="Transportation"
          icon={<Bus className="w-5 h-5 text-purple-600" />}
          value={aggregatedMetrics.adoption.transportationAdoptedStudents}
          total={aggregatedMetrics.adoption.busEnrolledStudents}
          percentage={aggregatedMetrics.adoption.transportationAdoptionRate}
          description="Unique pickups/dropoffs"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Adoption Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AdoptionStat
              label="Dismissals"
              icon={<LogOut className="w-4 h-4 text-blue-600" />}
              adopted={aggregatedMetrics.adoption.dismissalAdoptedStudents}
              total={aggregatedMetrics.adoption.activeStudents}
              percentage={aggregatedMetrics.adoption.dismissalAdoptionRate}
            />
            <AdoptionStat
              label="Attendance"
              icon={<ClipboardCheck className="w-4 h-4 text-green-600" />}
              adopted={aggregatedMetrics.adoption.attendanceAdoptedStudents}
              total={aggregatedMetrics.adoption.activeStudents}
              percentage={aggregatedMetrics.adoption.attendanceAdoptionRate}
            />
            <AdoptionStat
              label="Canteen"
              icon={<UtensilsCrossed className="w-4 h-4 text-orange-600" />}
              adopted={aggregatedMetrics.adoption.canteenAdoptedStudents}
              total={aggregatedMetrics.adoption.activeStudents}
              percentage={aggregatedMetrics.adoption.canteenAdoptionRate}
            />
            <AdoptionStat
              label="Transport"
              icon={<Bus className="w-4 h-4 text-purple-600" />}
              adopted={aggregatedMetrics.adoption.transportationAdoptedStudents}
              total={aggregatedMetrics.adoption.busEnrolledStudents}
              percentage={aggregatedMetrics.adoption.transportationAdoptionRate}
            />
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

interface AdoptionStatProps {
  label: string;
  icon: React.ReactNode;
  adopted: number;
  total: number;
  percentage: number;
}

function AdoptionStat({ label, icon, adopted, total, percentage }: AdoptionStatProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <p className={cn('text-3xl font-bold', getPercentageColor(percentage))}>
        {formatPercentage(percentage)}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        {formatNumber(adopted)} of {formatNumber(total)}
      </p>
    </div>
  );
}

function aggregateAdoptionMetrics(metrics: EntityMetrics[]): EntityMetrics {
  const totalStudents = metrics.reduce((sum, m) => sum + m.adoption.totalStudents, 0);
  const activeStudents = metrics.reduce((sum, m) => sum + m.adoption.activeStudents, 0);
  const busEnrolled = metrics.reduce((sum, m) => sum + m.adoption.busEnrolledStudents, 0);

  const dismissalAdopted = metrics.reduce((sum, m) => sum + m.adoption.dismissalAdoptedStudents, 0);
  const attendanceAdopted = metrics.reduce((sum, m) => sum + m.adoption.attendanceAdoptedStudents, 0);
  const canteenAdopted = metrics.reduce((sum, m) => sum + m.adoption.canteenAdoptedStudents, 0);
  const transportationAdopted = metrics.reduce((sum, m) => sum + m.adoption.transportationAdoptedStudents, 0);

  return {
    entityId: 'aggregated',
    entityName: 'All Selected',
    entityType: 'company',
    verification: metrics[0].verification,
    activation: metrics[0].activation,
    adoption: {
      totalStudents,
      activeStudents,
      dismissalAdoptedStudents: dismissalAdopted,
      dismissalAdoptionRate: Math.round((dismissalAdopted / activeStudents) * 100 * 10) / 10,
      attendanceAdoptedStudents: attendanceAdopted,
      attendanceAdoptionRate: Math.round((attendanceAdopted / activeStudents) * 100 * 10) / 10,
      canteenAdoptedStudents: canteenAdopted,
      canteenAdoptionRate: Math.round((canteenAdopted / activeStudents) * 100 * 10) / 10,
      busEnrolledStudents: busEnrolled,
      transportationAdoptedStudents: transportationAdopted,
      transportationAdoptionRate: Math.round((transportationAdopted / busEnrolled) * 100 * 10) / 10,
    },
    staffPerformance: metrics[0].staffPerformance,
  };
}
