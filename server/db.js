require('dotenv').config();
const path = require('path');
const { Pool } = require('pg');

const isPg = Boolean(process.env.DATABASE_URL);
let pgPool = null;
let db = null;
const dbPath = path.join(__dirname, 'college.db');

if (isPg) {
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log('>>> Initialized Cloud PostgreSQL connection pool (Supabase/Neon)');
} else {
  const Database = require('better-sqlite3');
  db = new Database(dbPath);
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
}

async function query(sql, params = []) {
  if (isPg) {
    let i = 1;
    const pgSql = sql.replace(/\?/g, () => `$${i++}`);
    const res = await pgPool.query(pgSql, params);
    return res.rows;
  } else {
    return db.prepare(sql).all(...params);
  }
}

async function queryOne(sql, params = []) {
  if (isPg) {
    let i = 1;
    const pgSql = sql.replace(/\?/g, () => `$${i++}`);
    const res = await pgPool.query(pgSql, params);
    return res.rows[0] || null;
  } else {
    return db.prepare(sql).get(...params) || null;
  }
}

async function execute(sql, params = []) {
  if (isPg) {
    let i = 1;
    let pgSql = sql.replace(/\?/g, () => `$${i++}`);
    const isInsert = /^\s*insert\s+into/i.test(pgSql);
    if (isInsert && !/returning/i.test(pgSql)) {
      pgSql += ' RETURNING id';
    }
    const res = await pgPool.query(pgSql, params);
    const lastId = res.rows[0]?.id;
    return { lastInsertRowid: lastId, changes: res.rowCount };
  } else {
    const res = db.prepare(sql).run(...params);
    return { lastInsertRowid: res.lastInsertRowid, changes: res.changes };
  }
}

function initDb() {
  if (isPg) {
    console.log('>>> Cloud database mode active: skipping local SQLite init.');
    return;
  }
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      degree TEXT NOT NULL,
      established INTEGER,
      intake INTEGER,
      duration TEXT DEFAULT '4 Years',
      hod_name TEXT,
      hod_designation TEXT,
      hod_email TEXT,
      hod_phone TEXT,
      hod_message TEXT,
      hod_photo TEXT,
      vision TEXT,
      mission TEXT,
      banner_image TEXT,
      about_text TEXT,
      curriculum_highlights TEXT
    );

    CREATE TABLE IF NOT EXISTS faculty (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department_id TEXT NOT NULL,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      qualification TEXT,
      experience TEXT,
      email TEXT,
      phone TEXT,
      specialization TEXT,
      photo TEXT,
      FOREIGN KEY (department_id) REFERENCES departments(id)
    );

    CREATE TABLE IF NOT EXISTS labs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      equipment TEXT,
      image TEXT,
      FOREIGN KEY (department_id) REFERENCES departments(id)
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL,
      event_date TEXT NOT NULL,
      event_time TEXT,
      venue TEXT,
      description TEXT,
      banner_image TEXT,
      is_featured INTEGER DEFAULT 0,
      is_banner INTEGER DEFAULT 0,
      registration_link TEXT,
      organizer TEXT
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      is_new INTEGER DEFAULT 1,
      is_urgent INTEGER DEFAULT 0,
      document_url TEXT,
      details TEXT
    );

    CREATE TABLE IF NOT EXISTS recruiters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo_url TEXT,
      website_url TEXT NOT NULL,
      sector TEXT,
      tier TEXT,
      highest_package TEXT,
      avg_package TEXT,
      placed_count INTEGER,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS library_books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      isbn TEXT,
      department TEXT,
      category TEXT,
      copies_total INTEGER DEFAULT 5,
      copies_available INTEGER DEFAULT 5,
      shelf_location TEXT,
      cover_image TEXT,
      publication_year INTEGER
    );

    CREATE TABLE IF NOT EXISTS library_reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER NOT NULL,
      student_name TEXT NOT NULL,
      usn TEXT NOT NULL,
      email TEXT NOT NULL,
      branch TEXT NOT NULL,
      semester TEXT NOT NULL,
      request_date TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      FOREIGN KEY (book_id) REFERENCES library_books(id)
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      course_interested TEXT,
      message TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      status TEXT DEFAULT 'New'
    );
  `);

  // Migration: ensure phone column exists in faculty table
  try {
    const cols = db.prepare('PRAGMA table_info(faculty)').all().map(c => c.name);
    if (!cols.includes('phone')) {
      db.exec('ALTER TABLE faculty ADD COLUMN phone TEXT');
    }
  } catch (e) {}

  seedDataIfEmpty();
}

function seedDataIfEmpty() {
  const deptCount = db.prepare('SELECT count(*) as count FROM departments').get().count;
  if (deptCount > 0) return;

  console.log('Seeding authentic SKSVMACET Laxmeshwar data into college.db...');

  // 1. Departments (Accurate to agadiengcollege.com)
  const insertDept = db.prepare(`
    INSERT INTO departments (
      id, name, short_name, degree, established, intake, duration, 
      hod_name, hod_designation, hod_email, hod_phone, hod_message, 
      hod_photo, vision, mission, banner_image, about_text, curriculum_highlights
    ) VALUES (
      @id, @name, @short_name, @degree, @established, @intake, @duration,
      @hod_name, @hod_designation, @hod_email, @hod_phone, @hod_message,
      @hod_photo, @vision, @mission, @banner_image, @about_text, @curriculum_highlights
    )
  `);

  const departments = [
    {
      id: 'cse',
      name: 'Computer Science & Engineering',
      short_name: 'CSE',
      degree: 'B.E. in Computer Science & Engineering',
      established: 2003,
      intake: 120,
      duration: '4 Years',
      hod_name: 'Dr. Arun A. Kumbi',
      hod_designation: 'Associate Professor & Head, Department of CSE',
      hod_email: 'arun.cse@agadiengcollege.com',
      hod_phone: '+91 8095791205',
      hod_message: 'Welcome to the Department of Computer Science & Engineering at SKSVMACET, Laxmeshwar. Our department provides quality technical education to prepare rural students into global IT leaders through the C-Cube student association, coding bootcamps, and state-of-the-art computational laboratories.',
      hod_photo: 'https://agadiengcollege.com/wp-content/uploads/2024/02/Arun-K.jpg',
      vision: 'To emerge as a premier centre of excellence in Computer Science and Engineering education, fostering competent software professionals with sound ethical and societal values.',
      mission: '1. Impart quality education in core and emerging areas of computer science through outcome-based pedagogical practices.\n2. Promote innovation, problem-solving, and practical development skills addressing industry needs.\n3. Inculcate professional ethics, teamwork, and lifelong learning for social empowerment.',
      banner_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&auto=format&fit=crop&q=80',
      about_text: 'The Department of Computer Science & Engineering was established in 2003 with the inception of SKSVMACET. The department is equipped with high-speed internet, modern computer labs, VTU research facilities, and coordinates the active "C-Cube" student association.',
      curriculum_highlights: JSON.stringify([
        'Design and Analysis of Algorithms (VTU Scheme)',
        'Object-Oriented Programming with Java & Python',
        'Database Management Systems (DBMS Lab)',
        'Operating Systems & Computer Networks',
        'Artificial Intelligence & Machine Learning',
        'Cloud Computing & Web Technology Lab'
      ])
    },
    {
      id: 'aiml',
      name: 'Artificial Intelligence & Machine Learning',
      short_name: 'AI & ML',
      degree: 'B.E. in Computer Science & Engineering (AI & ML)',
      established: 2021,
      intake: 60,
      duration: '4 Years',
      hod_name: 'Dr. Parashuram Baraki',
      hod_designation: 'Principal & In-Charge Program Head, AI & ML',
      hod_email: 'principal@agadiengcollege.com',
      hod_phone: '+91 9686042385',
      hod_message: 'The AI & ML program at SKSVMACET equips future engineers with deep knowledge in neural networks, cognitive computing, automated reasoning, and data science to tackle next-generation technological revolutions.',
      hod_photo: 'https://agadiengcollege.com/wp-content/uploads/2025/12/dr-parashuram-baraki-e1767089044139.jpeg',
      vision: 'To groom technically proficient engineers capable of leading breakthroughs in artificial intelligence, deep learning, and data engineering.',
      mission: '1. Impart in-depth knowledge in machine learning algorithms, computer vision, and cognitive systems.\n2. Foster interdisciplinary research and collaboration with industry.\n3. Promote ethical, trustworthy, and responsible AI implementations for societal well-being.',
      banner_image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&auto=format&fit=crop&q=80',
      about_text: 'Established in 2021 to cater to burgeoning AI industry demands, the department provides dedicated high-performance computing labs, GPU workstations, and specialized curriculum under VTU Belagavi.',
      curriculum_highlights: JSON.stringify([
        'Mathematical Foundations for Machine Learning',
        'Deep Learning & Neural Network Architectures',
        'Natural Language Processing (NLP)',
        'Computer Vision & Image Analytics',
        'Reinforcement Learning & Robotics',
        'Data Engineering & Big Data Analytics'
      ])
    },
    {
      id: 'ece',
      name: 'Electronics & Communication Engineering',
      short_name: 'ECE',
      degree: 'B.E. in Electronics & Communication Engineering',
      established: 2003,
      intake: 120,
      duration: '4 Years',
      hod_name: 'Dr. Subhas Meti',
      hod_designation: 'Professor & Head, Department of ECE',
      hod_email: 'hod.ece@agadiengcollege.com',
      hod_phone: '+91 9449375371',
      hod_message: 'The Department of ECE at SKSVMACET focuses on building strong foundations in semiconductor electronics, embedded microcontrollers, signal processing, and communication systems through practical experimentation.',
      hod_photo: 'https://agadiengcollege.com/wp-content/uploads/2024/02/Dr.Subhash-M.jpg',
      vision: 'To be a centre of excellence in Electronics and Communication Engineering education and research, transforming rural students into globally recognized technocrats.',
      mission: '1. Provide rigorous foundation in analog and digital electronics, VLSI design, and communication systems.\n2. Foster experiential learning with modern EDA software and microcontroller labs.\n3. Encourage innovations, student projects, and societal technology solutions.',
      banner_image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80',
      about_text: 'The ECE Department features advanced laboratories including VLSI Simulation Lab, Microcontrollers Lab, DSP Lab, and Analog Communication Suites. Students actively participate in VTU design contests and regional technical symposiums.',
      curriculum_highlights: JSON.stringify([
        'Analog & Digital Circuits Design',
        'VLSI Design & Cadence EDA Simulation',
        'Microcontrollers (ARM / 8051) & Embedded Systems',
        'Digital Signal Processing (DSP Lab)',
        'Wireless & Optical Fiber Communications',
        'Internet of Things (IoT) & Sensor Networks'
      ])
    },
    {
      id: 'eee',
      name: 'Electrical & Electronics Engineering',
      short_name: 'EEE',
      degree: 'B.E. in Electrical & Electronics Engineering',
      established: 2003,
      intake: 60,
      duration: '4 Years',
      hod_name: 'Dr. R. M. Patil',
      hod_designation: 'Professor & Head, Dept. of EEE & IQAC Coordinator',
      hod_email: 'hod.eee@agadiengcollege.com',
      hod_phone: '+91 9975052933',
      hod_message: 'Electrical engineering powers modern civilization. Our department combines fundamental power engineering with renewable energy systems, electric vehicle technologies, and industrial automation.',
      hod_photo: 'https://agadiengcollege.com/wp-content/uploads/2024/02/Dr.-R-M-Patil.jpg',
      vision: 'To provide quality electrical engineering education, instilling technical expertise, research curiosity, and professional ethics.',
      mission: '1. Provide comprehensive education in electrical machines, power systems, and power electronics.\n2. Train students on clean energy, solar power installations, and electrical drives.\n3. Nurture ethical values and leadership for sustainable energy development.',
      banner_image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&auto=format&fit=crop&q=80',
      about_text: 'The Department of EEE offers heavy electrical machinery testing setups, transformer test benches, power system simulation suites, and renewable solar PV demonstrations on the SKSVMACET campus.',
      curriculum_highlights: JSON.stringify([
        'Transformers and Generator Machines',
        'Power Electronics & Converters',
        'Electric Vehicle Powertrain & Battery Systems',
        'Power Systems Analysis & Protection',
        'Control Systems Engineering',
        'Renewable Energy Integration & Smart Grids'
      ])
    },
    {
      id: 'civil',
      name: 'Civil Engineering',
      short_name: 'CV',
      degree: 'B.E. in Civil Engineering',
      established: 2009,
      intake: 60,
      duration: '4 Years',
      hod_name: 'Dr. Swapna Channagoudar',
      hod_designation: 'Associate Professor & Head, Department of Civil Engineering',
      hod_email: 'hod.civil@agadiengcollege.com',
      hod_phone: '+91 8867617379',
      hod_message: 'Civil engineering builds the backbone of society. At SKSVMACET, our civil department is known across North Karnataka for consultancy in concrete testing, geotechnical soil analysis, and structural consultancy for PWD and local municipalities.',
      hod_photo: 'https://agadiengcollege.com/wp-content/uploads/2024/01/Dr.-Swapna.jpg',
      vision: 'To produce socially committed, innovative civil engineers capable of designing sustainable and resilient infrastructure.',
      mission: '1. Deliver sound training in structural design, geotechnical engineering, and environmental analysis.\n2. Provide material testing and consultancy services to government and private infrastructure projects.\n3. Inculcate sustainable development and eco-friendly construction practices.',
      banner_image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=1600&auto=format&fit=crop&q=80',
      about_text: 'The Department of Civil Engineering offers comprehensive testing facilities including Universal Testing Machine (UTM), Total Station surveying, Geotechnical lab, and Environmental Engineering testing suites.',
      curriculum_highlights: JSON.stringify([
        'Strength of Materials & Concrete Technology Lab',
        'Structural Analysis & Design of RCC Structures',
        'Advanced Surveying with Total Station & GIS',
        'Geotechnical Engineering & Soil Mechanics',
        'Highway Engineering & Transportation',
        'Hydrology, Water Resources & Environmental Engineering'
      ])
    },
    {
      id: 'mech',
      name: 'Mechanical Engineering',
      short_name: 'ME',
      degree: 'B.E. in Mechanical Engineering',
      established: 2003,
      intake: 60,
      duration: '4 Years',
      hod_name: 'Dr. Sreenivasa R.',
      hod_designation: 'Associate Professor & Head, Department of Mechanical Engineering',
      hod_email: 'hod.mech@agadiengcollege.com',
      hod_phone: '+91 9606476159',
      hod_message: 'Mechanical engineering is the mother of all engineering disciplines. Through our active student association "TORQUE", our students participate in machine fabrication, thermal experiments, and technical project exhibitions.',
      hod_photo: 'https://agadiengcollege.com/wp-content/uploads/2026/11/sreenivasa.jpeg',
      vision: 'To produce competent mechanical engineers who excel in machine design, thermal sciences, and modern manufacturing with ethical values.',
      mission: '1. Impart quality education in mechanics, thermodynamics, and manufacturing processes.\n2. Foster hands-on skills through machine shops, CAD/CAM labs, and the TORQUE student association.\n3. Promote industrial collaborations, internships, and sustainable engineering.',
      banner_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&auto=format&fit=crop&q=80',
      about_text: 'Featuring machine shop lathe setups, foundry & forging testing, metallurgy lab, thermal engineering rigs, and computer-aided design laboratories. Home to the celebrated "TORQUE" Mechanical Engineers Association.',
      curriculum_highlights: JSON.stringify([
        'Computer Aided Machine Drawing (CAMD)',
        'Fluid Mechanics & Machinery Lab',
        'Thermodynamics & Heat Transfer',
        'Design of Machine Elements (DME)',
        'Manufacturing Processes & CNC Machining',
        'Mechatronics, Automation & Robotics'
      ])
    },
    {
      id: 'ise',
      name: 'Information Science & Engineering',
      short_name: 'ISE',
      degree: 'B.E. in Information Science & Engineering',
      established: 2007,
      intake: 60,
      duration: '4 Years',
      hod_name: 'Dr. Arunkumar Joshi',
      hod_designation: 'Associate Professor & In-Charge Head, Department of ISE',
      hod_email: 'hod.ise@agadiengcollege.com',
      hod_phone: '+91 9663579700',
      hod_message: 'The Department of Information Science & Engineering focuses on data systems, software architecture, mobile application development, and cybersecurity to meet dynamic enterprise standards.',
      hod_photo: 'https://agadiengcollege.com/wp-content/uploads/2024/02/Dr.-Arun-J.jpg',
      vision: 'To be a recognized department of excellence in information technology education and software innovation.',
      mission: '1. Impart sound technical education in information systems, networks, and data management.\n2. Encourage student participation in hackathons, coding contests, and open-source contributions.\n3. Instill professional ethics, leadership qualities, and lifelong learning.',
      banner_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80',
      about_text: 'Equipped with dedicated network laboratories, software engineering workstations, and collaborative learning spaces designed for project development.',
      curriculum_highlights: JSON.stringify([
        'Data Structures & Applications',
        'Database Management & SQL Systems',
        'Software Engineering Principles',
        'Computer Networks & Cryptography',
        'Full Stack Web Development',
        'Mobile Application Development (Android/Flutter)'
      ])
    },
    {
      id: 'basic-science',
      name: 'First Year Engineering (General Science)',
      short_name: 'FYE',
      degree: 'Foundational First-Year Basic Sciences',
      established: 2003,
      intake: 420,
      duration: '1 Year (Foundational)',
      hod_name: 'Dr. Girish Yatinahalli',
      hod_designation: 'Associate Professor (Mathematics) & Lead, First Year Engineering',
      hod_email: 'girish.math@agadiengcollege.com',
      hod_phone: '+91 9844950991',
      hod_message: 'The First Year Engineering department lays the rock-solid foundation for all aspiring engineers in engineering mathematics, physics, chemistry, professional communication, and computational thinking under VTU.',
      hod_photo: 'https://agadiengcollege.com/wp-content/uploads/2024/06/Dr.-Girish-Y.jpg',
      vision: 'To impart fundamental scientific acumen and moral values to first-year engineering students for successful academic and professional journeys.',
      mission: '1. Build strong conceptual foundation in applied mathematics, engineering physics, and chemistry.\n2. Inculcate communicative English and digital language lab proficiency.\n3. Provide dedicated mentorship to support smooth transition into engineering disciplines.',
      banner_image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1600&auto=format&fit=crop&q=80',
      about_text: 'Spacious physics and chemistry laboratories, digital language learning lab, and dedicated faculty-student mentorship framework for all incoming first-year scholars with USN starting with 2KA.',
      curriculum_highlights: JSON.stringify([
        'Engineering Mathematics - I & II (Calculus & Linear Algebra)',
        'Applied Engineering Physics & Optics Lab',
        'Engineering Chemistry & Battery Materials Lab',
        'Professional Communication & Digital Language Lab',
        'Problem Solving using C Programming',
        'Universal Human Values (UHV) & Professional Ethics'
      ])
    }
  ];

  departments.forEach(dept => insertDept.run(dept));

  // 2. Faculty (Real faculty members from SKSVMACET)
  const insertFaculty = db.prepare(`
    INSERT INTO faculty (department_id, name, designation, qualification, experience, email, phone, specialization, photo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const facultyData = [
  [
    "cse",
    "Dr. Parashuram Baraki",
    "Professor",
    "Ph.D., M.Tech",
    "20+ Years",
    "info@agadiengcollege.com",
    "+91 9686042385",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2025/12/dr-parashuram-baraki-e1767089044139.jpeg"
  ],
  [
    "cse",
    "Dr. S Poongodi",
    "Professor",
    "Ph.D., M.Tech",
    "20+ Years",
    "poongodi.cse@agadiengcollege.com",
    "+91 8695644553",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2026/07/Dr.-S-poongodi.jpeg"
  ],
  [
    "cse",
    "Dr. Arun A. Kumbi",
    "Associate Professor & HOD",
    "Ph.D., M.Tech",
    "15+ Years",
    "arun.cse@agadiengcollege.com",
    "+91 8095791205",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Arun-K.jpg"
  ],
  [
    "cse",
    "Mr. Vikram Shirol",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "hod.cse@agadiengcollege.com",
    "+91 9880728834",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Vikram-S.jpg"
  ],
  [
    "cse",
    "Mr. Shrikant Jogar",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "shrikanth.cse@agadiengcollege.com",
    "+91 9902790185",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Srikant-J.jpg"
  ],
  [
    "cse",
    "Mr. Basavaraj Muragod",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "basavaraj.cse@agadiengcollege.com",
    "+91 8884062317",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Basavaraj-M.jpg"
  ],
  [
    "cse",
    "Mrs. Rajeshwari Gamanagatti",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "rajeshwari.cse@agadiengcollege.com",
    "+91 9591316573",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Rajeshwari-G.jpg"
  ],
  [
    "cse",
    "Mr. Anil Narayanpur",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "anil.cse@agadiengcollege.com",
    "+91 8217658281",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Anil-N.jpg"
  ],
  [
    "cse",
    "Mr. Nagaraj Baradeli",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "nagaraj.cse@agadiengcollege.com",
    "+91 7996972715",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Nagaraj-B.jpg"
  ],
  [
    "cse",
    "Mr. Shrikanth Malligawad",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "shrikanthm.cse@agadiengcollege.com",
    "+91 9035528726",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2025/06/shrikanthm-cse.jpeg"
  ],
  [
    "cse",
    "Mr. Jagadish Kotagi",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "jagadish.cse@agadiengcollege.com",
    "+91 9916865653",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2026/01/jagadish-kotagi.jpeg"
  ],
  [
    "cse",
    "Mrs. Sunita Halagatti",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "sunita.cse@agadiengcollege.com",
    "+91 9902772151",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2026/02/sunita-halagatti-cse-e1777356432646.jpeg"
  ],
  [
    "cse",
    "Ms. Meghana",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "meghana.cse@agadiengcollege.com",
    "+91 8088097066",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2026/04/meghana-cse-e1777356580897.jpeg"
  ],
  [
    "cse",
    "Ms. Sahana B Sudarshana",
    "System Analyst",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2025/08/sahana-cse.jpeg"
  ],
  [
    "cse",
    "Mr. Aditya D. P.",
    "Programmer",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Aditya-P.jpg"
  ],
  [
    "cse",
    "Ms. Netravati Gokavi",
    "Programmer",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2025/06/netravati-cse.jpeg"
  ],
  [
    "cse",
    "Mrs. Pallavi S Hiremath",
    "Instructor",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2025/12/pallavi-cse.jpeg"
  ],
  [
    "cse",
    "Mr. Anilkumar S H",
    "Instructor (Deputed for Higher Studies)",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2025/06/anil-cse.jpeg"
  ],
  [
    "cse",
    "Mr. Vinay Hemagirimath",
    "Mechanic",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Computer Science, Algorithms & Software Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Vinay-H.jpg"
  ],
  [
    "civil",
    "Dr. Swapna Channagoudar",
    "HOD",
    "Ph.D., M.Tech",
    "6+ Years",
    "hod.civil@agadiengcollege.com",
    "+91 8867617379",
    "Structural Design, Geotechnical & Environmental Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/01/Dr.-Swapna.jpg"
  ],
  [
    "civil",
    "Dr. Shivarajkumar Goudar",
    "Associate Professor",
    "Ph.D., M.Tech",
    "15+ Years",
    "shivaraj.civil@agadiengcollege.com",
    "+91 8123679168",
    "Structural Design, Geotechnical & Environmental Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/01/shivarajkumar.jpg"
  ],
  [
    "civil",
    "Mr. Arun Tandi",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "arun.civil@agadiengcollege.com",
    "+91 9591655705",
    "Structural Design, Geotechnical & Environmental Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/01/arun-tandi.jpg"
  ],
  [
    "civil",
    "Mr. Malatesh Suranagi",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "maltesh.civil@agadiengcollege.com",
    "+91 9743676504",
    "Structural Design, Geotechnical & Environmental Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/01/maltesh-surangi.jpg"
  ],
  [
    "civil",
    "Mr. Laxman Patil",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "laxman.civil@agadiengcollege.com",
    "+91 9591655705",
    "Structural Design, Geotechnical & Environmental Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/01/laxman-patil.jpg"
  ],
  [
    "civil",
    "Mr. Rajendra Shetra",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "rajendra.civil@agadiengcollege.com",
    "+91 8867617379",
    "Structural Design, Geotechnical & Environmental Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/01/rajendra.jpg"
  ],
  [
    "civil",
    "Mr. Manjunath Malavalli",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "manjunath.civil@agadiengcollege.com",
    "+91 8970621530",
    "Structural Design, Geotechnical & Environmental Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2025/06/manjunath-civil.jpeg"
  ],
  [
    "civil",
    "Mr. Kiran",
    "Foreman",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Structural Design, Geotechnical & Environmental Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/01/kiran.jpg"
  ],
  [
    "civil",
    "Mr. Sandeep",
    "Instructor",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Structural Design, Geotechnical & Environmental Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/01/sandeep.jpg"
  ],
  [
    "civil",
    "Mr. Sanjeev",
    "Instructor",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Structural Design, Geotechnical & Environmental Engineering",
    "https://agadiengcollege.com/wp-content/uploads/2024/01/sanjeev.jpg"
  ],
  [
    "eee",
    "Dr. R. M. Patil",
    "Professor & HOD",
    "Ph.D., M.Tech",
    "20+ Years",
    "hod.eee@agadiengcollege.com",
    "+91 9975052933",
    "Power Systems, Electrical Drives & Renewable Energy",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Dr.-R-M-Patil.jpg"
  ],
  [
    "eee",
    "Mr. Iranna Makarabbi",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "iranna.eee@agadiengcollege.com",
    "+91 8867701426",
    "Power Systems, Electrical Drives & Renewable Energy",
    "https://agadiengcollege.com/wp-content/uploads/2024/07/iranna-makarabbi.png"
  ],
  [
    "eee",
    "Mr. Manjunath Hombal",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "manjunath.eee@agadiengcollege.com",
    "+91 9886178019",
    "Power Systems, Electrical Drives & Renewable Energy",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Manjunath-H.jpg"
  ],
  [
    "eee",
    "Mrs. Pratima Kadekar",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "pratima.eee@agadiengcollege.com",
    "+91 9449751452",
    "Power Systems, Electrical Drives & Renewable Energy",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Prathima-K.jpg"
  ],
  [
    "eee",
    "Mrs. Shridevi Ganiger",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "shridevig.eee@agadiengcollege.com",
    "+91 8105572501",
    "Power Systems, Electrical Drives & Renewable Energy",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Shridevi-G.jpg"
  ],
  [
    "eee",
    "Mr. Shivalingappa D R",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "shivalingappa.eee@agadiengcollege.com",
    "+91 9663338639",
    "Power Systems, Electrical Drives & Renewable Energy",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Shivalingappa.jpeg"
  ],
  [
    "eee",
    "Mr. Keshav Negalur",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "keshav.eee@agadiengcollege.com",
    "+91 9886644507",
    "Power Systems, Electrical Drives & Renewable Energy",
    "https://agadiengcollege.com/wp-content/uploads/2025/06/keshav-eee.jpeg"
  ],
  [
    "eee",
    "Mrs. Manjula Rathod",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "manjula.eee@agadiengcollege.com",
    "+91 9686324386",
    "Power Systems, Electrical Drives & Renewable Energy",
    "https://agadiengcollege.com/wp-content/uploads/2025/09/manjula-rathod.jpeg"
  ],
  [
    "eee",
    "Mrs. Shivaleela S Konnur",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "shivaleela.eee@agadiengcollege.com",
    "+91 8971869462",
    "Power Systems, Electrical Drives & Renewable Energy",
    "https://agadiengcollege.com/wp-content/uploads/2026/09/mrs-shivaleela.jpeg"
  ],
  [
    "eee",
    "Mr. Sanjeevkumar Kulkarni",
    "Foreman",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Power Systems, Electrical Drives & Renewable Energy",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Sanjeew-k.jpg"
  ],
  [
    "eee",
    "Mr. Vinayak S K",
    "Instructor",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Power Systems, Electrical Drives & Renewable Energy",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Vinayk.jpg"
  ],
  [
    "ece",
    "Dr. Santosh Bujari",
    "HOD",
    "Ph.D., M.Tech",
    "6+ Years",
    "hod.ece@agadiengcollege.com",
    "+91 9449375371",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Dr.-Suresh-B.jpg"
  ],
  [
    "ece",
    "Dr. Subhas Meti",
    "Professor",
    "Ph.D., M.Tech",
    "20+ Years",
    "subhash.ece@agadiengcollege.com",
    "+91 9845675725",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Dr.Subhash-M.jpg"
  ],
  [
    "ece",
    "Dr. Shashidhar P. K.",
    "Associate Professor",
    "Ph.D., M.Tech",
    "15+ Years",
    "shashidhar.ece@agadiengcollege.com",
    "+91 9742445955",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Shashidar-P-K.jpg"
  ],
  [
    "ece",
    "Mr. Kiran Kotin",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "kiran.ece@agadiengcollege.com",
    "+91 9986943239",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Kiran-k.jpg"
  ],
  [
    "ece",
    "Mr. Basavaraj Soratur",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "basavaraj.ece@agadiengcollege.com",
    "+91 9742708070",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Basavaraj-S.jpg"
  ],
  [
    "ece",
    "Mr. Manjunathraddi Bentur",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "manjunath.ece@agadiengcollege.com",
    "+91 8867707197",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Manjunathraddi-B.jpg"
  ],
  [
    "ece",
    "Mr. Amarappa Pagi",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "amarappa.ece@agadiengcollege.com",
    "+91 9663338639",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Amarappa-P.jpg"
  ],
  [
    "ece",
    "Mr. Niranjan Shettar",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "niranjan.ece@agadiengcollege.com",
    "+91 9900997978",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2025/06/niranjan-ece-e1750922796759.jpeg"
  ],
  [
    "ece",
    "Mr. Arunakumar S B",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "arunakumar.ece@agadiengcollege.com",
    "+91 9448121772",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2025/06/arunakumar-ece.jpeg"
  ],
  [
    "ece",
    "Mr. Chandramouli Joshi",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "chndramouli.ece@agadiengcollege.com",
    "+91 9739173237",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2025/06/chandramouli-ece-2.jpeg"
  ],
  [
    "ece",
    "Mrs. Anupama Hongal",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "anupama.ece@agadiengcollege.com",
    "+91 9739173237",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2025/09/Anupama-ECE.jpeg"
  ],
  [
    "ece",
    "Mr. Ramesh Ashtekar",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "ramesh.ece@agadiengcollege.com",
    "+91 9738929769",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2026/10/ramesh-ashtekar.jpeg"
  ],
  [
    "ece",
    "Mr. Kiran Naganur",
    "Foreman",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2026/05/resized_278x289.jpg"
  ],
  [
    "ece",
    "Mr. Girish Harti",
    "Instructor",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Girish-H.jpg"
  ],
  [
    "ece",
    "Mr. Mahantesh M",
    "Instructor (Deputed for Higher Studies)",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Mahantesh-M.jpg"
  ],
  [
    "ece",
    "Mr. Shridhar Badiger",
    "Instructor (Deputed for Higher Studies)",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2025/09/shridhar-badiger.jpeg"
  ],
  [
    "ece",
    "Ms. Soundarya Hiremath",
    "Instructor (Deputed for Higher Studies)",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "VLSI Design, Embedded Systems & Signal Processing",
    "https://agadiengcollege.com/wp-content/uploads/2026/11/soundarya-hiremath.jpeg"
  ],
  [
    "ise",
    "Dr. Arunkumar Joshi",
    "Assoc. Professor & HOD",
    "Ph.D., M.Tech",
    "20+ Years",
    "hod.ise@agadiengcollege.com",
    "+91 9663579700",
    "Information Systems, Cyber Security & Web Architecture",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Dr.-Arun-J.jpg"
  ],
  [
    "ise",
    "Mrs. Pratima Mahapurush",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "pratima.ise@agadiengcollege.com",
    "+91 9845789768",
    "Information Systems, Cyber Security & Web Architecture",
    "https://agadiengcollege.com/wp-content/uploads/2025/09/Prathima-ECE.jpeg"
  ],
  [
    "ise",
    "Mr. Shambulingappa H. S.",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "shambulingappa.ise@agadiengcollege.com",
    "+91 9686634981",
    "Information Systems, Cyber Security & Web Architecture",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Shambulingappa.jpg"
  ],
  [
    "ise",
    "Mr. Ravikumar Chawhan",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "ravikumarc.ise@agadiengcollege.com",
    "+91 9900997978",
    "Information Systems, Cyber Security & Web Architecture",
    "https://agadiengcollege.com/wp-content/uploads/2025/12/ravikumar-chavanise.jpeg"
  ],
  [
    "ise",
    "Mrs. Ashwini Gouripur",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "ashwini.ise@agadiengcollege.com",
    "+91 7022953946",
    "Information Systems, Cyber Security & Web Architecture",
    "https://agadiengcollege.com/wp-content/uploads/2025/09/Ashwini-ISE.jpeg"
  ],
  [
    "ise",
    "Mr. Hareesha Harogoppa",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "harisha.ise@agadiengcollege.com",
    "+91 9743616694",
    "Information Systems, Cyber Security & Web Architecture",
    "https://agadiengcollege.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-22-at-5.26.19-PM.jpeg"
  ],
  [
    "ise",
    "Mr. Sangamesh Ulavappanavar",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "sangamesh.ise@agadiengcollege.com",
    "+91 9740785038",
    "Information Systems, Cyber Security & Web Architecture",
    "https://agadiengcollege.com/wp-content/uploads/2025/12/sangamesh-ise.jpg"
  ],
  [
    "ise",
    "Mr. Suresh Aralelimath",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "suresh.ise@agadiengcollege.com",
    "+91 8867678886",
    "Information Systems, Cyber Security & Web Architecture",
    "https://agadiengcollege.com/wp-content/uploads/2026/04/suresh-ise-1-e1777355188594.jpeg"
  ],
  [
    "ise",
    "Ms. Jyothi Sankanagoudar",
    "Foreman",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Information Systems, Cyber Security & Web Architecture",
    "https://agadiengcollege.com/wp-content/uploads/2025/09/Jyothi-ISE.jpeg"
  ],
  [
    "ise",
    "Mrs. Rashmi R Kammar",
    "Instructor",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Information Systems, Cyber Security & Web Architecture",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Rashmi.jpg"
  ],
  [
    "ise",
    "Mr. Shashidhar L N",
    "Instructor",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Information Systems, Cyber Security & Web Architecture",
    "https://agadiengcollege.com/wp-content/uploads/2025/06/shashidhar-cse.jpeg"
  ],
  [
    "ise",
    "Mr. Altaf Gokavi",
    "Mechanic",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Information Systems, Cyber Security & Web Architecture",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Altaf-G.jpg"
  ],
  [
    "mech",
    "Dr. Sreenivasa R",
    "Associate Professor & HOD",
    "Ph.D., M.Tech",
    "15+ Years",
    "hod.mech@agadiengcollege.com",
    "+91 7760382464",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2026/11/sreenivasa.jpeg"
  ],
  [
    "mech",
    "Dr. Kallesh S S",
    "Associate Professor",
    "Ph.D., M.Tech",
    "15+ Years",
    "kallesh.mech@agadiengcollege.com",
    "+91 9902743739",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2026/11/kallesh.jpeg"
  ],
  [
    "mech",
    "Mr. Somappa Navalagund",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "somappa.mech@agadiengcollege.com",
    "+91 9900173851",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2026/11/somappa.jpeg"
  ],
  [
    "mech",
    "Mr. Mukunda Dabair",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "mukunda.mech@agadiengcollege.com",
    "+91 9945709175",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2026/11/mukund.jpeg"
  ],
  [
    "mech",
    "Mr. Ravi Duragannavar",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "ravi.mech@agadiengcollege.com",
    "+91 8904504543",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2026/11/ravi-d.jpeg"
  ],
  [
    "mech",
    "Mr. Satishkumar L",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "satishkumar.mech@agadiengcollege.com",
    "+91 8722742496",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2025/06/satishkumar-mech.jpeg"
  ],
  [
    "mech",
    "Mr. Girish S Halli",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "girish.mech@agadiengcollege.com",
    "+91 9945564813",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-10-at-11.01.12-AM.jpeg"
  ],
  [
    "mech",
    "Mr. Naveenkumar P",
    "Assistant Professor",
    "M.Tech",
    "8+ Years",
    "naveenkumar.mech@agadiengcollege.com",
    "+91 9110675451",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2026/11/naveen-kumar-p.jpeg"
  ],
  [
    "mech",
    "Mr. Kademani Rakesh",
    "Foreman",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2024/10/kademani-rakesh1.png"
  ],
  [
    "mech",
    "Mr. Krishna Jamakhandi",
    "Assistant Instructor",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Jamakandi.jpg"
  ],
  [
    "mech",
    "Mr. M. I. Annigeri",
    "Assistant Instructor",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Anigeri.jpg"
  ],
  [
    "mech",
    "Mr. Praveen Bhuvanagoudar",
    "Assistant Instructor",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/praveen.jpg"
  ],
  [
    "mech",
    "Mr. Manjunath Umachagi",
    "Mechanic",
    "M.Tech",
    "6+ Years",
    "info@agadiengcollege.com",
    "+91 9448120344",
    "Thermal Engineering, Machine Design & Manufacturing",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Manjunath.jpg"
  ],
  [
    "basic-science",
    "Dr. Girish Yatinahalli",
    "Associate Professor",
    "Ph.D., M.Sc",
    "15+ Years",
    "girish.math@agadiengcollege.com",
    "+91 9844950991",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2024/06/Dr.-Girish-Y.jpg"
  ],
  [
    "basic-science",
    "Dr. Mahesh Akki",
    "Assistant Professor",
    "Ph.D., M.Sc",
    "8+ Years",
    "mahesh.gs@agadiengcollege.com",
    "+91 8867188085",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-10-at-10.40.49-AM.jpeg"
  ],
  [
    "basic-science",
    "Mr. S. N. Gondkar",
    "Assistant Professor",
    "M.Sc",
    "8+ Years",
    "shreenivas.phys@agadiengcollege.com",
    "+91 7676694684",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2024/06/Gondkar.jpg"
  ],
  [
    "basic-science",
    "Mr. D. B. Badigannavar",
    "Assistant Professor",
    "M.Sc",
    "8+ Years",
    "dayanand.phys@agadiengcollege.com",
    "+91 7829756069",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2024/06/Dyananad-B.jpg"
  ],
  [
    "basic-science",
    "Mr. Somashekar C. K.",
    "Assistant Professor",
    "M.Sc",
    "8+ Years",
    "somashekar.math@agadiengcollege.com",
    "+91 9449121196",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2024/06/s-c-kerimani.jpg"
  ],
  [
    "basic-science",
    "Mr. J. Yallappa",
    "Assistant Professor",
    "M.Sc",
    "8+ Years",
    "yallappa.gs@agadiengcollege.com",
    "+91 9844725017",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2024/06/Yallappa.jpg"
  ],
  [
    "basic-science",
    "Mr. Shanmukh G.",
    "Assistant Professor",
    "M.Sc",
    "8+ Years",
    "hanmukh.gs@agadiengcollege.com",
    "+91 8951162100",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2024/06/Shanmukha-G.jpg"
  ],
  [
    "basic-science",
    "Ms. Savitri Wali",
    "Assistant Professor",
    "M.Sc",
    "8+ Years",
    "savitri.math@agadiengcollege.com",
    "+91 8748941836",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2024/06/Savitri.jpg"
  ],
  [
    "basic-science",
    "Ms. Geeta Byati",
    "Assistant Professor",
    "M.Sc",
    "8+ Years",
    "geeta.math@agadiengcollege.com",
    "+91 9449121196",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2024/06/Geeta.jpg"
  ],
  [
    "basic-science",
    "Ms. Renuka Kadiwal",
    "Assistant Professor",
    "M.Sc",
    "8+ Years",
    "renuka.math@agadiengcollege.com",
    "+91 9448120344",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2026/11/renuka.jpeg"
  ],
  [
    "basic-science",
    "Mr. Ramesh Koppad",
    "Sr. Instructor",
    "M.Sc",
    "6+ Years",
    "firstyear@agadiengcollege.com",
    "+91 9448120344",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2024/06/RK.jpg"
  ],
  [
    "basic-science",
    "Mr. Prashant Lingashetti",
    "Instructor",
    "M.Sc",
    "6+ Years",
    "firstyear@agadiengcollege.com",
    "+91 9448120344",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2024/06/Prashant.jpg"
  ],
  [
    "basic-science",
    "Mr. Sarvesh Sulakhe",
    "Instructor",
    "M.Sc",
    "6+ Years",
    "firstyear@agadiengcollege.com",
    "+91 9448120344",
    "Applied Mathematics, Physics, Chemistry & Humanities",
    "https://agadiengcollege.com/wp-content/uploads/2025/09/sarvesh-sulakhe.jpeg"
  ],
  [
    "aiml",
    "Dr. Parashuram Baraki",
    "Principal & Program Head",
    "Ph.D., M.Tech",
    "24+ Years",
    "principal@agadiengcollege.com",
    "+91 9686042385",
    "Computer Vision, Pattern Recognition & Deep Learning",
    "https://agadiengcollege.com/wp-content/uploads/2025/12/dr-parashuram-baraki-e1767089044139.jpeg"
  ],
  [
    "aiml",
    "Dr. S Poongodi",
    "Professor",
    "Ph.D., M.Tech",
    "18+ Years",
    "poongodi.cse@agadiengcollege.com",
    "+91 8695644553",
    "Neural Networks, Deep Learning & Predictive AI",
    "https://agadiengcollege.com/wp-content/uploads/2026/07/Dr.-S-poongodi.jpeg"
  ],
  [
    "aiml",
    "Mr. Shrikant Jogar",
    "Assistant Professor",
    "M.Tech",
    "12+ Years",
    "shrikanth.cse@agadiengcollege.com",
    "+91 9902790185",
    "Data Science, Machine Learning Architectures",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Srikant-J.jpg"
  ],
  [
    "aiml",
    "Mr. Basavaraj Muragod",
    "Assistant Professor",
    "M.Tech",
    "9+ Years",
    "basavaraj.cse@agadiengcollege.com",
    "+91 8884062317",
    "Natural Language Processing, Full Stack AI",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Basavaraj-M.jpg"
  ],
  [
    "aiml",
    "Mrs. Rajeshwari Gamanagatti",
    "Assistant Professor",
    "M.Tech",
    "14+ Years",
    "rajeshwari.cse@agadiengcollege.com",
    "+91 9591316573",
    "Cognitive Computing, Machine Learning",
    "https://agadiengcollege.com/wp-content/uploads/2024/02/Rajeshwari-G.jpg"
  ]
];

  facultyData.forEach(row => insertFaculty.run(...row));

  // 3. Laboratories
  const insertLab = db.prepare(`
    INSERT INTO labs (department_id, name, description, equipment, image)
    VALUES (?, ?, ?, ?, ?)
  `);

  const labsData = [
    ['cse', 'C-Cube Computing & Programming Lab', 'Central computational laboratory equipped for Data Structures, Java, Python, and C programming practicals for 2KA engineering students.', '60x High-Speed Dell Optiplex PCs, Ubuntu & Windows, 1 Gbps LAN, Eclipse, VS Code', 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80'],
    ['cse', 'DBMS & Web Technologies Lab', 'Dedicated database management systems laboratory for relational SQL design, full stack development, and VTU practical exams.', 'Intel Core i5 systems, MySQL, Oracle 11g, Node.js development suites', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80'],
    ['aiml', 'Artificial Intelligence & Deep Learning Lab', 'GPU-accelerated lab for neural network modeling, computer vision, and cognitive data engineering.', 'Multi-core Workstations, NVIDIA RTX GPUs, TensorFlow, PyTorch, Jupyter Lab', 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&auto=format&fit=crop&q=80'],
    ['ece', 'VLSI & Embedded Systems Lab', 'Electronics design automation and microcontrollers facility for digital integrated circuit design and ARM programming.', 'Cadence EDA Suite, Xilinx Vivado, Keil MicroVision, ARM Cortex development boards', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'],
    ['eee', 'Electrical Machines & Power Systems Lab', 'Comprehensive laboratory for analyzing AC/DC motors, alternators, transformers, and industrial motor drives.', 'AC/DC Motor-Generator sets, 3-Phase Transformers, Loading Rheostats, Digital Power Meters', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80'],
    ['civil', 'Material Testing & Geotechnical Testing Lab', 'Certified testing center providing concrete compressive testing, tensile testing, and soil mechanics consultancy for PWD projects in Gadag district.', '2000 kN Universal Testing Machine (UTM), Compression Testing Machine, Triaxial Shear Apparatus', 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&auto=format&fit=crop&q=80'],
    ['mech', 'Machine Shop & Fluid Machinery Lab', 'Comprehensive manufacturing workshop containing center lathes, shaping machines, milling, and hydraulic turbine test rigs.', 'Heavy Duty Center Lathes, Shaper & Milling Machines, Pelton Wheel, Francis Turbine', 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80']
  ];

  labsData.forEach(row => insertLab.run(...row));

  // 4. Events (Real institutional events at SKSVMACET)
  const insertEvent = db.prepare(`
    INSERT INTO events (
      title, subtitle, category, event_date, event_time, venue, 
      description, banner_image, is_featured, is_banner, registration_link, organizer
    ) VALUES (
      @title, @subtitle, @category, @event_date, @event_time, @venue,
      @description, @banner_image, @is_featured, @is_banner, @registration_link, @organizer
    )
  `);

  const eventsData = [
    {
      title: 'MELANZE: Annual National Techno-Cultural Fest',
      subtitle: 'Flagship Techno-Cultural Festival: Project Exhibition, Coding Hackathon, Robotics & Cultural Stages',
      category: 'Tech Fest',
      event_date: 'March 27-28, 2026',
      event_time: '09:30 AM - 08:30 PM',
      venue: 'SKSVMACET Main Campus Grounds, Open Air Auditorium & Central Labs, Lakshmeshwar',
      description: 'Melanze is the premier annual national-level techno-cultural festival of SKSVMACET Lakshmeshwar. Bringing together engineering talent from institutions across Karnataka for hardware and software project exhibitions, C-Cube 24-hour coding sprints, robotics arena, bridge-making contests, paper presentations, gaming, and vibrant cultural music and dance nights.',
      banner_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=80',
      is_featured: 1,
      is_banner: 1,
      registration_link: 'https://agadiengcollege.com/melanze',
      organizer: 'SKSVMACET Student Council & Cultural Committee'
    },
    {
      title: 'ICMRTET: International Conference on Multi-disciplinary Research Trends in Engineering and Technology',
      subtitle: 'Peer-Reviewed Research Paper Presentations, Keynotes by Eminent Scientists & Industry Experts',
      category: 'Conference',
      event_date: 'April 24-25, 2026',
      event_time: '10:00 AM - 05:00 PM',
      venue: 'Sir M. Visvesvaraya Seminar Hall Complex, SKSVMACET Lakshmeshwar',
      description: 'SKSVMACET flagship international academic conference connecting researchers, academicians, and industry pioneers to present breakthrough findings across Computer Science, Artificial Intelligence, Electronics, Mechanical, and Civil Engineering.',
      banner_image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&auto=format&fit=crop&q=80',
      is_featured: 1,
      is_banner: 1,
      registration_link: 'https://agadiengcollege.com/icmrtet',
      organizer: 'SKSVMACET Research & Development (R&D) Cell'
    },
    {
      title: 'TORQUE: Mechanical Engineering Student Convention & Workshop',
      subtitle: 'Industrial Innovation, Automotive CAD Design & 3D Prototyping',
      category: 'Workshop',
      event_date: 'May 08, 2026',
      event_time: '10:00 AM - 04:30 PM',
      venue: 'Mechanical Engineering Department Block, SKSVMACET Lakshmeshwar',
      description: 'Organized by the TORQUE Mechanical Association under Dr. Sreenivasa R. Features hands-on masterclasses in 3D CAD modeling, CNC machining demonstrations, industrial automation, and student prototype displays.',
      banner_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1600&auto=format&fit=crop&q=80',
      is_featured: 1,
      is_banner: 0,
      registration_link: 'https://agadiengcollege.com/torque',
      organizer: 'TORQUE Mechanical Association'
    },
    {
      title: 'Annual Mega Pool Campus Recruitment Drive',
      subtitle: 'Top MNCs & Core Engineering Companies Hiring Final & Pre-Final Year Engineers',
      category: 'Placement',
      event_date: 'May 18-19, 2026',
      event_time: '08:30 AM Onwards',
      venue: 'Campus Placement & Training Centre, SKSVMACET Lakshmeshwar',
      description: 'Coordinated by TPO Cell leads Mrs. Rajeshwari Gamanagatti, Dr. Shivarajkumar Goudar, Mr. Manjunathraddi Bentur, and Mr. Keshav Negalur. On-campus and pool drives with Infosys, Wipro, TCS, Cognizant, Xoriant, and Powercon.',
      banner_image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&auto=format&fit=crop&q=80',
      is_featured: 0,
      is_banner: 0,
      registration_link: 'https://agadiengcollege.com/placements',
      organizer: 'Training & Placement Cell (TPO)'
    },
    {
      title: 'Annual Special Rural Community NSS Camp',
      subtitle: 'Village Health Awareness, Tree Plantation, Clean Drinking Water & Watershed Campaigns',
      category: 'Cultural',
      event_date: 'June 02-08, 2026',
      event_time: '7-Day Residential Camp',
      venue: 'Adopted Rural Panchayats, Lakshmeshwar Taluk, Gadag District',
      description: 'Organized by the SKSVMACET National Service Scheme (NSS) Unit under the Ministry of Youth Affairs and Sports. Engineering student volunteers engage in village health awareness, tree plantation drives, computer literacy for school students, and watershed development in Gadag district.',
      banner_image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&auto=format&fit=crop&q=80',
      is_featured: 0,
      is_banner: 0,
      registration_link: 'https://agadiengcollege.com/nss',
      organizer: 'SKSVMACET National Service Scheme (NSS)'
    }
  ];

  eventsData.forEach(ev => insertEvent.run(ev));

  // 5. Announcements / Notices (IIT Dharwad style for 2KA students)
  const insertAnnouncement = db.prepare(`
    INSERT INTO announcements (title, date, category, is_new, is_urgent, document_url, details)
    VALUES (@title, @date, @category, @is_new, @is_urgent, @document_url, @details)
  `);

  const announcementsData = [
    {
      title: 'Our Honorable Chairman Sri Harshavardhan V. Agadi Has Announced Free Engineering Education for Children of Fallen Soldiers at Our Institute',
      date: 'March 10, 2026',
      category: 'Welfare & Scholarships',
      is_new: 1,
      is_urgent: 1,
      document_url: 'https://agadiengcollege.com',
      details: 'In a noble philanthropic tribute to the brave martyrs of the Indian Armed Forces, our Honorable Chairman Sri Harshavardhan V. Agadi has announced 100% free Engineering Education at SKSVMACET Lakshmeshwar for the children of fallen soldiers. Full tuition waiver and complete institutional support are provided across all B.E. programs. Eligible candidates can contact the Chairman’s Office or Principal desk directly.'
    },
    {
      title: '50% KCET Fee Concession Scheme & ₹20 Lakhs Annual Management Scholarships for Meritorious Students',
      date: 'March 08, 2026',
      category: 'Scholarships',
      is_new: 1,
      is_urgent: 0,
      document_url: 'https://agadiengcollege.com',
      details: 'S.V.M.V.V. Society announces 50% CET tuition fee concession for students securing KCET rank under 30,000 or 95%+ in II PUC, alongside ₹20 Lakhs in annual scholarships distributed to deserving rural students.'
    },
    {
      title: 'B.E. Admissions 2026-27 Open at SKSVMACET: KCET Code E167 / COMED-K & Management Quota',
      date: 'March 07, 2026',
      category: 'Admissions',
      is_new: 1,
      is_urgent: 1,
      document_url: 'https://agadiengcollege.com/admissions',
      details: 'Applications are invited for admissions into B.E. programs (CSE, AI&ML, ECE, EEE, Civil, Mechanical, ISE) for academic year 2026-27. Contact the Principal desk at +91 9686042385 or Admissions helpline +91 8378 267101.'
    },
    {
      title: 'VTU Belagavi Notification: Submission of Examination Application Forms for USN 2KA Batches',
      date: 'March 05, 2026',
      category: 'Examination',
      is_new: 1,
      is_urgent: 1,
      document_url: 'https://vtu.ac.in',
      details: 'All students with USN starting with 2KA (2KA20, 2KA21, 2KA22, 2KA23 batches) must submit odd/even semester examination forms through the VTU college examination coordinator before the deadline.'
    },
    {
      title: 'Prof. Venkata Subba Setti Library: Return & Re-issue of Odd Semester Book Bank Volumes',
      date: 'March 02, 2026',
      category: 'Academics',
      is_new: 1,
      is_urgent: 0,
      document_url: '/library',
      details: 'Students are requested to return Book Bank books issued for the semester to the circulation counter between 9:30 AM to 5:30 PM. Renewal for even semester begins next week via Koha OPAC.'
    },
    {
      title: 'TPO Notice: Soft Skills & Aptitude Bootcamp for 6th Semester (USN 2KA23 Batch)',
      date: 'February 27, 2026',
      category: 'Circulars',
      is_new: 0,
      is_urgent: 0,
      document_url: '/placements',
      details: 'Mandatory campus recruitment training session conducted by Training & Placement Cell coordinators starting Monday at the Main Auditorium.'
    },
    {
      title: 'SVMVV Society SKSVMACET Merit Scholarships Disbursement for Rural Students',
      date: 'February 20, 2026',
      category: 'Admissions',
      is_new: 0,
      is_urgent: 0,
      document_url: 'https://agadiengcollege.com',
      details: 'SVMVV Society announces institutional fee concessions and merit scholarships for deserving students from rural Karnataka.'
    }
  ];

  announcementsData.forEach(ann => insertAnnouncement.run(ann));

  // 6. Recruiters (Real hiring partners of SKSVMACET with direct URLs)
  const insertRecruiter = db.prepare(`
    INSERT INTO recruiters (name, logo_url, website_url, sector, tier, highest_package, avg_package, placed_count, description)
    VALUES (@name, @logo_url, @website_url, @sector, @tier, @highest_package, @avg_package, @placed_count, @description)
  `);

  const recruitersData = [
    {
      name: 'Infosys Limited',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
      website_url: 'https://www.infosys.com',
      sector: 'IT Services & Software',
      tier: 'Tier 1 Global',
      highest_package: '₹6.5 LPA (Specialist Programmer)',
      avg_package: '₹3.8 LPA',
      placed_count: 38,
      description: 'Global leader in next-generation digital services and consulting; regular campus recruiter at SKSVMACET.'
    },
    {
      name: 'Tata Consultancy Services (TCS)',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
      website_url: 'https://www.tcs.com',
      sector: 'IT & Digital Consulting',
      tier: 'Tier 1 Global',
      highest_package: '₹7.0 LPA (Digital/Prime)',
      avg_package: '₹4.0 LPA',
      placed_count: 45,
      description: 'India’s largest multinational IT services and consulting company recruiting 2KA graduates.'
    },
    {
      name: 'Wipro Limited',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Logo.svg',
      website_url: 'https://www.wipro.com',
      sector: 'Information Technology & Cloud',
      tier: 'Tier 1',
      highest_package: '₹6.0 LPA (Turbo)',
      avg_package: '₹3.6 LPA',
      placed_count: 32,
      description: 'Global information technology and consulting partner conducting annual pool drives.'
    },
    {
      name: 'Cognizant (CTS)',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Cognizant_logo_2022.svg',
      website_url: 'https://www.cognizant.com',
      sector: 'Digital Transformation',
      tier: 'Tier 1 Global',
      highest_package: '₹6.75 LPA (GenC Next)',
      avg_package: '₹4.0 LPA',
      placed_count: 24,
      description: 'Multinational technology company providing modern enterprise software services.'
    },
    {
      name: 'Xoriant Solutions',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Xoriant_Logo.png',
      website_url: 'https://www.xoriant.com',
      sector: 'Software Engineering & Cloud',
      tier: 'Specialist IT / Core',
      highest_package: '₹5.5 LPA',
      avg_package: '₹4.2 LPA',
      placed_count: 14,
      description: 'Silicon Valley technology services company providing high-value product engineering roles.'
    },
    {
      name: 'Powercon, Pune',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Powercon_logo.png',
      website_url: 'https://www.powercon.in',
      sector: 'Renewable Energy & Core Electrical',
      tier: 'Core Engineering',
      highest_package: '₹5.5 LPA',
      avg_package: '₹3.8 LPA',
      placed_count: 12,
      description: 'Premier wind and renewable energy engineering company actively hiring EEE & Mechanical graduates.'
    },
    {
      name: 'MphasiS',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Mphasis_Logo.svg',
      website_url: 'https://www.mphasis.com',
      sector: 'Cloud & Cognitive Solutions',
      tier: 'Tier 1 IT',
      highest_package: '₹5.0 LPA',
      avg_package: '₹3.5 LPA',
      placed_count: 18,
      description: 'Global IT service provider specializing in cloud migration, application modernization, and AI.'
    },
    {
      name: 'NTT Data',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/NTT_Data_logo.svg',
      website_url: 'https://www.nttdata.com',
      sector: 'Enterprise Systems & Consulting',
      tier: 'Tier 1 Global',
      highest_package: '₹5.5 LPA',
      avg_package: '₹3.8 LPA',
      placed_count: 15,
      description: 'Japanese multinational systems integration company with major digital delivery centres.'
    },
    {
      name: 'SLK Software',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/SLK_Software_Logo.png',
      website_url: 'https://www.slksoftware.com',
      sector: 'FinTech & Intelligent Systems',
      tier: 'Specialist IT',
      highest_package: '₹5.2 LPA',
      avg_package: '₹3.6 LPA',
      placed_count: 16,
      description: 'Global technology company providing automation and AI software for banking and manufacturing.'
    },
    {
      name: 'Continental Automotive',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Continental_logo.svg',
      website_url: 'https://www.continental.com',
      sector: 'Automotive & Embedded Systems',
      tier: 'Core Engineering / Dream',
      highest_package: '₹8.5 LPA',
      avg_package: '₹5.2 LPA',
      placed_count: 10,
      description: 'German multinational automotive electronics supplier recruiting ECE & Mechanical talent.'
    },
    {
      name: 'Robert Bosch',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg',
      website_url: 'https://www.bosch.com',
      sector: 'Automotive, Industrial & IoT',
      tier: 'Core Engineering / Dream',
      highest_package: '₹8.0 LPA',
      avg_package: '₹5.0 LPA',
      placed_count: 12,
      description: 'Global engineering and technology powerhouse providing IoT and automotive mobility solutions.'
    },
    {
      name: 'Tech Mahindra',
      logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Tech_Mahindra_New_Logo.svg',
      website_url: 'https://www.techmahindra.com',
      sector: 'Telecom & Enterprise Software',
      tier: 'Tier 1',
      highest_package: '₹5.5 LPA',
      avg_package: '₹3.5 LPA',
      placed_count: 20,
      description: 'Specialists in 5G telecommunication networks, enterprise software, and engineering services.'
    }
  ];

  recruitersData.forEach(rec => insertRecruiter.run(rec));

  // 7. Library Books (Prof. Venkata Subba Setti Library - VTU syllabus books)
  const insertBook = db.prepare(`
    INSERT INTO library_books (
      title, author, isbn, department, category, copies_total, 
      copies_available, shelf_location, cover_image, publication_year
    ) VALUES (
      @title, @author, @isbn, @department, @category, @copies_total,
      @copies_available, @shelf_location, @cover_image, @publication_year
    )
  `);

  const libraryBooksData = [
    {
      title: 'Introduction to Algorithms (Core VTU Textbook)',
      author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest',
      isbn: '978-0262046305',
      department: 'Computer Science',
      category: 'Textbook / Core',
      copies_total: 28,
      copies_available: 22,
      shelf_location: 'Stack CS-02 / Shelf 3',
      cover_image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777d?w=300&auto=format&fit=crop&q=80',
      publication_year: 2022
    },
    {
      title: 'Artificial Intelligence: A Modern Approach (4th Edition)',
      author: 'Stuart Russell and Peter Norvig',
      isbn: '978-0134610993',
      department: 'Artificial Intelligence',
      category: 'Reference',
      copies_total: 20,
      copies_available: 15,
      shelf_location: 'Stack AI-01 / Shelf 2',
      cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
      publication_year: 2021
    },
    {
      title: 'Operating System Concepts (10th Edition - Silberschatz)',
      author: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
      isbn: '978-1119800361',
      department: 'Computer Science',
      category: 'Textbook',
      copies_total: 24,
      copies_available: 18,
      shelf_location: 'Stack CS-05 / Shelf 1',
      cover_image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&auto=format&fit=crop&q=80',
      publication_year: 2020
    },
    {
      title: 'Digital Design: With an Introduction to Verilog HDL',
      author: 'M. Morris Mano and Michael D. Ciletti',
      isbn: '978-0132774208',
      department: 'Electronics & Communication',
      category: 'Core VLSI',
      copies_total: 35,
      copies_available: 26,
      shelf_location: 'Stack EC-01 / Shelf 4',
      cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&auto=format&fit=crop&q=80',
      publication_year: 2018
    },
    {
      title: 'Microelectronic Circuits: Theory & Applications',
      author: 'Adel S. Sedra and Kenneth C. Smith',
      isbn: '978-0190853464',
      department: 'Electronics & Communication',
      category: 'Textbook',
      copies_total: 30,
      copies_available: 24,
      shelf_location: 'Stack EC-04 / Shelf 2',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=80',
      publication_year: 2020
    },
    {
      title: 'Electric Machinery Fundamentals',
      author: 'Stephen J. Chapman',
      isbn: '978-0073529547',
      department: 'Electrical & Electronics',
      category: 'Core Machines',
      copies_total: 25,
      copies_available: 19,
      shelf_location: 'Stack EE-02 / Shelf 3',
      cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      publication_year: 2019
    },
    {
      title: 'Power System Analysis & Design',
      author: 'J. Duncan Glover, Thomas Overbye, Mulukutla Sarma',
      isbn: '978-1305636187',
      department: 'Electrical & Electronics',
      category: 'Power Systems',
      copies_total: 20,
      copies_available: 14,
      shelf_location: 'Stack EE-05 / Shelf 1',
      cover_image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300&auto=format&fit=crop&q=80',
      publication_year: 2017
    },
    {
      title: 'Reinforced Concrete Design (IS 456-2000 Code Compliant)',
      author: 'N. Krishna Raju and R. N. Pranesh',
      isbn: '978-8122432924',
      department: 'Civil Engineering',
      category: 'Structures',
      copies_total: 32,
      copies_available: 25,
      shelf_location: 'Stack CV-02 / Shelf 2',
      cover_image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&auto=format&fit=crop&q=80',
      publication_year: 2021
    },
    {
      title: 'Soil Mechanics and Foundation Engineering',
      author: 'Dr. B. C. Punmia, Ashok Kumar Jain, Arun Kumar Jain',
      isbn: '978-8170087915',
      department: 'Civil Engineering',
      category: 'Geotechnical',
      copies_total: 30,
      copies_available: 23,
      shelf_location: 'Stack CV-03 / Shelf 4',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&auto=format&fit=crop&q=80',
      publication_year: 2020
    },
    {
      title: 'Design of Machine Elements (VTU Prescribed Text)',
      author: 'V. B. Bhandari',
      isbn: '978-9352606559',
      department: 'Mechanical Engineering',
      category: 'Machine Design',
      copies_total: 35,
      copies_available: 27,
      shelf_location: 'Stack ME-01 / Shelf 2',
      cover_image: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777d?w=300&auto=format&fit=crop&q=80',
      publication_year: 2020
    },
    {
      title: 'Theory of Machines & Mechanisms',
      author: 'John J. Uicker, Gordon R. Pennock, Joseph E. Shigley',
      isbn: '978-0190699024',
      department: 'Mechanical Engineering',
      category: 'Mechanisms',
      copies_total: 26,
      copies_available: 20,
      shelf_location: 'Stack ME-03 / Shelf 1',
      cover_image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&auto=format&fit=crop&q=80',
      publication_year: 2019
    },
    {
      title: 'Higher Engineering Mathematics (44th Edition)',
      author: 'Dr. B. S. Grewal',
      isbn: '978-8193328491',
      department: 'Basic Science & Humanities',
      category: 'Core Mathematics',
      copies_total: 45,
      copies_available: 36,
      shelf_location: 'Stack BS-01 / Shelf 1',
      cover_image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&auto=format&fit=crop&q=80',
      publication_year: 2021
    }
  ];

  libraryBooksData.forEach(book => insertBook.run(book));

  console.log('Authentic SKSVMACET data seeding completed successfully!');
}

module.exports = {
  db,
  initDb,
  query,
  queryOne,
  execute,
  isPg
};
