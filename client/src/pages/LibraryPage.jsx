import React, { useState, useEffect } from 'react';
import {
  BookOpen, Search, Filter, Bookmark, CheckCircle, Clock,
  Globe, Database, ExternalLink, ShieldCheck, MapPin, Sparkles,
  Layers, Users, ChevronRight, X, AlertCircle
} from 'lucide-react';

export default function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Reservation modal state
  const [selectedBook, setSelectedBook] = useState(null);
  const [reservationForm, setReservationForm] = useState({
    student_name: '',
    usn: '',
    email: '',
    branch: 'Computer Science & Engineering',
    semester: '6th Semester'
  });
  const [reservationSubmitting, setReservationSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(null);
  const [reservationError, setReservationError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, selectedDept, selectedCategory, availableOnly]);

  const fetchBooks = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (selectedDept !== 'All') params.append('department', selectedDept);
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    if (availableOnly) params.append('available_only', 'true');

    fetch(`/api/library/books?${params.toString()}`)
      .then(res => res.json())
      .then(d => {
        if (d.success) setBooks(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleReserveSubmit = (e) => {
    e.preventDefault();
    setReservationSubmitting(true);
    setReservationError(null);

    const cleanUsn = reservationForm.usn.trim().toUpperCase();
    if (!cleanUsn.startsWith('2KA')) {
      setReservationError(`Invalid USN: "${cleanUsn}". SKSVMACET Lakshmeshwar VTU USN must start with "2KA" (e.g. 2KA21CS045, 2KA22EC012).`);
      setReservationSubmitting(false);
      return;
    }

    fetch('/api/library/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        book_id: selectedBook.id,
        ...reservationForm,
        usn: cleanUsn
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReservationSuccess(data);
          fetchBooks(); // Refresh book copies count
        } else {
          setReservationError(data.error || 'Failed to reserve book');
        }
      })
      .catch(err => setReservationError(err.message))
      .finally(() => setReservationSubmitting(false));
  };

  const departments = [
    'All',
    'Computer Science',
    'Artificial Intelligence',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Civil Engineering',
    'Mechanical Engineering',
    'Basic Science & Humanities'
  ];

  const digitalResources = [
    {
      name: 'IEEE ASPP & POP ALL Database',
      description: 'Access millions of IEEE journals, transactions, and conference proceedings via VTU consortium.',
      url: 'https://ieeexplore.ieee.org',
      tag: 'Scopus Indexed'
    },
    {
      name: 'Elsevier (ScienceDirect)',
      description: 'Leading peer-reviewed journal articles across engineering, computer science, and materials.',
      url: 'https://www.sciencedirect.com',
      tag: 'Peer Reviewed'
    },
    {
      name: 'Springer Nature E-Journals',
      description: 'Curated technical journals and scientific publications subscribed by SKSVMACET.',
      url: 'https://link.springer.com',
      tag: 'Springer Link'
    },
    {
      name: 'DELNET Inter-Library Network',
      description: 'Developing Library Network connecting 7,500+ institutional libraries for resource sharing.',
      url: 'https://delnet.in',
      tag: 'Inter-Library Loan'
    },
    {
      name: 'Knimbus & mLibrary App',
      description: 'Cloud-based digital platform allowing 2KA students to read digital textbooks on smartphones.',
      url: 'https://vtu.knimbus.com',
      tag: 'Mobile Library'
    },
    {
      name: 'Drillbit Plagiarism Detection',
      description: 'VTU mandatory anti-plagiarism screening portal for final year project reports and research papers.',
      url: 'https://www.drillbitplagiarism.com',
      tag: 'Research Integrity'
    }
  ];

  return (
    <div className="bg-[#faf8f5] min-h-screen">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-[#1c0f08] via-[#2b1408] to-[#140c08] text-white py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-yellow-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold uppercase tracking-wider border border-yellow-500/30">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Estd. 2003 • Koha Integrated LMS & OPAC</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-serif tracking-tight text-white">
                Prof. Venkata Subba Setti Library
              </h1>
              <p className="text-sm sm:text-base text-yellow-100/90 leading-relaxed">
                Central Learning Resource Centre of SKSVMACET Lakshmeshwar. Spanning 919.9 Sq.m with a seating capacity of 250, housing <strong>38,322+ Volumes</strong>, <strong>4,926+ Titles</strong>, and comprehensive VTU E-Resources.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-shrink-0">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-center">
                <span className="block text-2xl font-black text-yellow-400 font-mono">38,322+</span>
                <span className="text-[11px] text-yellow-100/80 uppercase font-semibold">Print Volumes</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-center">
                <span className="block text-2xl font-black text-yellow-400 font-mono">4,926+</span>
                <span className="text-[11px] text-yellow-100/80 uppercase font-semibold">Distinct Titles</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-center">
                <span className="block text-2xl font-black text-yellow-400 font-mono">250</span>
                <span className="text-[11px] text-yellow-100/80 uppercase font-semibold">Seating Capacity</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-center">
                <span className="block text-2xl font-black text-yellow-400 font-mono">11 Hrs/Day</span>
                <span className="text-[11px] text-yellow-100/80 uppercase font-semibold">9:30 AM – 8:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive OPAC Search & Catalog Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* OPAC Bar */}
        <div className="bg-white rounded-2xl shadow-md border border-stone-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-yellow-600" />
                  <span>Koha Online Public Access Catalog (OPAC)</span>
                </h2>
                <span className="text-[10px] font-mono font-bold bg-yellow-100 text-[#2b1408] px-2 py-0.5 rounded border border-yellow-300">
                  USN: 2KA Batches
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Search prescribed VTU textbooks and reference volumes. Students with USN starting with <strong className="text-[#2b1408]">2KA</strong> can reserve copies online.
              </p>
            </div>

            {/* Availability Toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-4 h-4 rounded text-yellow-600 focus:ring-yellow-500 border-stone-300"
              />
              <span>Show Available Copies Only</span>
            </label>
          </div>

          {/* Search Inputs & Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Title (e.g., Algorithms, Verilog, Concrete, Silberschatz)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            {/* Department Filter */}
            <div className="sm:col-span-4">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              >
                {departments.map((dept, idx) => (
                  <option key={idx} value={dept}>
                    {dept === 'All' ? 'All Engineering Departments' : dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div className="sm:col-span-2">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDept('All');
                  setAvailableOnly(false);
                }}
                className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-bold transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div className="mb-14">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider">
              Search Results ({books.length} Books Found)
            </h3>
            <span className="text-xs text-stone-500 font-mono">Live Koha database synchronization</span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-stone-400">Loading library database...</div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-lg transition-all p-5 flex flex-col justify-between hover:border-yellow-500/50"
                >
                  <div className="space-y-3">
                    {/* Header Tags */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-yellow-50 text-[#2b1408] border border-yellow-200">
                        {book.department}
                      </span>
                      <span className="text-[11px] font-mono text-stone-500">
                        {book.publication_year}
                      </span>
                    </div>

                    {/* Title & Author */}
                    <div>
                      <h4 className="font-bold text-base text-stone-900 leading-snug">
                        {book.title}
                      </h4>
                      <p className="text-xs text-stone-600 mt-1">
                        By <span className="font-medium text-[#2b1408]">{book.author}</span>
                      </p>
                    </div>

                    {/* Metadata & Shelf location */}
                    <div className="bg-[#faf8f5] p-2.5 rounded-lg border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">ISBN:</span>
                        <span className="font-mono text-stone-700 text-[11px]">{book.isbn}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Stack Location:</span>
                        <span className="font-semibold text-stone-800 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-yellow-600" />
                          {book.shelf_location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer & Reserve Button */}
                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase text-stone-400 font-bold block">Availability</span>
                      <span className={`text-xs font-bold ${book.copies_available > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                        {book.copies_available > 0 ? `${book.copies_available} / ${book.copies_total} Available` : 'All Copies Issued'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedBook(book);
                        setReservationSuccess(null);
                        setReservationError(null);
                      }}
                      disabled={book.copies_available <= 0}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                        book.copies_available > 0
                          ? 'bg-[#2b1408] hover:bg-[#3d1f0f] text-yellow-300 border border-yellow-500/40'
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {book.copies_available > 0 ? 'Reserve Copy (2KA)' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
              <BookOpen className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="font-medium text-sm">No books matched your search query.</p>
              <p className="text-xs text-stone-400 mt-1">Try searching with a different keyword or reset filters.</p>
            </div>
          )}
        </div>

        {/* 3. Digital E-Resources & Journals Gateway */}
        <div className="mb-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-black text-stone-900 font-serif">
              VTU Consortium E-Resources & Research Portals
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              Direct campus LAN and remote Knimbus credentials give SKSVMACET students access to leading digital research databases.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {digitalResources.map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl border border-stone-200 p-5 hover:shadow-lg transition-all group flex flex-col justify-between hover:border-yellow-500/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-yellow-50 text-[#2b1408] border border-yellow-200">
                      {res.tag}
                    </span>
                    <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-yellow-600 transition-colors" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm group-hover:text-[#4a2511] transition-colors">
                    {res.name}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 text-xs font-semibold text-[#4a2511] flex items-center gap-1 group-hover:text-yellow-700">
                  <span>Access Portal</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 4. Facilities, Rules & Working Hours */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider">Working Hours & Schedule</h4>
            </div>
            <ul className="text-xs text-stone-600 space-y-2">
              <li className="flex justify-between pb-1 border-b border-stone-100">
                <span>Working Days (Mon - Sat):</span>
                <span className="font-bold text-stone-800">9:30 AM – 8:30 PM (11 Hrs)</span>
              </li>
              <li className="flex justify-between pb-1 border-b border-stone-100">
                <span>Circulation Counter:</span>
                <span className="font-bold text-stone-800">9:30 AM – 5:30 PM</span>
              </li>
              <li className="flex justify-between pb-1 border-b border-stone-100">
                <span>Digital Library Section:</span>
                <span className="font-bold text-stone-800">9:30 AM – 8:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>During VTU Examinations:</span>
                <span className="font-bold text-amber-700">Open until 10:00 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bookmark className="w-5 h-5 text-[#4a2511]" />
              <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider">Borrowing Entitlement</h4>
            </div>
            <ul className="text-xs text-stone-600 space-y-2">
              <li>• <strong className="text-stone-900">Undergraduate (2KA) Students:</strong> 3 Books for 14 Days (renewable).</li>
              <li>• <strong className="text-stone-900">General Book Bank Scheme:</strong> 4 Core Textbooks for the entire semester.</li>
              <li>• <strong className="text-stone-900">SC/ST Book Bank Scheme:</strong> Free full syllabus textbook sets every semester.</li>
              <li>• <strong className="text-stone-900">Faculty Members:</strong> 6 Books for 30 Days.</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-yellow-600" />
              <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider">Infrastructure & Facilities</h4>
            </div>
            <ul className="text-xs text-stone-600 space-y-1.5">
              <li>✓ Spacious 919.9 Sq.m independent facility with 250 seating capacity</li>
              <li>✓ Integrated Koha Library Management Software with Web OPAC</li>
              <li>✓ 22 National Journals, 5 International Journals, 10 Magazines</li>
              <li>✓ High-speed internet terminals with Knimbus Mobile App support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. Book Reservation Modal (with strict 2KA USN validation) */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 border border-stone-200">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>

            {reservationSuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Book Reserved Successfully!</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {reservationSuccess.message}
                </p>
                <div className="p-3 bg-[#faf8f5] rounded-lg text-xs font-mono text-stone-700 space-y-1 border border-stone-200">
                  <div>Registered USN: <span className="font-bold text-[#2b1408]">{reservationSuccess.usn}</span></div>
                  <div>Stack Location: <span className="font-bold">{reservationSuccess.shelfLocation}</span></div>
                </div>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="w-full mt-4 py-2 bg-[#2b1408] hover:bg-[#3d1f0f] text-yellow-300 rounded-lg text-xs font-bold transition-colors shadow"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-yellow-100 text-[#2b1408] px-2 py-0.5 rounded border border-yellow-300">
                      Koha Circulation Request
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mt-1">
                    Reserve: {selectedBook.title}
                  </h3>
                  <p className="text-xs text-stone-500">By {selectedBook.author}</p>
                </div>

                {reservationError && (
                  <div className="mb-3 p-2.5 bg-red-50 text-red-700 rounded-lg text-xs flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{reservationError}</span>
                  </div>
                )}

                <form onSubmit={handleReserveSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patil"
                      value={reservationForm.student_name}
                      onChange={(e) => setReservationForm({ ...reservationForm, student_name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  {/* USN with 2KA validation */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">
                      VTU USN (Must start with 2KA) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="2KA21CS045"
                      value={reservationForm.usn}
                      onChange={(e) => setReservationForm({ ...reservationForm, usn: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs font-mono uppercase focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                    <span className="text-[10px] text-stone-500 mt-0.5 block">
                      Note: SKSVMACET student USNs start with <strong className="text-[#2b1408]">2KA</strong> (e.g., 2KA21CS045, 2KA22EC012, 2KA23AI008).
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Engineering Branch</label>
                      <select
                        value={reservationForm.branch}
                        onChange={(e) => setReservationForm({ ...reservationForm, branch: e.target.value })}
                        className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option>Computer Science & Engineering</option>
                        <option>CSE (Artificial Intelligence & ML)</option>
                        <option>Electronics & Communication</option>
                        <option>Electrical & Electronics</option>
                        <option>Civil Engineering</option>
                        <option>Mechanical Engineering</option>
                        <option>Information Science</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">Semester</label>
                      <select
                        value={reservationForm.semester}
                        onChange={(e) => setReservationForm({ ...reservationForm, semester: e.target.value })}
                        className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option>1st Semester</option>
                        <option>2nd Semester</option>
                        <option>3rd Semester</option>
                        <option>4th Semester</option>
                        <option>5th Semester</option>
                        <option>6th Semester</option>
                        <option>7th Semester</option>
                        <option>8th Semester</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Student Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@agadiengcollege.com"
                      value={reservationForm.email}
                      onChange={(e) => setReservationForm({ ...reservationForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBook(null)}
                      className="px-3 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reservationSubmitting}
                      className="px-4 py-2 text-xs font-bold bg-[#2b1408] hover:bg-[#3d1f0f] text-yellow-300 rounded-lg shadow border border-yellow-500/40"
                    >
                      {reservationSubmitting ? 'Reserving...' : 'Confirm Reservation'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
