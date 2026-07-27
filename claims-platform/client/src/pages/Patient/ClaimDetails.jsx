import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, DollarSign, FileText, Download, MessageSquare, AlertCircle } from 'lucide-react';

const ClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        const res = await API.get(`/claims/${id}`);
        setClaim(res.data);
      } catch (err) {
        toast.error(err.message || 'Failed to load claim details');
      } finally {
        setLoading(false);
      }
    };

    fetchClaimDetails();
  }, [id]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-slate-50 p-4">
        <AlertCircle className="h-12 w-12 text-slate-400 mb-4" />
        <h2 className="text-lg font-semibold text-slate-900">Claim not found</h2>
        <p className="text-sm text-slate-500 mt-1">The claim application you are looking for does not exist.</p>
        <button
          onClick={() => navigate('/patient/dashboard')}
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isImage = /\.(jpg|jpeg|png)$/i.test(claim.document);
  const documentUrl = `http://localhost:5000/uploads/${claim.document}`;

  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/patient/dashboard')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Header card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Claim Reference</span>
              <h1 className="text-xl font-bold text-slate-900 mt-0.5 max-w-xs truncate">{claim._id}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                <Calendar className="h-3.5 w-3.5" />
                Submitted {formatDate(claim.submissionDate)}
              </div>
            </div>
            <div>
              <StatusBadge status={claim.status} />
            </div>
          </div>
        </div>

        {/* Claim Details Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Details Column */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Main Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Claim Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-slate-400">Claimant Profile</h4>
                  <p className="text-sm font-semibold text-slate-800 mt-1">{claim.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{claim.email}</p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-400">Symptoms & Description</h4>
                  <p className="text-sm text-slate-700 mt-1.5 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {claim.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Insurer comments */}
            {claim.status !== 'Pending' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  Insurer Comments
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {claim.insurerComments ? (
                    <p className="text-sm text-slate-700 leading-relaxed italic">"{claim.insurerComments}"</p>
                  ) : (
                    <p className="text-sm text-slate-400 italic">No feedback comments provided.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Side stats & Attachment */}
          <div className="space-y-6">
            {/* Amount Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Financial Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs text-slate-500">Requested</span>
                  <span className="text-sm font-semibold text-slate-900">{formatCurrency(claim.claimAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Approved</span>
                  <span className={`text-base font-bold ${claim.status === 'Approved' ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {claim.status === 'Approved' ? formatCurrency(claim.approvedAmount) : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Supporting Document */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Attachment</h3>
              
              {isImage ? (
                <div className="relative group overflow-hidden rounded-xl border border-slate-200 mb-4 bg-slate-100 flex items-center justify-center h-40">
                  <img
                    src={documentUrl}
                    alt="Claim attachment"
                    className="object-contain h-full w-full max-h-40"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-slate-200 bg-slate-50 mb-4">
                  <FileText className="h-10 w-10 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-600 text-center truncate max-w-[120px]">
                    {claim.document}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">PDF Document</span>
                </div>
              )}

              <a
                href={documentUrl}
                download={claim.document}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center gap-2 justify-center rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-all cursor-pointer text-center"
              >
                <Download className="h-3.5 w-3.5" />
                View & Download File
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClaimDetails;
