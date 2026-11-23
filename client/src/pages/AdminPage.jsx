import React, { useState, useEffect } from 'react';
import {
  Calendar, Bell, PlusCircle, Trash2, CheckCircle2,
  AlertCircle, ShieldAlert, Sparkles, RefreshCw, Users, FileText
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('events');
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Form states
  const [eventForm, setEventForm] = useState({
    title: '',
    subtitle: '',
    category: 'Tech Fest',
    event_date: '',
    venue: 'Campus Auditorium, SKSVMACET Laxmeshwar',
    banner_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80',
    description: '',
    registration_link: 'https://agadiengcollege.com/register'
  });

  const [annForm, setAnnForm] = useState({
    title: '',
    category: 'Admissions',
    is_new: 1,
    is_urgent: 0,
    document_url: 'https://agadiengcollege.com/circular.pdf',
    details: ''
  });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = () => {
    setLoading(true);
    fetch('/api/inquiries')
      .then(res => res.json())
      .then(d => {
        if (d.success) setInquiries(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventForm)
    })
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setMessage({ type: 'success', text: `Event "${eventForm.title}" added to database and live banner!` });
          setEventForm({
            title: '',
            subtitle: '',
            category: 'Tech Fest',
            event_date: '',
            venue: 'Campus Auditorium, SKSVMACET Laxmeshwar',
            banner_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80',
            description: '',
            registration_link: 'https://agadiengcollege.com/register'
          });
        } else {
          setMessage({ type: 'error', text: d.error || 'Failed to create event' });
        }
      })
      .catch(err => setMessage({ type: 'error', text: err.message }));
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(annForm)
    })
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setMessage({ type: 'success', text: `Circular "${annForm.title}" published to live database!` });
          setAnnForm({
            title: '',
            category: 'Admissions',
            is_new: 1,
            is_urgent: 0,
            document_url: 'https://agadiengcollege.com/circular.pdf',
            details: ''
          });
        } else {
          setMessage({ type: 'error', text: d.error || 'Failed to publish announcement' });
        }
      })
      .catch(err => setMessage({ type: 'error', text: err.message }));
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-16">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-[#1c0f08] via-[#2b1408] to-[#140c08] text-white py-10 px-4 sm:px-6 lg:px-8 border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-2 border border-yellow-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Administrative Control Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-serif text-white">
              Database & Content Administration
            </h1>
          </div>

          <span className="text-xs font-mono bg-[#140c08] text-yellow-400 px-3 py-1.5 rounded-lg border border-yellow-500/30">
            SQLite Database Connected
          </span>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Alerts */}
        {message && (
          <div className={`p-4 rounded-xl text-xs font-semibold mb-6 flex items-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab strip */}
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-xl border border-stone-200 shadow-sm">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'events' ? 'bg-[#2b1408] text-yellow-300 shadow border border-yellow-500/40' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Add Event Banner</span>
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'announcements' ? 'bg-[#2b1408] text-yellow-300 shadow border border-yellow-500/40' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Publish Circular / Document</span>
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'inquiries' ? 'bg-[#2b1408] text-yellow-300 shadow border border-yellow-500/40' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* TAB 1: ADD EVENT BANNER */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm max-w-3xl">
            <h2 className="text-xl font-bold text-stone-900 mb-2">Publish Event to Live Banner (IIT Dharwad Style)</h2>
            <p className="text-xs text-stone-500 mb-6">Events added here will immediately appear in the homepage banner carousel.</p>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Hackathon 2026"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Subtitle / Highlight</label>
                <input
                  type="text"
                  placeholder="e.g. 48-Hour Coding Challenge with ₹2,00,000 Prizes"
                  value={eventForm.subtitle}
                  onChange={(e) => setEventForm({ ...eventForm, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                  >
                    <option>Tech Fest</option>
                    <option>Conference</option>
                    <option>Placement</option>
                    <option>Workshop</option>
                    <option>Cultural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Event Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. April 10-11, 2026"
                    value={eventForm.event_date}
                    onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Venue</label>
                  <input
                    type="text"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  value={eventForm.banner_image}
                  onChange={(e) => setEventForm({ ...eventForm, banner_image: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#2b1408] hover:bg-[#3d1f0f] text-yellow-300 rounded-lg text-xs font-bold flex items-center gap-2 border border-yellow-500/40 shadow transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-yellow-400" />
                <span>Save Event & Deploy to Live Banner</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: PUBLISH CIRCULAR */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm max-w-3xl">
            <h2 className="text-xl font-bold text-stone-900 mb-2">Publish Circular / Academic Document</h2>
            <p className="text-xs text-stone-500 mb-6">Published documents will appear in the Events & Documentation repository.</p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VTU Belagavi Revaluation Result Notification"
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={annForm.category}
                    onChange={(e) => setAnnForm({ ...annForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                  >
                    <option>Admissions</option>
                    <option>Examination</option>
                    <option>Academics</option>
                    <option>Tenders</option>
                    <option>Circulars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Document URL / PDF</label>
                  <input
                    type="text"
                    value={annForm.document_url}
                    onChange={(e) => setAnnForm({ ...annForm, document_url: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Document Details</label>
                <textarea
                  rows={3}
                  placeholder="Details and context..."
                  value={annForm.details}
                  onChange={(e) => setAnnForm({ ...annForm, details: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#2b1408] hover:bg-[#3d1f0f] text-yellow-300 rounded-lg text-xs font-bold flex items-center gap-2 border border-yellow-500/40 shadow transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-yellow-400" />
                <span>Publish Document</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-stone-200 mb-4">
              <h2 className="text-base font-bold text-stone-900">Student Admissions & Campus Inquiries</h2>
              <button
                onClick={fetchInquiries}
                className="px-3 py-1.5 bg-[#faf8f5] hover:bg-stone-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-stone-200"
              >
                <RefreshCw className="w-3 h-3 text-yellow-600" />
                <span>Refresh</span>
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-stone-400">Loading inquiries...</div>
            ) : inquiries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf8f5] text-stone-600 border-b border-stone-200 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Program / Subject</th>
                      <th className="p-3">Message</th>
                      <th className="p-3">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-[#faf8f5]">
                        <td className="p-3 font-mono font-bold text-[#2b1408]">#{inq.id}</td>
                        <td className="p-3 font-bold text-stone-900">{inq.name}</td>
                        <td className="p-3 space-y-0.5">
                          <div>{inq.email}</div>
                          {inq.phone && <div className="text-stone-500 font-mono text-[11px]">{inq.phone}</div>}
                        </td>
                        <td className="p-3">
                          <span className="bg-yellow-50 text-[#2b1408] px-2 py-0.5 rounded text-[11px] font-medium border border-yellow-200">
                            {inq.course_interested}
                          </span>
                        </td>
                        <td className="p-3 max-w-xs text-stone-600 line-clamp-2">{inq.message || '—'}</td>
                        <td className="p-3 text-stone-400 text-[11px] font-mono">
                          {new Date(inq.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-stone-400">
                No inquiries submitted yet. Submit an inquiry through the homepage or contact form!
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
