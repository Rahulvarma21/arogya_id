import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, FileText, Download, MessageSquare, AlertCircle, Check, X } from 'lucide-react';

const ClaimReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Review inputs
  const [approvedAmount, setApprovedAmount] = useState('');
  const [insurerComments, setInsurerComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchClaimDetails = async () => {
      try {
        const res = await API.get(`/claims/${id}`);
        setClaim(res.data);
        // Pre-fill inputs if already reviewed
        if (res.data.approvedAmount) setApprovedAmount(res.data.approvedAmount.toString());
        if (res.data.insurerComments) setInsurerComments(res.data.insurerComments);
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

  const handleReviewAction = async (status) => {
    // 1. Rules Validation
    if (status === 'Approved') {
      const amt = parseFloat(approvedAmount);
      if (isNaN(amt) || amt <= 0) {
        toast.error('Please enter a valid positive approved amount');
        return;
      }
      if (claim && amt > claim.claimAmount) {
        toast.error(`Approved amount cannot exceed requested amount ($${claim.claimAmount})`);
        return;
      }
    }

    if (status === 'Rejected') {
      if (!insurerComments.trim()) {
        toast.error('Comments are required for rejected claims');
        return;
      }
    }

    setSubmitting(true);
    try {
      await API.put(`/claims/${id}`, {
        status,
        approvedAmount: status === 'Approved' ? parseFloat(approvedAmount) : 0,
        insurerComments
      });
      toast.success(`Claim successfully ${status.toLowerCase()}!`);
      navigate('/insurer/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to update claim review');
    } finally {
      setSubmitting(false);
    }
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
        <p className="text-sm text-slate-500 mt-1">The claim you are reviewing does not exist.</p>
        <button
          onClick={() => navigate('/insurer/dashboard')}
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Panel
        </button>
      </div>
    );
  }

  const isImage = /\.(jpg|jpeg|png)$/i.test(claim.document);
  const documentUrl = `http://localhost:5000/uploads/${claim.document}`;

  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8 bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/insurer/dashboard')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Panel
        </button>

        {/* Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 m-0">Review Claim Application</h1>
            <p className="text-sm text-slate-500 mt-1">Review the submitted details, receipts, and approve/reject with feedback.</p>
          </div>
          <div>
            <StatusBadge status={claim.status} />
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Claim info & attachment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Patient profile & symptoms description */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Patient Claim Info</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Name</span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{claim.name}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                    <p className="text-sm font-medium text-slate-600 mt-0.5">{claim.email}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Submission Date</span>
                    <p className="text-sm text-slate-500 mt-0.5">{formatDate(claim.submissionDate)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Claim Reference ID</span>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{claim._id}</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnosis / Symptoms Description</span>
                  <p className="text-sm text-slate-700 mt-1.5 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {claim.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Preview & Download */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Supporting Receipt / Document</h3>
                <a
                  href={documentUrl}
                  download={claim.document}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download File
                </a>
              </div>

              {isImage ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2 min-h-60 max-h-96">
                  <img
                    src={documentUrl}
                    alt="Claim document attachment"
                    className="object-contain max-h-80 w-auto"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-slate-200 bg-slate-50">
                  <FileText className="h-12 w-12 text-slate-400 mb-2" />
                  <span className="text-sm font-medium text-slate-700 truncate max-w-xs">{claim.document}</span>
                  <span className="text-xs text-slate-400 mt-0.5">PDF Document</span>
                </div>
              )}
            </div>

          </div>

          {/* Insurer review panel card */}
          <div className="space-y-6">
            
            {/* Financial request summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 font-mono">Financial Data</h3>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Requested Amount:</span>
                <span className="text-base font-bold text-slate-900">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(claim.claimAmount)}
                </span>
              </div>
            </div>

            {/* Decision Editor Form */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Review Decision</h3>
              
              <div className="space-y-5">
                {/* Approved Amount Input */}
                <div>
                  <label htmlFor="approvedAmount" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Approved Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 text-sm">$</span>
                    <input
                      id="approvedAmount"
                      type="number"
                      step="0.01"
                      value={approvedAmount}
                      onChange={(e) => setApprovedAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-1.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Required if approving the claim application.</p>
                </div>

                {/* Reviewer Comments */}
                <div>
                  <label htmlFor="comments" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Insurer Review Comments
                  </label>
                  <textarea
                    id="comments"
                    rows={4}
                    value={insurerComments}
                    onChange={(e) => setInsurerComments(e.target.value)}
                    placeholder="Enter review remarks, feedback reasons, or notes..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Required if rejecting the claim application.</p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-3">
                  <button
                    onClick={() => handleReviewAction('Approved')}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/10 hover:bg-emerald-700 disabled:bg-slate-300 disabled:shadow-none transition-all cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    Approve Claim Application
                  </button>
                  <button
                    onClick={() => handleReviewAction('Rejected')}
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-500/10 hover:bg-rose-700 disabled:bg-slate-300 disabled:shadow-none transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    Reject Claim Application
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ClaimReview;
