import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, ExternalLink, Download,
  FileText, Filter, Sparkles, ChevronRight, Award
} from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [circulars, setCirculars] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    Promise.all([
      fetch('/api/events').then(r => r.json()),
      fetch('/api/announcements').then(r => r.json())
    ])
      .then(([evData, annData]) => {
        if (evData.success) setEvents(evData.data);
        if (annData.success) setCirculars(annData.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const eventCategories = ['All', 'Tech Fest', 'Conference', 'Placement', 'Workshop', 'Cultural'];

  const filteredEvents = events.filter(e => {
    if (activeCategory === 'All') return true;
    return e.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-16">
      
      {/* Page Header (IIT Dharwad style) */}
      <section className="bg-gradient-to-r from-[#1c0f08] via-[#2b1408] to-[#140c08] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-3 border border-yellow-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Happenings & Dispatch</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">
            Events, Conferences & Academic Schedules
          </h1>
          <p className="mt-3 text-sm sm:text-base text-yellow-100/90 max-w-3xl">
            Explore national technical symposiums, research conferences, campus recruitment drives, industry workshops, and VTU academic schedules at SKSVMACET Lakshmeshwar.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* 1. Major Upcoming Events Section */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-stone-900 font-serif">
                Featured Events & Symposia
              </h2>
              <p className="text-xs text-stone-500">Flagship annual symposiums, hackathons, and national conferences</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {eventCategories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#2b1408] text-yellow-300 shadow border border-yellow-500/40'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-yellow-500/50"
              >
                <div>
                  {/* Banner Image */}
                  <div className="h-48 relative overflow-hidden bg-[#1c0f08]">
                    <img
                      src={event.banner_image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140c08] via-[#140c08]/50 to-transparent"></div>
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-yellow-500 text-slate-950 font-black text-[11px] shadow">
                      {event.category}
                    </span>
                    <span className="absolute bottom-3 left-3 right-3 text-xs text-yellow-300 font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {event.event_date}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-2.5">
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-[#4a2511] transition-colors leading-snug">
                      {event.title}
                    </h3>

                    {event.subtitle && (
                      <p className="text-xs font-semibold text-yellow-700">
                        {event.subtitle}
                      </p>
                    )}

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
                      {event.venue && (
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                          <span>{event.venue}</span>
                        </div>
                      )}
                      {event.organizer && (
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-semibold text-stone-700">Organizer:</span>
                          <span>{event.organizer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <a
                    href={event.registration_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#2b1408] hover:bg-[#3d1f0f] text-yellow-300 font-bold text-xs flex items-center justify-center gap-2 shadow transition-colors border border-yellow-500/30"
                  >
                    <span>Register / Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Official Academic Schedules & Symposium Publications */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <div>
                <h3 className="font-bold text-stone-900 text-lg">Academic Schedules & Documentation</h3>
                <p className="text-xs text-stone-500">Official academic calendars, syllabus schemes, and symposium documents</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#2b1408] bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300">
              {circulars.length} Documents
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {circulars.map((doc) => (
              <div
                key={doc.id}
                className="py-4 hover:bg-[#faf8f5] px-2 rounded-lg transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 text-center flex-shrink-0 bg-[#faf8f5] rounded-lg p-2 border border-stone-200">
                    <span className="block text-[10px] uppercase font-bold text-stone-500">{doc.date.split(' ')[0]}</span>
                    <span className="block text-base font-black text-stone-900">{doc.date.split(' ')[1]?.replace(',', '')}</span>
                    <span className="block text-[10px] text-stone-400">{doc.date.split(' ')[2]}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#2b1408] bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200">
                        {doc.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 hover:text-[#4a2511] cursor-pointer">
                      {doc.title}
                    </h4>

                    {doc.details && (
                      <p className="text-xs text-stone-500 line-clamp-1">
                        {doc.details}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 pl-24 sm:pl-0">
                  {doc.document_url && (
                    <a
                      href={doc.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-[#faf8f5] hover:bg-yellow-50 text-[#2b1408] border border-stone-200 hover:border-yellow-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-yellow-600" />
                      <span>Download</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
