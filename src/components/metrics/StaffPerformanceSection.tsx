'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { MetricSectionHeader } from './MetricCard';
import { EntityMetrics } from '@/types';
import { formatNumber, formatPercentage, getPercentageColor, cn } from '@/lib/utils';
import {
  Users,
  Clock,
  AlertTriangle,
  CalendarCheck,
  Calendar,
  TrendingDown,
  Timer,
  CheckSquare,
} from 'lucide-react';

interface StaffPerformanceSectionProps {
  metrics: EntityMetrics[];
  showComparison?: boolean;
  dateRangeLabel?: string;
}

export function StaffPerformanceSection({ metrics, showComparison = false, dateRangeLabel }: StaffPerformanceSectionProps) {
  if (metrics.length === 0) return null;

  const aggregatedMetrics = metrics.length === 1 ? metrics[0] : aggregateStaffMetrics(metrics);

  if (showComparison && metrics.length > 1) {
    return (
      <div className="space-y-4">
        <MetricSectionHeader
          title="Staff Performance"
          icon={<Users className="w-5 h-5" />}
          description="Operational metrics during selected period"
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
                    <AlertTriangle className="w-4 h-4" />
                    Undelivered
                  </div>
                </th>
                <th className="text-center text-sm font-semibold text-gray-700 px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <CheckSquare className="w-4 h-4" />
                    Attendance
                  </div>
                </th>
                <th className="text-center text-sm font-semibold text-gray-700 px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <Timer className="w-4 h-4" />
                    Avg. Delivery
                  </div>
                </th>
                <th className="text-center text-sm font-semibold text-gray-700 px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <CalendarCheck className="w-4 h-4" />
                    Days Marked
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {metrics.map((metric) => (
                <tr key={metric.entityId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{metric.entityName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">
                        {formatNumber(metric.staffPerformance.undeliveredRequests)}
                      </p>
                      <p className={cn(
                        'text-sm font-medium',
                        metric.staffPerformance.undeliveredRate < 3 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {formatPercentage(metric.staffPerformance.undeliveredRate)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">
                        {formatNumber(metric.staffPerformance.studentsWithAttendance)}
                      </p>
                      <p className={cn('text-sm font-medium', getPercentageColor(metric.staffPerformance.attendanceRate))}>
                        {formatPercentage(metric.staffPerformance.attendanceRate)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-center">
                      <p className={cn(
                        'text-xl font-bold',
                        metric.staffPerformance.averageDeliveryTimeMinutes <= 5 ? 'text-green-600' :
                        metric.staffPerformance.averageDeliveryTimeMinutes <= 8 ? 'text-yellow-600' : 'text-red-600'
                      )}>
                        {metric.staffPerformance.averageDeliveryTimeMinutes}
                      </p>
                      <p className="text-xs text-gray-500">minutes</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">
                        {metric.staffPerformance.attendanceDaysMarked}
                      </p>
                      <p className="text-xs text-gray-500">
                        of {metric.staffPerformance.totalSchoolDays} days
                      </p>
                    </div>
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
        title="Staff Performance"
        icon={<Users className="w-5 h-5" />}
        description="Operational metrics during selected period"
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
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-red-50">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <Badge
                variant={aggregatedMetrics.staffPerformance.undeliveredRate < 3 ? 'success' : 'danger'}
              >
                {aggregatedMetrics.staffPerformance.undeliveredRate < 3 ? 'Good' : 'Needs Attention'}
              </Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Undelivered Requests</h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatNumber(aggregatedMetrics.staffPerformance.undeliveredRequests)}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                of {formatNumber(aggregatedMetrics.staffPerformance.totalPickupRequests)} total
              </span>
              <span className={cn(
                'font-semibold',
                aggregatedMetrics.staffPerformance.undeliveredRate < 3 ? 'text-green-600' : 'text-red-600'
              )}>
                {formatPercentage(aggregatedMetrics.staffPerformance.undeliveredRate)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-green-50">
                <CheckSquare className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Attendance Marked</h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {formatNumber(aggregatedMetrics.staffPerformance.studentsWithAttendance)}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">students</span>
              <span className={cn(
                'font-semibold',
                getPercentageColor(aggregatedMetrics.staffPerformance.attendanceRate)
              )}>
                {formatPercentage(aggregatedMetrics.staffPerformance.attendanceRate)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-blue-50">
                <Timer className="w-5 h-5 text-blue-600" />
              </div>
              <Badge
                variant={
                  aggregatedMetrics.staffPerformance.averageDeliveryTimeMinutes <= 5
                    ? 'success'
                    : aggregatedMetrics.staffPerformance.averageDeliveryTimeMinutes <= 8
                    ? 'warning'
                    : 'danger'
                }
              >
                {aggregatedMetrics.staffPerformance.averageDeliveryTimeMinutes <= 5
                  ? 'Excellent'
                  : aggregatedMetrics.staffPerformance.averageDeliveryTimeMinutes <= 8
                  ? 'Good'
                  : 'Slow'}
              </Badge>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Avg. Delivery Time</h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {aggregatedMetrics.staffPerformance.averageDeliveryTimeMinutes}
              <span className="text-lg font-normal text-gray-500 ml-1">min</span>
            </p>
            <p className="text-sm text-gray-500">
              for dismissal requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-purple-50">
                <CalendarCheck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Attendance Days</h3>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {aggregatedMetrics.staffPerformance.attendanceDaysMarked}
              <span className="text-lg font-normal text-gray-500 ml-1">
                / {aggregatedMetrics.staffPerformance.totalSchoolDays}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              days with attendance marked
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Dismissal Efficiency</h4>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Average Response Time</p>
                    <p className="text-xs text-gray-500">From request to delivery</p>
                  </div>
                </div>
                <p className={cn(
                  'text-2xl font-bold',
                  aggregatedMetrics.staffPerformance.averageDeliveryTimeMinutes <= 5 ? 'text-green-600' :
                  aggregatedMetrics.staffPerformance.averageDeliveryTimeMinutes <= 8 ? 'text-yellow-600' : 'text-red-600'
                )}>
                  {aggregatedMetrics.staffPerformance.averageDeliveryTimeMinutes} min
                </p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white">
                    <TrendingDown className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Undelivered Rate</p>
                    <p className="text-xs text-gray-500">Requests not fulfilled</p>
                  </div>
                </div>
                <p className={cn(
                  'text-2xl font-bold',
                  aggregatedMetrics.staffPerformance.undeliveredRate < 3 ? 'text-green-600' : 'text-red-600'
                )}>
                  {formatPercentage(aggregatedMetrics.staffPerformance.undeliveredRate)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Attendance Tracking</h4>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Students Tracked</p>
                    <p className="text-xs text-gray-500">With attendance marked</p>
                  </div>
                </div>
                <p className={cn(
                  'text-2xl font-bold',
                  getPercentageColor(aggregatedMetrics.staffPerformance.attendanceRate)
                )}>
                  {formatPercentage(aggregatedMetrics.staffPerformance.attendanceRate)}
                </p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white">
                    <CalendarCheck className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Days Coverage</p>
                    <p className="text-xs text-gray-500">Attendance marked</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {aggregatedMetrics.staffPerformance.attendanceDaysMarked}/{aggregatedMetrics.staffPerformance.totalSchoolDays}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function aggregateStaffMetrics(metrics: EntityMetrics[]): EntityMetrics {
  const totalPickupRequests = metrics.reduce((sum, m) => sum + m.staffPerformance.totalPickupRequests, 0);
  const undeliveredRequests = metrics.reduce((sum, m) => sum + m.staffPerformance.undeliveredRequests, 0);
  const studentsWithAttendance = metrics.reduce((sum, m) => sum + m.staffPerformance.studentsWithAttendance, 0);
  const totalStudents = metrics.reduce((sum, m) => sum + m.verification.totalStudents, 0);
  const totalSchoolDays = Math.max(...metrics.map(m => m.staffPerformance.totalSchoolDays));
  const attendanceDaysMarked = Math.round(
    metrics.reduce((sum, m) => sum + m.staffPerformance.attendanceDaysMarked, 0) / metrics.length
  );

  // Weighted average for delivery time
  const avgDeliveryTime = Math.round(
    metrics.reduce((sum, m) =>
      sum + m.staffPerformance.averageDeliveryTimeMinutes * m.staffPerformance.totalPickupRequests, 0
    ) / totalPickupRequests * 10
  ) / 10;

  return {
    entityId: 'aggregated',
    entityName: 'All Selected',
    entityType: 'company',
    verification: metrics[0].verification,
    activation: metrics[0].activation,
    adoption: metrics[0].adoption,
    staffPerformance: {
      totalPickupRequests,
      undeliveredRequests,
      undeliveredRate: Math.round((undeliveredRequests / totalPickupRequests) * 100 * 10) / 10,
      studentsWithAttendance,
      attendanceRate: Math.round((studentsWithAttendance / totalStudents) * 100 * 10) / 10,
      averageDeliveryTimeMinutes: avgDeliveryTime,
      attendanceDaysMarked,
      totalSchoolDays,
    },
  };
}
