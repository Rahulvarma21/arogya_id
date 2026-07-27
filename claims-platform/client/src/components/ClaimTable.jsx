import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Eye, ArrowUpRight } from 'lucide-react';

const ClaimTable = ({ claims, role, onViewDetails }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (!claims || claims.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-dashed border-slate-200 bg-white">
        <div className="rounded-full bg-slate-50 p-3 mb-4">
          <Eye className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">No claims found</h3>
        <p className="text-xs text-slate-500 mt-1">Get started by submitting your first insurance claim.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            {role === 'insurer' && (
              <>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Email</th>
              </>
            )}
            <th className="px-6 py-4">Requested Amount</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Submission Date</th>
            {role === 'patient' && <th className="px-6 py-4">Approved Amount</th>}
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
          {claims.map((claim) => (
            <tr key={claim._id} className="hover:bg-slate-50/50 transition-colors">
              {role === 'insurer' && (
                <>
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                    {claim.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {claim.email}
                  </td>
                </>
              )}
              <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                {formatCurrency(claim.claimAmount)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <StatusBadge status={claim.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                {formatDate(claim.submissionDate)}
              </td>
              {role === 'patient' && (
                <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                  {claim.status === 'Approved' ? formatCurrency(claim.approvedAmount) : '—'}
                </td>
              )}
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <button
                  onClick={() => onViewDetails(claim._id)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-all cursor-pointer"
                >
                  {role === 'insurer' ? 'Review' : 'View'}
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClaimTable;
