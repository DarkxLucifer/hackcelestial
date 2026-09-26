import React, { useState } from 'react';
import { 
  Navigation, Heart, Send, MapPin, Calendar, Users, 
  ArrowRight, Check, Star, ShieldCheck, Zap, Radio
} from 'lucide-react';

export default function TravelAgencySections({ onSimulateAlpine, onOpenSaga, activeDisruption }) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Mike Taylor",
      location: "Lahore, Pakistan",
      role: "Global Executive Traveler",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      quote: "“On the Windows talking painted pasture yet its express parties use. Sure last upon he same as knew next. When our Heathrow flight was delayed by 65 minutes, Voyage caught the missed train at Zurich HB 3 hours before British Airways even notified us and held my hotel reservation!”"
    },
    {
      name: "Chris Thomas",
      location: "London, UK",
      role: "CEO of Red Button",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      quote: "“Of believed or diverted no. The autonomous Ghost-Hold feature reserved the last scenic Glacier Express rail seat without charging my corporate card. A truly extraordinary travel resilience platform.”"
    }
  ];

  return (
    <div className="w-full bg-white text-[#14183E] overflow-hidden">

      {/* ========================================================================= */}
      {/* 1. SERVICES SECTION ("We Offer Best Services")                            */}
      {/* Figma: Category, Heading, 4 Cards, Decore + grid                          */}
      {/* ========================================================================= */}
      <section id="services" className="relative py-24 px-6 max-w-7xl mx-auto">
        
        {/* Decorative Figma + Grid in top-right */}
        <div className="absolute top-12 right-6 hidden lg:grid grid-cols-5 gap-3 pointer-events-none opacity-60">
          {[...Array(25)].map((_, i) => (
            <span key={i} className={`text-base font-bold ${
              i === 0 ? 'text-[#FF7152]' : i === 12 ? 'text-[#6246E5]' : 'text-[#E5E5E5]'
            }`}>+</span>
          ))}
        </div>

        <div className="text-center space-y-2 mb-16">
          <p className="font-poppins font-semibold text-base sm:text-lg uppercase tracking-wider text-[#5E6282]">
            Category
          </p>
          <h2 className="font-volkhov font-bold text-3xl sm:text-4xl md:text-5xl capitalize text-[#14183E]">
            We Offer Best Services
          </h2>
        </div>

        {/* 4 Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Card 1: Calculated Weather */}
          <div className="group relative rounded-[36px] bg-white p-8 text-center transition-all duration-300 hover:shadow-voyare-card border border-transparent hover:border-slate-100 flex flex-col items-center">
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#FFF1DA] rounded-[18px] rotate-[-12deg] group-hover:rotate-0 transition-transform" />
              <div className="relative z-10 w-12 h-12 rounded-full bg-[#B5DCFF]/50 flex items-center justify-center">
                <Radio className="w-7 h-7 text-[#029BC5]" />
              </div>
            </div>
            <h3 className="font-openSans font-semibold text-xl text-[#1E1D4C] mb-3">
              Calculated Weather
            </h3>
            <p className="font-poppins text-sm text-[#5E6282] leading-relaxed">
              Predictive METAR &amp; Doppler radar anticipates alpine snowfall and terminal ground delays hours ahead.
            </p>
          </div>

          {/* Card 2: Best Flights (Active Card with Figma coral rectangle decore) */}
          <div className="relative group">
            {/* Figma Rectangle 157 (Coral corner accent) */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#DF6951] rounded-tl-[30px] rounded-br-[10px] -z-10 hidden sm:block group-hover:scale-105 transition-transform" />
            
            <div className="relative rounded-[36px] bg-white p-8 text-center shadow-voyare-card border border-slate-100/80 flex flex-col items-center">
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#FFF1DA] rounded-[18px] rotate-[10deg] group-hover:rotate-0 transition-transform" />
                <img 
                  src="/plane.png" 
                  alt="Best Flights" 
                  className="relative z-10 w-16 h-auto transform -rotate-45"
                />
              </div>
              <h3 className="font-openSans font-semibold text-xl text-[#1E1D4C] mb-3">
                Best Flights
              </h3>
              <p className="font-poppins text-sm text-[#5E6282] leading-relaxed">
                Autonomous spatio-temporal routing selects guaranteed flight corridors with critical connection buffers.
              </p>
            </div>
          </div>

          {/* Card 3: Local Events & Critical Anchors */}
          <div className="group relative rounded-[36px] bg-white p-8 text-center transition-all duration-300 hover:shadow-voyare-card border border-transparent hover:border-slate-100 flex flex-col items-center">
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#FFF1DA] rounded-[18px] rotate-[-8deg] group-hover:rotate-0 transition-transform" />
              <div className="relative z-10 w-12 h-12 rounded-full bg-[#FFD086]/50 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#F1A501]" />
              </div>
            </div>
            <h3 className="font-openSans font-semibold text-xl text-[#1E1D4C] mb-3">
              Critical Anchors
            </h3>
            <p className="font-poppins text-sm text-[#5E6282] leading-relaxed">
              Protects strict hotel check-in cutoffs, non-refundable ski passes, and scheduled meeting anchors.
            </p>
          </div>

          {/* Card 4: Customization */}
          <div className="group relative rounded-[36px] bg-white p-8 text-center transition-all duration-300 hover:shadow-voyare-card border border-transparent hover:border-slate-100 flex flex-col items-center">
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#FFF1DA] rounded-[18px] rotate-[12deg] group-hover:rotate-0 transition-transform" />
              <div className="relative z-10 w-12 h-12 rounded-full bg-[#B6C4CF]/50 flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#6246E5]" />
              </div>
            </div>
            <h3 className="font-openSans font-semibold text-xl text-[#1E1D4C] mb-3">
              Customization
            </h3>
            <p className="font-poppins text-sm text-[#5E6282] leading-relaxed">
              Multi-objective Pareto optimization fine-tuned to your personal balance of cost, fatigue, and speed.
            </p>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. DESTINATIONS SECTION ("Top Destinations")                              */}
      {/* Figma: Rome $5.42k (10 Days), London $4.2k (12 Days), Full Europe $15k    */}
      {/* ========================================================================= */}
      <section id="destinations" className="relative py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-2 mb-16">
          <p className="font-poppins font-semibold text-base sm:text-lg uppercase tracking-wider text-[#5E6282]">
            Top Selling
          </p>
          <h2 className="font-volkhov font-bold text-3xl sm:text-4xl md:text-5xl capitalize text-[#14183E]">
            Top Destinations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Destination 1: Rome, Italy */}
          <div className="group rounded-[24px] overflow-hidden bg-white shadow-voyare-card border border-slate-100 transition-all duration-300 hover:-translate-y-2">
            <div className="relative h-80 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80" 
                alt="Rome, Italy" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-[#181E4B]">
                Verified Slack: +45m
              </div>
            </div>
            <div className="p-6 bg-white space-y-4">
              <div className="flex items-center justify-between text-lg font-poppins text-[#5E6282]">
                <span className="font-medium text-[#181E4B]">Rome, Italy</span>
                <span>$5,420</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#5E6282] font-poppins">
                <Navigation className="w-4 h-4 text-[#080809] transform -rotate-45" />
                <span>10 Days Trip</span>
              </div>
            </div>
          </div>

          {/* Destination 2: London, UK */}
          <div className="group rounded-[24px] overflow-hidden bg-white shadow-voyare-card border border-slate-100 transition-all duration-300 hover:-translate-y-2">
            <div className="relative h-80 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80" 
                alt="London, UK" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-[#181E4B]">
                EU261 Protected
              </div>
            </div>
            <div className="p-6 bg-white space-y-4">
              <div className="flex items-center justify-between text-lg font-poppins text-[#5E6282]">
                <span className="font-medium text-[#181E4B]">London, UK</span>
                <span>$4,200</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#5E6282] font-poppins">
                <Navigation className="w-4 h-4 text-[#080809] transform -rotate-45" />
                <span>12 Days Trip</span>
              </div>
            </div>
          </div>

          {/* Destination 3: Full Europe / Alpine Expedition */}
          <div className="group rounded-[24px] overflow-hidden bg-white shadow-voyare-card border border-slate-100 transition-all duration-300 hover:-translate-y-2">
            <div className="relative h-80 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&auto=format&fit=crop&q=80" 
                alt="Full Europe Alpine" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold shadow-md">
                Active Itinerary
              </div>
            </div>
            <div className="p-6 bg-white space-y-4">
              <div className="flex items-center justify-between text-lg font-poppins text-[#5E6282]">
                <span className="font-medium text-[#181E4B]">Full Europe (Zermatt)</span>
                <span>$15,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#5E6282] font-poppins">
                <Navigation className="w-4 h-4 text-[#080809] transform -rotate-45" />
                <span>28 Days Trip</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. BOOK A TRIP IN 3 EASY STEPS                                            */}
      {/* Figma: 3 Value steps (Yellow, Orange, Teal) + Floating Trip Card          */}
      {/* ========================================================================= */}
      <section id="easy-steps" className="relative py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Heading & 3 Value Steps */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2">
              <p className="font-poppins font-semibold text-base sm:text-lg uppercase tracking-wider text-[#5E6282]">
                Easy and Fast
              </p>
              <h2 className="font-volkhov font-bold text-3xl sm:text-4xl md:text-5xl capitalize text-[#14183E] leading-[1.2]">
                Book Your Next Trip In 3 Easy Steps
              </h2>
            </div>

            <div className="space-y-7">
              {/* Step 1: Choose Destination */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-[13px] bg-[#F0BB1F] flex items-center justify-center shrink-0 shadow-md">
                  <Navigation className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-poppins font-bold text-base text-[#5E6282]">
                    Choose Destination
                  </h4>
                  <p className="font-poppins text-sm text-[#5E6282] max-w-sm leading-relaxed">
                    Select origin and target destinations. Our TDAG engine validates every connection time buffer.
                  </p>
                </div>
              </div>

              {/* Step 2: Make Payment & Liquidity */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-[13px] bg-[#F15A2B] flex items-center justify-center shrink-0 shadow-md">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-poppins font-bold text-base text-[#5E6282]">
                    Make Payment &amp; Liquidity Advance
                  </h4>
                  <p className="font-poppins text-sm text-[#5E6282] max-w-sm leading-relaxed">
                    Instant secure settlement with built-in statutory EU261 &amp; US DOT advance credit liquidity.
                  </p>
                </div>
              </div>

              {/* Step 3: Reach Airport with Ghost-Holds */}
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-[13px] bg-[#006380] flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-poppins font-bold text-base text-[#5E6282]">
                    Reach Airport on Selected Date
                  </h4>
                  <p className="font-poppins text-sm text-[#5E6282] max-w-sm leading-relaxed">
                    Travel with peace of mind. Background Ghost-Holds reserve backup rail seats and hotel rooms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Figma Trip Card ("Trip To Greece" + "Trip to Rome") */}
          <div className="lg:col-span-6 relative flex justify-center">
            
            {/* Ambient cyan glow orb from Figma Ellipse 8 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#59B1E6]/30 filter blur-[70px] pointer-events-none" />

            {/* Main Trip Card (Rectangle 16 in Figma) */}
            <div className="relative w-full max-w-[370px] rounded-[26px] bg-white p-6 shadow-voyare-card border border-slate-100">
              <div className="rounded-[24px] overflow-hidden h-44 mb-5">
                <img 
                  src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&auto=format&fit=crop&q=80" 
                  alt="Trip to Greece" 
                  className="w-full h-full object-cover"
                />
              </div>

              <h4 className="font-poppins font-semibold text-lg text-[#080809] tracking-wide">
                Trip To Greece
              </h4>
              <p className="font-poppins text-sm text-[#84829A] mt-1">
                14-29 June | by Robbin Joseph
              </p>

              {/* Option round buttons (leaf, map, send) */}
              <div className="flex items-center gap-4 mt-5">
                <div className="w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#84829A] hover:bg-slate-200 cursor-pointer transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#84829A] hover:bg-slate-200 cursor-pointer transition-colors">
                  <Send className="w-4 h-4" />
                </div>
                <div className="w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#84829A] hover:bg-slate-200 cursor-pointer transition-colors">
                  <Heart className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom people going */}
              <div className="flex items-center justify-between mt-6 text-sm text-[#84829A]">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>24 people going</span>
                </div>
                <Heart className="w-5 h-5 text-[#4152CA] fill-[#4152CA]" />
              </div>

              {/* Floating "Trip to Rome" notification pill card (Figma Rectangle 18) */}
              <div className="absolute -bottom-8 -right-8 sm:-right-12 w-64 rounded-[18px] bg-white p-4 shadow-voyare-card border border-slate-100 flex items-start gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=120&auto=format&fit=crop&q=80" 
                    alt="Rome" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[11px] font-poppins text-[#84829A]">Ongoing</span>
                  <h5 className="font-poppins font-medium text-sm text-[#080809]">Trip to Rome</h5>
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-xs font-semibold text-[#8A79DF]">40% completed</span>
                  </div>
                  {/* Progress bar (Figma Rectangle 19 & 20) */}
                  <div className="w-full h-1.5 rounded-full bg-[#F5F5F5] overflow-hidden mt-1">
                    <div className="w-2/5 h-full rounded-full bg-[#8A79DF]" />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. TESTIMONIALS SECTION ("What People Say About Us")                      */}
      {/* Figma: Mike Taylor & Chris Thomas cards with shadow 0px 100px 80px        */}
      {/* ========================================================================= */}
      <section id="testimonials" className="relative py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Heading & Pagination Dots */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <p className="font-poppins font-semibold text-base sm:text-lg uppercase tracking-wider text-[#5E6282]">
                Testimonials
              </p>
              <h2 className="font-volkhov font-bold text-3xl sm:text-4xl md:text-5xl capitalize text-[#14183E] leading-[1.2]">
                What People Say About Us.
              </h2>
            </div>

            {/* Pagination indicator dots */}
            <div className="flex items-center gap-4 pt-4">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeTestimonial === i 
                      ? 'bg-[#39425D] scale-125' 
                      : 'bg-[#E5E5E5] hover:bg-slate-300'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Floating Review Cards with Avatar */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-[10px] bg-white p-8 sm:p-10 shadow-voyare-card border border-slate-100 max-w-xl ml-auto">
              
              {/* Floating Avatar from Figma */}
              <div className="absolute -top-7 -left-7 w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img 
                  src={testimonials[activeTestimonial].avatar} 
                  alt={testimonials[activeTestimonial].name} 
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="font-openSans text-sm sm:text-base text-[#4E4E73] leading-relaxed italic">
                {testimonials[activeTestimonial].quote}
              </p>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-poppins font-semibold text-lg text-[#5E6282]">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="font-poppins text-xs text-[#84829A]">
                    {testimonials[activeTestimonial].location} • {testimonials[activeTestimonial].role}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[#F1A501]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F1A501]" />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. AIRLINE & GDS PARTNER LOGOS (Luminosity mix-blend mode)                */}
      {/* ========================================================================= */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-100">
        <div className="flex flex-wrap items-center justify-around gap-8 opacity-60 hover:opacity-100 transition-opacity">
          <span className="font-poppins font-bold text-2xl tracking-[0.2em] text-[#181E4B] grayscale hover:grayscale-0 transition-all">
            AXON
          </span>
          <span className="font-poppins font-black text-2xl tracking-[0.15em] text-[#DF6951] grayscale hover:grayscale-0 transition-all">
            JETSTAR
          </span>
          <span className="font-poppins font-bold text-2xl tracking-[0.1em] text-[#029BC5] grayscale hover:grayscale-0 transition-all">
            EXPEDIA
          </span>
          <span className="font-poppins font-black text-2xl tracking-[0.2em] text-[#E01933] grayscale hover:grayscale-0 transition-all">
            QANTAS
          </span>
          <span className="font-poppins font-bold text-2xl tracking-[0.18em] text-[#006380] grayscale hover:grayscale-0 transition-all">
            ALITALIA
          </span>
        </div>
      </section>

    </div>
  );
}
