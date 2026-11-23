import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, BookOpen, Building2,
  Calendar, Briefcase, ExternalLink, Sparkles,
  GraduationCap
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const mastheadRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Fetch departments for mega dropdown
    fetch('/api/departments')
      .then(res => res.json())
      .then(d => {
        if (d.success) setDepartments(d.data);
      })
      .catch(() => {});
  }, []);

  // Monitor scroll position to stick navbar at the very top of viewport
  useEffect(() => {
    const handleScroll = () => {
      const threshold = mastheadRef.current ? mastheadRef.current.offsetHeight : 65;
      setIsScrolled(window.scrollY >= threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  return (
    <div className="w-full">
      
      {/* 1. Official College Header Masthead (Moves along with page scroll, reduced vertical length) */}
      <div 
        ref={mastheadRef}
        className="w-full bg-white border-b border-stone-200 relative"
      >
        <div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-1 sm:py-1.5">
          
          {/* Main Horizontal Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-1 sm:gap-3 lg:gap-4">
            
            {/* LEFT: SKSVMA Logo with Estd/ISO + NAAC Logo */}
            <div className="flex items-center justify-between w-full md:w-auto gap-2.5 sm:gap-3 flex-shrink-0">
              <Link to="/" className="flex items-center gap-2 sm:gap-3">
                {/* College Crest */}
                <div className="flex flex-col items-center text-center">
                  <img
                    src="/images/header-logo.png"
                    alt="SKSVMA College Logo"
                    className="h-9 sm:h-11 lg:h-12 w-auto object-contain"
                  />
                  <span className="text-[8px] sm:text-[9px] font-bold text-stone-900 leading-none mt-0.5">
                    Estd:2003
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-semibold text-stone-800 leading-none mt-0.5 whitespace-nowrap">
                    ISO 9001: 2015 Certified
                  </span>
                </div>

                {/* NAAC B++ Grade Emblem */}
                <div className="flex flex-col items-center">
                  <img
                    src="/images/header-naac.png"
                    alt="NAAC Accredited B++ Grade"
                    className="h-9 sm:h-11 lg:h-12 w-auto object-contain"
                  />
                </div>
              </Link>

              {/* Mobile Menu Button (Visible on mobile only when at top) */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded-md text-[#770b0a] hover:bg-[#faf4f4] focus:outline-none border border-[#770b0a]/30 md:hidden"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* CENTER: Compact Titles (English & Kannada, Divider, Approvals & Contact) */}
            <div className="flex-1 text-center min-w-0 px-1 lg:px-3">
              {/* English Heading (Maroon #770b0a, Bold Serif, Compact Vertical Spacing) */}
              <h1 className="font-serif font-black tracking-tight text-[#770b0a] leading-tight">
                <span className="block text-xs sm:text-base md:text-lg lg:text-[19px] xl:text-[21px]">
                  Smt. Kamala & Sri Venkappa M. Agadi
                </span>
                <span className="block text-xs sm:text-base md:text-lg lg:text-[19px] xl:text-[21px] mt-0.5">
                  College of Engineering and Technology, Lakshmeshwar-582116
                </span>
              </h1>

              {/* Kannada Script Title */}
              <p className="text-[10px] sm:text-xs md:text-[12px] lg:text-[13px] font-bold text-[#770b0a] mt-0.5 font-serif leading-tight">
                ಶ್ರೀಮತಿ ಕಮಲಾ ಮತ್ತು ಶ್ರೀ ವೆಂಕಪ್ಪ ಎಂ. ಅಗಡಿ ಅಭಿಯಾಂತ್ರಿಕ ಮತ್ತು ತಾಂತ್ರಿಕ ಮಹಾವಿದ್ಯಾಲಯ,ಲಕ್ಷ್ಮೇಶ್ವರ
              </p>

              {/* Compact Horizontal Divider Line */}
              <div className="w-full max-w-2xl mx-auto border-t border-[#140c08] my-0.5"></div>

              {/* Approvals & Accreditations */}
              <p className="text-[8.5px] sm:text-[9.5px] md:text-[10.5px] lg:text-[11px] font-serif font-bold text-[#140c08] tracking-wide leading-tight">
                Approved by AICTE & Affiliated to VTU Belagavi, Karnataka. Accredited by NAAC B++ Grade
              </p>

              {/* Contact Info */}
              <p className="text-[8.5px] sm:text-[9.5px] md:text-[10.5px] lg:text-[11px] font-serif font-bold text-[#140c08] mt-0.5 leading-tight">
                Mobile : <a href="tel:9448120344" className="hover:underline">9448120344</a> | <a href="mailto:info@agadiengcollege.com" className="hover:underline">info@agadiengcollege.com</a>
              </p>
            </div>

            {/* RIGHT: Compact Founders' Portraits (Late Sri Venkappa & Smt. Kamala) */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-3.5 flex-shrink-0 pt-0.5 md:pt-0">
              {/* Founder 1 */}
              <div className="flex flex-col items-center text-center w-16 sm:w-18 lg:w-20">
                <div className="border border-stone-800 p-[1px] bg-white shadow-sm">
                  <img
                    src="/images/founder-venkappa.png"
                    alt="Late. Sri Venkappa M. Agadi"
                    className="h-9 sm:h-11 lg:h-12 w-auto object-cover"
                  />
                </div>
                <span className="text-[7.5px] sm:text-[8px] lg:text-[9px] font-bold text-[#140c08] mt-0.5 leading-tight whitespace-nowrap">
                  Late. Sri Venkappa M. Agadi
                </span>
                <span className="text-[6.5px] sm:text-[7px] lg:text-[8px] text-stone-600 font-medium leading-none">
                  1932 to 2010
                </span>
                <span className="text-[6.5px] sm:text-[7px] lg:text-[8px] font-bold text-[#140c08] leading-tight whitespace-nowrap">
                  Founder Chairman & Trustee
                </span>
              </div>

              {/* Founder 2 */}
              <div className="flex flex-col items-center text-center w-16 sm:w-18 lg:w-20">
                <div className="border border-stone-800 p-[1px] bg-white shadow-sm">
                  <img
                    src="/images/founder-kamala.png"
                    alt="Smt. Kamala V. Agadi"
                    className="h-9 sm:h-11 lg:h-12 w-auto object-cover"
                  />
                </div>
                <span className="text-[7.5px] sm:text-[8px] lg:text-[9px] font-bold text-[#140c08] mt-0.5 leading-tight whitespace-nowrap">
                  Smt. Kamala V. Agadi
                </span>
                <span className="text-[6.5px] sm:text-[7px] lg:text-[8px] text-stone-600 font-medium leading-none">
                  B.Sc.
                </span>
                <span className="text-[6.5px] sm:text-[7px] lg:text-[8px] font-bold text-[#140c08] leading-tight whitespace-nowrap">
                  Founder Trustee
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Placeholder to prevent layout shift when navbar becomes fixed to top */}
      {isScrolled && (
        <div className="h-11 sm:h-12 w-full" aria-hidden="true" />
      )}

      {/* 2. KLE Tech Inspired Navigation Bar (Permanently pinned at top while scrolling) */}
      <nav 
        className={`w-full bg-[#121824] border-t-2 border-yellow-500 transition-all duration-150 ${
          isScrolled 
            ? 'fixed top-0 left-0 right-0 z-50 shadow-2xl' 
            : 'relative z-40 shadow-md'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 sm:h-12">
            
            {/* Left: KLE Tech Style Menu Links with Hover Indicators */}
            <div className="flex items-center h-full">
              
              {/* KLE Tech Sticky Logo Indicator (Visible when scrolled to top) */}
              {isScrolled && (
                <Link 
                  to="/" 
                  className="hidden md:flex items-center gap-2 pr-3.5 border-r border-stone-700/70 mr-2 flex-shrink-0 animate-in fade-in duration-200"
                  title="SKSVMACET Lakshmeshwar"
                >
                  <img 
                    src="/images/header-logo.png" 
                    alt="SKSVMA Logo" 
                    className="h-7 w-auto object-contain bg-white rounded p-0.5"
                  />
                  <span className="text-xs font-black tracking-wider text-yellow-400 font-serif whitespace-nowrap hidden xl:inline">
                    SKSVMACET
                  </span>
                </Link>
              )}

              <ul className="hidden lg:flex items-center space-x-1 h-full">
                
                {/* Home */}
                <li className="h-full flex items-center">
                  <Link
                    to="/"
                    className={`h-full px-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      location.pathname === '/'
                        ? 'border-yellow-400 text-yellow-300 bg-white/5'
                        : 'border-transparent text-stone-200 hover:text-yellow-400 hover:border-yellow-400'
                    }`}
                  >
                    <span>Home</span>
                  </Link>
                </li>

                {/* About Us (Dropdown) */}
                <li
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveDropdown('about')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href="/#about"
                    className={`h-full px-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      activeDropdown === 'about'
                        ? 'border-yellow-400 text-yellow-300 bg-white/5'
                        : 'border-transparent text-stone-200 hover:text-yellow-400 hover:border-yellow-400'
                    }`}
                  >
                    <span>About Us</span>
                    <ChevronDown className={`w-3 h-3 text-yellow-400 transition-transform ${activeDropdown === 'about' ? 'rotate-180' : ''}`} />
                  </a>

                  {/* Dropdown Menu */}
                  {activeDropdown === 'about' && (
                    <div className="absolute left-0 top-full w-72 bg-white text-stone-900 rounded-b-xl shadow-2xl border-t-4 border-yellow-500 border-x border-b border-[#e7ded5] p-3 space-y-1 z-50">
                      <a
                        href="/#chairman-initiative"
                        className="block p-2 rounded-lg hover:bg-[#fbf7f0] hover:text-[#4a2511] text-xs font-semibold text-stone-800 transition-colors border-l-2 border-yellow-500 pl-2.5"
                      >
                        <span className="font-bold block text-stone-950 flex items-center gap-1">
                          <span>Chairman's Defense Initiative</span>
                          <span className="text-[10px] bg-yellow-400 text-stone-950 px-1.5 py-0.2 rounded font-black">SPECIAL</span>
                        </span>
                        <span className="text-[11px] text-stone-500">Free Education for Fallen Soldiers' Children</span>
                      </a>
                      <a
                        href="/#why-us"
                        className="block p-2 rounded-lg hover:bg-[#fbf7f0] hover:text-[#4a2511] text-xs font-semibold text-stone-800 transition-colors"
                      >
                        <span className="font-bold block text-stone-950">Why SKSVMACET?</span>
                        <span className="text-[11px] text-stone-500">Zero Capitation Fee, 50% CET Fee Scheme</span>
                      </a>
                      <a
                        href="/#about"
                        className="block p-2 rounded-lg hover:bg-[#fbf7f0] hover:text-[#4a2511] text-xs font-semibold text-stone-800 transition-colors"
                      >
                        <span className="font-bold block text-stone-950">Vision & Mission</span>
                        <span className="text-[11px] text-stone-500">M1-M4 Mandates & Core Values</span>
                      </a>
                      <a
                        href="/#about"
                        className="block p-2 rounded-lg hover:bg-[#fbf7f0] hover:text-[#4a2511] text-xs font-semibold text-stone-800 transition-colors"
                      >
                        <span className="font-bold block text-stone-950">S.V.M.V.V. Society</span>
                        <span className="text-[11px] text-stone-500">Founders & Governing Council</span>
                      </a>
                    </div>
                  )}
                </li>

                {/* Departments (KLE Tech Mega Dropdown) */}
                <li
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveDropdown('departments')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to="/departments"
                    className={`h-full px-3.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      location.pathname.startsWith('/departments') || activeDropdown === 'departments'
                        ? 'border-yellow-400 text-yellow-300 bg-white/5'
                        : 'border-transparent text-stone-200 hover:text-yellow-400 hover:border-yellow-400'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Departments</span>
                    <ChevronDown className={`w-3 h-3 text-yellow-400 transition-transform ${activeDropdown === 'departments' ? 'rotate-180' : ''}`} />
                  </Link>

                  {/* Mega Dropdown Menu */}
                  {activeDropdown === 'departments' && (
                    <div className="absolute left-0 top-full w-[720px] bg-white text-stone-900 rounded-b-xl shadow-2xl border-t-4 border-yellow-500 border-x border-b border-[#e7ded5] p-5 z-50">
                      <div className="flex justify-between items-center pb-3 mb-3 border-b border-stone-200">
                        <div>
                          <h4 className="font-black text-[#2b1408] text-sm">Undergraduate B.E. Programs</h4>
                          <p className="text-xs text-stone-500">AICTE Approved • Affiliated to Visvesvaraya Technological University, Belagavi</p>
                        </div>
                        <Link
                          to="/departments"
                          className="text-xs font-bold text-[#783c19] hover:text-[#4a2511] flex items-center gap-1 bg-[#fbf7f0] px-2.5 py-1 rounded-md border border-yellow-400/40"
                        >
                          View All <ExternalLink className="w-3 h-3 text-yellow-600" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {departments.map((dept) => (
                          <Link
                            key={dept.id}
                            to={`/departments/${dept.id}`}
                            className="p-2.5 rounded-lg hover:bg-[#fbf7f0] border border-transparent hover:border-yellow-300 flex items-start gap-3 transition-all group/item"
                          >
                            <span className="w-9 h-9 rounded-md bg-[#2b1408] text-yellow-400 font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover/item:bg-yellow-400 group-hover/item:text-stone-950 transition-colors shadow-sm">
                              {dept.short_name}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-xs text-stone-900 group-hover/item:text-[#4a2511] truncate">
                                {dept.name}
                              </h5>
                              <p className="text-[11px] text-stone-500 truncate">
                                HOD: {dept.hod_name} • Intake: {dept.intake} Seats
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>

                {/* Admissions (Dropdown) */}
                <li
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setActiveDropdown('admissions')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href="/#admissions"
                    className={`h-full px-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      activeDropdown === 'admissions'
                        ? 'border-yellow-400 text-yellow-300 bg-white/5'
                        : 'border-transparent text-stone-200 hover:text-yellow-400 hover:border-yellow-400'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Admissions</span>
                    <ChevronDown className={`w-3 h-3 text-yellow-400 transition-transform ${activeDropdown === 'admissions' ? 'rotate-180' : ''}`} />
                  </a>

                  {activeDropdown === 'admissions' && (
                    <div className="absolute left-0 top-full w-72 bg-white text-stone-900 rounded-b-xl shadow-2xl border-t-4 border-yellow-500 border-x border-b border-[#e7ded5] p-3 space-y-1 z-50">
                      <a
                        href="/#admissions"
                        className="block p-2 rounded-lg hover:bg-[#fbf7f0] hover:text-[#4a2511] text-xs font-semibold text-stone-800 transition-colors"
                      >
                        <span className="font-bold block text-stone-950">Admissions 2026-27</span>
                        <span className="text-[11px] text-stone-500">KEA CET Code: E167 • COMED-K: E099</span>
                      </a>
                      <a
                        href="/#admissions"
                        className="block p-2 rounded-lg hover:bg-[#fbf7f0] hover:text-[#4a2511] text-xs font-semibold text-stone-800 transition-colors"
                      >
                        <span className="font-bold block text-stone-950">Eligibility & Seat Matrix</span>
                        <span className="text-[11px] text-stone-500">Government & Management Quota</span>
                      </a>
                      <a
                        href="/#admissions"
                        className="block p-2 rounded-lg hover:bg-[#fbf7f0] hover:text-[#4a2511] text-xs font-semibold text-stone-800 transition-colors"
                      >
                        <span className="font-bold block text-stone-950">Admission Inquiry Form</span>
                        <span className="text-[11px] text-stone-500">Instant counselor callback</span>
                      </a>
                    </div>
                  )}
                </li>

                {/* Placements */}
                <li className="h-full flex items-center">
                  <Link
                    to="/placements"
                    className={`h-full px-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      location.pathname === '/placements'
                        ? 'border-yellow-400 text-yellow-300 bg-white/5'
                        : 'border-transparent text-stone-200 hover:text-yellow-400 hover:border-yellow-400'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Placements</span>
                  </Link>
                </li>

                {/* Central Library */}
                <li className="h-full flex items-center">
                  <Link
                    to="/library"
                    className={`h-full px-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      location.pathname === '/library'
                        ? 'border-yellow-400 text-yellow-300 bg-white/5'
                        : 'border-transparent text-stone-200 hover:text-yellow-400 hover:border-yellow-400'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Library</span>
                  </Link>
                </li>

                {/* Events & Symposia */}
                <li className="h-full flex items-center">
                  <Link
                    to="/events"
                    className={`h-full px-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      location.pathname === '/events'
                        ? 'border-yellow-400 text-yellow-300 bg-white/5'
                        : 'border-transparent text-stone-200 hover:text-yellow-400 hover:border-yellow-400'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Events</span>
                  </Link>
                </li>

                {/* Contact Us */}
                <li className="h-full flex items-center">
                  <Link
                    to="/contact"
                    className={`h-full px-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                      location.pathname === '/contact'
                        ? 'border-yellow-400 text-yellow-300 bg-white/5'
                        : 'border-transparent text-stone-200 hover:text-yellow-400 hover:border-yellow-400'
                    }`}
                  >
                    <span>Contact</span>
                  </Link>
                </li>

              </ul>
            </div>

            {/* Right: KLE Tech Style Action CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="/#admissions"
                className="px-3.5 py-1.5 rounded bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#4a2511]" />
                <span>Admissions 2026-27 (CET: E167)</span>
              </a>
            </div>

            {/* Mobile Header in Nav Bar */}
            <div className="flex items-center justify-between w-full lg:hidden py-1">
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
                <img src="/images/header-logo.png" alt="Logo" className="h-5 w-auto object-contain bg-white rounded p-0.5" />
                <span>SKSVMACET Laxmeshwar</span>
              </span>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 rounded text-yellow-400 hover:bg-white/10"
                aria-label="Toggle Navigation"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* 3. Mobile Navigation Drawer (Scrollable if tall) */}
        {isOpen && (
          <div className="lg:hidden bg-[#0c121e] text-white border-t border-yellow-500/50 px-4 pt-2 pb-5 space-y-1.5 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <Link
              to="/"
              className="block py-2 text-xs font-bold uppercase tracking-wider text-stone-200 hover:text-yellow-400 border-b border-stone-800"
            >
              Home
            </Link>

            <a
              href="/#about"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-xs font-bold uppercase tracking-wider text-stone-200 hover:text-yellow-400 border-b border-stone-800"
            >
              About Us
            </a>

            {/* Mobile Departments Accordion */}
            <div className="border-b border-stone-800 pb-1.5">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'dept_mobile' ? null : 'dept_mobile')}
                className="w-full flex justify-between items-center py-2 text-xs font-bold uppercase tracking-wider text-stone-200"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-yellow-400" />
                  Departments (8 Branches)
                </span>
                <ChevronDown className={`w-4 h-4 text-yellow-400 transition-transform ${activeDropdown === 'dept_mobile' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'dept_mobile' && (
                <div className="pl-6 pt-1 pb-2 space-y-1">
                  {departments.map(dept => (
                    <Link
                      key={dept.id}
                      to={`/departments/${dept.id}`}
                      className="block py-1 text-xs text-stone-300 hover:text-yellow-400"
                    >
                      {dept.name} ({dept.short_name})
                    </Link>
                  ))}
                  <Link
                    to="/departments"
                    className="block py-1 text-xs font-bold text-yellow-400 underline pt-1"
                  >
                    View All Departments →
                  </Link>
                </div>
              )}
            </div>

            <a
              href="/#admissions"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-xs font-bold uppercase tracking-wider text-stone-200 hover:text-yellow-400 border-b border-stone-800"
            >
              Admissions (CET: E167)
            </a>

            <Link
              to="/placements"
              className="block py-2 text-xs font-bold uppercase tracking-wider text-stone-200 hover:text-yellow-400 border-b border-stone-800"
            >
              Placements
            </Link>

            <Link
              to="/library"
              className="block py-2 text-xs font-bold uppercase tracking-wider text-stone-200 hover:text-yellow-400 border-b border-stone-800"
            >
              Central Library
            </Link>

            <Link
              to="/events"
              className="block py-2 text-xs font-bold uppercase tracking-wider text-stone-200 hover:text-yellow-400 border-b border-stone-800"
            >
              Events & Symposia
            </Link>

            <Link
              to="/contact"
              className="block py-2 text-xs font-bold uppercase tracking-wider text-stone-200 hover:text-yellow-400 border-b border-stone-800"
            >
              Contact Us
            </Link>

            <div className="pt-2">
              <a
                href="/#admissions"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2.5 rounded bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-stone-950 font-black text-xs uppercase tracking-wider shadow-md"
              >
                Admissions 2026-27 (CET: E167)
              </a>
            </div>
          </div>
        )}
      </nav>

    </div>
  );
}
