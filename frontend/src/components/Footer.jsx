import React from 'react';
import { Mail, Send, Compass } from 'lucide-react';

export default function Footer({ showSubscribe = true }) {
  return (
    <footer id="footer" className={`relative bg-white overflow-hidden border-t border-slate-100 ${showSubscribe ? 'pt-12 pb-16' : 'pt-16 pb-16'}`}>
      
      {/* Decorative ambient blur orbs from Figma Ellipse 8 */}
      <div className="absolute -bottom-20 right-0 w-[480px] h-[496px] rounded-full bg-[#D5AEE4]/40 filter blur-[75px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* ========================================================================= */}
        {/* SUBSCRIBE SECTION (Figma: Group 78 & Group 77)                            */}
        {/* Shown only when showSubscribe is true (e.g. on home page)                */}
        {/* ========================================================================= */}
        {showSubscribe && (
          <div className="relative rounded-[20px] rounded-tr-[90px] sm:rounded-tr-[129px] bg-[#DFD7F9]/30 p-8 sm:p-14 lg:p-16 mb-24 overflow-hidden border border-purple-100/60 shadow-sm">
          
          {/* Decorative concentric ellipses in top-right */}
          <div className="absolute -top-10 -right-10 w-72 h-72 pointer-events-none opacity-20">
            <div className="w-full h-full rounded-full border border-[#6246E5]" />
            <div className="absolute inset-4 rounded-full border border-[#6246E5]" />
            <div className="absolute inset-8 rounded-full border border-[#6246E5]" />
            <div className="absolute inset-12 rounded-full border border-[#6246E5]" />
          </div>

          {/* Group 77: Floating Send Icon Button (rotated -30deg) */}
          <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-gradient-to-br from-[#747DEF] to-[#5E3BE1] flex items-center justify-center text-white shadow-xl shadow-[#747DEF]/40 transform -rotate-[30deg] hidden sm:flex">
            <Send className="w-7 h-7 fill-white translate-x-0.5" />
          </div>

          {/* Subscribe Heading from Figma */}
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h3 className="font-poppins font-semibold text-2xl sm:text-3xl lg:text-[33px] text-[#5E6282] leading-[1.4] sm:leading-[54px]">
              Subscribe to get information, latest news and other interesting offers about Voyage
            </h3>

            {/* Email Input + Orange Subscribe Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
              <div className="relative w-full">
                <Mail className="w-5 h-5 text-[#39425D] absolute left-5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full pl-14 pr-5 py-4 rounded-[10px] bg-white text-[#39425D] font-montserrat text-sm placeholder-[#39425D]/60 focus:outline-none focus:ring-2 focus:ring-[#FF946D] shadow-sm"
                />
              </div>

              <button
                type="button"
                className="w-full sm:w-auto px-10 py-4 rounded-[10px] bg-gradient-to-b from-[#FF946D] to-[#FF7D68] text-white font-openSans font-semibold text-base shadow-md hover:shadow-lg hover:opacity-95 active:scale-95 transition-all whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        )}


        {/* ========================================================================= */}
        {/* FOOTER MAIN GRID (Figma: Company Desc, Nav Columns, Socials, Apps)         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16">
          
          {/* Col 1: Company Desc */}
          <div className="lg:col-span-3 space-y-4">
            <a href="#hero" className="inline-block">
              <span className="font-poppins font-bold text-4xl text-[#181E4B] tracking-tight">
                Voyage.
              </span>
            </a>
            <p className="font-poppins font-normal text-xs sm:text-[13px] text-[#5E6282] max-w-[207px] leading-relaxed">
              Book your trip in minute, get full Control for much longer.
            </p>
          </div>

          {/* Col 2: Company */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-poppins font-bold text-xl text-[#080809]">
              Company
            </h4>
            <ul className="space-y-3 font-poppins font-normal text-base sm:text-lg text-[#5E6282]">
              <li><a href="#hero" className="hover:text-[#181E4B] transition-colors">About</a></li>
              <li><a href="#services" className="hover:text-[#181E4B] transition-colors">Careers</a></li>
              <li><a href="#destinations" className="hover:text-[#181E4B] transition-colors">Mobile</a></li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-poppins font-bold text-xl text-[#080809]">
              Contact
            </h4>
            <ul className="space-y-3 font-poppins font-normal text-base sm:text-lg text-[#5E6282]">
              <li><a href="#simulator" className="hover:text-[#181E4B] transition-colors">Help/FAQ</a></li>
              <li><a href="#rights" className="hover:text-[#181E4B] transition-colors">Press</a></li>
              <li><a href="#recovery" className="hover:text-[#181E4B] transition-colors">Affilates</a></li>
            </ul>
          </div>

          {/* Col 4: More */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-poppins font-bold text-xl text-[#080809]">
              More
            </h4>
            <ul className="space-y-3 font-poppins font-normal text-base sm:text-lg text-[#5E6282]">
              <li><a href="#rights" className="hover:text-[#181E4B] transition-colors">Airlinefees</a></li>
              <li><a href="#itinerary" className="hover:text-[#181E4B] transition-colors">Airline</a></li>
              <li><a href="#destinations" className="hover:text-[#181E4B] transition-colors">Low fare tips</a></li>
            </ul>
          </div>

          {/* Col 5: Social Icons & Discover Our App */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Social Icons matching Figma (Facebook, Instagram with conic-gradient, Twitter) */}
            <div className="flex items-center gap-4">
              
              {/* Facebook */}
              <a 
                href="#" 
                className="w-[41px] h-[41px] rounded-full bg-white shadow-[0px_2px_10px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#080809] hover:scale-105 transition-transform"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-[#080809]" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>

              {/* Instagram (Signature Figma Conic Gradient) */}
              <a 
                href="#" 
                className="w-[45px] h-[45px] rounded-full shadow-[0px_2px_10px_rgba(0,0,0,0.1)] flex items-center justify-center text-white hover:scale-105 transition-transform"
                style={{
                  background: 'conic-gradient(from 180deg at 50% 50%, #B8D2F1 0deg, #F289AA 60deg, #C68BF0 106.09deg, #D164DA 153.75deg, #C963E8 221.25deg, #BFC2E8 258.75deg, #FFC999 288.75deg, #D0D8C9 315deg, #BAD0F1 334.13deg, #CED8CB 358.97deg, rgba(255, 255, 255, 0) 360deg)'
                }}
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Twitter / Outbound */}
              <a 
                href="#" 
                className="w-[41px] h-[41px] rounded-full bg-white shadow-[0px_2px_10px_rgba(0,0,0,0.1)] flex items-center justify-center text-[#080809] hover:scale-105 transition-transform"
                title="Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-[#080809]" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            {/* Discover our app */}
            <div className="space-y-3">
              <p className="font-poppins font-normal text-lg sm:text-xl text-[#5E6282] tracking-wide">
                Discover our app
              </p>

              {/* Exact Figma App Buttons (Rectangle 23 & 24: 107px x 35px & 100px x 35px, radius 17.5px) */}
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Google Play */}
                <div className="w-[107px] h-[35px] rounded-[17.5px] bg-[#080809] flex items-center justify-center gap-1.5 cursor-pointer hover:bg-black transition-colors shadow-sm">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                      <path fill="#2196F3" d="M3 20.5v-17c0-.9.6-1.5 1.5-1.5.3 0 .6.1.9.3l10.8 9.7-10.8 9.7c-.3.2-.6.3-.9.3-.9 0-1.5-.6-1.5-1.5z" />
                      <path fill="#4CAF50" d="M16.2 12l-3.3-3 4.8-2.7c1-.6 2.3.1 2.3 1.3v.4l-3.8 4z" />
                      <path fill="#F0BB1F" d="M16.2 12l3.8 4v.4c0 1.2-1.3 1.9-2.3 1.3L12.9 15l3.3-3z" />
                      <path fill="#F15A2B" d="M16.2 12l-3.3-3-9.9-8.7c.3-.2.6-.3.9-.3 1 0 2 .5 2.6.9l10.2 5.8 4.8 2.7-5.3 2.6z" />
                    </svg>
                  </div>
                  <div className="text-white text-[9px] font-sans font-medium leading-tight">
                    <span className="text-[7px] text-white/70 block uppercase">GET IT ON</span>
                    Google Play
                  </div>
                </div>

                {/* Apple Store */}
                <div className="w-[100px] h-[35px] rounded-[17.5px] bg-[#080809] flex items-center justify-center gap-1.5 cursor-pointer hover:bg-black transition-colors shadow-sm">
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.64-.78 1.08-1.86.96-2.95-1 .04-2.14.67-2.8 1.44-.58.67-1.09 1.76-.96 2.82 1.11.09 2.16-.53 2.8-1.31z" />
                  </svg>
                  <div className="text-white text-[9px] font-sans font-medium leading-tight">
                    <span className="text-[7px] text-white/70 block uppercase">Available on</span>
                    Apple Store
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* BOTTOM COPYRIGHT (Figma: All rights reserved@voyage.co)                   */}
        {/* ========================================================================= */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-sm text-[#5E6282] font-poppins">
          <div>
            All rights reserved@voyage.co
          </div>
          <div className="mt-2 sm:mt-0 flex gap-6 text-xs text-[#5E6282]">
            <a href="#hero" className="hover:text-[#181E4B]">Privacy Policy</a>
            <a href="#services" className="hover:text-[#181E4B]">Terms &amp; Conditions</a>
            <a href="#rights" className="hover:text-[#181E4B]">EU261 Compliance</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
