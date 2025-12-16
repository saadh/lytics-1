'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'flex items-start gap-3 cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center w-5 h-5 rounded border-2 transition-all duration-200 flex-shrink-0 mt-0.5',
          checked
            ? 'bg-blue-600 border-blue-600'
            : 'bg-white border-gray-300 hover:border-gray-400'
        )}
        onClick={() => !disabled && onChange(!checked)}
      >
        {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </div>
      {(label || description) && (
        <div className="flex-1" onClick={() => !disabled && onChange(!checked)}>
          {label && (
            <span className="block text-sm font-medium text-gray-900">{label}</span>
          )}
          {description && (
            <span className="block text-sm text-gray-500 mt-0.5">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}
