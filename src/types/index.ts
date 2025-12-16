// School Hierarchy Types
export interface Level {
  id: string;
  name: string;
  branchId: string;
}

export interface Branch {
  id: string;
  name: string;
  brandId: string;
  levels: Level[];
}

export interface Brand {
  id: string;
  name: string;
  companyId: string;
  curriculum: 'International' | 'National' | 'Mixed';
  branches: Branch[];
}

export interface Company {
  id: string;
  name: string;
  brands: Brand[];
}

// Metrics Types
export interface BaseMetrics {
  totalStudents: number;
  activeStudents: number; // excluding deleted/graduated
}

export interface VerificationMetrics extends BaseMetrics {
  verifiedStudents: number;
  verificationRate: number; // percentage
}

export interface ActivationMetrics extends BaseMetrics {
  // Dismissals
  dismissalActivatedStudents: number;
  dismissalActivationRate: number;

  // Attendance
  attendanceActivatedStudents: number;
  attendanceActivationRate: number;

  // Canteen
  canteenActivatedStudents: number;
  canteenActivationRate: number;

  // Transportation
  busEnrolledStudents: number;
  transportationActivatedStudents: number;
  transportationActivationRate: number;
}

export interface AdoptionMetrics extends BaseMetrics {
  // Dismissals
  dismissalAdoptedStudents: number;
  dismissalAdoptionRate: number;

  // Attendance
  attendanceAdoptedStudents: number;
  attendanceAdoptionRate: number;

  // Canteen
  canteenAdoptedStudents: number;
  canteenAdoptionRate: number;

  // Transportation
  busEnrolledStudents: number;
  transportationAdoptedStudents: number;
  transportationAdoptionRate: number;
}

export interface StaffPerformanceMetrics {
  // Undelivered requests
  totalPickupRequests: number;
  undeliveredRequests: number;
  undeliveredRate: number;

  // Attendance
  studentsWithAttendance: number;
  attendanceRate: number;

  // Average delivery time
  averageDeliveryTimeMinutes: number;

  // Attendance days
  attendanceDaysMarked: number;
  totalSchoolDays: number;
}

export interface EntityMetrics {
  entityId: string;
  entityName: string;
  entityType: 'company' | 'brand' | 'branch' | 'level';
  verification: VerificationMetrics;
  activation: ActivationMetrics;
  adoption: AdoptionMetrics;
  staffPerformance: StaffPerformanceMetrics;
}

// Filter Types
export type DatePreset = 'week' | 'month' | '30days' | '60days' | '90days' | '120days' | 'custom';

export interface DateFilter {
  preset: DatePreset;
  startDate: Date;
  endDate: Date;
}

// View Types
export interface SavedView {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  filters: ViewFilters;
}

export interface ViewFilters {
  selectedBrands: string[];
  selectedBranches: string[];
  selectedLevels: string[];
  groupBy: 'brand' | 'branch' | 'level' | 'curriculum';
  comparisonMode: 'single' | 'side-by-side';
  dateFilter: DateFilter;
}

// Aggregation Types
export interface AggregatedMetrics extends EntityMetrics {
  childCount: number;
  children?: AggregatedMetrics[];
}

// Chart Data Types
export interface TrendDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ComparisonDataPoint {
  name: string;
  value: number;
  percentage: number;
  fill?: string;
}
