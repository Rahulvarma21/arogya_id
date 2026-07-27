import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Activity } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">Arogya</span>
              <span className="text-xs block text-slate-500 font-medium -mt-1">Claims Manager</span>
            </div>
          </div>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                <span className="text-xs uppercase tracking-wider font-bold text-blue-600">{user.role}</span>
              </div>
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <User className="h-5 w-5" />
              </div>
              <button
                onClick={logout}
                className="flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 sm:py-2 gap-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
