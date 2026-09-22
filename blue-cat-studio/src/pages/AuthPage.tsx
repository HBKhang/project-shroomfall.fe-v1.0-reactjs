import React, { useState } from 'react';
import { useIdentity } from '../api/hooks/useIdentity';
import Avatar from '../assets/logo/avatar.gif';

interface AuthPageProps { }

export const AuthPage: React.FC<AuthPageProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Pulling the compiled login mutation from your unified identity hook
  const { login } = useIdentity();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Just execute the request. If it fails, the interceptor layer handles the toast automatically!
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-sky-50/50 p-4 font-sans antialiased text-sky-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-sky-100 bg-white p-8 shadow-2xl shadow-sky-100/50 flex flex-col gap-6 relative overflow-hidden"
      >
        {/* Background decorative element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-50 rounded-full opacity-50"></div>

        <div className="text-center mb-2 relative z-10">
          {/* Avatar Integration - Centered above inputs, scaled down appropriately */}
          <div className="flex justify-center mb-4 relative z-10">
            <div className="p-1 rounded-full bg-white border-2 border-sky-100 shadow-md">
              <img
                src={Avatar}
                alt="Admin Avatar Mascot"
                className="h-16 w-16 rounded-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-sky-950 mb-1">
            Blue Cat Studio
          </h1>
          <p className="text-sm text-sky-600/80">
            Sign in to manage Shroomfall infrastructure
          </p>
        </div>

        <div className="flex flex-col gap-2 relative z-10">
          <label className="flex items-center gap-2.5 text-sm font-semibold text-sky-900">
            <span className="material-symbols-outlined text-[20px] text-sky-500">mail</span>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@bluecat.studio"
            className="w-full rounded-xl border border-sky-200 bg-sky-50/20 px-4 py-3 text-sm text-sky-900 placeholder-sky-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div className="flex flex-col gap-2 relative z-10">
          <label className="flex items-center gap-2.5 text-sm font-semibold text-sky-900">
            <span className="material-symbols-outlined text-[20px] text-sky-500">lock</span>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full rounded-xl border border-sky-200 bg-sky-50/20 px-4 py-3 text-sm text-sky-900 placeholder-sky-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <button
          type="submit"
          disabled={login.isPending}
          className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl bg-sky-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-sky-400 cursor-pointer relative z-10"
        >
          {login.isPending ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[20px]">
                progress_activity
              </span>
              Authenticating Securely...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              Establish Connection
            </>
          )}
        </button>

        {/* Footer note */}
        <div className="text-center text-[11px] text-sky-400 mt-2 relative z-10 tracking-wide uppercase font-medium">
          Authorized personnel only
        </div>
      </form>
    </div>
  );
};