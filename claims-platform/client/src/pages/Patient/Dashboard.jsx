import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import ClaimTable from '../../components/ClaimTable';
import Loader from '../../components/Loader';
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await API.get('/claims/my');
        setClaims(res.data);
      } catch (err) {
        toast.error(err.message || 'Failed to load claims');
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const totalClaims = claims.length;
  const pendingClaims = claims.filter(c => c.status === 'Pending').length;
  const approvedClaims = claims.filter(c => c.status === 'Approved').length;
  const rejectedClaims = claims.filter(c => c.status === 'Rejected').length;

  const handleViewClaim = (id) => {
    navigate(`/patient/claim/${id}`);
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0">My Insurance Claims</h1>
            <p className="text-sm text-slate-500 mt-1">Submit, monitor, and manage your claim applications.</p>
          </div>
          <button
            onClick={() => navigate('/patient/submit')}
            className="inline-flex items-center gap-2 justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Submit New Claim
          </button>
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

        {/* Claim Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Claim Applications History</h2>
          <ClaimTable claims={claims} role="patient" onViewDetails={handleViewClaim} />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
