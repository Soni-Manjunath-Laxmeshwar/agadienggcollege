import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import DepartmentsListPage from './pages/DepartmentsListPage';
import DepartmentDetailPage from './pages/DepartmentDetailPage';
import LibraryPage from './pages/LibraryPage';
import EventsPage from './pages/EventsPage';
import PlacementsPage from './pages/PlacementsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/departments" element={<DepartmentsListPage />} />
            <Route path="/departments/:id" element={<DepartmentDetailPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/placements" element={<PlacementsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* Fallback to Home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
