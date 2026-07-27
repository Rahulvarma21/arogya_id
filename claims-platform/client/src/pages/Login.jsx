import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Activity, Mail, Lock, Shield, User, KeyRound } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // If already logged in, redirect away from login page
  if (user) {
    return <Navigate to={user.role === 'insurer' ? '/insurer/dashboard' : '/patient/dashboard'} replace />;
  }

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const loggedInUser = await login(data.email, data.password);
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      if (loggedInUser.role === 'insurer') {
        navigate('/insurer/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillCredentials = (email, password) => {
    setValue('email', email);
    setValue('password', password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        
        {/* Header Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
            <Activity className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
            Arogya Claims Portal
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to submit or review insurance claims
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-md">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 ${
                    errors.email ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/25' : 'border-slate-300 focus:border-blue-500'
                  }`}
                  placeholder="patient@test.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/25 ${
                    errors.password ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/25' : 'border-slate-300 focus:border-blue-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:shadow-none transition-all cursor-pointer"
              >
                {submitting ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>

          </form>
        </div>

        {/* Demo Credentials Helper Box */}
        <div className="bg-slate-100/80 rounded-2xl border border-slate-200/50 p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
            <KeyRound className="h-4 w-4 text-blue-600" />
            Quick Demo Credentials
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Credentials */}
            <button
              onClick={() => handleFillCredentials('patient@test.com', 'patient123')}
              className="flex flex-col items-start p-3 bg-white hover:bg-blue-50/50 rounded-xl border border-slate-200 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <User className="h-3.5 w-3.5" />
                Role: Patient
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-mono">patient@test.com</span>
              <span className="text-[10px] text-slate-400 font-mono">pass: patient123</span>
            </button>

            {/* Insurer Credentials */}
            <button
              onClick={() => handleFillCredentials('insurer@test.com', 'insurer123')}
              className="flex flex-col items-start p-3 bg-white hover:bg-blue-50/50 rounded-xl border border-slate-200 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <Shield className="h-3.5 w-3.5" />
                Role: Insurer
              </div>
              <span className="text-[10px] text-slate-500 mt-1 font-mono">insurer@test.com</span>
              <span className="text-[10px] text-slate-400 font-mono">pass: insurer123</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
