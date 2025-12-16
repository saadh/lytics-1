import { Company, Brand, Branch, Level, EntityMetrics, VerificationMetrics, ActivationMetrics, AdoptionMetrics, StaffPerformanceMetrics } from '@/types';

// Helper function to generate random metrics
const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateVerificationMetrics = (totalStudents: number): VerificationMetrics => {
  const activeStudents = Math.floor(totalStudents * 0.95);
  const verifiedStudents = Math.floor(activeStudents * (0.65 + Math.random() * 0.30));
  return {
    totalStudents,
    activeStudents,
    verifiedStudents,
    verificationRate: Math.round((verifiedStudents / activeStudents) * 100 * 10) / 10,
  };
};

const generateActivationMetrics = (totalStudents: number): ActivationMetrics => {
  const activeStudents = Math.floor(totalStudents * 0.95);
  const dismissalActivated = Math.floor(activeStudents * (0.50 + Math.random() * 0.40));
  const attendanceActivated = Math.floor(activeStudents * (0.45 + Math.random() * 0.45));
  const canteenActivated = Math.floor(activeStudents * (0.30 + Math.random() * 0.35));
  const busEnrolled = Math.floor(activeStudents * (0.25 + Math.random() * 0.20));
  const transportationActivated = Math.floor(busEnrolled * (0.60 + Math.random() * 0.35));

  return {
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
  };
};

const generateAdoptionMetrics = (totalStudents: number, activationMetrics: ActivationMetrics): AdoptionMetrics => {
  const activeStudents = activationMetrics.activeStudents;
  const dismissalAdopted = Math.floor(activationMetrics.dismissalActivatedStudents * (0.40 + Math.random() * 0.45));
  const attendanceAdopted = Math.floor(activationMetrics.attendanceActivatedStudents * (0.50 + Math.random() * 0.40));
  const canteenAdopted = Math.floor(activationMetrics.canteenActivatedStudents * (0.35 + Math.random() * 0.40));
  const transportationAdopted = Math.floor(activationMetrics.transportationActivatedStudents * (0.55 + Math.random() * 0.40));

  return {
    totalStudents,
    activeStudents,
    dismissalAdoptedStudents: dismissalAdopted,
    dismissalAdoptionRate: Math.round((dismissalAdopted / activeStudents) * 100 * 10) / 10,
    attendanceAdoptedStudents: attendanceAdopted,
    attendanceAdoptionRate: Math.round((attendanceAdopted / activeStudents) * 100 * 10) / 10,
    canteenAdoptedStudents: canteenAdopted,
    canteenAdoptionRate: Math.round((canteenAdopted / activeStudents) * 100 * 10) / 10,
    busEnrolledStudents: activationMetrics.busEnrolledStudents,
    transportationAdoptedStudents: transportationAdopted,
    transportationAdoptionRate: Math.round((transportationAdopted / activationMetrics.busEnrolledStudents) * 100 * 10) / 10,
  };
};

const generateStaffPerformanceMetrics = (totalStudents: number): StaffPerformanceMetrics => {
  const totalPickupRequests = generateRandomNumber(totalStudents * 15, totalStudents * 25);
  const undeliveredRequests = Math.floor(totalPickupRequests * (0.01 + Math.random() * 0.05));
  const studentsWithAttendance = Math.floor(totalStudents * (0.75 + Math.random() * 0.20));
  const totalSchoolDays = generateRandomNumber(20, 25);
  const attendanceDaysMarked = Math.floor(totalSchoolDays * (0.85 + Math.random() * 0.15));

  return {
    totalPickupRequests,
    undeliveredRequests,
    undeliveredRate: Math.round((undeliveredRequests / totalPickupRequests) * 100 * 10) / 10,
    studentsWithAttendance,
    attendanceRate: Math.round((studentsWithAttendance / totalStudents) * 100 * 10) / 10,
    averageDeliveryTimeMinutes: Math.round((3 + Math.random() * 7) * 10) / 10,
    attendanceDaysMarked,
    totalSchoolDays,
  };
};

// Level templates
const levelTemplates = [
  'KG',
  'Primary Boys',
  'Primary Girls',
  'Middle School Boys',
  'Middle School Girls',
  'Secondary Boys',
  'Secondary Girls',
  'High School Boys',
  'High School Girls',
];

// Generate levels for a branch
const generateLevels = (branchId: string, count: number): Level[] => {
  const shuffled = [...levelTemplates].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((name, idx) => ({
    id: `${branchId}-level-${idx + 1}`,
    name,
    branchId,
  }));
};

// Mock Company Data - Ataa Educational Company
export const mockCompany: Company = {
  id: 'ataa-edu',
  name: 'Ataa Educational Company',
  brands: [
    {
      id: 'rowad',
      name: 'Rowad Schools',
      companyId: 'ataa-edu',
      curriculum: 'National',
      branches: [
        {
          id: 'rowad-izdihar',
          name: 'Rowad Al Izdihar',
          brandId: 'rowad',
          levels: generateLevels('rowad-izdihar', 6),
        },
        {
          id: 'rowad-ishbiliya',
          name: 'Rowad Ishbiliya',
          brandId: 'rowad',
          levels: generateLevels('rowad-ishbiliya', 5),
        },
        {
          id: 'rowad-murooj',
          name: 'Rowad Al Murooj',
          brandId: 'rowad',
          levels: generateLevels('rowad-murooj', 7),
        },
        {
          id: 'rowad-narjis',
          name: 'Rowad Al Narjis',
          brandId: 'rowad',
          levels: generateLevels('rowad-narjis', 5),
        },
        {
          id: 'rowad-yasmin',
          name: 'Rowad Al Yasmin',
          brandId: 'rowad',
          levels: generateLevels('rowad-yasmin', 4),
        },
      ],
    },
    {
      id: 'mei',
      name: 'Middle East International Schools',
      companyId: 'ataa-edu',
      curriculum: 'International',
      branches: [
        {
          id: 'mei-riyadh',
          name: 'MEI Riyadh',
          brandId: 'mei',
          levels: generateLevels('mei-riyadh', 6),
        },
        {
          id: 'mei-jeddah',
          name: 'MEI Jeddah',
          brandId: 'mei',
          levels: generateLevels('mei-jeddah', 5),
        },
        {
          id: 'mei-dammam',
          name: 'MEI Dammam',
          brandId: 'mei',
          levels: generateLevels('mei-dammam', 4),
        },
      ],
    },
    {
      id: 'pioneers',
      name: 'Pioneers International Schools',
      companyId: 'ataa-edu',
      curriculum: 'International',
      branches: [
        {
          id: 'pioneers-sulaimaniya',
          name: 'Pioneers Sulaimaniya',
          brandId: 'pioneers',
          levels: generateLevels('pioneers-sulaimaniya', 5),
        },
        {
          id: 'pioneers-malqa',
          name: 'Pioneers Al Malqa',
          brandId: 'pioneers',
          levels: generateLevels('pioneers-malqa', 6),
        },
      ],
    },
    {
      id: 'gulf',
      name: 'Gulf National Schools',
      companyId: 'ataa-edu',
      curriculum: 'National',
      branches: [
        {
          id: 'gulf-olaya',
          name: 'Gulf Olaya',
          brandId: 'gulf',
          levels: generateLevels('gulf-olaya', 5),
        },
        {
          id: 'gulf-rabwa',
          name: 'Gulf Al Rabwa',
          brandId: 'gulf',
          levels: generateLevels('gulf-rabwa', 4),
        },
        {
          id: 'gulf-hamra',
          name: 'Gulf Al Hamra',
          brandId: 'gulf',
          levels: generateLevels('gulf-hamra', 6),
        },
        {
          id: 'gulf-rawdah',
          name: 'Gulf Al Rawdah',
          brandId: 'gulf',
          levels: generateLevels('gulf-rawdah', 5),
        },
      ],
    },
    {
      id: 'alamal',
      name: 'Al Amal Schools',
      companyId: 'ataa-edu',
      curriculum: 'Mixed',
      branches: [
        {
          id: 'alamal-main',
          name: 'Al Amal Main Campus',
          brandId: 'alamal',
          levels: generateLevels('alamal-main', 7),
        },
        {
          id: 'alamal-north',
          name: 'Al Amal North',
          brandId: 'alamal',
          levels: generateLevels('alamal-north', 5),
        },
      ],
    },
  ],
};

// Generate metrics data for entities
const generateEntityMetrics = (entityId: string, entityName: string, entityType: 'company' | 'brand' | 'branch' | 'level', studentCount: number): EntityMetrics => {
  const verification = generateVerificationMetrics(studentCount);
  const activation = generateActivationMetrics(studentCount);
  const adoption = generateAdoptionMetrics(studentCount, activation);
  const staffPerformance = generateStaffPerformanceMetrics(studentCount);

  return {
    entityId,
    entityName,
    entityType,
    verification,
    activation,
    adoption,
    staffPerformance,
  };
};

// Student counts per level (randomized)
const getLevelStudentCount = (): number => generateRandomNumber(80, 350);

// Generate all metrics data
export const generateMetricsData = (): Map<string, EntityMetrics> => {
  const metricsMap = new Map<string, EntityMetrics>();

  // Generate level metrics
  mockCompany.brands.forEach(brand => {
    brand.branches.forEach(branch => {
      branch.levels.forEach(level => {
        const studentCount = getLevelStudentCount();
        metricsMap.set(level.id, generateEntityMetrics(level.id, level.name, 'level', studentCount));
      });
    });
  });

  // Aggregate branch metrics
  mockCompany.brands.forEach(brand => {
    brand.branches.forEach(branch => {
      const branchMetrics = aggregateMetrics(
        branch.levels.map(l => metricsMap.get(l.id)!),
        branch.id,
        branch.name,
        'branch'
      );
      metricsMap.set(branch.id, branchMetrics);
    });
  });

  // Aggregate brand metrics
  mockCompany.brands.forEach(brand => {
    const brandMetrics = aggregateMetrics(
      brand.branches.map(b => metricsMap.get(b.id)!),
      brand.id,
      brand.name,
      'brand'
    );
    metricsMap.set(brand.id, brandMetrics);
  });

  // Aggregate company metrics
  const companyMetrics = aggregateMetrics(
    mockCompany.brands.map(b => metricsMap.get(b.id)!),
    mockCompany.id,
    mockCompany.name,
    'company'
  );
  metricsMap.set(mockCompany.id, companyMetrics);

  return metricsMap;
};

// Aggregate metrics from children
const aggregateMetrics = (
  childMetrics: EntityMetrics[],
  entityId: string,
  entityName: string,
  entityType: 'company' | 'brand' | 'branch' | 'level'
): EntityMetrics => {
  const totalStudents = childMetrics.reduce((sum, m) => sum + m.verification.totalStudents, 0);
  const activeStudents = childMetrics.reduce((sum, m) => sum + m.verification.activeStudents, 0);

  const verification: VerificationMetrics = {
    totalStudents,
    activeStudents,
    verifiedStudents: childMetrics.reduce((sum, m) => sum + m.verification.verifiedStudents, 0),
    verificationRate: 0,
  };
  verification.verificationRate = Math.round((verification.verifiedStudents / activeStudents) * 100 * 10) / 10;

  const busEnrolled = childMetrics.reduce((sum, m) => sum + m.activation.busEnrolledStudents, 0);
  const activation: ActivationMetrics = {
    totalStudents,
    activeStudents,
    dismissalActivatedStudents: childMetrics.reduce((sum, m) => sum + m.activation.dismissalActivatedStudents, 0),
    dismissalActivationRate: 0,
    attendanceActivatedStudents: childMetrics.reduce((sum, m) => sum + m.activation.attendanceActivatedStudents, 0),
    attendanceActivationRate: 0,
    canteenActivatedStudents: childMetrics.reduce((sum, m) => sum + m.activation.canteenActivatedStudents, 0),
    canteenActivationRate: 0,
    busEnrolledStudents: busEnrolled,
    transportationActivatedStudents: childMetrics.reduce((sum, m) => sum + m.activation.transportationActivatedStudents, 0),
    transportationActivationRate: 0,
  };
  activation.dismissalActivationRate = Math.round((activation.dismissalActivatedStudents / activeStudents) * 100 * 10) / 10;
  activation.attendanceActivationRate = Math.round((activation.attendanceActivatedStudents / activeStudents) * 100 * 10) / 10;
  activation.canteenActivationRate = Math.round((activation.canteenActivatedStudents / activeStudents) * 100 * 10) / 10;
  activation.transportationActivationRate = Math.round((activation.transportationActivatedStudents / busEnrolled) * 100 * 10) / 10;

  const adoption: AdoptionMetrics = {
    totalStudents,
    activeStudents,
    dismissalAdoptedStudents: childMetrics.reduce((sum, m) => sum + m.adoption.dismissalAdoptedStudents, 0),
    dismissalAdoptionRate: 0,
    attendanceAdoptedStudents: childMetrics.reduce((sum, m) => sum + m.adoption.attendanceAdoptedStudents, 0),
    attendanceAdoptionRate: 0,
    canteenAdoptedStudents: childMetrics.reduce((sum, m) => sum + m.adoption.canteenAdoptedStudents, 0),
    canteenAdoptionRate: 0,
    busEnrolledStudents: busEnrolled,
    transportationAdoptedStudents: childMetrics.reduce((sum, m) => sum + m.adoption.transportationAdoptedStudents, 0),
    transportationAdoptionRate: 0,
  };
  adoption.dismissalAdoptionRate = Math.round((adoption.dismissalAdoptedStudents / activeStudents) * 100 * 10) / 10;
  adoption.attendanceAdoptionRate = Math.round((adoption.attendanceAdoptedStudents / activeStudents) * 100 * 10) / 10;
  adoption.canteenAdoptionRate = Math.round((adoption.canteenAdoptedStudents / activeStudents) * 100 * 10) / 10;
  adoption.transportationAdoptionRate = Math.round((adoption.transportationAdoptedStudents / busEnrolled) * 100 * 10) / 10;

  const totalPickupRequests = childMetrics.reduce((sum, m) => sum + m.staffPerformance.totalPickupRequests, 0);
  const totalSchoolDays = Math.max(...childMetrics.map(m => m.staffPerformance.totalSchoolDays));
  const staffPerformance: StaffPerformanceMetrics = {
    totalPickupRequests,
    undeliveredRequests: childMetrics.reduce((sum, m) => sum + m.staffPerformance.undeliveredRequests, 0),
    undeliveredRate: 0,
    studentsWithAttendance: childMetrics.reduce((sum, m) => sum + m.staffPerformance.studentsWithAttendance, 0),
    attendanceRate: 0,
    averageDeliveryTimeMinutes: Math.round(
      childMetrics.reduce((sum, m) => sum + m.staffPerformance.averageDeliveryTimeMinutes * m.staffPerformance.totalPickupRequests, 0) / totalPickupRequests * 10
    ) / 10,
    attendanceDaysMarked: Math.round(
      childMetrics.reduce((sum, m) => sum + m.staffPerformance.attendanceDaysMarked, 0) / childMetrics.length
    ),
    totalSchoolDays,
  };
  staffPerformance.undeliveredRate = Math.round((staffPerformance.undeliveredRequests / totalPickupRequests) * 100 * 10) / 10;
  staffPerformance.attendanceRate = Math.round((staffPerformance.studentsWithAttendance / totalStudents) * 100 * 10) / 10;

  return {
    entityId,
    entityName,
    entityType,
    verification,
    activation,
    adoption,
    staffPerformance,
  };
};

// Pre-generated metrics (stable across renders)
let cachedMetrics: Map<string, EntityMetrics> | null = null;

export const getMetrics = (): Map<string, EntityMetrics> => {
  if (!cachedMetrics) {
    cachedMetrics = generateMetricsData();
  }
  return cachedMetrics;
};

// Reset metrics (for testing)
export const resetMetrics = (): void => {
  cachedMetrics = null;
};

// Helper to get all brands
export const getAllBrands = (): Brand[] => mockCompany.brands;

// Helper to get all branches
export const getAllBranches = (): Branch[] => mockCompany.brands.flatMap(b => b.branches);

// Helper to get all levels
export const getAllLevels = (): Level[] => getAllBranches().flatMap(b => b.levels);

// Helper to get branches by brand
export const getBranchesByBrand = (brandId: string): Branch[] => {
  const brand = mockCompany.brands.find(b => b.id === brandId);
  return brand?.branches || [];
};

// Helper to get levels by branch
export const getLevelsByBranch = (branchId: string): Level[] => {
  for (const brand of mockCompany.brands) {
    const branch = brand.branches.find(b => b.id === branchId);
    if (branch) return branch.levels;
  }
  return [];
};

// Helper to get brand by id
export const getBrandById = (brandId: string): Brand | undefined => {
  return mockCompany.brands.find(b => b.id === brandId);
};

// Helper to get branch by id
export const getBranchById = (branchId: string): Branch | undefined => {
  for (const brand of mockCompany.brands) {
    const branch = brand.branches.find(b => b.id === branchId);
    if (branch) return branch;
  }
  return undefined;
};

// Get brands by curriculum
export const getBrandsByCurriculum = (curriculum: 'International' | 'National' | 'Mixed'): Brand[] => {
  return mockCompany.brands.filter(b => b.curriculum === curriculum);
};
