'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { EntityMetrics } from '@/types';
import { getChartColors } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface MetricsChartProps {
  metrics: EntityMetrics[];
  type: 'activation' | 'adoption' | 'verification' | 'staff';
}

export function MetricsComparisonChart({ metrics, type }: MetricsChartProps) {
  const colors = getChartColors();

  if (metrics.length === 0) return null;

  if (type === 'activation' || type === 'adoption') {
    const data = metrics.map((m) => ({
      name: m.entityName.length > 15 ? m.entityName.slice(0, 15) + '...' : m.entityName,
      fullName: m.entityName,
      dismissals: type === 'activation' ? m.activation.dismissalActivationRate : m.adoption.dismissalAdoptionRate,
      attendance: type === 'activation' ? m.activation.attendanceActivationRate : m.adoption.attendanceAdoptionRate,
      canteen: type === 'activation' ? m.activation.canteenActivationRate : m.adoption.canteenAdoptionRate,
      transport: type === 'activation' ? m.activation.transportationActivationRate : m.adoption.transportationAdoptionRate,
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {type === 'activation' ? 'Activation' : 'Adoption'} Rates Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(1)}%`]}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
                />
                <Legend />
                <Bar dataKey="dismissals" name="Dismissals" fill={colors[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="attendance" name="Attendance" fill={colors[1]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="canteen" name="Canteen" fill={colors[2]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="transport" name="Transport" fill={colors[4]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'verification') {
    const data = metrics.map((m, idx) => ({
      name: m.entityName,
      value: m.verification.verificationRate,
      fill: colors[idx % colors.length],
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Verification Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Verification Rate']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Staff performance
  const data = metrics.map((m) => ({
    name: m.entityName.length > 15 ? m.entityName.slice(0, 15) + '...' : m.entityName,
    fullName: m.entityName,
    undeliveredRate: m.staffPerformance.undeliveredRate,
    attendanceRate: m.staffPerformance.attendanceRate,
    deliveryTime: m.staffPerformance.averageDeliveryTimeMinutes,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Staff Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip
                labelFormatter={(label, payload) => payload?.[0]?.payload?.fullName || label}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="attendanceRate" name="Attendance %" fill={colors[1]} radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="deliveryTime" name="Delivery Time (min)" fill={colors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface RadarChartProps {
  metrics: EntityMetrics;
  type: 'activation' | 'adoption';
}

export function MetricsRadarChart({ metrics, type }: RadarChartProps) {
  const data = [
    {
      metric: 'Dismissals',
      value: type === 'activation' ? metrics.activation.dismissalActivationRate : metrics.adoption.dismissalAdoptionRate,
      fullMark: 100,
    },
    {
      metric: 'Attendance',
      value: type === 'activation' ? metrics.activation.attendanceActivationRate : metrics.adoption.attendanceAdoptionRate,
      fullMark: 100,
    },
    {
      metric: 'Canteen',
      value: type === 'activation' ? metrics.activation.canteenActivationRate : metrics.adoption.canteenAdoptionRate,
      fullMark: 100,
    },
    {
      metric: 'Transport',
      value: type === 'activation' ? metrics.activation.transportationActivationRate : metrics.adoption.transportationAdoptionRate,
      fullMark: 100,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {type === 'activation' ? 'Activation' : 'Adoption'} Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name={metrics.entityName}
                dataKey="value"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
              />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`]} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface PieChartProps {
  metrics: EntityMetrics;
}

export function VerificationPieChart({ metrics }: PieChartProps) {
  const verified = metrics.verification.verifiedStudents;
  const pending = metrics.verification.activeStudents - verified;

  const data = [
    { name: 'Verified', value: verified, fill: '#10B981' },
    { name: 'Pending', value: pending, fill: '#E5E7EB' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Verification Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
