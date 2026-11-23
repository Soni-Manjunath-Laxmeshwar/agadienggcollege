import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, MapPin, Phone, Mail, Globe, ShieldCheck,
  ChevronRight, ArrowUp, Heart, Award
} from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const departments = [
    { name: 'Computer Science & Engineering', path: '/departments/cse' },
    { name: 'Artificial Intelligence & Machine Learning', path: '/departments/aiml' },
    { name: 'Electronics & Communication Engineering', path: '/departments/ece' },
    { name: 'Electrical & Electronics Engineering', path: '/departments/eee' },
    { name: 'Civil Engineering', path: '/departments/civil' },
    { name: 'Mechanical Engineering', path: '/departments/mech' },
    { name: 'Information Science & Engineering', path: '/departments/ise' },
    { name: 'First Year Engineering (General Science)', path: '/departments/basic-science' }
  ];

  return (
    <footer className="bg-[#140c08] text-stone-300 pt-16 pb-8 border-t-4 border-yellow-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Accreditation & Logos Banner */}
        <div className="bg-[#1f120c] rounded-2xl p-6 mb-12 border border-yellow-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white p-1 border-2 border-yellow-400 shadow-md flex items-center justify-center flex-shrink-0">
              <img
                src="/images/clg-logo.png"
                alt="SKSVMACET Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-serif tracking-tight leading-snug">
                Smt. Kamala and Sri Venkappa M. Agadi College of Engineering & Technology
              </h3>
              <p className="text-xs text-yellow-300 font-semibold mt-0.5">Lakshmeshwar - 582116, Gadag District, Karnataka • Managed by S.V.M.V.V. Society</p>
              <p className="text-[11px] text-stone-400 mt-0.5">KEA CET Code: E167 • COMED-K: E099</p>
            </div>
          </div>

          {/* NAAC Badge */}
          <div className="flex items-center gap-3 bg-white/95 px-4 py-2.5 rounded-xl border-2 border-yellow-400 shadow-md flex-shrink-0">
            <img
              src="/images/naac-grade.png"
              alt="NAAC B++ Grade Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="text-left">
              <span className="text-[10px] font-black text-[#2b1408] block uppercase tracking-wider">National Accreditation</span>
              <span className="text-xs font-black text-[#854d0e]">NAAC B++ GRADE</span>
              <span className="text-[9px] text-stone-600 block">Quality Certified</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#2d180d]">
          
          {/* Column 1: College Info & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white font-serif tracking-tight">SKSVMACET</span>
              <span className="text-[10px] font-bold text-yellow-400 bg-[#361a0b] px-2 py-0.5 rounded border border-yellow-500/40">
                ESTD 2003
              </span>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Founded by Late Sri Venkappa M. Agadi and Smt. Kamala Agadi under the aegis of S.V.M.V.V. Society. Transforming rural youths into global technocrats through quality engineering education, innovation, and ethical values.
            </p>

            <div className="pt-1 flex flex-wrap gap-2 text-[11px]">
              <span className="bg-[#24130a] text-yellow-300 px-2.5 py-1 rounded border border-yellow-500/30 font-semibold">
                AICTE Approved
              </span>
              <span className="bg-[#24130a] text-yellow-300 px-2.5 py-1 rounded border border-yellow-500/30 font-semibold">
                Affiliated to VTU Belagavi
              </span>
              <span className="bg-[#24130a] text-yellow-400 px-2.5 py-1 rounded border border-yellow-500/40 font-bold">
                NAAC B++ Grade
              </span>
            </div>
          </div>

          {/* Column 2: Academic Departments */}
          <div>
            <h4 className="text-sm font-black text-yellow-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              Academic Departments
            </h4>
            <ul className="space-y-2 text-xs">
              {departments.map((dept, idx) => (
                <li key={idx}>
                  <Link
                    to={dept.path}
                    className="hover:text-yellow-300 transition-colors flex items-center gap-1.5 group text-stone-300"
                  >
                    <ChevronRight className="w-3 h-3 text-yellow-600 group-hover:text-yellow-400 transition-transform group-hover:translate-x-0.5" />
                    <span>{dept.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Portals & Mandatory Disclosures */}
          <div>
            <h4 className="text-sm font-black text-yellow-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              Key Campus Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/library" className="hover:text-yellow-300 transition-colors flex items-center gap-1.5 text-stone-300">
                  <ChevronRight className="w-3 h-3 text-yellow-600" />
                  <span>Prof. Venkata Subba Setti Library (OPAC)</span>
                </Link>
              </li>
              <li>
                <Link to="/placements" className="hover:text-yellow-300 transition-colors flex items-center gap-1.5 text-stone-300">
                  <ChevronRight className="w-3 h-3 text-yellow-600" />
                  <span>Training & Placement Cell (TPO)</span>
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-yellow-300 transition-colors flex items-center gap-1.5 text-stone-300">
                  <ChevronRight className="w-3 h-3 text-yellow-600" />
                  <span>Melanze Techno-Cultural Fest</span>
                </Link>
              </li>
              <li>
                <a href="https://vtu.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors flex items-center gap-1.5 text-stone-300">
                  <ChevronRight className="w-3 h-3 text-yellow-600" />
                  <span>VTU Belagavi Official Portal</span>
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-300 transition-colors flex items-center gap-1.5 text-stone-300">
                  <ChevronRight className="w-3 h-3 text-yellow-600" />
                  <span>Anti-Ragging Committee & Helplines</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-yellow-300 transition-colors flex items-center gap-1.5 text-stone-400 hover:text-stone-200">
                  <ChevronRight className="w-3 h-3 text-stone-600" />
                  <span>Administrative Control Panel</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Campus Location */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-yellow-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              Campus Location
            </h4>
            
            <div className="flex items-start gap-2.5 text-xs text-stone-300">
              <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <span>
                SKSVMACET Campus,<br />
                Near Laxmeshwar Railway Station,<br />
                Lakshmeshwar - 582116, Gadag Dist, Karnataka
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-stone-300">
              <Phone className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span>Principal: +91 9686042385 (Dr. Parashuram Baraki)</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-stone-300">
              <Phone className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span>Office: +91 8378 267101 / +91 9480 382894</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-stone-300">
              <Mail className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span>principal@agadiengcollege.com</span>
            </div>

            <div className="pt-2">
              <div className="text-[11px] bg-[#24130a] p-2.5 rounded-lg border border-yellow-500/30">
                <span className="font-bold text-white block">Admissions Helpdesk (CET: E167):</span>
                <span className="text-yellow-300 font-mono font-bold">+91 8378 267101 / +91 9686042385</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} SKSVMACET, Lakshmeshwar. All Rights Reserved. Managed by S.V.M.V.V. Society.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25130b] hover:bg-[#361a0b] text-yellow-300 rounded-lg border border-yellow-500/30 transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-yellow-400" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
