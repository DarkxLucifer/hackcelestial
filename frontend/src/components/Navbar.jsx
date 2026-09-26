import React, { useState } from 'react';
import { Menu, X, ChevronDown, User, LogOut, ShieldCheck, Check } from 'lucide-react';

export default function Navbar({ 
  activeDisruption, 
  onOpenSaga, 
  onQuickSimulate,
  user,
  onLogout,
  onOpenAuth,
  onOpenBooking,
  language,
  onSelectLanguage,
  t
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

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
    { label: t?.destinations || 'Destinations', target: '#destinations' },
    { label: t?.hotels || 'Hotels', target: '#easy-steps' },
    { label: t?.flights || 'Flights', target: '#demo-journey' },
    { 
      label: t?.bookings || 'Bookings', 
      isAction: true,
      onClick: () => {
        if (!user) {
          onOpenAuth('login');
        } else {
          onOpenBooking();
        }
      }
    },
  ];

  const handleBookNow = () => {
    if (!user) {
      onOpenAuth('signup');
    } else {
      onOpenBooking();
    }
  };

  const handleDisruptionSolving = () => {
    if (onOpenSaga) {
      onOpenSaga();
    } else if (onQuickSimulate) {
      onQuickSimulate();
    }
  };

  const languages = [
    { code: 'en', label: 'English (EN)' },
    { code: 'mr', label: 'मराठी (MR)' },
    { code: 'hi', label: 'हिन्दी (HI)' }
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP UTILITY BAR (EN Dropdown, Login, Sign up)                          */}
      {/* Matching media_1790416291459.png exact top-right layout                   */}
      {/* ========================================================================= */}
      <div className="fixed top-2.5 sm:top-3.5 right-4 sm:right-10 z-50 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3.5 sm:gap-5 px-4 py-1.5 rounded-full bg-[#07191d]/60 backdrop-blur-md border border-white/15 shadow-sm text-white/90">
          
          {/* Language Switcher Dropdown (EN, Marathi, Hindi) */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 font-googleSans font-medium text-[13px] sm:text-[15px] text-white/90 hover:text-white cursor-pointer transition-colors"
            >
              <span>{language?.toUpperCase() || 'EN'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/70" />
            </button>

            {langDropdownOpen && (
              <div className="absolute top-8 right-0 w-36 bg-[#0c2328] border border-white/20 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onSelectLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs font-poppins flex items-center justify-between transition-colors ${
                      language === l.code ? 'bg-white/15 text-white font-bold' : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{l.label}</span>
                    {language === l.code && <Check className="w-3 h-3 text-[#F1A501]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-3.5 bg-white/25" />

          {/* User Logged In Profile or Login / Sign Up */}
          {user ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={onOpenBooking}
                className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white font-googleSans font-medium cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </button>
              <button 
                onClick={onLogout}
                title={t?.logout || "Logout"}
                className="text-white/60 hover:text-white cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Login */}
              <button
                onClick={() => onOpenAuth('login')}
                className="font-googleSans font-medium text-[13px] sm:text-[15px] leading-[22px] text-white/90 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {t?.login || "Login"}
              </button>

              {/* Sign up */}
              <button
                onClick={() => onOpenAuth('signup')}
                className="font-googleSans font-medium text-[12px] sm:text-[14px] leading-[20px] text-white px-3 py-0.8 rounded-[6px] border border-white/60 hover:border-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
              >
                {t?.signup || "Sign up"}
              </button>
            </>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN FLOATING NAVBAR CAPSULE                                           */}
      {/* Matching media_1790416291459.png: Dark green capsule, Book Now, Resolve   */}
      {/* ========================================================================= */}
      <header className="fixed top-12 sm:top-14 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-4xl lg:max-w-5xl rounded-full px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between bg-[#072422]/90 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all duration-300">
          
          {/* LEFT: VOYAGE LOGO */}
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
          <div className="hidden md:flex items-center gap-7 lg:gap-10">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.target || "#"}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.isAction) {
                    item.onClick();
                  } else {
                    scrollTo(item.target);
                  }
                }}
                className="font-googleSans font-normal text-[15px] lg:text-[17px] leading-[22px] text-white/90 hover:text-white transition-colors duration-200 whitespace-nowrap hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* RIGHT: ACTION BUTTONS (Book Now secondary, Resolve Disruption terracotta) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-4 sm:pl-6">
            
            {/* BUTTON 1: Book Now (Clean dark outlined pill) */}
            <button
              onClick={handleBookNow}
              className="hidden sm:inline-flex px-5 py-2 rounded-full border border-white/35 bg-white/5 hover:bg-white/15 text-white font-medium text-xs sm:text-sm active:scale-95 transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              {t?.bookNow || "Book Now"}
            </button>

            {/* BUTTON 2: Resolve Disruption (Terracotta filled pill #A35645) */}
            <button
              onClick={handleDisruptionSolving}
              className="px-5 sm:px-6 py-2 rounded-full font-bold text-xs sm:text-sm text-white bg-[#A35645] hover:bg-[#b8614e] transition-all duration-200 shadow-md active:scale-95 whitespace-nowrap cursor-pointer"
            >
              {t?.resolveDisruption || "Resolve Disruption"}
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
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#072422]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 space-y-6 md:hidden">
          <div className="w-full flex justify-between items-center pb-4 border-b border-white/10">
            <img src="/voyage_logo_crop.png" alt="Voyage" className="h-6 w-auto" />
            <button onClick={() => setMobileMenuOpen(false)} className="text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-5 w-full">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.isAction) {
                    item.onClick();
                  } else {
                    scrollTo(item.target);
                  }
                }}
                className="text-lg font-googleSans text-white/90 hover:text-white font-medium py-1"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="w-full pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => { setMobileMenuOpen(false); handleBookNow(); }}
              className="w-full py-3 rounded-xl border border-white/35 text-white font-medium text-sm"
            >
              {t?.bookNow || "Book Now"}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); handleDisruptionSolving(); }}
              className="w-full py-3 rounded-xl bg-[#A35645] text-white font-bold text-sm"
            >
              {t?.resolveDisruption || "Resolve Disruption"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
