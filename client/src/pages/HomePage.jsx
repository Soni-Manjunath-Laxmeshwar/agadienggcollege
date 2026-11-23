import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Award, Building2, BookOpen, Users, Briefcase,
  ChevronRight, Calendar, ArrowRight, ShieldCheck, CheckCircle2,
  Sparkles, ExternalLink, Phone, Mail, MapPin, Send, AlertCircle,
  Heart, Shield
} from 'lucide-react';

import EventBannerNoticeHub from '../components/EventBannerNoticeHub';
import RecruiterGrid from '../components/RecruiterGrid';

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [heroSlide, setHeroSlide] = useState(0);

  // Inquiry form state
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    course_interested: 'B.E. Computer Science & Engineering',
    message: ''
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState(null);

  useEffect(() => {
    // Fetch stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(d => {
        if (d.success) setStats(d.data);
      })
      .catch(() => {});

    // Fetch departments
    fetch('/api/departments')
      .then(res => res.json())
      .then(d => {
        if (d.success) setDepartments(d.data);
      })
      .catch(() => {});
  }, []);

  // Hero carousel auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide(prev => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySubmitting(true);
    setInquiryError(null);

    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryForm)
    })
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setInquirySuccess(true);
          setInquiryForm({
            name: '',
            email: '',
            phone: '',
            course_interested: 'B.E. Computer Science & Engineering',
            message: ''
          });
        } else {
          setInquiryError(d.error || 'Failed to submit inquiry');
        }
      })
      .catch(err => setInquiryError(err.message))
      .finally(() => setInquirySubmitting(false));
  };

  const heroSlides = [
    {
      title: "Transforming Rural Youths into Global Technocrats",
      subtitle: "Affiliated to VTU Belagavi, Approved by AICTE New Delhi, Accredited by NAAC with B++ Grade. Established in 2003 under S.V.M.V.V. Society in Lakshmeshwar.",
      cta: "Explore Academic Departments",
      ctaLink: "/departments",
      bgImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1800&auto=format&fit=crop&q=80",
      tag: "KEA CET: E167 • COMED-K: E099 • NAAC ACCREDITED"
    },
    {
      title: "MELANZE: Annual National Techno-Cultural Fest & ICMRTET",
      subtitle: "Join student innovators and researchers across Karnataka for flagship project exhibitions, C-Cube coding challenges, robotics arenas, international conferences, and grand cultural stages at our 45-acre Lakshmeshwar campus.",
      cta: "Explore Melanze & Symposia",
      ctaLink: "/events",
      bgImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1800&auto=format&fit=crop&q=80",
      tag: "ANNUAL TECHNO-CULTURAL FEST • SKSVMACET LAKSHMESHWAR"
    },
    {
      title: "Top Corporate Recruitment for Engineering Batches",
      subtitle: "Infosys, TCS, Wipro, Cognizant, Xoriant Solutions, Powercon, SLK Software, Continental & Bosch actively hire our graduates. Comprehensive 4-year training framework.",
      cta: "Browse Recruiters & Placements",
      ctaLink: "/placements",
      bgImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1800&auto=format&fit=crop&q=80",
      tag: "CAREER EXCELLENCE • TRAINING & PLACEMENT CELL"
    }
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen text-stone-900">
      
      {/* 1. Hero Carousel (Theme: Deep Black & Brown with Vibrant Yellow Accents) */}
      <section className="relative bg-[#140c08] text-white min-h-[560px] lg:min-h-[620px] flex items-center justify-center overflow-hidden border-b-4 border-yellow-500">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              heroSlide === index ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.bgImage}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-40"
            />
            {/* Multi-layered Warm Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#140c08] via-[#1c0f0a]/85 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#140c08] via-transparent to-transparent"></div>
          </div>
        ))}

        {/* Hero Content Overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 w-full">
          <div className="max-w-3xl space-y-6">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-black uppercase tracking-wider border border-yellow-400/50 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>{heroSlides[heroSlide].tag}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif text-white tracking-tight leading-tight">
              {heroSlides[heroSlide].title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-lg text-stone-300 leading-relaxed font-normal max-w-2xl">
              {heroSlides[heroSlide].subtitle}
            </p>

            {/* CTA Buttons (Yellow & White) */}
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to={heroSlides[heroSlide].ctaLink}
                className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-stone-950 font-black text-sm shadow-xl flex items-center gap-2 transition-transform hover:-translate-y-0.5"
              >
                <span>{heroSlides[heroSlide].cta}</span>
                <ArrowRight className="w-4 h-4 text-stone-950" />
              </Link>

              <a
                href="#admissions"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-yellow-400/30 transition-colors"
              >
                Admissions 2026-27 (CET: E167)
              </a>
            </div>
          </div>

          {/* Hero Carousel Navigation Dots */}
          <div className="mt-12 flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  heroSlide === i ? 'w-10 bg-yellow-400' : 'w-3 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Chairman's Special Welfare Announcement Ribbon (Directly from agadiengcollege.com) */}
      <div className="bg-gradient-to-r from-[#241108] via-[#3a1d0d] to-[#241108] border-b-2 border-yellow-500 text-white py-3 px-4 sm:px-6 shadow-md relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <span className="px-2.5 py-1 rounded bg-yellow-400 text-stone-950 font-black text-[11px] uppercase tracking-wider flex-shrink-0 shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Chairman's Initiative</span>
            </span>
            <p className="text-xs sm:text-sm font-semibold text-stone-100">
              Our Honorable Chairman <strong className="text-yellow-400 font-bold">Sri Harshavardhan V. Agadi</strong> has announced <strong className="text-white underline decoration-yellow-400">free Engineering Education for Children of Fallen Soldiers</strong> at Our Institute.
            </p>
          </div>
          <a
            href="#chairman-initiative"
            className="flex-shrink-0 text-xs font-bold text-yellow-300 hover:text-white flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg border border-yellow-400/40 transition-colors whitespace-nowrap"
          >
            <span>Read Initiative Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-yellow-400" />
          </a>
        </div>
      </div>

      {/* 2. Quick Action Cards (Theme: Crisp White with Deep Brown & Yellow Highlights) */}
      <section className="relative z-30 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/#admissions"
            className="bg-white rounded-xl shadow-lg border border-[#e7ded5] p-4 hover:shadow-xl hover:border-yellow-500 hover:-translate-y-1 transition-all group flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-lg bg-[#2b1408] text-yellow-400 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-yellow-400 group-hover:text-stone-950 transition-colors shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-stone-900 group-hover:text-[#4a2511]">Admissions 2026</h4>
              <p className="text-[11px] text-stone-500">CET Code: E167</p>
            </div>
          </Link>

          <Link
            to="/library"
            className="bg-white rounded-xl shadow-lg border border-[#e7ded5] p-4 hover:shadow-xl hover:border-yellow-500 hover:-translate-y-1 transition-all group flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-lg bg-[#2b1408] text-yellow-400 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-yellow-400 group-hover:text-stone-950 transition-colors shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-stone-900 group-hover:text-[#4a2511]">V. S. Setti Library</h4>
              <p className="text-[11px] text-stone-500">38,322+ Volumes</p>
            </div>
          </Link>

          <Link
            to="/departments"
            className="bg-white rounded-xl shadow-lg border border-[#e7ded5] p-4 hover:shadow-xl hover:border-yellow-500 hover:-translate-y-1 transition-all group flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-lg bg-[#2b1408] text-yellow-400 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-yellow-400 group-hover:text-stone-950 transition-colors shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-stone-900 group-hover:text-[#4a2511]">8 Departments</h4>
              <p className="text-[11px] text-stone-500">AICTE Approved</p>
            </div>
          </Link>

          <Link
            to="/placements"
            className="bg-white rounded-xl shadow-lg border border-[#e7ded5] p-4 hover:shadow-xl hover:border-yellow-500 hover:-translate-y-1 transition-all group flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-lg bg-[#2b1408] text-yellow-400 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-yellow-400 group-hover:text-stone-950 transition-colors shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-stone-900 group-hover:text-[#4a2511]">Top Recruiters</h4>
              <p className="text-[11px] text-stone-500">92%+ Placement</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 2B. Chairman's Special Welfare Initiative & Why SKSVMACET Institutional Hallmarks */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="chairman-initiative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf1dc] text-[#542d13] text-xs font-bold uppercase tracking-wider mb-2 border border-yellow-400/60">
            <ShieldCheck className="w-4 h-4 text-yellow-600" />
            <span>Official Institutional Mandate • agadiengcollege.com</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-stone-900 tracking-tight">
            Why SKSVMACET Lakshmeshwar?
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2">
            Pioneering ethical technical education, national defense welfare, and global corporate leadership under Chairman Sri Harshavardhan V. Agadi.
          </p>
        </div>

        {/* 1. The Large Chairman's Welfare Hero Card */}
        <div className="bg-gradient-to-br from-[#221008] via-[#32170c] to-[#180b05] rounded-3xl p-6 sm:p-10 text-white border-2 border-yellow-500/60 shadow-2xl relative overflow-hidden mb-8">
          
          {/* Subtle Decorative Background Glow */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-yellow-500/5 rounded-full pointer-events-none blur-3xl"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-black uppercase tracking-wider border border-yellow-400/40">
                <Heart className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/30" />
                <span>National Tribute & Special Defense Welfare Initiative</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-white tracking-tight leading-tight">
                Free Engineering Education for Children of Fallen Soldiers
              </h3>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-yellow-400/25 backdrop-blur-sm space-y-2">
                <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-serif italic">
                  "Our Honorable Chairman <strong>Sri Harshavardhan V. Agadi</strong> has announced free Engineering Education for Children of Fallen Soldiers at Our Institute."
                </p>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                  In highest salute to the supreme sacrifice made by India’s brave martyrs defending our motherland, S.V.M.V.V. Society’s SKSVMACET Lakshmeshwar provides complete <strong>100% tuition fee waiver</strong>, academic mentorship, and campus hostel assistance across all 8 accredited B.E. disciplines for the children of fallen soldiers of the Indian Armed Forces and Paramilitary forces.
                </p>
              </div>

              {/* Chairman Citation Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-yellow-500/20">
                <div>
                  <h5 className="font-bold text-sm text-yellow-400">Sri Harshavardhan V. Agadi</h5>
                  <p className="text-xs text-stone-300">Honorable Chairman & Managing Trustee, SKSVMACET Lakshmeshwar</p>
                  <p className="text-[11px] text-stone-400">Former CEO & President, Crawford & Company (NYSE: CRD-A) • Board of Directors, Sonata Software</p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <a
                    href="#admissions"
                    className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-stone-950 font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Defense Quota Inquiry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="tel:9448120344"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-300 font-bold text-xs uppercase tracking-wider border border-yellow-400/30 transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>9448120344</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Right: Key Highlights Summary Card (4 cols) */}
            <div className="lg:col-span-4 bg-white/5 border border-yellow-400/30 rounded-2xl p-6 backdrop-blur-md space-y-3.5">
              <span className="text-xs font-black uppercase tracking-widest text-yellow-400 block pb-1 border-b border-yellow-500/20">
                Welfare Scheme Coverage
              </span>
              <ul className="text-xs space-y-2.5 text-stone-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span><strong>100% Tuition Fee Waiver</strong> across all 4 years of B.E. study</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Applicable for all 8 B.E. Branches</strong> (CSE, AI&ML, ECE, EEE, Civil, Mech, ISE)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Free Textbook Access</strong> from Prof. V. S. Setti Central Library</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Priority Hostel & Mentorship</strong> on our 45-acre Lakshmeshwar campus</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* 2. Grid of 5 Official Institutional Pillars from agadiengcollege.com */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="why-us">
          
          {/* Pillar 1: No Capitation Fee */}
          <div className="bg-white rounded-2xl p-6 border border-[#e7ded5] shadow-sm hover:shadow-md hover:border-yellow-400 transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2b1408] text-yellow-400 flex items-center justify-center font-black text-sm">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-stone-900 font-serif">No Capitation Fee Ever</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              No capitation fee or donation has ever been charged since the inception of the college in 2003. We stand steadfast in providing honest, transparent, and merit-first engineering education.
            </p>
          </div>

          {/* Pillar 2: 50% KCET Fee Concession */}
          <div className="bg-white rounded-2xl p-6 border border-[#e7ded5] shadow-sm hover:shadow-md hover:border-yellow-400 transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2b1408] text-yellow-400 flex items-center justify-center font-black text-sm">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-stone-900 font-serif">50% KCET Fee Concession</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Special 50% CET tuition fee concession awarded to meritorious students securing KCET ranks within 30,000 or achieving 95% and above in II PUC / 12th Standard exams.
            </p>
          </div>

          {/* Pillar 3: ₹20 Lakhs Annual Scholarships */}
          <div className="bg-white rounded-2xl p-6 border border-[#e7ded5] shadow-sm hover:shadow-md hover:border-yellow-400 transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2b1408] text-yellow-400 flex items-center justify-center font-black text-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-stone-900 font-serif">₹20 Lakhs Annual Scholarships</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              S.V.M.V. Society and management disburse over ₹20 Lakhs annually in merit scholarships and fee support, ensuring economic constraints never hold back talented rural youth.
            </p>
          </div>

          {/* Pillar 4: Global Corporate Leadership */}
          <div className="bg-white rounded-2xl p-6 border border-[#e7ded5] shadow-sm hover:shadow-md hover:border-yellow-400 transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2b1408] text-yellow-400 flex items-center justify-center font-black text-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-stone-900 font-serif">Global Corporate Leadership</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Under Chairman Sri Harshavardhan V. Agadi's global Fortune leadership, students benefit from international corporate management rigor, industry partnerships, and career mentorship.
            </p>
          </div>

          {/* Pillar 5: Centers of Excellence & Industry MoUs */}
          <div className="bg-white rounded-2xl p-6 border border-[#e7ded5] shadow-sm hover:shadow-md hover:border-yellow-400 transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2b1408] text-yellow-400 flex items-center justify-center font-black text-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-stone-900 font-serif">Centers of Excellence & MoUs</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Established CoEs and MoUs with Tattva Labs, Manomaya Software Services, and SVARKS IT LLP providing students live software projects, industrial hackathons, and corporate internships.
            </p>
          </div>

          {/* Pillar 6: 45-Acre Green Campus & Central Library */}
          <div className="bg-white rounded-2xl p-6 border border-[#e7ded5] shadow-sm hover:shadow-md hover:border-yellow-400 transition-all space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2b1408] text-yellow-400 flex items-center justify-center font-black text-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-stone-900 font-serif">45-Acre Campus & V.S. Setti Library</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              A serene 45-acre educational sanctuary in Lakshmeshwar housing the Prof. Venkata Subba Setti Library (38,322+ Volumes, Koha OPAC, IEEE consortia) and modern sports complex.
            </p>
          </div>

        </div>

      </section>

      {/* 3. Statistics Banner (Theme: Deep Black-Brown & Gold Accents) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#201007] via-[#331a0c] to-[#1a0c05] rounded-3xl p-8 sm:p-12 text-white shadow-xl border-2 border-yellow-500/40">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-extrabold tracking-widest text-yellow-400">Institutional Benchmarks</span>
            <h2 className="text-2xl sm:text-4xl font-black font-serif mt-1">23+ Years of Educational Leadership</h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2">
              Established in 2003 under the visionary leadership of Late Sri Venkappa M. Agadi & Smt. Kamala Agadi under S.V.M.V.V. Society in Lakshmeshwar.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-white/5 border border-yellow-400/20 backdrop-blur-sm">
              <span className="block text-3xl sm:text-5xl font-black text-yellow-400 font-mono">23+</span>
              <span className="text-xs uppercase font-bold text-stone-200 mt-1 block">Years of Legacy</span>
              <span className="text-[11px] text-stone-400">Established 2003</span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-yellow-400/20 backdrop-blur-sm">
              <span className="block text-3xl sm:text-5xl font-black text-yellow-400 font-mono">45+</span>
              <span className="text-xs uppercase font-bold text-stone-200 mt-1 block">Acre Green Campus</span>
              <span className="text-[11px] text-stone-400">Lakshmeshwar, Karnataka</span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-yellow-400/20 backdrop-blur-sm">
              <span className="block text-3xl sm:text-5xl font-black text-yellow-400 font-mono">92%+</span>
              <span className="text-xs uppercase font-bold text-stone-200 mt-1 block">Placement Success</span>
              <span className="text-[11px] text-stone-400">MNC & Core Industry Ties</span>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-yellow-400/20 backdrop-blur-sm">
              <span className="block text-3xl sm:text-5xl font-black text-yellow-400 font-mono">38,322+</span>
              <span className="text-xs uppercase font-bold text-stone-200 mt-1 block">Library Volumes</span>
              <span className="text-[11px] text-stone-400">4,926+ Titles • Koha OPAC</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Institutional Vision & Mission (Official SKSVMACET Mandate) */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="about">
        <div className="bg-white rounded-3xl border border-[#e7ded5] p-8 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4a2511] bg-[#fbf1dc] px-3 py-1 rounded-full border border-yellow-400/60">
                Institutional Mandate
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-serif text-stone-900">
                Our Vision & Mission
              </h3>
              <div className="p-5 rounded-2xl bg-[#fdf9f2] border-2 border-yellow-400/50 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4a2511] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-yellow-600" />
                  Institute Vision
                </span>
                <p className="text-xs sm:text-sm text-stone-800 italic leading-relaxed font-serif">
                  "Aspire to become preferred institute by transforming rural youths into global technocrats through continual excellence in engineering education, innovation, lifelong learning and ethical values."
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-stone-500 block mb-1">
                Institute Mission Pillars (M1 - M4)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-[#e7ded5] space-y-1">
                  <span className="font-black text-[#3d1f0f] block font-mono">M1: Outcome-Based Quality</span>
                  <p className="text-stone-600 leading-relaxed">
                    Inculcate outcome-based quality education in engineering through experiential learning with state-of-the-art infrastructure.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-[#e7ded5] space-y-1">
                  <span className="font-black text-[#3d1f0f] block font-mono">M2: Industry Ecosystem</span>
                  <p className="text-stone-600 leading-relaxed">
                    Promote industry-institute collaborations to encourage innovations in thrust areas by providing an ecosystem.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-[#e7ded5] space-y-1">
                  <span className="font-black text-[#3d1f0f] block font-mono">M3: Sustainable Technology</span>
                  <p className="text-stone-600 leading-relaxed">
                    Emphasize cutting-edge technologies that are sustainable and beneficial to different sectors of society.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-[#e7ded5] space-y-1">
                  <span className="font-black text-[#3d1f0f] block font-mono">M4: Professional Ethics</span>
                  <p className="text-stone-600 leading-relaxed">
                    Develop professionals by inculcating discipline, integrity, and ethical values.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Campus Events, Conferences & Symposia Showcase (Important Notice Section Removed) */}
      <EventBannerNoticeHub />

      {/* 6. Academic Departments Showcase (Every card links to separate page) */}
      <section className="py-16 bg-white" id="departments">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbf1dc] text-[#542d13] text-xs font-bold uppercase tracking-wider mb-2 border border-yellow-400/60">
                <Building2 className="w-3.5 h-3.5 text-yellow-600" />
                <span>Undergraduate Degree Programs • B.E. Disciplines</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight font-serif">
                Academic Departments
              </h2>
              <p className="text-sm text-stone-600 mt-1">
                Explore our accredited engineering disciplines. Click on any department to view faculty, labs, curriculum, and HOD message.
              </p>
            </div>

            <Link
              to="/departments"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4a2511] hover:text-[#783c19] transition-colors bg-[#faf7f2] px-4 py-2 rounded-lg border border-[#e7ded5] hover:border-yellow-400"
            >
              <span>View All 8 Departments</span>
              <ArrowRight className="w-4 h-4 text-yellow-600" />
            </Link>
          </div>

          {/* Departments Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept) => (
              <Link
                key={dept.id}
                to={`/departments/${dept.id}`}
                className="group bg-[#faf8f5] hover:bg-white rounded-2xl border border-[#e7ded5] hover:border-yellow-500 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image header */}
                  <div className="h-36 relative overflow-hidden bg-[#140c08]">
                    <img
                      src={dept.banner_image}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140c08] via-transparent to-transparent"></div>
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#2b1408] text-yellow-400 font-bold text-xs font-mono shadow border border-yellow-400/40">
                      {dept.short_name}
                    </span>
                    <span className="absolute bottom-2.5 left-3 text-[11px] text-stone-300 font-semibold">
                      Intake: {dept.intake} Seats
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-stone-900 group-hover:text-[#4a2511] transition-colors line-clamp-1">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {dept.about_text}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-[#4a2511] group-hover:text-yellow-700">
                    <span>View Department Page</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-yellow-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Central Library Spotlight & Koha OPAC Gateway */}
      <section className="py-16 bg-[#160d08] text-white relative overflow-hidden border-y-2 border-yellow-500/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/40">
                Knowledge Resource Centre
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-white">
                Prof. Venkata Subba Setti Library
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed">
                Central Learning Resource Centre of SKSVMACET Lakshmeshwar. Spanning 919.9 Sq.m with a seating capacity of 250 users, housing <strong>38,322+ Volumes</strong>, <strong>4,926+ Titles</strong>, Koha Web OPAC, and comprehensive VTU E-Resource databases.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white/5 rounded-lg border border-yellow-400/20">
                  <span className="font-bold text-yellow-400 block text-lg">38,322+</span>
                  <span className="text-stone-300">Print Volumes</span>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-yellow-400/20">
                  <span className="font-bold text-yellow-400 block text-lg">4,926+</span>
                  <span className="text-stone-300">Distinct Titles</span>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-yellow-400/20">
                  <span className="font-bold text-yellow-400 block text-lg">Koha OPAC</span>
                  <span className="text-stone-300">Book Reservation</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/library"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-stone-950 font-black text-sm shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <BookOpen className="w-4 h-4 text-stone-950" />
                  <span>Launch Prof. V. S. Setti Library & OPAC</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#24130a] backdrop-blur-md rounded-2xl p-6 border-2 border-yellow-500/40 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-yellow-400" />
                  <span>Subscribed Research Consortiums</span>
                </h3>
                <ul className="text-xs text-stone-300 space-y-2.5">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span><strong>IEEE ASPP & POP ALL</strong> — Millions of technical IEEE articles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span><strong>Elsevier (ScienceDirect)</strong> — Peer-reviewed technical papers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span><strong>Knimbus & mLibrary App</strong> — Mobile digital library for students</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span><strong>DELNET & NDL</strong> — Inter-library loans & union catalogs</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <Link
                    to="/library"
                    className="block w-full text-center py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-yellow-300 border border-yellow-400/30 transition-colors"
                  >
                    Search Book Catalog (Koha OPAC) →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Our Esteemed Recruiters (Logo click directs to company websites) */}
      <RecruiterGrid showTitle={true} limit={null} />

      {/* 9. Admissions & Inquiry Section (#admissions) */}
      <section className="py-16 bg-[#f7f2ea]" id="admissions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-[#e7ded5] shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Column: Admissions Info */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#201007] via-[#2f180c] to-[#140a04] text-white p-8 sm:p-12 space-y-6 border-r border-yellow-500/30">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-yellow-400 bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/40">
                    SKSVMACET Lakshmeshwar
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black font-serif mt-3 text-white">
                    Admissions 2026-27 Open
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                    Choose from 8 accredited B.E. programs under Visvesvaraya Technological University Belagavi.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white/10 rounded-xl border border-yellow-400/30 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 font-bold">KEA CET Code:</span>
                      <span className="text-base font-mono font-bold text-white">E167</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 font-bold">COMED-K Code:</span>
                      <span className="text-base font-mono font-bold text-white">E099</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-stone-300">
                    <Phone className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span>Principal: +91 9686042385 (Dr. Parashuram Baraki)</span>
                  </div>

                  <div className="flex items-center gap-3 text-stone-300">
                    <Phone className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span>Office: +91 8378 267101 / +91 9480 382894</span>
                  </div>

                  <div className="flex items-center gap-3 text-stone-300">
                    <Mail className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span>principal@agadiengcollege.com</span>
                  </div>

                  <div className="flex items-center gap-3 text-stone-300">
                    <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span>Lakshmeshwar - 582116, Gadag District, Karnataka</span>
                  </div>
                </div>

                {/* Special Welfare & Scholarship Callout */}
                <div className="p-3.5 bg-yellow-400/10 rounded-xl border border-yellow-400/40 space-y-2">
                  <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span>Special Welfare & Scholarships</span>
                  </div>
                  <ul className="text-[11px] text-stone-200 space-y-1.5">
                    <li className="flex items-start gap-1.5">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span><strong className="text-white">Free Engineering Education</strong> for Children of Fallen Soldiers (Chairman's Initiative)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span><strong className="text-white">50% KCET Fee Concession</strong> for Rank &lt; 30,000 or 95%+ in II PUC</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span><strong className="text-white">₹20 Lakhs Annual Scholarships</strong> by S.V.M.V.V. Society</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-yellow-400 font-bold">•</span>
                      <span><strong className="text-white">Zero Capitation Fee Ever</strong> since establishment (2003)</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-1 border-t border-yellow-500/20 text-[11px] text-stone-400">
                  Affiliated to Visvesvaraya Technological University Belagavi • Approved by AICTE • Accredited by NAAC B++
                </div>
              </div>

              {/* Right Column: Inquiry Form */}
              <div className="lg:col-span-7 p-8 sm:p-12">
                <h3 className="text-xl font-bold text-stone-900">
                  Request Information / Apply Online
                </h3>
                <p className="text-xs text-stone-500 mt-1 mb-6">
                  Fill in your details and our admission counselor will reach out to you within 24 hours.
                </p>

                {inquirySuccess ? (
                  <div className="p-6 bg-[#fbf7f0] rounded-2xl border-2 border-yellow-400 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 text-[#4a2511] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="text-base font-bold text-stone-900">Application Submitted!</h4>
                    <p className="text-xs text-stone-600">
                      Thank you for your interest in SKSVMACET. Our Admissions Office will contact you shortly.
                    </p>
                    <button
                      onClick={() => setInquirySuccess(false)}
                      className="px-4 py-2 bg-[#2b1408] text-yellow-300 rounded-lg text-xs font-bold"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    {inquiryError && (
                      <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{inquiryError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Student Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Patil"
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="student@example.com"
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Mobile / WhatsApp Number</label>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 mb-1">Branch of Interest</label>
                        <select
                          value={inquiryForm.course_interested}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, course_interested: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                        >
                          <option>B.E. Computer Science & Engineering</option>
                          <option>B.E. CSE (Artificial Intelligence & ML)</option>
                          <option>B.E. Electronics & Communication</option>
                          <option>B.E. Electrical & Electronics</option>
                          <option>B.E. Civil Engineering</option>
                          <option>B.E. Mechanical Engineering</option>
                          <option>B.E. Information Science</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Your Query / Message</label>
                      <textarea
                        rows={3}
                        placeholder="Inquire about KCET rank cutoffs, hostel facilities, fees, or campus visit..."
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={inquirySubmitting}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-stone-950 font-black text-xs shadow-md inline-flex items-center gap-2 transition-all border border-yellow-300"
                    >
                      <Send className="w-3.5 h-3.5 text-stone-950" />
                      <span>{inquirySubmitting ? 'Sending Request...' : 'Submit Admission Inquiry (CET: E167)'}</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
