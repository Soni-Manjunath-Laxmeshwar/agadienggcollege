import React, { useState, useEffect } from 'react';
import { ExternalLink, Briefcase, Award, TrendingUp, Building } from 'lucide-react';

export default function RecruiterGrid({ showTitle = true, limit = null }) {
  const [recruiters, setRecruiters] = useState([]);
  const [activeSector, setActiveSector] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recruiters')
      .then(res => res.json())
      .then(d => {
        if (d.success) setRecruiters(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const sectors = ['All', 'IT & Digital Consulting', 'IT Services & Software', 'Automotive & Embedded Systems', 'Consulting & Engineering'];

  const filteredRecruiters = recruiters.filter(r => {
    if (activeSector === 'All') return true;
    return r.sector.toLowerCase().includes(activeSector.toLowerCase().split('&')[0].trim());
  });

  const displayedList = limit ? filteredRecruiters.slice(0, limit) : filteredRecruiters;

  return (
    <section className="py-14 bg-white" id="recruiters">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf1dc] text-[#542d13] text-xs font-bold uppercase tracking-wider mb-3 border border-yellow-400/60">
              <TrendingUp className="w-3.5 h-3.5 text-yellow-600" />
              <span>Campus Career Partnerships & Placements</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1c120c] tracking-tight font-serif">
              Our Esteemed Recruiters & Industry Partners
            </h2>
            <p className="mt-3 text-sm text-stone-600 leading-relaxed">
              Global IT giants and core automotive leaders recruit from SKSVMACET Laxmeshwar.
              <span className="font-bold text-[#4a2511] block mt-1">
                Click any company logo to directly visit their official corporate career portal.
              </span>
            </p>
          </div>
        )}

        {/* Sector Filter Tabs */}
        {!limit && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['All', 'IT & Software', 'Core & Automotive', 'Consulting'].map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSector(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeSector === cat
                    ? 'bg-[#2b1408] text-yellow-300 shadow-md border border-yellow-500/50'
                    : 'bg-[#faf7f2] text-stone-700 hover:bg-[#fbf1dc] border border-[#e7ded5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Recruiters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {displayedList.map((recruiter) => (
            <a
              key={recruiter.id}
              href={recruiter.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white border border-[#e7ded5] rounded-xl p-4 flex flex-col items-center justify-between transition-all duration-300 hover:shadow-xl hover:border-yellow-500 hover:-translate-y-1 text-center"
              title={`Visit official website: ${recruiter.website_url}`}
            >
              {/* External Link Pill (Top Right) */}
              <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-100 text-[#3b1d0c] p-1 rounded-md border border-yellow-300">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>

              {/* Logo Container */}
              <div className="w-full h-20 flex items-center justify-center p-2 mb-2 bg-[#faf8f5] rounded-lg group-hover:bg-[#fef9c3]/30 transition-colors border border-stone-100">
                <img
                  src={recruiter.logo_url}
                  alt={recruiter.name}
                  className="max-h-12 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-12 h-12 rounded-full bg-[#2b1408] text-yellow-400 font-bold text-sm items-center justify-center">
                  {recruiter.name.slice(0, 2).toUpperCase()}
                </div>
              </div>

              {/* Recruiter Details */}
              <div className="w-full">
                <h4 className="font-bold text-xs text-stone-900 group-hover:text-[#4a2511] transition-colors line-clamp-1">
                  {recruiter.name}
                </h4>
                <p className="text-[10px] text-stone-500 truncate mt-0.5">
                  {recruiter.sector}
                </p>

                {recruiter.highest_package && (
                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
                    <span className="text-stone-400 font-medium">Max CTC:</span>
                    <span className="font-extrabold text-[#854d0e]">{recruiter.highest_package}</span>
                  </div>
                )}
              </div>

              {/* Hover CTA Indicator */}
              <div className="w-full mt-2.5 text-[10px] font-bold text-[#4a2511] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 bg-[#fbf3e5] py-0.5 rounded">
                <span>Visit Portal</span>
                <ExternalLink className="w-2.5 h-2.5 text-yellow-600" />
              </div>
            </a>
          ))}
        </div>

        {/* View All Recruiters Button if limited */}
        {limit && (
          <div className="text-center mt-8">
            <a
              href="/placements"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2b1408] hover:bg-[#3d1f0f] text-yellow-300 font-bold text-xs shadow-md transition-all border border-yellow-500/40"
            >
              <span>View All 150+ Corporate Recruiters</span>
              <ExternalLink className="w-3.5 h-3.5 text-yellow-400" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
