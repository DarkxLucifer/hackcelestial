import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, initialTab = 'login', t }) {
  const [tab, setTab] = useState(initialTab); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        name: name || 'Elena Vance',
        email: email || 'elena.vance@voyage.io',
        tier: 'Plus'
      });
      onClose();
    }, 600);
  };

  const handleQuickDemo = () => {
    onLoginSuccess({
      name: 'Elena Vance',
      email: 'elena.vance@voyage.io',
      tier: 'Plus'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
        >
          &times;
        </button>

        {/* Header */}
        <div className="text-center pt-2 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0b272c] text-white mx-auto flex items-center justify-center shadow-lg mb-4">
            <Lock className="w-5 h-5 text-[#F1A501]" />
          </div>
          <h3 className="font-volkhov font-bold text-2xl text-[#181E4B]">
            {tab === 'login' ? (t?.loginTitle || "Welcome back to Voyage") : (t?.signupTitle || "Join Voyage Resilience")}
          </h3>
          <p className="font-poppins text-xs sm:text-sm text-[#5E6282] mt-1">
            {tab === 'login' 
              ? (t?.loginSubtitle || "Sign in to access your protected bookings and live disruption solver.") 
              : (t?.signupSubtitle || "Get instant autonomous immunity against flight and rail cancellations.")}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-lg font-googleSans text-xs font-semibold transition-all cursor-pointer ${
              tab === 'login' ? 'bg-white text-[#181E4B] shadow-sm' : 'text-[#5E6282]'
            }`}
          >
            {t?.login || "Login"}
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 py-2 rounded-lg font-googleSans text-xs font-semibold transition-all cursor-pointer ${
              tab === 'signup' ? 'bg-white text-[#181E4B] shadow-sm' : 'text-[#5E6282]'
            }`}
          >
            {t?.signup || "Sign up"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#181E4B] mb-1 font-poppins">
                {t?.nameLabel || "Full Name"}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Elena Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F1A501] text-sm text-[#181E4B]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#181E4B] mb-1 font-poppins">
              {t?.emailLabel || "Email address"}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="elena.vance@voyage.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F1A501] text-sm text-[#181E4B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#181E4B] mb-1 font-poppins">
              {t?.passwordLabel || "Password"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#F1A501] text-sm text-[#181E4B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0b272c] hover:bg-[#143940] text-white font-googleSans font-semibold text-sm transition-all shadow-md mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? "Verifying..." : tab === 'login' ? (t?.login || "Login") : (t?.signup || "Sign up")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo One-Click Access */}
        <div className="pt-5 mt-5 border-t border-slate-100">
          <button
            onClick={handleQuickDemo}
            className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold font-poppins transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#F1A501]" />
            <span>{t?.quickDemoLogin || "Quick Demo Login as Elena Vance"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
