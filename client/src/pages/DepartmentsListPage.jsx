import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Users, Laptop, ArrowRight, GraduationCap } from 'lucide-react';

export default function DepartmentsListPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetch('/api/departments')
      .then(res => res.json())
      .then(d => {
        if (d.success) setDepartments(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-16">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#1c0f08] via-[#2b1408] to-[#140c08] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-3 border border-yellow-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Excellence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">
            Academic Departments & Programs
          </h1>
          <p className="mt-3 text-sm sm:text-base text-yellow-100/80 max-w-3xl">
            SKSVMACET offers accredited undergraduate B.E. engineering degrees affiliated with Visvesvaraya Technological University Belagavi (KEA CET Code: <strong className="text-yellow-400">E167</strong>, COMED-K: <strong className="text-yellow-400">E099</strong>) and approved by AICTE New Delhi.
          </p>
        </div>
      </section>

      {/* Departments Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {loading ? (
          <div className="text-center py-20 text-stone-400">Loading departments...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-yellow-500/50"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="h-44 relative overflow-hidden bg-[#1c0f08]">
                    <img
                      src={dept.banner_image}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140c08] via-[#140c08]/50 to-transparent"></div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md bg-[#2b1408] text-yellow-400 font-bold text-xs shadow border border-yellow-400/40">
                        {dept.short_name}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] text-yellow-300 font-mono font-semibold block uppercase">
                        ESTD {dept.established} • Intake: {dept.intake} Seats
                      </span>
                      <h3 className="text-lg font-bold text-white line-clamp-1 leading-snug">
                        {dept.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {dept.about_text}
                    </p>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#4a2511]" />
                        {dept.faculty_count || 4}+ Faculty
                      </span>
                      <span className="flex items-center gap-1">
                        <Laptop className="w-3.5 h-3.5 text-yellow-700" />
                        {dept.lab_count || 2}+ Labs
                      </span>
                      <span className="font-semibold text-stone-700">
                        {dept.duration}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Link to Separate Department Page */}
                <div className="p-5 pt-0">
                  <Link
                    to={`/departments/${dept.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#faf8f5] group-hover:bg-[#2b1408] text-[#2b1408] group-hover:text-yellow-300 border border-stone-200 group-hover:border-[#2b1408] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>Explore Department Details</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
