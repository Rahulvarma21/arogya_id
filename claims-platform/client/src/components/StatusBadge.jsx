import React from 'react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: 'bg-blue-50 text-blue-700 border-blue-200',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        statusStyles[status] || 'bg-slate-50 text-slate-700 border-slate-200'
      }`}
    >
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
        status === 'Pending' ? 'bg-blue-500' :
        status === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'
      }`} />
      {status}
    </span>
  );
};

export default StatusBadge;
