import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)] px-4 py-6">
      <div className="space-y-1">
        {user.role === 'patient' && (
          <>
            <NavLink
              to="/patient/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/patient/submit"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <PlusCircle className="h-4 w-4" />
              Submit Claim
            </NavLink>
          </>
        )}

        {user.role === 'insurer' && (
          <NavLink
            to="/insurer/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            Claims Dashboard
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
