import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, ChevronRight, ChevronLeft,
  ExternalLink, ArrowRight, Sparkles, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventBannerNoticeHub() {
  const [events, setEvents] = useState([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    // Fetch events
    fetch('/api/events')
      .then(res => res.json())
      .then(d => {
        if (d.success && d.data.length > 0) {
          setEvents(d.data);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-advance banner every 6s
  useEffect(() => {
    if (events.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx(prev => (prev + 1) % events.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [events.length]);

  const categories = ['All', 'Tech Fest', 'Workshop', 'Placement', 'Cultural'];

  const filteredEvents = events.filter(e => {
    if (activeCategory === 'All') return true;
    return e.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const currentEvent = events[activeBannerIdx] || null;

  return (
    <section className="py-14 bg-[#faf7f2] border-y border-[#e7ded5]" id="events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf1dc] text-[#542d13] text-xs font-bold uppercase tracking-wider mb-2 border border-yellow-400/60">
              <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
              <span>Campus Happenings & Technical Symposia</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1c120c] tracking-tight font-serif">
              Events, Conferences & Exhibitions
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Annual national level technical fests, C-Cube coding challenges, TORQUE mechanical symposiums, and corporate placement drives at SKSVMACET Laxmeshwar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a2511] hover:text-[#783c19] transition-colors bg-white px-3.5 py-2 rounded-lg border border-[#e7ded5] shadow-sm hover:border-yellow-400"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4 text-yellow-600" />
            </Link>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#2b1408] text-yellow-300 shadow-md border border-yellow-500/50'
                  : 'bg-white text-stone-700 hover:bg-[#fbf1dc] border border-[#e7ded5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Event Carousel & Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Featured Event Banner (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-[#140c08] text-white flex-1 min-h-[420px] flex flex-col justify-end group border border-yellow-500/30">
              
              {/* Background Image with Warm Gradient Overlay */}
              {currentEvent && (
                <>
                  <img
                    src={currentEvent.banner_image}
                    alt={currentEvent.title}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140c08] via-[#1c0f0a]/75 to-transparent"></div>
                </>
              )}

              {/* Banner Top Ribbon (Category & Controls) */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                {currentEvent && (
                  <span className="px-3 py-1 rounded-full bg-yellow-400 text-stone-950 text-xs font-black uppercase tracking-wider shadow-md">
                    ★ {currentEvent.category}
                  </span>
                )}

                {/* Banner Next/Prev Controls */}
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1 rounded-lg border border-yellow-400/30">
                  <button
                    onClick={() => setActiveBannerIdx(prev => (prev - 1 + events.length) % events.length)}
                    className="p-1 rounded hover:bg-yellow-400/20 text-yellow-300 transition-colors"
                    aria-label="Previous Banner"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono px-1 text-stone-300">
                    {activeBannerIdx + 1}/{events.length}
                  </span>
                  <button
                    onClick={() => setActiveBannerIdx(prev => (prev + 1) % events.length)}
                    className="p-1 rounded hover:bg-yellow-400/20 text-yellow-300 transition-colors"
                    aria-label="Next Banner"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Banner Content Body */}
              {currentEvent ? (
                <div className="relative p-6 sm:p-8 z-10 space-y-3">
                  {/* Date, Time & Venue */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-yellow-300 font-semibold">
                    <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-yellow-400/30">
                      <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                      {currentEvent.event_date}
                    </span>
                    {currentEvent.event_time && (
                      <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-yellow-400/30">
                        <Clock className="w-3.5 h-3.5 text-yellow-400" />
                        {currentEvent.event_time}
                      </span>
                    )}
                    {currentEvent.venue && (
                      <span className="hidden sm:flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-yellow-400/30">
                        <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                        {currentEvent.venue}
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {currentEvent.title}
                  </h3>

                  {currentEvent.subtitle && (
                    <p className="text-xs sm:text-sm text-stone-300 line-clamp-2">
                      {currentEvent.subtitle}
                    </p>
                  )}

                  {/* Action Link */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      href={currentEvent.registration_link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-stone-950 font-black text-xs shadow-lg transition-transform hover:-translate-y-0.5"
                    >
                      <span>Register for Event</span>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-950" />
                    </a>
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 font-bold text-xs backdrop-blur-md border border-white/20 transition-colors"
                    >
                      <span>All Events Schedule</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-stone-400">Loading events...</div>
              )}

              {/* Thumbnails Indicator */}
              <div className="relative z-10 px-6 sm:px-8 pb-4 pt-2 flex items-center gap-2">
                {events.map((ev, i) => (
                  <button
                    key={ev.id}
                    onClick={() => setActiveBannerIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeBannerIdx === i ? 'w-8 bg-yellow-400' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    title={ev.title}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Upcoming Events List (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-3">
            <div className="bg-white rounded-2xl border border-[#e7ded5] shadow-md p-5 flex flex-col h-full justify-between">
              
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <h3 className="font-black text-[#2b1408] text-sm uppercase tracking-wider">
                      Upcoming Campus Calendar
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-[#542d13] bg-[#fbf1dc] px-2 py-0.5 rounded-full border border-yellow-400/50">
                    SKSVMACET
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredEvents.slice(0, 4).map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        const targetIdx = events.findIndex(ev => ev.id === item.id);
                        if (targetIdx !== -1) setActiveBannerIdx(targetIdx);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        events[activeBannerIdx]?.id === item.id
                          ? 'bg-[#fbf7f0] border-yellow-400 shadow-sm'
                          : 'bg-white hover:bg-stone-50 border-stone-200'
                      }`}
                    >
                      {/* Date Badge in Dark Brown & Yellow */}
                      <div className="w-14 text-center flex-shrink-0 bg-[#2b1408] rounded-lg p-1.5 border border-yellow-500/40 text-white">
                        <span className="block text-[9px] uppercase font-bold text-yellow-300">
                          {item.event_date.split(' ')[0]}
                        </span>
                        <span className="block text-sm font-black text-white">
                          {item.event_date.split(' ')[1]?.replace(',', '')}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold text-[#542d13] bg-yellow-100 px-1.5 py-0.2 rounded border border-yellow-300">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                          {item.subtitle || item.venue}
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 text-[11px]">SKSVMACET Cultural & Tech Council</span>
                <Link
                  to="/events"
                  className="text-[#4a2511] hover:text-[#783c19] font-bold flex items-center gap-1"
                >
                  <span>Full Schedule</span>
                  <ChevronRight className="w-3.5 h-3.5 text-yellow-600" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
