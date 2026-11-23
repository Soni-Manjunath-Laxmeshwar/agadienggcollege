const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database(path.join(__dirname, '../server/college.db'));

let sql = `-- ================================================================
-- SKSVMACET Laxmeshwar - Production Cloud Database Schema & Seed
-- Compatible with PostgreSQL (Supabase / Neon / Render) & Cloud SQL
-- ================================================================

DROP TABLE IF EXISTS inquiries CASCADE;
DROP TABLE IF EXISTS library_reservations CASCADE;
DROP TABLE IF EXISTS library_books CASCADE;
DROP TABLE IF EXISTS recruiters CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS labs CASCADE;
DROP TABLE IF EXISTS faculty CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

CREATE TABLE departments (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(50) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  established INTEGER,
  intake INTEGER,
  duration VARCHAR(50) DEFAULT '4 Years',
  hod_name VARCHAR(255),
  hod_designation VARCHAR(255),
  hod_email VARCHAR(255),
  hod_phone VARCHAR(50),
  hod_message TEXT,
  hod_photo TEXT,
  vision TEXT,
  mission TEXT,
  banner_image TEXT,
  about_text TEXT,
  curriculum_highlights TEXT
);

CREATE TABLE faculty (
  id SERIAL PRIMARY KEY,
  department_id VARCHAR(50) NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  qualification VARCHAR(255),
  experience VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  specialization TEXT,
  photo TEXT
);

CREATE TABLE labs (
  id SERIAL PRIMARY KEY,
  department_id VARCHAR(50) NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  equipment TEXT,
  image TEXT
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  event_date VARCHAR(50) NOT NULL,
  event_time VARCHAR(50),
  venue VARCHAR(255),
  description TEXT,
  banner_image TEXT,
  is_featured INTEGER DEFAULT 0,
  is_banner INTEGER DEFAULT 0,
  registration_link TEXT,
  organizer VARCHAR(255)
);

CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  is_new INTEGER DEFAULT 1,
  is_urgent INTEGER DEFAULT 0,
  document_url TEXT,
  details TEXT
);

CREATE TABLE recruiters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  website_url TEXT NOT NULL,
  sector VARCHAR(100),
  tier VARCHAR(50),
  highest_package VARCHAR(50),
  avg_package VARCHAR(50),
  placed_count INTEGER,
  description TEXT
);

CREATE TABLE library_books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(100),
  department VARCHAR(100),
  category VARCHAR(100),
  copies_total INTEGER DEFAULT 5,
  copies_available INTEGER DEFAULT 5,
  shelf_location VARCHAR(100),
  cover_image TEXT,
  publication_year INTEGER
);

CREATE TABLE library_reservations (
  id SERIAL PRIMARY KEY,
  book_id INTEGER NOT NULL REFERENCES library_books(id) ON DELETE CASCADE,
  student_name VARCHAR(255) NOT NULL,
  usn VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  branch VARCHAR(50) NOT NULL,
  semester VARCHAR(20) NOT NULL,
  request_date VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending'
);

CREATE TABLE inquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  course_interested VARCHAR(255),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'New'
);
`;

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  return "'" + String(val).replace(/'/g, "''") + "'";
}

const tables = ['departments', 'faculty', 'labs', 'events', 'announcements', 'recruiters', 'library_books'];

for (const t of tables) {
  const rows = db.prepare(`SELECT * FROM ${t}`).all();
  if (rows.length === 0) continue;
  sql += `\n-- Data for ${t} (${rows.length} records)\n`;
  for (const r of rows) {
    const keys = Object.keys(r);
    const cols = keys.join(', ');
    const values = keys.map(k => escapeSql(r[k])).join(', ');
    sql += `INSERT INTO ${t} (${cols}) VALUES (${values});\n`;
  }
}

const outPath = path.join(__dirname, 'production_export.sql');
fs.writeFileSync(outPath, sql);
console.log(`Successfully generated ${outPath}! Size: ${sql.length} bytes`);
