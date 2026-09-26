import React from 'react';
import { Mail, Plane, Send, Smartphone, Globe, Share2, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="relative pt-16 pb-12 bg-white overflow-hidden border-t border-slate-100">
      
      {/* Decorative ambient blur orbs from Figma specification */}
      <div className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full bg-voyare-purpleGlow/20 filter blur-[85px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-voyare-cream filter blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Subscribe / Newsletter Banner (Matching Group 78 in Figma CSS) */}
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#DFD7F9]/30 via-[#F3EDFB]/40 to-[#FFF1DA]/50 p-8 sm:p-14 mb-20 border border-purple-100/50 overflow-hidden shadow-sm">
          
          {/* Top-Right Send Icon Floating Pill from Figma Group 77 */}
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-tr from-voyare-violet to-[#747DEF] flex items-center justify-center text-white shadow-xl shadow-voyare-violet/30 hidden sm:flex">
            <Send className="w-8 h-8 transform rotate-12 -translate-x-1" />
          </div>

          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold text-voyare-slate leading-tight">
              Subscribe to get real-time disruption radar alerts and resilience updates from YATAR
            </h3>
            
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
              <div className="relative w-full">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-sm text-voyare-navy placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-voyare-coral shadow-sm"
                />
              </div>
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF946D] to-[#FF7D68] text-white font-semibold text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Main Links Grid (From Figma Company, Contact, More) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-voyare-coral to-voyare-gold flex items-center justify-center shadow-md">
                <Plane className="w-4 h-4 text-white transform -rotate-45" />
              </div>
              <span className="font-poppins font-bold text-2xl text-voyare-navy">YATAR.</span>
            </div>
            <p className="font-poppins text-xs text-voyare-slate max-w-xs leading-relaxed">
              Book your trip in minutes, get full autonomous control and disruption immunity for much longer.
            </p>
            <div className="text-[11px] text-voyare-textMuted font-mono">
              Engine Version: 2.4.0 • OR-Tools CP-SAT Powered
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="font-poppins font-bold text-base text-voyare-charcoal">Company</h4>
            <ul className="space-y-2 text-xs text-voyare-slate font-poppins">
              <li><a href="#hero" className="hover:text-voyare-coral transition-colors">About Us</a></li>
              <li><a href="#itinerary" className="hover:text-voyare-coral transition-colors">Careers</a></li>
              <li><a href="#recovery" className="hover:text-voyare-coral transition-colors">Mobile App</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-poppins font-bold text-base text-voyare-charcoal">Contact</h4>
            <ul className="space-y-2 text-xs text-voyare-slate font-poppins">
              <li><a href="#simulator" className="hover:text-voyare-coral transition-colors">Help / FAQ</a></li>
              <li><a href="#rights" className="hover:text-voyare-coral transition-colors">Press &amp; Media</a></li>
              <li><a href="#domino-risk" className="hover:text-voyare-coral transition-colors">Carrier Affiliates</a></li>
            </ul>
          </div>

          {/* More */}
          <div className="space-y-3">
            <h4 className="font-poppins font-bold text-base text-voyare-charcoal">More</h4>
            <ul className="space-y-2 text-xs text-voyare-slate font-poppins">
              <li><a href="#rights" className="hover:text-voyare-coral transition-colors">Airline Fees &amp; Rights</a></li>
              <li><a href="#itinerary" className="hover:text-voyare-coral transition-colors">ADS-B Radar</a></li>
              <li><a href="#recovery" className="hover:text-voyare-coral transition-colors">Low Fare Tips</a></li>
            </ul>
          </div>

          {/* Discover our App & Socials */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-voyare-charcoal hover:text-voyare-coral transition-colors" title="Global Coverage">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gradient-to-tr from-voyare-coral to-voyare-gold text-white shadow-md flex items-center justify-center hover:scale-105 transition-transform" title="Share Trip">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-voyare-charcoal hover:text-voyare-coral transition-colors" title="Concierge Channel">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2">
              <span className="text-xs text-voyare-slate font-poppins block mb-2">Discover our app</span>
              <div className="flex flex-col gap-2">
                <div className="px-3.5 py-1.5 rounded-full bg-[#080809] text-white flex items-center gap-2 text-[10px] font-mono cursor-pointer hover:bg-black transition-colors w-max">
                  <Smartphone className="w-3.5 h-3.5 text-voyare-gold" />
                  <span>Google Play</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-[#080809] text-white flex items-center gap-2 text-[10px] font-mono cursor-pointer hover:bg-black transition-colors w-max">
                  <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                  <span>Apple Store</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright matching Figma */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-voyare-slate font-poppins">
          <div>
            All rights reserved @ YATAR Resilience Engine • Celestial Hackathon 2026
          </div>
          <div className="mt-2 sm:mt-0 flex gap-4 text-voyare-textMuted text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>EU261 Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
