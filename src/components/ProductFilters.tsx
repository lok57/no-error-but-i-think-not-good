import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  options: string[];
}

export interface ProductFiltersProps {
  filters: FilterOption[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filterId: string, values: string[]) => void;
  onClearFilters: () => void;
  className?: string;
  position?: 'left' | 'right';
}

export default function ProductFilters({
  filters,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  className = '',
  position = 'left'
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeFiltersCount = Object.values(selectedFilters).reduce(
    (count, values) => count + values.length,
    0
  );

  return (
    <>
      {/* Filter Icon Button */}
      <div className={`${className} absolute ${position}-4 top-4 z-10`}>
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
        >
          <SlidersHorizontal className="w-5 h-5 text-white transition-transform group-hover:rotate-180" />
          <span className="text-white font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="flex items-center justify-center bg-accent-600 text-white text-xs min-w-[20px] h-5 px-1.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className={`absolute inset-y-0 ${position}-0 w-full max-w-sm bg-white/10 backdrop-blur-xl border-r border-white/20`}>
            <div className="h-full flex flex-col text-white">
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => {
                        onClearFilters();
                        setIsOpen(false);
                      }}
                      className="text-sm text-accent-400 hover:text-accent-300"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-4 space-y-8">
                  {filters.map((filter) => (
                    <div key={filter.id} className="border-b border-white/10 pb-6 last:border-0">
                      <h4 className="font-medium mb-4 text-lg">{filter.label}</h4>
                      <div className="space-y-3">
                        {filter.options.map((option) => {
                          const isSelected = selectedFilters[filter.id]?.includes(option) || false;
                          return (
                            <label 
                              key={option} 
                              className="flex items-center group cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={isSelected}
                                onChange={(e) => {
                                  const currentValues = selectedFilters[filter.id] || [];
                                  const newValues = e.target.checked
                                    ? [...currentValues, option]
                                    : currentValues.filter(value => value !== option);
                                  onFilterChange(filter.id, newValues);
                                }}
                              />
                              <div className={`w-5 h-5 rounded border ${
                                isSelected 
                                  ? 'bg-accent-600 border-accent-600' 
                                  : 'border-white/30 group-hover:border-white/50'
                              } flex items-center justify-center transition-colors mr-3`}>
                                {isSelected && (
                                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className={`text-sm ${
                                isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'
                              } transition-colors`}>
                                {option}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/20 p-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-accent-600 text-white py-3 px-4 rounded-lg hover:bg-accent-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}