'use client';

import { useState } from 'react';
import { useDashboardStore, useSavedViews } from '@/store/dashboardStore';
import { Checkbox, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Building,
  MapPin,
  GraduationCap,
  Bookmark,
  Trash2,
  LayoutGrid,
  List,
  Filter,
  Layers,
} from 'lucide-react';
import { getAllBrands, getBranchesByBrand, getLevelsByBranch } from '@/data/mockData';
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
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 w-72 bg-white border-r border-gray-200 z-40',
          'transform transition-transform duration-300 ease-in-out',
          'overflow-hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Tabs */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
              <button
                onClick={() => setActiveTab('filters')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all',
                  activeTab === 'filters'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Filter className="w-4 h-4" />
                Schools
              </button>
              <button
                onClick={() => setActiveTab('views')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all',
                  activeTab === 'views'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Bookmark className="w-4 h-4" />
                Views
                {savedViews.length > 0 && (
                  <span className={cn(
                    'px-1.5 py-0.5 text-xs rounded-full',
                    activeTab === 'views' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  )}>
                    {savedViews.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'filters' ? (
              <div className="p-4 space-y-6">
                {/* Display Options */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-700">Display Options</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-2 block">
                        Group By
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(['brand', 'branch', 'level', 'curriculum'] as const).map((option) => (
                          <button
                            key={option}
                            onClick={() => setGroupBy(option)}
                            className={cn(
                              'px-3 py-2 text-xs font-medium rounded-md transition-all capitalize border',
                              filters.groupBy === option
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-2 block">
                        Comparison Mode
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => setComparisonMode('single')}
                          className={cn(
                            'flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-all border',
                            filters.comparisonMode === 'single'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          )}
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                          Single
                        </button>
                        <button
                          onClick={() => setComparisonMode('side-by-side')}
                          className={cn(
                            'flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-all border',
                            filters.comparisonMode === 'side-by-side'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          )}
                        >
                          <List className="w-3.5 h-3.5" />
                          Compare
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* School Selection */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-700">School Brands</h3>
                    </div>
                    <button
                      onClick={handleSelectAllBrands}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      {filters.selectedBrands.length === brands.length ? 'Clear All' : 'Select All'}
                    </button>
                  </div>

                  <div className="space-y-1 bg-white rounded-lg border border-gray-200 p-2">
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
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-800 mb-2">Selection Summary</div>
                    <div className="flex flex-wrap gap-1.5">
                      {filters.selectedBrands.length > 0 && (
                        <Badge variant="info" size="sm">
                          {filters.selectedBrands.length} Brand{filters.selectedBrands.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                      {filters.selectedBranches.length > 0 && (
                        <Badge variant="info" size="sm">
                          {filters.selectedBranches.length} Branch{filters.selectedBranches.length > 1 ? 'es' : ''}
                        </Badge>
                      )}
                      {filters.selectedLevels.length > 0 && (
                        <Badge variant="info" size="sm">
                          {filters.selectedLevels.length} Level{filters.selectedLevels.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <button
                      onClick={clearSelections}
                      className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      Clear all selections
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4">
                {savedViews.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bookmark className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">No saved views yet</p>
                    <p className="text-xs text-gray-400 max-w-[200px] mx-auto">
                      Configure your filters and click &quot;Save View&quot; to save your dashboard configuration
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedViews.map((view) => (
                      <div
                        key={view.id}
                        className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group cursor-pointer"
                        onClick={() => loadView(view.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{view.name}</h4>
                            {view.description && (
                              <p className="text-xs text-gray-500 mt-0.5 truncate">{view.description}</p>
                            )}
                            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                              {view.filters.selectedBrands.length > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                  {view.filters.selectedBrands.length} brands
                                </span>
                              )}
                              {view.filters.selectedBranches.length > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                                  {view.filters.selectedBranches.length} branches
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteView(view.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
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
    <div>
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-2 rounded-md transition-colors',
          isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
        )}
      >
        <button
          onClick={onToggleExpand}
          className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
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
        <div className="ml-5 pl-3 border-l-2 border-gray-200 mt-1 space-y-1">
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
          'flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors',
          isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
        )}
      >
        <button
          onClick={onToggleExpand}
          className="p-0.5 hover:bg-gray-200 rounded flex-shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          )}
        </button>
        <Checkbox
          checked={isSelected}
          onChange={onToggleSelect}
          className="flex-shrink-0"
        />
        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-700 flex-1 truncate">{branch.name}</span>
        <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{levels.length}</span>
      </div>

      {isExpanded && (
        <div className="ml-5 pl-3 border-l-2 border-gray-200 mt-1 space-y-0.5">
          {levels.map((level) => (
            <div
              key={level.id}
              className={cn(
                'flex items-center gap-2 px-2 py-1 rounded-md transition-colors',
                isLevelSelected(level.id) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
              )}
            >
              <Checkbox
                checked={isLevelSelected(level.id)}
                onChange={() => onToggleLevel(level.id)}
                className="flex-shrink-0"
              />
              <GraduationCap className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-600 truncate">{level.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
