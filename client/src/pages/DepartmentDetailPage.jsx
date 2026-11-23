import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2, Users, Award, BookOpen, Layers, Mail, Phone,
  ChevronRight, Download, CheckCircle2, ArrowLeft, ExternalLink,
  Laptop, ShieldCheck, Cpu, Briefcase, GraduationCap
} from 'lucide-react';

export default function DepartmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dept, setDept] = useState(null);
  const [allDepts, setAllDepts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    // Fetch department details
    fetch(`/api/departments/${id}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setDept(d.data);
        } else {
          setDept(null);
        }
      })
      .catch(() => setDept(null))
      .finally(() => setLoading(false));

    // Fetch all depts for sidebar navigation
    fetch('/api/departments')
      .then(res => res.json())
      .then(d => {
        if (d.success) setAllDepts(d.data);
      })
      .catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#2b1408] border-t-yellow-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-stone-600">Loading department information...</p>
        </div>
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center space-y-4 border border-stone-200">
          <Building2 className="w-12 h-12 text-stone-400 mx-auto" />
          <h2 className="text-xl font-bold text-stone-900">Department Not Found</h2>
          <p className="text-xs text-stone-500">The requested academic department could not be found.</p>
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2b1408] hover:bg-[#3d1f0f] text-yellow-300 rounded-lg text-xs font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All Departments</span>
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview & Vision', icon: Layers },
    { id: 'hod', label: "HOD's Desk", icon: GraduationCap },
    { id: 'faculty', label: `Faculty (${dept.faculty?.length || 0})`, icon: Users },
    { id: 'labs', label: `Laboratories (${dept.labs?.length || 0})`, icon: Laptop },
    { id: 'curriculum', label: 'Curriculum & Scheme', icon: BookOpen },
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-16">
      
      {/* 1. Department Hero Header */}
      <section className="relative bg-[#140c08] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-yellow-500 overflow-hidden">
        {/* Background Image with Overlay */}
        <img
          src={dept.banner_image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80'}
          alt={dept.name}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#140c08] via-[#140c08]/90 to-transparent"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-yellow-200/60 mb-4">
            <Link to="/" className="hover:text-yellow-400">Home</Link>
            <ChevronRight className="w-3 h-3 text-stone-600" />
            <Link to="/departments" className="hover:text-yellow-400">Departments</Link>
            <ChevronRight className="w-3 h-3 text-stone-600" />
            <span className="text-yellow-400 font-semibold">{dept.short_name}</span>
          </nav>

          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold uppercase tracking-wider border border-yellow-500/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>Department Code: {dept.short_name}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">
              {dept.name}
            </h1>

            <p className="text-sm sm:text-base text-yellow-100/90 font-medium">
              {dept.degree} • Affiliated to Visvesvaraya Technological University Belagavi
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-md border border-white/15">
                Intake: <strong className="text-yellow-400">{dept.intake} Seats</strong>
              </span>
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-md border border-white/15">
                CET Code: <strong className="text-yellow-400">E167</strong>
              </span>
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-md border border-white/15">
                COMED-K: <strong className="text-yellow-400">E099</strong>
              </span>
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-md border border-white/15">
                Established: <strong className="text-yellow-400">{dept.established}</strong>
              </span>
              <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-md border border-yellow-500/30 font-semibold">
                NAAC Grade B++ & AICTE Approved
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Body: Tabs Content & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Tabbed Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tab Navigation Strip */}
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-[#2b1408] text-yellow-300 shadow-md border-b-2 border-yellow-400'
                        : 'text-stone-600 hover:bg-[#faf8f5] hover:text-[#2b1408]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW & VISION */}
            {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
                {/* About Department */}
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#4a2511]" />
                    <span>About the Department</span>
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {dept.about_text || 'The department offers state-of-the-art technical education with a balanced emphasis on theoretical principles, analytical competence, and experiential laboratory work.'}
                  </p>
                </div>

                {/* Vision & Mission Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vision */}
                  <div className="bg-[#faf8f5] rounded-xl p-5 border border-stone-200">
                    <div className="flex items-center gap-2 mb-2 text-[#2b1408] font-bold text-sm">
                      <Award className="w-4 h-4 text-yellow-600" />
                      <h4>Vision</h4>
                    </div>
                    <p className="text-xs text-stone-700 leading-relaxed italic">
                      "{dept.vision}"
                    </p>
                  </div>

                  {/* Mission */}
                  <div className="bg-yellow-50/50 rounded-xl p-5 border border-yellow-200/60">
                    <div className="flex items-center gap-2 mb-2 text-[#2b1408] font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-yellow-600" />
                      <h4>Mission</h4>
                    </div>
                    <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                      {dept.mission}
                    </div>
                  </div>
                </div>

                {/* Core Competencies / Curriculum Highlights */}
                {dept.curriculum_highlights && dept.curriculum_highlights.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                      Key Competency & Specialization Domains
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {dept.curriculum_highlights.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 p-3 rounded-lg bg-[#faf8f5] border border-stone-200 text-xs font-medium text-stone-800"
                        >
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: HOD'S DESK */}
            {activeTab === 'hod' && (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-stone-100">
                  <img
                    src={dept.hod_photo || '/images/clg-logo.png'}
                    alt={dept.hod_name}
                    onError={(e) => { e.currentTarget.src = '/images/clg-logo.png'; }}
                    className="w-32 h-32 rounded-2xl object-cover object-top shadow-md border-2 border-stone-200 flex-shrink-0 bg-white"
                  />
                  <div className="space-y-1.5 text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-yellow-100 text-[#2b1408] border border-yellow-300">
                      Head of the Department
                    </span>
                    <h3 className="text-xl font-bold text-stone-900">{dept.hod_name}</h3>
                    <p className="text-xs text-stone-600 font-medium">{dept.hod_designation}</p>

                    <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-stone-500">
                      {dept.hod_email && (
                        <a href={`mailto:${dept.hod_email}`} className="flex items-center gap-1 hover:text-[#2b1408] font-medium transition-colors">
                          <Mail className="w-3.5 h-3.5 text-yellow-600" />
                          <span>{dept.hod_email}</span>
                        </a>
                      )}
                      {dept.hod_phone && (
                        <a href={`tel:${dept.hod_phone.replace(/[\s-]/g, '')}`} className="flex items-center gap-1 hover:text-[#2b1408] font-medium transition-colors">
                          <Phone className="w-3.5 h-3.5 text-[#4a2511]" />
                          <span>{dept.hod_phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">Message from the HOD</h4>
                  <p className="text-sm text-stone-600 leading-relaxed bg-[#faf8f5] p-5 rounded-xl border border-stone-200 italic">
                    "{dept.hod_message}"
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: FACULTY DIRECTORY */}
            {activeTab === 'faculty' && (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Faculty Profiles & Research Expertise</h3>
                    <p className="text-xs text-stone-500">Verified official faculty directory of SKSVMACET Laxmeshwar</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-[#2b1408] border border-amber-200">
                    {dept.faculty?.length || 0} Faculty Members
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dept.faculty && dept.faculty.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 rounded-xl border border-stone-200 hover:border-yellow-500 hover:shadow-md transition-all flex items-start gap-4 bg-[#faf8f5]"
                    >
                      <img
                        src={member.photo}
                        alt={member.name}
                        onError={(e) => { e.currentTarget.src = '/images/clg-logo.png'; }}
                        className="w-20 h-24 sm:w-22 sm:h-26 rounded-xl object-cover object-top shadow-sm flex-shrink-0 border border-stone-200 bg-white"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-bold text-sm text-stone-900 truncate">{member.name}</h4>
                        <p className="text-xs text-[#4a2511] font-semibold truncate">{member.designation}</p>
                        
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-200">
                            {member.qualification}
                          </span>
                          {member.experience && (
                            <span className="text-[10px] text-stone-500">
                              • {member.experience}
                            </span>
                          )}
                        </div>

                        {member.specialization && (
                          <p className="text-[11px] text-stone-600 line-clamp-1 pt-0.5">
                            <span className="font-medium text-stone-700">Area:</span> {member.specialization}
                          </p>
                        )}

                        <div className="pt-2 space-y-1 border-t border-stone-200/60 mt-1">
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#2b1408] transition-colors truncate"
                              title={member.email}
                            >
                              <Mail className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                              <span className="truncate">{member.email}</span>
                            </a>
                          )}
                          {member.phone && (
                            <a
                              href={`tel:${member.phone.replace(/[\s-]/g, '')}`}
                              className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#2b1408] transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#4a2511] flex-shrink-0" />
                              <span>{member.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: LABORATORIES & INFRASTRUCTURE */}
            {activeTab === 'labs' && (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                  <h3 className="text-base font-bold text-stone-900">Laboratories & Computational Facilities</h3>
                  <span className="text-xs text-stone-500">{dept.labs?.length || 0} Specialised Labs</span>
                </div>

                <div className="space-y-6">
                  {dept.labs && dept.labs.map((lab) => (
                    <div
                      key={lab.id}
                      className="rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-5 h-48 md:h-auto relative">
                          <img
                            src={lab.image}
                            alt={lab.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:col-span-7 p-5 space-y-2">
                          <h4 className="text-base font-bold text-stone-900">{lab.name}</h4>
                          <p className="text-xs text-stone-600 leading-relaxed">{lab.description}</p>
                          <div className="pt-2">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                              Major Equipment & Software
                            </span>
                            <p className="text-xs font-mono bg-[#faf8f5] p-2.5 rounded-lg border border-stone-200 text-stone-700">
                              {lab.equipment}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: CURRICULUM & SYLLABUS */}
            {activeTab === 'curriculum' && (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-base font-bold text-stone-900">Curriculum Structure & Academic Scheme</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Aligned with Visvesvaraya Technological University (VTU) Outcome-Based Education (OBE) & NEP Scheme.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#faf8f5] border border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">B.E. Complete Syllabus & Scheme (PDF)</h4>
                      <p className="text-xs text-stone-500">Official VTU Belagavi approved course syllabus and examination regulations.</p>
                    </div>
                    <a
                      href="https://vtu.ac.in/en/b-e-scheme-syllabus/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#2b1408] hover:bg-[#3d1f0f] text-yellow-300 rounded-lg text-xs font-bold inline-flex items-center gap-2 flex-shrink-0 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Scheme (VTU)</span>
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-stone-200">
                      <span className="font-bold text-[#2b1408] block mb-1">Semester 1 & 2 (Foundations)</span>
                      <p className="text-stone-600">Calculus, Physics/Chemistry, Basic Electronics/Electrical, C Programming, Engineering Drawing.</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-stone-200">
                      <span className="font-bold text-[#2b1408] block mb-1">Semester 3 & 4 (Core Fundamentals)</span>
                      <p className="text-stone-600">Branch specific core courses, Data Structures, Circuits, Mathematics, and Practical Labs.</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-stone-200">
                      <span className="font-bold text-[#2b1408] block mb-1">Semester 5 & 6 (Advanced Electives)</span>
                      <p className="text-stone-600">Specialization electives, Industry internships, Mini-project fabrication, and Aptitude training.</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-stone-200">
                      <span className="font-bold text-[#2b1408] block mb-1">Semester 7 & 8 (Capstone & Placement)</span>
                      <p className="text-stone-600">Major Capstone Project, Final placement interview drives, Technical seminars, Open electives.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sidebar Navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Admissions Action */}
            <div className="bg-gradient-to-br from-[#2b1408] via-[#1c0f08] to-[#120804] text-white rounded-2xl p-6 shadow-md border-t-4 border-yellow-500">
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">
                Admissions 2026-27
              </span>
              <h3 className="text-lg font-bold mt-1 text-white">Join {dept.short_name} at SKSVMACET</h3>
              <p className="text-xs text-yellow-100/80 mt-2 leading-relaxed">
                KCET / COMED-K Code: <strong className="text-yellow-400">E167</strong>. Merit scholarships available for rural Karnataka students.
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                <a
                  href="/#admissions"
                  className="block w-full text-center py-2 px-3 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Apply for Admission
                </a>
                <a
                  href="tel:+918378267101"
                  className="block w-full text-center py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
                >
                  Call Admission Desk: +91 8378 267101
                </a>
              </div>
            </div>

            {/* Other Departments List */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5">
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>All Departments</span>
                <span className="text-xs text-[#4a2511] font-mono font-bold">({allDepts.length})</span>
              </h4>

              <div className="space-y-1.5">
                {allDepts.map((d) => (
                  <Link
                    key={d.id}
                    to={`/departments/${d.id}`}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-all ${
                      d.id === dept.id
                        ? 'bg-yellow-50 text-[#2b1408] font-bold border border-yellow-300'
                        : 'text-stone-700 hover:bg-[#faf8f5]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] ${
                        d.id === dept.id ? 'bg-[#2b1408] text-yellow-300' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {d.short_name.slice(0, 3)}
                      </span>
                      <span className="truncate max-w-[180px]">{d.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Library & Placement Quick Shortcuts */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 space-y-3 text-xs">
              <h4 className="font-bold text-stone-900 uppercase tracking-wider text-xs">Related Resources</h4>
              <Link
                to="/library"
                className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-[#faf8f5] border border-stone-100"
              >
                <BookOpen className="w-4 h-4 text-[#4a2511]" />
                <div>
                  <span className="font-bold text-stone-800 block">Prof. V. S. Setti Library</span>
                  <span className="text-[11px] text-stone-500">Search textbooks on Koha OPAC</span>
                </div>
              </Link>
              <Link
                to="/placements"
                className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-[#faf8f5] border border-stone-100"
              >
                <Briefcase className="w-4 h-4 text-yellow-600" />
                <div>
                  <span className="font-bold text-stone-800 block">Recruiters & Placements</span>
                  <span className="text-[11px] text-stone-500">Browse companies recruiting {dept.short_name}</span>
                </div>
              </Link>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
