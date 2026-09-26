import React, { useState } from 'react';
import { Menu, X, ChevronDown, Lock, UserPlus } from 'lucide-react';

export default function Navbar({ activeDisruption, onOpenSaga, onQuickSimulate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authSubmitted, setAuthSubmitted] = useState(false);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    if (id === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Destinations', target: '#destinations' },
    { label: 'Hotels', target: '#easy-steps' },
    { label: 'Flights', target: '#itinerary' },
    { label: 'Bookings', target: '#recovery' },
  ];

  const handleDisruptionSolving = () => {
    if (activeDisruption && onOpenSaga) {
      onOpenSaga();
    } else if (onQuickSimulate) {
      onQuickSimulate();
      const el = document.querySelector('#simulator');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookNow = () => {
    scrollTo('#easy-steps');
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthSubmitted(true);
    setTimeout(() => {
      setAuthModal(null);
      setAuthSubmitted(false);
      setAuthEmail('');
      setAuthPassword('');
    }, 1200);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY NAVBAR (DIFFERENT NAVBAR FOR LOGIN & SIGN UP)              */}
      {/* Exact Figma reference font structure: Google Sans 500, Rectangle 4 border */}
      {/* ========================================================================= */}
      <div className="fixed top-2.5 sm:top-3 right-4 sm:right-10 z-50 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4 sm:gap-6 px-4 py-1.5 rounded-full bg-[#0b272c]/40 backdrop-blur-md border border-white/15 shadow-sm text-white/90">
          
          {/* EN Dropdown (Figma Vector arrow, 17px) */}
          <div className="flex items-center gap-1 font-googleSans font-medium text-[14px] sm:text-[16px] leading-[22px] text-white/80 hover:text-white cursor-pointer transition-colors">
            <span>EN</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/70" />
          </div>

          <div className="w-px h-3.5 bg-white/25" />

          {/* Login (Figma Google Sans 500 17px) */}
          <button
            onClick={() => setAuthModal('login')}
            className="font-googleSans font-medium text-[14px] sm:text-[16px] leading-[22px] text-white/90 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            Login
          </button>

          {/* Sign up (Figma Rectangle 4: border 1px solid, radius 5px) */}
          <button
            onClick={() => setAuthModal('signup')}
            className="font-googleSans font-medium text-[13px] sm:text-[15px] leading-[20px] text-white px-3.5 py-1 rounded-[5px] border border-white/60 hover:border-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            Sign up
          </button>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* 2. MAIN FLOATING CAPSULE NAVBAR                                           */}
      {/* Spacious, uncrowded, neat separation. NO STICKERS, NO ICONS in button!    */}
      {/* ========================================================================= */}
      <header className="fixed top-12 sm:top-14 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-4xl lg:max-w-5xl rounded-full px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between bg-[#0b272c]/85 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.38)] transition-all duration-300">
          
          {/* LEFT: VOYAGE LOGO (Isolated with clean right spacing) */}
          <div className="flex items-center shrink-0 pr-6 mr-2 sm:mr-4">
            <a 
              href="#hero" 
              onClick={(e) => { e.preventDefault(); scrollTo('#hero'); }}
              className="flex items-center group py-0.5"
              aria-label="Voyage Home"
            >
              <img 
                src="/voyage_logo_crop.png" 
                alt="Voyage" 
                className="h-6 sm:h-7 md:h-8 w-auto object-contain brightness-105 transition-transform duration-200 group-hover:scale-[1.02]" 
              />
            </a>
          </div>

          {/* CENTER: NAV ITEMS (Destinations, Hotels, Flights, Bookings) */}
          {/* Ample room, will NEVER collide with buttons! */}
          <div className="hidden md:flex items-center gap-7 lg:gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.target}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.target);
                }}
                className="font-googleSans font-normal text-[15px] lg:text-[17px] leading-[22px] text-white/90 hover:text-white transition-colors duration-200 whitespace-nowrap hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* RIGHT: ACTION BUTTONS (Book Now secondary, Disruption Solver main) */}
          {/* NO STICKERS / NO ICONS - Pure clean typography! */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-4 sm:pl-6">
            
            {/* SECONDARY ACTION: Book Now */}
            <button
              onClick={handleBookNow}
              className="hidden sm:inline-flex px-4 py-1.5 sm:py-2 rounded-full border border-white/35 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm active:scale-95 transition-all duration-200 whitespace-nowrap"
            >
              Book Now
            </button>

            {/* MAIN PRIMARY ACTION: Disruption Solver */}
            <button
              onClick={handleDisruptionSolving}
              className={`px-5 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-lg active:scale-95 whitespace-nowrap ${
                activeDisruption
                  ? 'bg-gradient-to-r from-[#DF6951] to-[#FF7D68] text-white shadow-[#DF6951]/50 animate-pulse'
                  : 'bg-white text-[#0b272c] hover:bg-slate-100 hover:shadow-xl'
              }`}
            >
              {activeDisruption ? "Resolve Disruption" : "Disruption Solver"}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white/90 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors ml-1"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </nav>

        {/* ========================================================================= */}
        {/* MOBILE NAVIGATION DRAWER                                                  */}
        {/* ========================================================================= */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto absolute top-16 left-4 right-4 rounded-2xl bg-[#0b272c]/95 backdrop-blur-2xl border border-white/20 p-5 shadow-2xl flex flex-col gap-3 md:hidden animate-in fade-in slide-in-from-top-3 duration-200">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.target}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.target);
                }}
                className="font-googleSans text-white/90 hover:text-white font-medium text-base py-2 px-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                {item.label}
              </a>
            ))}

            <div className="pt-3 border-t border-white/15 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDisruptionSolving();
                }}
                className="w-full py-2.5 rounded-full bg-white text-[#0b272c] font-bold text-sm shadow-md"
              >
                {activeDisruption ? "Resolve Disruption" : "Disruption Solver"}
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleBookNow();
                }}
                className="w-full py-2 rounded-full border border-white/30 text-white font-medium text-sm text-center"
              >
                Book Now
              </button>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModal('login');
                  }}
                  className="py-2 text-center text-white/90 hover:text-white font-googleSans text-sm font-medium border border-white/20 rounded-[5px]"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModal('signup');
                  }}
                  className="py-2 text-center text-white font-googleSans text-sm font-medium border border-white/60 bg-white/10 rounded-[5px]"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* INTERACTIVE AUTH MODAL (Login & Sign Up)                                  */}
      {/* ========================================================================= */}
      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setAuthModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FFF1DA] text-[#DF6951] mb-2">
                {authModal === 'login' ? <Lock className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
              </div>
              <h3 className="font-volkhov font-bold text-2xl text-[#181E4B]">
                {authModal === 'login' ? 'Sign In to Voyage' : 'Create Voyage Account'}
              </h3>
              <p className="font-poppins text-xs text-[#5E6282]">
                {authModal === 'login' 
                  ? 'Access your autonomous disruption recovery dashboard' 
                  : 'Join Voyage for self-healing travel & EU261 liquidity'}
              </p>
            </div>

            {/* Toggle Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-sm font-googleSans font-medium">
              <button
                onClick={() => setAuthModal('login')}
                className={`py-2 rounded-lg transition-all ${
                  authModal === 'login' ? 'bg-white text-[#181E4B] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthModal('signup')}
                className={`py-2 rounded-lg transition-all ${
                  authModal === 'signup' ? 'bg-white text-[#181E4B] shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            {authSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h4 className="font-poppins font-bold text-lg text-[#181E4B]">Welcome Aboard!</h4>
                <p className="text-xs text-[#5E6282]">Redirecting to your flight resilience portal...</p>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-4 font-poppins">
                {authModal === 'signup' && (
                  <div>
                    <label className="text-xs font-semibold text-[#5E6282] block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Elena Vance"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DF6951]"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-[#5E6282] block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="elena.vance@corporate.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DF6951]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#5E6282] block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#DF6951]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#DF6951] text-white font-semibold text-sm shadow-md hover:bg-[#c8563e] active:scale-95 transition-all mt-2"
                >
                  {authModal === 'login' ? 'Sign In' : 'Create Free Account'}
                </button>
              </form>
            )}

            <div className="pt-2 text-center text-xs text-[#84829A] font-poppins">
              Protected by Voyage 256-bit GDS Encryption &amp; EU261 Liquidity Bridge
            </div>

          </div>
        </div>
      )}
    </>
  );
}
