import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedView, ViewFilters, DateFilter, DatePreset } from '@/types';
import { subDays, startOfWeek, startOfMonth, endOfMonth, endOfWeek } from 'date-fns';

const getDefaultDateFilter = (): DateFilter => {
  const today = new Date();
  return {
    preset: '30days',
    startDate: subDays(today, 30),
    endDate: today,
  };
};

const getDefaultFilters = (): ViewFilters => ({
  selectedBrands: [],
  selectedBranches: [],
  selectedLevels: [],
  groupBy: 'brand',
  comparisonMode: 'single',
  dateFilter: getDefaultDateFilter(),
});

interface DashboardState {
  // Current active filters
  filters: ViewFilters;

  // Saved views
  savedViews: SavedView[];
  activeViewId: string | null;

  // UI State
  sidebarOpen: boolean;
  viewModalOpen: boolean;

  // Actions
  setFilters: (filters: Partial<ViewFilters>) => void;
  resetFilters: () => void;

  // Date filter actions
  setDatePreset: (preset: DatePreset) => void;
  setCustomDateRange: (startDate: Date, endDate: Date) => void;

  // Selection actions
  toggleBrand: (brandId: string) => void;
  toggleBranch: (branchId: string) => void;
  toggleLevel: (levelId: string) => void;
  selectAllBrands: (brandIds: string[]) => void;
  selectAllBranches: (branchIds: string[]) => void;
  clearSelections: () => void;

  // View actions
  saveView: (name: string, description?: string) => void;
  loadView: (viewId: string) => void;
  deleteView: (viewId: string) => void;
  updateView: (viewId: string, updates: Partial<SavedView>) => void;
  clearActiveView: () => void;

  // UI actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setViewModalOpen: (open: boolean) => void;

  // Group by actions
  setGroupBy: (groupBy: ViewFilters['groupBy']) => void;
  setComparisonMode: (mode: ViewFilters['comparisonMode']) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      filters: getDefaultFilters(),
      savedViews: [],
      activeViewId: null,
      sidebarOpen: true,
      viewModalOpen: false,

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          activeViewId: null, // Clear active view when filters change
        })),

      resetFilters: () =>
        set({
          filters: getDefaultFilters(),
          activeViewId: null,
        }),

      setDatePreset: (preset) => {
        const today = new Date();
        let startDate: Date;
        let endDate: Date = today;

        switch (preset) {
          case 'week':
            startDate = startOfWeek(today, { weekStartsOn: 0 });
            endDate = endOfWeek(today, { weekStartsOn: 0 });
            break;
          case 'month':
            startDate = startOfMonth(today);
            endDate = endOfMonth(today);
            break;
          case '30days':
            startDate = subDays(today, 30);
            break;
          case '60days':
            startDate = subDays(today, 60);
            break;
          case '90days':
            startDate = subDays(today, 90);
            break;
          case '120days':
            startDate = subDays(today, 120);
            break;
          default:
            startDate = subDays(today, 30);
        }

        set((state) => ({
          filters: {
            ...state.filters,
            dateFilter: { preset, startDate, endDate },
          },
        }));
      },

      setCustomDateRange: (startDate, endDate) =>
        set((state) => ({
          filters: {
            ...state.filters,
            dateFilter: { preset: 'custom', startDate, endDate },
          },
        })),

      toggleBrand: (brandId) =>
        set((state) => {
          const current = state.filters.selectedBrands;
          const newSelected = current.includes(brandId)
            ? current.filter((id) => id !== brandId)
            : [...current, brandId];
          return {
            filters: { ...state.filters, selectedBrands: newSelected },
            activeViewId: null,
          };
        }),

      toggleBranch: (branchId) =>
        set((state) => {
          const current = state.filters.selectedBranches;
          const newSelected = current.includes(branchId)
            ? current.filter((id) => id !== branchId)
            : [...current, branchId];
          return {
            filters: { ...state.filters, selectedBranches: newSelected },
            activeViewId: null,
          };
        }),

      toggleLevel: (levelId) =>
        set((state) => {
          const current = state.filters.selectedLevels;
          const newSelected = current.includes(levelId)
            ? current.filter((id) => id !== levelId)
            : [...current, levelId];
          return {
            filters: { ...state.filters, selectedLevels: newSelected },
            activeViewId: null,
          };
        }),

      selectAllBrands: (brandIds) =>
        set((state) => ({
          filters: { ...state.filters, selectedBrands: brandIds },
          activeViewId: null,
        })),

      selectAllBranches: (branchIds) =>
        set((state) => ({
          filters: { ...state.filters, selectedBranches: branchIds },
          activeViewId: null,
        })),

      clearSelections: () =>
        set((state) => ({
          filters: {
            ...state.filters,
            selectedBrands: [],
            selectedBranches: [],
            selectedLevels: [],
          },
          activeViewId: null,
        })),

      saveView: (name, description) => {
        const { filters } = get();
        const newView: SavedView = {
          id: `view-${Date.now()}`,
          name,
          description,
          createdAt: new Date(),
          updatedAt: new Date(),
          filters: { ...filters },
        };
        set((state) => ({
          savedViews: [...state.savedViews, newView],
          activeViewId: newView.id,
        }));
      },

      loadView: (viewId) => {
        const { savedViews } = get();
        const view = savedViews.find((v) => v.id === viewId);
        if (view) {
          set({
            filters: { ...view.filters },
            activeViewId: viewId,
          });
        }
      },

      deleteView: (viewId) =>
        set((state) => ({
          savedViews: state.savedViews.filter((v) => v.id !== viewId),
          activeViewId: state.activeViewId === viewId ? null : state.activeViewId,
        })),

      updateView: (viewId, updates) =>
        set((state) => ({
          savedViews: state.savedViews.map((v) =>
            v.id === viewId
              ? { ...v, ...updates, updatedAt: new Date() }
              : v
          ),
        })),

      clearActiveView: () => set({ activeViewId: null }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setViewModalOpen: (open) => set({ viewModalOpen: open }),

      setGroupBy: (groupBy) =>
        set((state) => ({
          filters: { ...state.filters, groupBy },
        })),

      setComparisonMode: (comparisonMode) =>
        set((state) => ({
          filters: { ...state.filters, comparisonMode },
        })),
    }),
    {
      name: 'lytics-dashboard-storage',
      partialize: (state) => ({
        savedViews: state.savedViews,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// Selectors
export const useFilters = () => useDashboardStore((state) => state.filters);
export const useSavedViews = () => useDashboardStore((state) => state.savedViews);
export const useActiveView = () => {
  const activeViewId = useDashboardStore((state) => state.activeViewId);
  const savedViews = useDashboardStore((state) => state.savedViews);
  return savedViews.find((v) => v.id === activeViewId);
};
