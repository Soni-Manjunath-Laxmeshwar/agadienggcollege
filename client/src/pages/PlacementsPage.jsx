import React, { useEffect } from 'react';
import {
  Briefcase, TrendingUp, Award, ExternalLink, Users, Phone,
  Mail, CheckCircle2, Building, ShieldCheck, ChevronRight
} from 'lucide-react';
import RecruiterGrid from '../components/RecruiterGrid';

export default function PlacementsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const coordinators = [
    {
      name: 'Mrs. Rajeshwari S G',
      dept: 'Computer Science & Engineering (CSE / AI)',
      phone: '+91 9880728834',
      email: 'tpo.cse@agadiengcollege.com'
    },
    {
      name: 'Prof. Manjunathraddi Bentur',
      dept: 'Electronics & Communication Engineering (ECE)',
      phone: '+91 9449375371',
      email: 'tpo.ece@agadiengcollege.com'
    },
    {
      name: 'Prof. Keshav Negalur',
      dept: 'Electrical & Electronics Engineering (EEE)',
      phone: '+91 9975052933',
      email: 'tpo.eee@agadiengcollege.com'
    },
    {
      name: 'Dr. Shivarajkumar Goudar',
      dept: 'Civil Engineering (CV)',
      phone: '+91 8867617379',
      email: 'tpo.civil@agadiengcollege.com'
    }
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#1c0f08] via-[#2b1408] to-[#140c08] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-3 border border-yellow-500/30">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Training & Placement Cell (TPO)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">
            Placements & Corporate Relations
          </h1>
          <p className="mt-3 text-sm sm:text-base text-yellow-100/90 max-w-3xl leading-relaxed">
            Bridging academic rigor with high-demand industry careers. Our dedicated Training and Placement Cell facilitates campus recruitment drives, skill bootcamps, and corporate internships for undergraduate engineering students across all disciplines.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
              <span className="block text-3xl font-black text-yellow-400 font-mono">₹8.50 LPA</span>
              <span className="text-xs uppercase font-semibold text-yellow-100/80 mt-1 block">Highest Package</span>
              <span className="text-[11px] text-stone-300">Continental / Dream MNCs</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
              <span className="block text-3xl font-black text-yellow-400 font-mono">₹4.20 LPA</span>
              <span className="text-xs uppercase font-semibold text-yellow-100/80 mt-1 block">Average Package</span>
              <span className="text-[11px] text-stone-300">Core & IT Sectors</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
              <span className="block text-3xl font-black text-yellow-400 font-mono">92%+</span>
              <span className="text-xs uppercase font-semibold text-yellow-100/80 mt-1 block">Placement Success</span>
              <span className="text-[11px] text-stone-300">Eligible Graduates</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15">
              <span className="block text-3xl font-black text-yellow-400 font-mono">150+</span>
              <span className="text-xs uppercase font-semibold text-yellow-100/80 mt-1 block">Recruiting Partners</span>
              <span className="text-[11px] text-stone-300">Annual On/Pool Drives</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Recruiters Grid (With direct official website hyperlinks) */}
      <RecruiterGrid showTitle={true} limit={null} />

      {/* Training Structure & Roadmap */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-black text-stone-900 font-serif">
              Comprehensive 4-Year Career Training Framework
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              From foundational soft skills to competitive coding, mock technical interviews, and industry internships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-stone-200 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-[#2b1408] text-yellow-300 font-bold text-xs flex items-center justify-center">
                1st Yr
              </span>
              <h4 className="font-bold text-sm text-stone-900">Communication & Soft Skills</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Verbal and digital communication, grammar, presentation skills, and public speaking in digital language labs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-yellow-50/50 border border-yellow-200 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-yellow-600 text-white font-bold text-xs flex items-center justify-center">
                2nd Yr
              </span>
              <h4 className="font-bold text-sm text-stone-900">Quantitative Aptitude & Logic</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Numerical reasoning, logical analysis, data interpretation, and foundational coding in Python and C++.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-stone-200 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-[#4a2511] text-yellow-200 font-bold text-xs flex items-center justify-center">
                3rd Yr
              </span>
              <h4 className="font-bold text-sm text-stone-900">Technical Bootcamps & DSA</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Data structures, full-stack development, cloud computing, mock coding assessments, and mini-projects.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-yellow-50/50 border border-yellow-200 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-[#140c08] text-yellow-400 font-bold text-xs flex items-center justify-center">
                4th Yr
              </span>
              <h4 className="font-bold text-sm text-stone-900">Campus Drives & Mock PI/GD</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Industry HR mock interviews, group discussion simulations, corporate etiquette, and recruitment drives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Placement Coordinators Directory */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Department Placement Coordinators</h3>
              <p className="text-xs text-stone-500">Contact our faculty leads for pooled campus drives and corporate tie-ups</p>
            </div>
            <span className="text-xs font-bold text-[#2b1408] bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300">
              TPO Cell Team
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coordinators.map((coord, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#faf8f5] border border-stone-200 space-y-2">
                <h4 className="font-bold text-xs text-stone-900">{coord.name}</h4>
                <p className="text-[11px] text-[#4a2511] font-semibold">{coord.dept}</p>
                <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-yellow-600" />
                    <span>{coord.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-yellow-600" />
                    <span className="truncate">{coord.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
