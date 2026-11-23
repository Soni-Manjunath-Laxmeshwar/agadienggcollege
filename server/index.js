const express = require('express');
const cors = require('cors');
const path = require('path');
const { db, initDb, query, queryOne, execute, isPg } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize and seed database if local SQLite
initDb();

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static assets if client build exists in production
app.use(express.static(path.join(__dirname, '../client/dist')));

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 0. Health Check & Diagnostics
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: isPg ? 'PostgreSQL (Cloud Supabase/Neon) connected' : 'SQLite (better-sqlite3) connected',
    institution: 'S.V.M.V.V. Society SKSVMACET Lakshmeshwar',
    vtuCode: '2KA',
    cetCode: 'E167',
    comedkCode: 'E099'
  });
});

// 1. Overview & Campus Stats
app.get('/api/stats', async (req, res) => {
  try {
    const deptRow = await queryOne('SELECT count(*) as count FROM departments');
    const facultyRow = await queryOne('SELECT count(*) as count FROM faculty');
    const recruitersRow = await queryOne('SELECT count(*) as count FROM recruiters');

    const deptCount = deptRow ? deptRow.count : 0;
    const facultyCount = facultyRow ? facultyRow.count : 0;
    const recruitersCount = recruitersRow ? recruitersRow.count : 0;

    res.json({
      success: true,
      data: {
        yearsOfExcellence: '23+',
        establishedYear: 2003,
        vtuCode: '2KA',
        cetCode: 'E167',
        comedkCode: 'E099',
        principalName: 'Dr. Parashuram Baraki',
        campusAcres: '45+ Acres (Laxmeshwar)',
        totalDepartments: Number(deptCount),
        facultyMembers: `${facultyCount}+ Faculty & Researchers`,
        placementRate: '92%+',
        highestPackage: '₹8.50 LPA',
        partnerRecruiters: `${recruitersCount}+ Corporate Recruiters`,
        libraryName: 'Prof. Venkata Subba Setti Library',
        libraryVolumes: '38,322+ Volumes (4,926+ Titles)',
        accreditations: ['AICTE Approved', 'VTU Affiliated (Code: 2KA)', 'NAAC Accredited', 'Govt of Karnataka Recognized']
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Events & Banners
app.get('/api/events', async (req, res) => {
  try {
    const { banner, featured, category } = req.query;
    let queryStr = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (banner === 'true') {
      queryStr += ' AND is_banner = 1';
    }
    if (featured === 'true') {
      queryStr += ' AND is_featured = 1';
    }
    if (category) {
      queryStr += ' AND category = ?';
      params.push(category);
    }

    queryStr += ' ORDER BY id DESC';
    const events = await query(queryStr, params);
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, subtitle, category, event_date, event_time, venue, description, banner_image, is_featured, is_banner, registration_link, organizer } = req.body;
    
    if (!title || !category || !event_date) {
      return res.status(400).json({ success: false, error: 'Title, category and event_date are required.' });
    }

    const result = await execute(`
      INSERT INTO events (title, subtitle, category, event_date, event_time, venue, description, banner_image, is_featured, is_banner, registration_link, organizer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      subtitle || '',
      category,
      event_date,
      event_time || '',
      venue || 'Campus Auditorium',
      description || '',
      banner_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80',
      is_featured ? 1 : 0,
      is_banner ? 1 : 0,
      registration_link || '',
      organizer || 'SKSVMACET'
    ]);

    const created = await queryOne('SELECT * FROM events WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Announcements & Notices
app.get('/api/announcements', async (req, res) => {
  try {
    const { category, urgent } = req.query;
    let queryStr = 'SELECT * FROM announcements WHERE 1=1';
    const params = [];

    if (urgent === 'true') {
      queryStr += ' AND is_urgent = 1';
    }
    if (category) {
      queryStr += ' AND category = ?';
      params.push(category);
    }

    queryStr += ' ORDER BY id DESC';
    const announcements = await query(queryStr, params);
    res.json({ success: true, count: announcements.length, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/announcements', async (req, res) => {
  try {
    const { title, date, category, is_new, is_urgent, document_url, details } = req.body;
    if (!title || !category) {
      return res.status(400).json({ success: false, error: 'Title and category are required.' });
    }

    const result = await execute(`
      INSERT INTO announcements (title, date, category, is_new, is_urgent, document_url, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      category,
      is_new !== undefined ? (is_new ? 1 : 0) : 1,
      is_urgent ? 1 : 0,
      document_url || '',
      details || ''
    ]);

    const created = await queryOne('SELECT * FROM announcements WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Departments
app.get('/api/departments', async (req, res) => {
  try {
    const departments = await query(`
      SELECT d.*, 
        (SELECT count(*) FROM faculty WHERE department_id = d.id) as faculty_count,
        (SELECT count(*) FROM labs WHERE department_id = d.id) as lab_count
      FROM departments d
    `);

    const formatted = departments.map(d => ({
      ...d,
      curriculum_highlights: typeof d.curriculum_highlights === 'string' ? JSON.parse(d.curriculum_highlights) : (d.curriculum_highlights || [])
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Single Department with full details, faculty list, and labs
app.get('/api/departments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const department = await queryOne('SELECT * FROM departments WHERE id = ?', [id.toLowerCase()]);

    if (!department) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }

    const faculty = await query('SELECT * FROM faculty WHERE department_id = ? ORDER BY id ASC', [id.toLowerCase()]);
    const labs = await query('SELECT * FROM labs WHERE department_id = ? ORDER BY id ASC', [id.toLowerCase()]);

    res.json({
      success: true,
      data: {
        ...department,
        curriculum_highlights: typeof department.curriculum_highlights === 'string' ? JSON.parse(department.curriculum_highlights) : (department.curriculum_highlights || []),
        faculty,
        labs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Recruiters (Direct company hyperlinks)
app.get('/api/recruiters', async (req, res) => {
  try {
    const { sector, tier } = req.query;
    let queryStr = 'SELECT * FROM recruiters WHERE 1=1';
    const params = [];

    if (sector) {
      queryStr += ' AND sector = ?';
      params.push(sector);
    }
    if (tier) {
      queryStr += ' AND tier = ?';
      params.push(tier);
    }

    queryStr += ' ORDER BY id ASC';
    const recruiters = await query(queryStr, params);
    res.json({ success: true, count: recruiters.length, data: recruiters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Library Books & Resources
app.get('/api/library/books', async (req, res) => {
  try {
    const { search, department, category, available_only } = req.query;
    let queryStr = 'SELECT * FROM library_books WHERE 1=1';
    const params = [];

    if (search) {
      queryStr += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (department && department !== 'All') {
      queryStr += ' AND department = ?';
      params.push(department);
    }

    if (category && category !== 'All') {
      queryStr += ' AND category = ?';
      params.push(category);
    }

    if (available_only === 'true') {
      queryStr += ' AND copies_available > 0';
    }

    queryStr += ' ORDER BY id ASC';
    const books = await query(queryStr, params);
    res.json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Book Reservation
app.post('/api/library/reserve', async (req, res) => {
  try {
    const { book_id, student_name, usn, email, branch, semester } = req.body;

    if (!book_id || !student_name || !usn || !email) {
      return res.status(400).json({ success: false, error: 'Book ID, Student Name, USN, and Email are required.' });
    }

    const cleanUsn = usn.trim().toUpperCase();
    if (!cleanUsn.startsWith('2KA')) {
      return res.status(400).json({
        success: false,
        error: `Invalid USN (${cleanUsn}). SKSVMACET Laxmeshwar VTU USN must start with '2KA' (e.g., 2KA21CS045, 2KA22EC012).`
      });
    }

    const book = await queryOne('SELECT * FROM library_books WHERE id = ?', [book_id]);
    if (!book) {
      return res.status(404).json({ success: false, error: 'Book not found.' });
    }

    if (book.copies_available <= 0) {
      return res.status(400).json({ success: false, error: 'Currently no copies available for issue. You may be waitlisted.' });
    }

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const result = await execute(`
      INSERT INTO library_reservations (book_id, student_name, usn, email, branch, semester, request_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Approved')
    `, [book_id, student_name, cleanUsn, email, branch || 'Engineering', semester || '4th', dateStr]);

    // Decrement available copies
    await execute('UPDATE library_books SET copies_available = copies_available - 1 WHERE id = ?', [book_id]);

    res.status(201).json({
      success: true,
      message: `Reservation confirmed for "${book.title}"! Registered under USN ${cleanUsn}. Please collect your copy from Prof. Venkata Subba Setti Library Circulation Counter within 48 hours.`,
      reservationId: result.lastInsertRowid,
      shelfLocation: book.shelf_location,
      usn: cleanUsn
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Inquiries / Contact / Admission Applications
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, phone, course_interested, message } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required.' });
    }

    const dateStr = new Date().toISOString();
    const result = await execute(`
      INSERT INTO inquiries (name, email, phone, course_interested, message, created_at, status)
      VALUES (?, ?, ?, ?, ?, ?, 'New')
    `, [name, email, phone || '', course_interested || 'General Admission', message || '', dateStr]);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your inquiry has been submitted successfully. Our Admissions Cell will contact you shortly.',
      inquiryId: result.lastInsertRowid
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/inquiries', async (req, res) => {
  try {
    const inquiries = await query('SELECT * FROM inquiries ORDER BY id DESC');
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fallback for SPA routing & 404
app.use((req, res) => {
  const indexPath = path.join(__dirname, '../client/dist/index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({
      message: 'Agadi Engineering College (SKSVMACET) API Server is active.',
      endpoints: [
        '/api/health',
        '/api/stats',
        '/api/events',
        '/api/announcements',
        '/api/departments',
        '/api/departments/:id',
        '/api/recruiters',
        '/api/library/books',
        '/api/library/reserve',
        '/api/inquiries'
      ]
    });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`>>> SKSVMACET Portal Server running on http://localhost:${PORT}`);
  console.log(`>>> Serving React frontend and REST API on port ${PORT}`);
});
