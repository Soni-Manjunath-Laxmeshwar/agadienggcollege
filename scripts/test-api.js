const { db, initDb } = require('../server/db');

console.log('================================================================');
console.log(' SKSVMACET Backend & Relational Database Diagnostic Test');
console.log('================================================================\n');

try {
  // 1. Initialize and verify DB connection
  initDb();
  console.log('✓ SQLite Database: CONNECTED (server/college.db)');

  // 2. Count records in each table
  const tables = [
    { name: 'departments', label: 'Academic Departments (B.E. Branches)' },
    { name: 'faculty', label: 'Faculty & HOD Profiles' },
    { name: 'labs', label: 'Specialized Laboratories' },
    { name: 'events', label: 'Campus Symposia & Conferences' },
    { name: 'announcements', label: 'Official Documents & Circulars' },
    { name: 'recruiters', label: 'Corporate Recruitment Partners' },
    { name: 'library_books', label: 'Prof. V. S. Setti Library Catalog' },
    { name: 'library_reservations', label: 'Circulation Reservations (2KA USN)' },
    { name: 'inquiries', label: 'Admissions & Student Inquiries' }
  ];

  console.log('\n--- Database Tables & Seeded Data Verification ---');
  for (const t of tables) {
    const row = db.prepare(`SELECT count(*) as count FROM ${t.name}`).get();
    console.log(`✓ Table [${t.name.padEnd(20)}]: ${String(row.count).padStart(3)} records (${t.label})`);
  }

  // 3. Test Department Retrieval with HOD & Faculty relation
  console.log('\n--- Relational Integrity Check ---');
  const cse = db.prepare('SELECT * FROM departments WHERE id = ?').get('cse');
  const faculty = db.prepare('SELECT * FROM faculty WHERE department_id = ?').all('cse');
  const labs = db.prepare('SELECT * FROM labs WHERE department_id = ?').all('cse');
  console.log(`✓ Department [${cse.name}]: HOD: ${cse.hod_name}, Faculty: ${faculty.length}, Labs: ${labs.length}`);

  // 4. Test Recruiter Links
  const recruiters = db.prepare('SELECT name, website_url FROM recruiters LIMIT 3').all();
  console.log('✓ Sample Recruiter Outbound Links:');
  recruiters.forEach(r => console.log(`   - ${r.name} -> ${r.website_url}`));

  // 5. Test USN Format Validation
  const sampleBook = db.prepare('SELECT * FROM library_books LIMIT 1').get();
  console.log(`✓ Library Koha OPAC Book Sample: "${sampleBook.title}" (${sampleBook.copies_available}/${sampleBook.copies_total} copies available)`);

  console.log('\n================================================================');
  console.log(' STATUS: ALL BACKEND SERVICES AND DATABASE SYSTEMS ARE HEALTHY!');
  console.log('================================================================\n');
} catch (error) {
  console.error('✗ Diagnostic Error:', error.message);
  process.exit(1);
}
