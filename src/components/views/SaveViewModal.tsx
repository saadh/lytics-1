'use client';

import { useState } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import { Modal, Button, Input } from '@/components/ui';

export function SaveViewModal() {
  const { viewModalOpen, setViewModalOpen, saveView, filters } = useDashboardStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter a name for this view');
      return;
    }

    saveView(name.trim(), description.trim() || undefined);
    setName('');
    setDescription('');
    setError('');
    setViewModalOpen(false);
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setError('');
    setViewModalOpen(false);
  };

  const hasSelections =
    filters.selectedBrands.length > 0 ||
    filters.selectedBranches.length > 0 ||
    filters.selectedLevels.length > 0;

  return (
    <Modal
      isOpen={viewModalOpen}
      onClose={handleClose}
      title="Save Current View"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save View
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {!hasSelections && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              No schools are currently selected. The saved view will show all schools by default.
            </p>
          </div>
        )}

        <Input
          label="View Name"
          placeholder="e.g., Rowad Schools Overview"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          error={error}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description (Optional)
          </label>
          <textarea
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Add a description to help identify this view..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">View Settings</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Group by:</span>{' '}
              <span className="capitalize">{filters.groupBy}</span>
            </p>
            <p>
              <span className="font-medium">Comparison:</span>{' '}
              <span className="capitalize">{filters.comparisonMode.replace('-', ' ')}</span>
            </p>
            {filters.selectedBrands.length > 0 && (
              <p>
                <span className="font-medium">Brands:</span> {filters.selectedBrands.length} selected
              </p>
            )}
            {filters.selectedBranches.length > 0 && (
              <p>
                <span className="font-medium">Branches:</span> {filters.selectedBranches.length} selected
              </p>
            )}
            {filters.selectedLevels.length > 0 && (
              <p>
                <span className="font-medium">Levels:</span> {filters.selectedLevels.length} selected
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
