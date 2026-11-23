const fs = require('fs');

const depts = ['cse', 'civil', 'eee', 'ece', 'ise', 'mech'];

const results = {};

for (const dept of depts) {
  const html = fs.readFileSync(`scripts/${dept}.html`, 'utf8');
  results[dept] = [];

  // Match each faculty card
  // Looking for <div class="fb_inner_content"> or similar
  const cardRegex = /<div class="fb_inner_content">([\s\S]*?)<\/div>\s*<\/div>/gi;
  let m;
  while ((m = cardRegex.exec(html)) !== null) {
    const cardHtml = m[1];

    // Image
    const imgM = cardHtml.match(/src=["']([^"']+)["']/i);
    const img = imgM ? imgM[1] : null;

    // Name
    const nameM = cardHtml.match(/<h[3-5][^>]*class=["']title["'][^>]*>(.*?)<\/h[3-5]>/i) ||
                  cardHtml.match(/<h[3-5][^>]*>(.*?)<\/h[3-5]>/i);
    const name = nameM ? nameM[1].replace(/<[^>]+>/g, '').trim() : null;

    // Designation / Qualification / Content
    const emailM = cardHtml.match(/([a-zA-Z0-9._-]+@agadiengcollege\.com)/i);
    const email = emailM ? emailM[1] : null;

    const phoneM = cardHtml.match(/(\+?91[\s-]?[0-9]{5}[\s-]?[0-9]{5}|\b[6-9][0-9]{9}\b)/);
    const phone = phoneM ? phoneM[1] : null;

    // Text lines inside card
    const textLines = cardHtml
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '\n')
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.includes('@') && !s.match(/^[0-9+\s-]{8,}$/));

    if (name && img && (email || phone || name.startsWith('Dr.') || name.startsWith('Mr.') || name.startsWith('Mrs.') || name.startsWith('Ms.') || name.startsWith('Prof.'))) {
      results[dept].push({
        dept,
        name,
        img: img.startsWith('http:') ? img.replace('http:', 'https:') : img,
        email,
        phone,
        textLines: textLines.slice(0, 5)
      });
    }
  }
  console.log(`Dept ${dept.toUpperCase()}: parsed ${results[dept].length} faculty cards`);
}

fs.writeFileSync('scripts/parsed_faculty.json', JSON.stringify(results, null, 2));
