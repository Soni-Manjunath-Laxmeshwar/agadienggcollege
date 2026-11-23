const https = require('https');
const fs = require('fs');

const deptUrls = [
  { id: 'cse', name: 'Computer Science', url: 'https://agadiengcollege.com/computer-science-engineering/' },
  { id: 'civil', name: 'Civil Engineering', url: 'https://agadiengcollege.com/civil-engineering/' },
  { id: 'eee', name: 'Electrical & Electronics', url: 'https://agadiengcollege.com/electrical-electronics-engineering/' },
  { id: 'ece', name: 'Electronics & Communication', url: 'https://agadiengcollege.com/electronics-communication-engineering/' },
  { id: 'ise', name: 'Information Science', url: 'https://agadiengcollege.com/information-science-engineering/' },
  { id: 'mech', name: 'Mechanical Engineering', url: 'https://agadiengcollege.com/mechanical-engineering/' }
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const allResults = {};

  for (const dept of deptUrls) {
    console.log(`\n==============================================`);
    console.log(`Fetching: ${dept.name} (${dept.url})`);
    console.log(`==============================================`);
    try {
      const html = await fetchUrl(dept.url);
      
      // Save HTML to scratch for detailed inspection
      fs.writeFileSync(`scripts/${dept.id}.html`, html);

      // Search for images in wp-content/uploads
      const imgRegex = /src=["'](https?:\/\/agadiengcollege\.com\/wp-content\/uploads\/[^"']+\.(?:jpe?g|png|webp))["']/gi;
      const images = [];
      let m;
      while ((m = imgRegex.exec(html)) !== null) {
        images.push(m[1]);
      }
      console.log(`Found ${images.length} uploaded images`);
      images.slice(0, 10).forEach(img => console.log('  Image:', img));

      // Search for email addresses
      const emailRegex = /([a-zA-Z0-9._-]+@agadiengcollege\.com)/gi;
      const emails = new Set();
      while ((m = emailRegex.exec(html)) !== null) {
        emails.add(m[1]);
      }
      console.log(`Found ${emails.size} emails:`, [...emails]);

      // Search for phone numbers
      const phoneRegex = /(\+?91[\s-]?[0-9]{5}[\s-]?[0-9]{5}|\b[6-9][0-9]{9}\b)/g;
      const phones = new Set();
      while ((m = phoneRegex.exec(html)) !== null) {
        phones.add(m[1]);
      }
      console.log(`Found ${phones.size} phone numbers:`, [...phones]);

      allResults[dept.id] = {
        images,
        emails: [...emails],
        phones: [...phones]
      };
    } catch (e) {
      console.error(`Error fetching ${dept.name}:`, e.message);
    }
  }

  fs.writeFileSync('scripts/faculty_scraped.json', JSON.stringify(allResults, null, 2));
  console.log('\nSaved results to scripts/faculty_scraped.json');
}

run();
