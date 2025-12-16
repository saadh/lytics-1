'use client';

import { useMemo } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { DashboardLayout } from '@/components/layout';
import { SaveViewModal, DateFilter } from '@/components/views';
import {
  VerificationSection,
  ActivationSection,
  AdoptionSection,
  StaffPerformanceSection,
} from '@/components/metrics';
import { MetricsComparisonChart, MetricsRadarChart, VerificationPieChart } from '@/components/charts';
import { Card, Badge } from '@/components/ui';
import { getMetrics, mockCompany, getAllBrands, getBranchesByBrand, getBrandsByCurriculum } from '@/data/mockData';
import { EntityMetrics } from '@/types';
import { format } from 'date-fns';
import { Building2, MapPin, GraduationCap, Users, Layers } from 'lucide-react';

export function Dashboard() {
  const { filters } = useDashboardStore();
  const metricsData = useMemo(() => getMetrics(), []);

  // Get filtered metrics based on selection
  const filteredMetrics = useMemo(() => {
    const {
      selectedBrands,
      selectedBranches,
      selectedLevels,
      groupBy,
    } = filters;

    // If nothing selected, show company level
    if (selectedBrands.length === 0 && selectedBranches.length === 0 && selectedLevels.length === 0) {
      // Group by curriculum or show all brands
      if (groupBy === 'curriculum') {
        const curriculums = ['International', 'National', 'Mixed'] as const;
        return curriculums.map(curriculum => {
          const brands = getBrandsByCurriculum(curriculum);
          if (brands.length === 0) return null;

          const brandMetrics = brands.map(b => metricsData.get(b.id)!).filter(Boolean);
          return aggregateMultipleMetrics(brandMetrics, curriculum + ' Schools', 'brand');
        }).filter(Boolean) as EntityMetrics[];
      }

      if (groupBy === 'brand') {
        return getAllBrands().map(brand => metricsData.get(brand.id)!).filter(Boolean);
      }

      return [metricsData.get(mockCompany.id)!];
    }

    // If levels are selected
    if (selectedLevels.length > 0) {
      return selectedLevels.map(id => metricsData.get(id)).filter(Boolean) as EntityMetrics[];
    }

    // If branches are selected
    if (selectedBranches.length > 0) {
      if (groupBy === 'level') {
        // Show all levels from selected branches
        const levels: EntityMetrics[] = [];
        selectedBranches.forEach(branchId => {
          const branch = mockCompany.brands.flatMap(b => b.branches).find(b => b.id === branchId);
          if (branch) {
            branch.levels.forEach(level => {
              const m = metricsData.get(level.id);
              if (m) levels.push(m);
            });
          }
        });
        return levels;
      }
      return selectedBranches.map(id => metricsData.get(id)).filter(Boolean) as EntityMetrics[];
    }

    // If brands are selected
    if (selectedBrands.length > 0) {
      if (groupBy === 'branch') {
        // Show all branches from selected brands
        const branches: EntityMetrics[] = [];
        selectedBrands.forEach(brandId => {
          getBranchesByBrand(brandId).forEach(branch => {
            const m = metricsData.get(branch.id);
            if (m) branches.push(m);
          });
        });
        return branches;
      }

      if (groupBy === 'curriculum') {
        const brands = getAllBrands().filter(b => selectedBrands.includes(b.id));
        const grouped: { [key: string]: EntityMetrics[] } = {};

        brands.forEach(brand => {
          const m = metricsData.get(brand.id);
          if (m) {
            if (!grouped[brand.curriculum]) grouped[brand.curriculum] = [];
            grouped[brand.curriculum].push(m);
          }
        });

        return Object.entries(grouped).map(([curriculum, metrics]) =>
          aggregateMultipleMetrics(metrics, curriculum + ' Schools', 'brand')
        );
      }

      return selectedBrands.map(id => metricsData.get(id)).filter(Boolean) as EntityMetrics[];
    }

    return [metricsData.get(mockCompany.id)!];
  }, [filters, metricsData]);

  const showComparison = filters.comparisonMode === 'side-by-side' && filteredMetrics.length > 1;

  const dateRangeLabel = `${format(filters.dateFilter.startDate, 'MMM d')} - ${format(filters.dateFilter.endDate, 'MMM d, yyyy')}`;

  // Summary stats
  const summaryStats = useMemo(() => {
    if (filteredMetrics.length === 0) return null;

    const aggregated = filteredMetrics.length === 1
      ? filteredMetrics[0]
      : aggregateMultipleMetrics(filteredMetrics, 'All', 'company');

    return {
      totalStudents: aggregated.verification.activeStudents,
      verificationRate: aggregated.verification.verificationRate,
      avgActivation: Math.round(
        (aggregated.activation.dismissalActivationRate +
          aggregated.activation.attendanceActivationRate +
          aggregated.activation.canteenActivationRate) / 3
      ),
      avgDeliveryTime: aggregated.staffPerformance.averageDeliveryTimeMinutes,
    };
  }, [filteredMetrics]);

  return (
    <DashboardLayout>
      <SaveViewModal />

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Comprehensive overview of school performance metrics
          </p>
        </div>

        {/* Summary Cards */}
        {summaryStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Students</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {summaryStats.totalStudents.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-green-100">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verification Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {summaryStats.verificationRate}%
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100">
                  <Layers className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Activation</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {summaryStats.avgActivation}%
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-100">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Delivery</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {summaryStats.avgDeliveryTime} min
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Selection Info */}
        {(filters.selectedBrands.length > 0 || filters.selectedBranches.length > 0 || filters.selectedLevels.length > 0) && (
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Viewing:</span>
              <div className="flex flex-wrap gap-2">
                {filters.selectedBrands.map(id => {
                  const brand = getAllBrands().find(b => b.id === id);
                  return brand ? (
                    <Badge key={id} variant="info" className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3" />
                      {brand.name}
                    </Badge>
                  ) : null;
                })}
                {filters.selectedBranches.map(id => {
                  const branch = mockCompany.brands.flatMap(b => b.branches).find(b => b.id === id);
                  return branch ? (
                    <Badge key={id} variant="success" className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {branch.name}
                    </Badge>
                  ) : null;
                })}
                {filters.selectedLevels.map(id => {
                  const level = mockCompany.brands.flatMap(b => b.branches.flatMap(br => br.levels)).find(l => l.id === id);
                  return level ? (
                    <Badge key={id} variant="warning" className="flex items-center gap-1.5">
                      <GraduationCap className="w-3 h-3" />
                      {level.name}
                    </Badge>
                  ) : null;
                })}
              </div>
              <Badge variant="default" className="ml-auto">
                Grouped by: {filters.groupBy}
              </Badge>
            </div>
          </Card>
        )}

        {/* Non-Date Filtered Metrics */}
        <div className="space-y-8">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="text-lg font-semibold text-gray-800">Current Status (To Date)</h2>
            <p className="text-sm text-gray-500">Metrics that do not require date filters</p>
          </div>

          <VerificationSection metrics={filteredMetrics} showComparison={showComparison} />

          {showComparison && filteredMetrics.length > 1 && (
            <MetricsComparisonChart metrics={filteredMetrics} type="verification" />
          )}

          {!showComparison && filteredMetrics.length === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <VerificationPieChart metrics={filteredMetrics[0]} />
              <MetricsRadarChart metrics={filteredMetrics[0]} type="activation" />
            </div>
          )}

          <ActivationSection metrics={filteredMetrics} showComparison={showComparison} />

          {showComparison && filteredMetrics.length > 1 && (
            <MetricsComparisonChart metrics={filteredMetrics} type="activation" />
          )}
        </div>

        {/* Date Filtered Metrics */}
        <div className="space-y-8">
          <div className="border-b border-gray-200 pb-2">
            <h2 className="text-lg font-semibold text-gray-800">Period Analysis</h2>
            <p className="text-sm text-gray-500">Metrics filtered by selected time period</p>
          </div>

          <DateFilter />

          <AdoptionSection
            metrics={filteredMetrics}
            showComparison={showComparison}
            dateRangeLabel={dateRangeLabel}
          />

          {showComparison && filteredMetrics.length > 1 && (
            <MetricsComparisonChart metrics={filteredMetrics} type="adoption" />
          )}

          {!showComparison && filteredMetrics.length === 1 && (
            <MetricsRadarChart metrics={filteredMetrics[0]} type="adoption" />
          )}

          <StaffPerformanceSection
            metrics={filteredMetrics}
            showComparison={showComparison}
            dateRangeLabel={dateRangeLabel}
          />

          {showComparison && filteredMetrics.length > 1 && (
            <MetricsComparisonChart metrics={filteredMetrics} type="staff" />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper function to aggregate multiple metrics
function aggregateMultipleMetrics(
  metrics: EntityMetrics[],
  name: string,
  type: EntityMetrics['entityType']
): EntityMetrics {
  if (metrics.length === 0) {
    throw new Error('Cannot aggregate empty metrics array');
  }

  if (metrics.length === 1) {
    return { ...metrics[0], entityName: name, entityType: type };
  }

  const totalStudents = metrics.reduce((sum, m) => sum + m.verification.totalStudents, 0);
  const activeStudents = metrics.reduce((sum, m) => sum + m.verification.activeStudents, 0);
  const verifiedStudents = metrics.reduce((sum, m) => sum + m.verification.verifiedStudents, 0);

  const busEnrolled = metrics.reduce((sum, m) => sum + m.activation.busEnrolledStudents, 0);

  // Activation
  const dismissalActivated = metrics.reduce((sum, m) => sum + m.activation.dismissalActivatedStudents, 0);
  const attendanceActivated = metrics.reduce((sum, m) => sum + m.activation.attendanceActivatedStudents, 0);
  const canteenActivated = metrics.reduce((sum, m) => sum + m.activation.canteenActivatedStudents, 0);
  const transportationActivated = metrics.reduce((sum, m) => sum + m.activation.transportationActivatedStudents, 0);

  // Adoption
  const dismissalAdopted = metrics.reduce((sum, m) => sum + m.adoption.dismissalAdoptedStudents, 0);
  const attendanceAdopted = metrics.reduce((sum, m) => sum + m.adoption.attendanceAdoptedStudents, 0);
  const canteenAdopted = metrics.reduce((sum, m) => sum + m.adoption.canteenAdoptedStudents, 0);
  const transportationAdopted = metrics.reduce((sum, m) => sum + m.adoption.transportationAdoptedStudents, 0);

  // Staff
  const totalPickupRequests = metrics.reduce((sum, m) => sum + m.staffPerformance.totalPickupRequests, 0);
  const undeliveredRequests = metrics.reduce((sum, m) => sum + m.staffPerformance.undeliveredRequests, 0);
  const studentsWithAttendance = metrics.reduce((sum, m) => sum + m.staffPerformance.studentsWithAttendance, 0);
  const totalSchoolDays = Math.max(...metrics.map(m => m.staffPerformance.totalSchoolDays));
  const attendanceDaysMarked = Math.round(
    metrics.reduce((sum, m) => sum + m.staffPerformance.attendanceDaysMarked, 0) / metrics.length
  );
  const avgDeliveryTime = Math.round(
    metrics.reduce((sum, m) =>
      sum + m.staffPerformance.averageDeliveryTimeMinutes * m.staffPerformance.totalPickupRequests, 0
    ) / totalPickupRequests * 10
  ) / 10;

  return {
    entityId: 'aggregated-' + name.toLowerCase().replace(/\s+/g, '-'),
    entityName: name,
    entityType: type,
    verification: {
      totalStudents,
      activeStudents,
      verifiedStudents,
      verificationRate: Math.round((verifiedStudents / activeStudents) * 100 * 10) / 10,
    },
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
      transportationActivationRate: busEnrolled > 0 ? Math.round((transportationActivated / busEnrolled) * 100 * 10) / 10 : 0,
    },
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
      transportationAdoptionRate: busEnrolled > 0 ? Math.round((transportationAdopted / busEnrolled) * 100 * 10) / 10 : 0,
    },
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
