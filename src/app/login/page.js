'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Hammer, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate small auth delay for realistic feel
    setTimeout(() => {
      if (password === '1234') {
        localStorage.setItem('a1_auth', 'true');
        router.push('/');
      } else {
        setError('Invalid admin password. Please try again.');
        setLoading(false);
      }
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-md p-8 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-3.5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#0b2240] flex items-center justify-center text-white shadow-sm">
            <Hammer className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-zinc-800 tracking-tight">
              A-1 Enterprises
            </h1>
            <p className="text-[10px] text-[#2d5e3b] font-extrabold uppercase tracking-wider block mt-0.5">
              Fabrication Works Billing Panel
            </p>
          </div>
        </div>

        <div className="h-px bg-zinc-200"></div>

        {/* Form Details */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-550 uppercase tracking-wider">
              Enter Admin Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm focus:ring-2 focus:ring-teal-500 font-mono text-zinc-800 transition-all placeholder-zinc-350"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-650"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-semibold text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0b2240] text-white hover:bg-[#071629] text-sm font-bold tracking-wide transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            ) : (
              'Verify & Enter Panel'
            )}
          </button>
        </form>
      </div>
      
      <p className="text-[10px] text-zinc-400 mt-6 font-medium">
        Secured Admin Console © {new Date().getFullYear()} A-1 Enterprises
      </p>
    </div>
  );
}
