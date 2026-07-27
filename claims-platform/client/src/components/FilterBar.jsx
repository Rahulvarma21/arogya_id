import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleReset = () => {
    onFilterChange({
      searchName: '',
      status: '',
      minAmount: '',
      maxAmount: '',
      startDate: '',
      endDate: '',
      sortBy: 'submissionDateDesc'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <SlidersHorizontal className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm font-bold text-slate-800">Filter & Sort Claims</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Search Patient
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="searchName"
              value={filters.searchName}
              onChange={handleChange}
              placeholder="Enter name..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Min Amount */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Min Amount ($)
          </label>
          <input
            type="number"
            name="minAmount"
            value={filters.minAmount}
            onChange={handleChange}
            placeholder="Min"
            className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
          />
        </div>

        {/* Max Amount */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Max Amount ($)
          </label>
          <input
            type="number"
            name="maxAmount"
            value={filters.maxAmount}
            onChange={handleChange}
            placeholder="Max"
            className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
          />
        </div>

        {/* Sort options */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Sort By
          </label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
          >
            <option value="submissionDateDesc">Newest First</option>
            <option value="submissionDateAsc">Oldest First</option>
            <option value="amountDesc">Amount: High-Low</option>
            <option value="amountAsc">Amount: Low-High</option>
          </select>
        </div>

        {/* Date Filter Start */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
          />
        </div>

      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
