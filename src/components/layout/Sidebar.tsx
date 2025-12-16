'use client';

import { useState } from 'react';
import { useDashboardStore, useSavedViews } from '@/store/dashboardStore';
import { Button, Checkbox, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Building,
  MapPin,
  GraduationCap,
  Bookmark,
  X,
  Trash2,
  LayoutGrid,
  List,
} from 'lucide-react';
import { mockCompany, getAllBrands, getBranchesByBrand, getLevelsByBranch } from '@/data/mockData';
import { Brand, Branch } from '@/types';

export function Sidebar() {
  const {
    filters,
    sidebarOpen,
    setSidebarOpen,
    toggleBrand,
    toggleBranch,
    toggleLevel,
    selectAllBrands,
    clearSelections,
    loadView,
    deleteView,
    setGroupBy,
    setComparisonMode,
  } = useDashboardStore();

  const savedViews = useSavedViews();
  const [expandedBrands, setExpandedBrands] = useState<Set<string>>(new Set());
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'filters' | 'views'>('filters');

  const brands = getAllBrands();

  const toggleBrandExpanded = (brandId: string) => {
    const next = new Set(expandedBrands);
    if (next.has(brandId)) {
      next.delete(brandId);
    } else {
      next.add(brandId);
    }
    setExpandedBrands(next);
  };

  const toggleBranchExpanded = (branchId: string) => {
    const next = new Set(expandedBranches);
    if (next.has(branchId)) {
      next.delete(branchId);
    } else {
      next.add(branchId);
    }
    setExpandedBranches(next);
  };

  const isBrandSelected = (brandId: string) => filters.selectedBrands.includes(brandId);
  const isBranchSelected = (branchId: string) => filters.selectedBranches.includes(branchId);
  const isLevelSelected = (levelId: string) => filters.selectedLevels.includes(levelId);

  const handleSelectAllBrands = () => {
    if (filters.selectedBrands.length === brands.length) {
      clearSelections();
    } else {
      selectAllBrands(brands.map(b => b.id));
    }
  };

  const getCurriculumBadge = (curriculum: Brand['curriculum']) => {
    const variants = {
      International: 'info' as const,
      National: 'success' as const,
      Mixed: 'warning' as const,
    };
    return <Badge variant={variants[curriculum]} size="sm">{curriculum}</Badge>;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 w-80 bg-white border-r border-gray-200 z-40',
          'transform transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Dashboard Settings
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('filters')}
                className={cn(
                  'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                  activeTab === 'filters'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Schools
              </button>
              <button
                onClick={() => setActiveTab('views')}
                className={cn(
                  'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                  activeTab === 'views'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Saved Views
                {savedViews.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                    {savedViews.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'filters' ? (
              <div className="p-4">
                {/* View Options */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Display Options
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                        Group By
                      </label>
                      <div className="flex gap-1 flex-wrap">
                        {(['brand', 'branch', 'level', 'curriculum'] as const).map((option) => (
                          <button
                            key={option}
                            onClick={() => setGroupBy(option)}
                            className={cn(
                              'px-2.5 py-1 text-xs font-medium rounded-md transition-all capitalize',
                              filters.groupBy === option
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1.5 block">
                        Comparison Mode
                      </label>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setComparisonMode('single')}
                          className={cn(
                            'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all',
                            filters.comparisonMode === 'single'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          )}
                        >
                          <LayoutGrid className="w-3 h-3" />
                          Single
                        </button>
                        <button
                          onClick={() => setComparisonMode('side-by-side')}
                          className={cn(
                            'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all',
                            filters.comparisonMode === 'side-by-side'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          )}
                        >
                          <List className="w-3 h-3" />
                          Compare
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* School Selection */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      School Brands
                    </h3>
                    <button
                      onClick={handleSelectAllBrands}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {filters.selectedBrands.length === brands.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  <div className="space-y-1">
                    {brands.map((brand) => (
                      <BrandItem
                        key={brand.id}
                        brand={brand}
                        isExpanded={expandedBrands.has(brand.id)}
                        isSelected={isBrandSelected(brand.id)}
                        onToggleExpand={() => toggleBrandExpanded(brand.id)}
                        onToggleSelect={() => toggleBrand(brand.id)}
                        expandedBranches={expandedBranches}
                        onToggleBranchExpand={toggleBranchExpanded}
                        isBranchSelected={isBranchSelected}
                        isLevelSelected={isLevelSelected}
                        onToggleBranch={toggleBranch}
                        onToggleLevel={toggleLevel}
                        getCurriculumBadge={getCurriculumBadge}
                      />
                    ))}
                  </div>
                </div>

                {/* Selection Summary */}
                {(filters.selectedBrands.length > 0 ||
                  filters.selectedBranches.length > 0 ||
                  filters.selectedLevels.length > 0) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs font-medium text-blue-800 mb-2">Selection Summary</div>
                    <div className="flex flex-wrap gap-1">
                      {filters.selectedBrands.length > 0 && (
                        <Badge variant="info" size="sm">
                          {filters.selectedBrands.length} Brands
                        </Badge>
                      )}
                      {filters.selectedBranches.length > 0 && (
                        <Badge variant="info" size="sm">
                          {filters.selectedBranches.length} Branches
                        </Badge>
                      )}
                      {filters.selectedLevels.length > 0 && (
                        <Badge variant="info" size="sm">
                          {filters.selectedLevels.length} Levels
                        </Badge>
                      )}
                    </div>
                    <button
                      onClick={clearSelections}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all selections
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4">
                {savedViews.length === 0 ? (
                  <div className="text-center py-8">
                    <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-1">No saved views yet</p>
                    <p className="text-xs text-gray-400">
                      Configure your filters and save a view to quickly access it later
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedViews.map((view) => (
                      <div
                        key={view.id}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => loadView(view.id)}
                          >
                            <h4 className="text-sm font-medium text-gray-900">{view.name}</h4>
                            {view.description && (
                              <p className="text-xs text-gray-500 mt-0.5">{view.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              {view.filters.selectedBrands.length > 0 && (
                                <Badge variant="default" size="sm">
                                  {view.filters.selectedBrands.length} brands
                                </Badge>
                              )}
                              {view.filters.selectedBranches.length > 0 && (
                                <Badge variant="default" size="sm">
                                  {view.filters.selectedBranches.length} branches
                                </Badge>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteView(view.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

interface BrandItemProps {
  brand: Brand;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onToggleSelect: () => void;
  expandedBranches: Set<string>;
  onToggleBranchExpand: (id: string) => void;
  isBranchSelected: (id: string) => boolean;
  isLevelSelected: (id: string) => boolean;
  onToggleBranch: (id: string) => void;
  onToggleLevel: (id: string) => void;
  getCurriculumBadge: (curriculum: Brand['curriculum']) => React.ReactNode;
}

function BrandItem({
  brand,
  isExpanded,
  isSelected,
  onToggleExpand,
  onToggleSelect,
  expandedBranches,
  onToggleBranchExpand,
  isBranchSelected,
  isLevelSelected,
  onToggleBranch,
  onToggleLevel,
  getCurriculumBadge,
}: BrandItemProps) {
  const branches = getBranchesByBrand(brand.id);

  return (
    <div className="rounded-lg overflow-hidden">
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
          isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
        )}
      >
        <button
          onClick={onToggleExpand}
          className="p-0.5 hover:bg-gray-200 rounded"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
        </button>
        <Checkbox
          checked={isSelected}
          onChange={onToggleSelect}
          className="flex-shrink-0"
        />
        <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-900 flex-1 truncate">
          {brand.name}
        </span>
        {getCurriculumBadge(brand.curriculum)}
      </div>

      {isExpanded && (
        <div className="ml-6 border-l border-gray-200 pl-2 mt-1 space-y-1">
          {branches.map((branch) => (
            <BranchItem
              key={branch.id}
              branch={branch}
              isExpanded={expandedBranches.has(branch.id)}
              isSelected={isBranchSelected(branch.id)}
              onToggleExpand={() => onToggleBranchExpand(branch.id)}
              onToggleSelect={() => onToggleBranch(branch.id)}
              isLevelSelected={isLevelSelected}
              onToggleLevel={onToggleLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface BranchItemProps {
  branch: Branch;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onToggleSelect: () => void;
  isLevelSelected: (id: string) => boolean;
  onToggleLevel: (id: string) => void;
}

function BranchItem({
  branch,
  isExpanded,
  isSelected,
  onToggleExpand,
  onToggleSelect,
  isLevelSelected,
  onToggleLevel,
}: BranchItemProps) {
  const levels = getLevelsByBranch(branch.id);

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors',
          isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
        )}
      >
        <button
          onClick={onToggleExpand}
          className="p-0.5 hover:bg-gray-200 rounded"
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3 text-gray-500" />
          ) : (
            <ChevronRight className="w-3 h-3 text-gray-500" />
          )}
        </button>
        <Checkbox
          checked={isSelected}
          onChange={onToggleSelect}
          className="flex-shrink-0"
        />
        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-700 flex-1 truncate">{branch.name}</span>
        <span className="text-xs text-gray-400">{levels.length}</span>
      </div>

      {isExpanded && (
        <div className="ml-6 border-l border-gray-200 pl-2 mt-1 space-y-0.5">
          {levels.map((level) => (
            <div
              key={level.id}
              className={cn(
                'flex items-center gap-2 px-3 py-1 rounded-lg transition-colors',
                isLevelSelected(level.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
              )}
            >
              <Checkbox
                checked={isLevelSelected(level.id)}
                onChange={() => onToggleLevel(level.id)}
                className="flex-shrink-0"
              />
              <GraduationCap className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-600 truncate">{level.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
