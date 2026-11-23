import React, { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2,
  AlertCircle, Building2, Train, Plane, Bus
} from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    course_interested: 'General Inquiries',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setSuccess(true);
          setForm({
            name: '',
            email: '',
            phone: '',
            course_interested: 'General Inquiries',
            message: ''
          });
        } else {
          setError(d.error || 'Failed to submit form');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#1c0f08] via-[#2b1408] to-[#140c08] text-white py-14 px-4 sm:px-6 lg:px-8 border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-yellow-300 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight mt-3">
            Contact & Campus Directory
          </h1>
          <p className="mt-3 text-sm sm:text-base text-yellow-100/90 max-w-3xl">
            We are here to assist you with admissions inquiries, campus visits, academic verifications, and corporate placement partnerships.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards & Location (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Address */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 text-[#2b1408] border border-yellow-200 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Campus Address</h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Smt. Kamala and Sri Venkappa M. Agadi College of Engineering & Technology (SKSVMACET)<br />
                    Laxmeshwar - 582116, Gadag District,<br />
                    Karnataka, India
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <span><strong>Principal (Dr. Parashuram Baraki):</strong> +91 9686042385</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <span><strong>Administrative Office:</strong> +91 8378 267101 / +91 9480 382894</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <span>principal@agadiengcollege.com / info@agadiengcollege.com</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <span>Office Hours: 9:00 AM – 5:30 PM (Mon – Sat)</span>
                </div>
              </div>

              {/* Institutional Codes */}
              <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 bg-yellow-100/60 rounded-lg border border-yellow-300">
                  <span className="text-[10px] uppercase font-bold text-stone-800 block">KEA CET CODE</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">E167</span>
                </div>
                <div className="p-2 bg-[#faf8f5] rounded-lg border border-stone-200">
                  <span className="text-[10px] uppercase font-bold text-[#4a2511] block">COMED-K CODE</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">E099</span>
                </div>
              </div>
            </div>

            {/* How to Reach Laxmeshwar */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Train className="w-4 h-4 text-yellow-600" />
                <span>How to Reach SKSVMACET</span>
              </h3>
              <ul className="text-xs text-stone-600 space-y-2.5">
                <li className="flex items-start gap-2">
                  <Train className="w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0" />
                  <span><strong>By Train:</strong> Laxmeshwar Railway Station is only 1.5 km from the college campus. Gadag Junction is 42 km.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Plane className="w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0" />
                  <span><strong>By Air:</strong> Hubballi Airport (HBX) is approximately 65 km with regular flights to Bangalore, Mumbai, and Delhi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Bus className="w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0" />
                  <span><strong>By Road:</strong> Direct KSRTC and private bus services connect Laxmeshwar to Hubballi, Gadag, Haveri, and Davangere.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Interactive Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
            <h2 className="text-2xl font-black text-stone-900 font-serif">
              Send us a Message
            </h2>
            <p className="text-xs text-stone-500 mt-1 mb-6">
              Have questions regarding admissions, scholarships, hostel accommodations, or research? Fill out the form below.
            </p>

            {success ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-stone-900">Message Delivered Successfully!</h3>
                <p className="text-xs text-stone-600">
                  Thank you for contacting SKSVMACET. Our representative will respond to your inquiry promptly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-4 py-2 bg-[#2b1408] hover:bg-[#3d1f0f] text-yellow-300 rounded-lg text-xs font-bold transition-colors shadow"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2 border border-red-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Subject / Inquiry Type</label>
                    <select
                      value={form.course_interested}
                      onChange={(e) => setForm({ ...form, course_interested: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                    >
                      <option>General Inquiries</option>
                      <option>B.E. Admissions 2026-27</option>
                      <option>Hostel Accommodation</option>
                      <option>Placement & Campus Recruitment</option>
                      <option>Central Library & Books</option>
                      <option>Alumni Association</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message or inquiry here..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#faf8f5] border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-[#2b1408] hover:bg-[#3d1f0f] text-yellow-300 font-bold text-xs shadow-md inline-flex items-center gap-2 transition-all border border-yellow-500/40"
                >
                  <Send className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
