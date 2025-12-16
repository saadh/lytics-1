'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { MetricCard, MetricSectionHeader } from './MetricCard';
import { EntityMetrics } from '@/types';
import { formatNumber, formatPercentage, getPercentageColor } from '@/lib/utils';
import { ShieldCheck, Users, CheckCircle2 } from 'lucide-react';

interface VerificationSectionProps {
  metrics: EntityMetrics[];
  showComparison?: boolean;
}

export function VerificationSection({ metrics, showComparison = false }: VerificationSectionProps) {
  if (metrics.length === 0) return null;

  // Aggregate metrics if showing single view
  const aggregatedMetrics = metrics.length === 1 ? metrics[0] : aggregateVerificationMetrics(metrics);

  if (showComparison && metrics.length > 1) {
    return (
      <div className="space-y-4">
        <MetricSectionHeader
          title="Verification"
          icon={<ShieldCheck className="w-5 h-5" />}
          description="Parent verification status across selected schools"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.entityId} className="overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <h3 className="font-semibold text-gray-900">{metric.entityName}</h3>
                <Badge variant="info" size="sm" className="mt-1">
                  {metric.entityType}
                </Badge>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Active Students</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(metric.verification.activeStudents)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Verified</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatNumber(metric.verification.verifiedStudents)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Rate</span>
                  <span className={`text-xl font-bold ${getPercentageColor(metric.verification.verificationRate)}`}>
                    {formatPercentage(metric.verification.verificationRate)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MetricSectionHeader
        title="Verification"
        icon={<ShieldCheck className="w-5 h-5" />}
        description="Parent verification status (to date)"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Verified Students"
          icon={<CheckCircle2 className="w-5 h-5 text-green-600" />}
          value={aggregatedMetrics.verification.verifiedStudents}
          total={aggregatedMetrics.verification.activeStudents}
          percentage={aggregatedMetrics.verification.verificationRate}
          description="Students verified by parents"
        />

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Verification Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Verified</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(aggregatedMetrics.verification.verifiedStudents)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatPercentage(aggregatedMetrics.verification.verificationRate)} of active
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(
                    aggregatedMetrics.verification.activeStudents -
                      aggregatedMetrics.verification.verifiedStudents
                  )}
                </p>
                <p className="text-sm text-gray-500">
                  {formatPercentage(
                    100 - aggregatedMetrics.verification.verificationRate
                  )} of active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function aggregateVerificationMetrics(metrics: EntityMetrics[]): EntityMetrics {
  const totalStudents = metrics.reduce((sum, m) => sum + m.verification.totalStudents, 0);
  const activeStudents = metrics.reduce((sum, m) => sum + m.verification.activeStudents, 0);
  const verifiedStudents = metrics.reduce((sum, m) => sum + m.verification.verifiedStudents, 0);

  return {
    entityId: 'aggregated',
    entityName: 'All Selected',
    entityType: 'company',
    verification: {
      totalStudents,
      activeStudents,
      verifiedStudents,
      verificationRate: Math.round((verifiedStudents / activeStudents) * 100 * 10) / 10,
    },
    activation: metrics[0].activation,
    adoption: metrics[0].adoption,
    staffPerformance: metrics[0].staffPerformance,
  };
}
