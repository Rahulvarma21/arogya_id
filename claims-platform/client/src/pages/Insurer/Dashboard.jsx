import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import ClaimTable from '../../components/ClaimTable';
import FilterBar from '../../components/FilterBar';
import Loader from '../../components/Loader';
import { ClipboardList, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const InsurerDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    searchName: '',
    status: '',
    minAmount: '',
    maxAmount: '',
    startDate: '',
    endDate: '',
    sortBy: 'submissionDateDesc'
  });

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await API.get('/claims');
        setClaims(res.data);
        setFilteredClaims(res.data);
      } catch (err) {
        toast.error(err.message || 'Failed to load claims');
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  // Filter & Sort claims whenever filters or claims state changes
  useEffect(() => {
    let result = [...claims];

    // 1. Filter by status
    if (filters.status) {
      result = result.filter(c => c.status === filters.status);
    }

    // 2. Filter by patient name search
    if (filters.searchName) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(filters.searchName.toLowerCase())
      );
    }

    // 3. Filter by Min amount
    if (filters.minAmount) {
      result = result.filter(c => c.claimAmount >= parseFloat(filters.minAmount));
    }

    // 4. Filter by Max amount
    if (filters.maxAmount) {
      result = result.filter(c => c.claimAmount <= parseFloat(filters.maxAmount));
    }

    // 5. Filter by Start Date
    if (filters.startDate) {
      const startDateTime = new Date(filters.startDate).setHours(0, 0, 0, 0);
      result = result.filter(c => new Date(c.submissionDate).getTime() >= startDateTime);
    }

    // 6. Sort
    if (filters.sortBy === 'submissionDateDesc') {
      result.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
    } else if (filters.sortBy === 'submissionDateAsc') {
      result.sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate));
    } else if (filters.sortBy === 'amountDesc') {
      result.sort((a, b) => b.claimAmount - a.claimAmount);
    } else if (filters.sortBy === 'amountAsc') {
      result.sort((a, b) => a.claimAmount - b.claimAmount);
    }

    setFilteredClaims(result);
  }, [filters, claims]);

  const totalClaims = claims.length;
  const pendingClaims = claims.filter(c => c.status === 'Pending').length;
  const approvedClaims = claims.filter(c => c.status === 'Approved').length;
  const rejectedClaims = claims.filter(c => c.status === 'Rejected').length;

  const handleReviewClaim = (id) => {
    navigate(`/insurer/claim/${id}`);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0">Insurer Claims Panel</h1>
          <p className="text-sm text-slate-500 mt-1">Review and manage pending health claim submissions.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Card Total */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="rounded-lg bg-slate-100 p-3 text-slate-600">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Claims</p>
              <h4 className="text-2xl font-bold text-slate-950 mt-1">{totalClaims}</h4>
            </div>
          </div>

          {/* Card Pending */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending</p>
              <h4 className="text-2xl font-bold text-slate-950 mt-1">{pendingClaims}</h4>
            </div>
          </div>

          {/* Card Approved */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Approved</p>
              <h4 className="text-2xl font-bold text-slate-950 mt-1">{approvedClaims}</h4>
            </div>
          </div>

          {/* Card Rejected */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-4">
            <div className="rounded-lg bg-rose-50 p-3 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rejected</p>
              <h4 className="text-2xl font-bold text-slate-950 mt-1">{rejectedClaims}</h4>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar filters={filters} onFilterChange={setFilters} />

        {/* Claim Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Claim Records</h2>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredClaims.length} of {totalClaims} results
            </span>
          </div>
          <ClaimTable claims={filteredClaims} role="insurer" onViewDetails={handleReviewClaim} />
        </div>
      </div>
    </div>
  );
};

export default InsurerDashboard;
