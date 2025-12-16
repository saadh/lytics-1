'use client';

import { useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { Button, Card } from '@/components/ui';
import { cn } from '@/lib/utils';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { DatePreset } from '@/types';

const datePresets: { value: DatePreset; label: string }[] = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: '30days', label: 'Past 30 Days' },
  { value: '60days', label: 'Past 60 Days' },
  { value: '90days', label: 'Past 90 Days' },
  { value: '120days', label: 'Past 120 Days' },
];

export function DateFilter() {
  const { filters, setDatePreset, setCustomDateRange } = useDashboardStore();
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      setCustomDateRange(new Date(customStart), new Date(customEnd));
      setShowCustom(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Time Period:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {datePresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setDatePreset(preset.value)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
                filters.dateFilter.preset === preset.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {preset.label}
            </button>
          ))}

          <button
            onClick={() => setShowCustom(!showCustom)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all',
              filters.dateFilter.preset === 'custom'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            Custom
            {showCustom ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5 ml-auto text-sm text-gray-500">
          <span>Showing:</span>
          <span className="font-medium text-gray-700">
            {format(filters.dateFilter.startDate, 'MMM d, yyyy')} -{' '}
            {format(filters.dateFilter.endDate, 'MMM d, yyyy')}
          </span>
        </div>
      </div>

      {showCustom && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              size="sm"
              onClick={handleCustomApply}
              disabled={!customStart || !customEnd}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
