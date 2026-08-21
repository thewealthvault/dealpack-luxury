'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert } from 'lucide-react';

interface AccessGuardProps {
  children: React.ReactNode;
}

export const AccessGuard: React.FC<AccessGuardProps> = ({ children }) => {
  const [email, setEmail] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const verifyServerStatus = async (userEmail: string) => {
    try {
      const res = await fetch(`/api/verify-access?t=${Date.now()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      return data.authorized === true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem('dealpack_user_email');

    if (!savedEmail) {
      setIsLoading(false);
      return;
    }

    verifyServerStatus(savedEmail).then((authorized) => {
      if (authorized) {
        setIsAuthorized(true);
      } else {
        localStorage.removeItem('dealpack_user_email');
        setIsAuthorized(false);
      }
      setIsLoading(false);
    });

    // Heartbeat: Check server every 10 seconds without page refresh
    const interval = setInterval(async () => {
      const currentSaved = localStorage.getItem('dealpack_user_email');
      if (currentSaved) {
        const stillAuthorized = await verifyServerStatus(currentSaved);
        if (!stillAuthorized) {
          localStorage.removeItem('dealpack_user_email');
          setIsAuthorized(false); // Drops lock screen automatically
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const authorized = await verifyServerStatus(email);
    if (authorized) {
      localStorage.setItem('dealpack_user_email', email);
      setIsAuthorized(true);
    } else {
      setError('This email does not have an active Lifetime Pass.');
    }
  };

  if (isLoading) return null;

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
        <div className="bg-slate-900 p-6 text-white text-center">
          <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-400 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">DealPack Luxury Access</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your registered email to unlock the generator</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="broker@agency.com"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-amber-600/20"
            >
              Verify & Unlock
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">Don't have access yet?</p>
            <p className="text-xs font-semibold text-slate-800 mt-0.5">
              Get Lifetime Access for $50 USD
            </p>
            <a
              href="mailto:support@dealpack.com?subject=Inquiry%20for%20DealPack%20Lifetime%20Pass"
              className="inline-block mt-3 text-xs font-bold text-amber-600 hover:underline"
            >
              Contact Founder to Purchase Access &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
