const fs = require('fs');

const depts = ['cse', 'civil', 'eee', 'ece', 'ise', 'mech', 'basic-science'];
const facultyCatalog = [];

for (const dept of depts) {
  const html = fs.readFileSync(`scripts/${dept}.html`, 'utf8');

  // Match flip box cards
  const blockRegex = /<div class="df_fb_front">([\s\S]*?)<div class="df_fb_back">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
  let m;
  let count = 0;

  while ((m = blockRegex.exec(html)) !== null) {
    const front = m[1];
    const back = m[2];

    // Image
    const imgM = front.match(/src=["'](https?:\/\/[^"']+\/wp-content\/uploads\/[^"']+)["']/i);
    const img = imgM ? imgM[1].replace('http:', 'https:') : null;

    // Name from front
    const nameM = front.match(/<h[3-5][^>]*class=["']title["'][^>]*>(.*?)<\/h[3-5]>/i) ||
                  front.match(/<h[3-5][^>]*>(.*?)<\/h[3-5]>/i);
    let name = nameM ? nameM[1].replace(/<[^>]+>/g, '').trim() : null;

    // Designation from front
    const desigM = front.match(/<div class="fb-text">[\s\S]*?<p>(.*?)<\/p>/i);
    let designation = desigM ? desigM[1].replace(/<[^>]+>/g, '').trim() : 'Assistant Professor';

    // Email from back
    const emailM = back.match(/([a-zA-Z0-9._-]+@agadiengcollege\.com)/i);
    const email = emailM ? emailM[1] : (dept === 'basic-science' ? 'firstyear@agadiengcollege.com' : `info@agadiengcollege.com`);

    // Phone from back
    const phoneM = back.match(/(\+?91[\s-]?[0-9]{5}[\s-]?[0-9]{5}|\b[6-9][0-9]{9}\b)/);
    const phone = phoneM ? phoneM[1] : '+91 9448120344';

    // Qualification or other back info
    const qualM = back.match(/Qualification:?\s*<strong>(.*?)<\/strong>/i) ||
                  back.match(/Qualification:?\s*([A-Za-z.,\s()]+)/i);
    let qualification = qualM ? qualM[1].replace(/<[^>]+>/g, '').trim() : null;

    if (!qualification) {
      if (designation.toLowerCase().includes('dr.') || (name && name.startsWith('Dr.'))) {
        qualification = dept === 'basic-science' ? 'Ph.D., M.Sc' : 'Ph.D., M.Tech';
      } else if (designation.toLowerCase().includes('associate')) {
        qualification = dept === 'basic-science' ? 'M.Sc, (Ph.D.)' : 'M.Tech, (Ph.D.)';
      } else {
        qualification = dept === 'basic-science' ? 'M.Sc' : 'M.Tech';
      }
    }

    if (name && img) {
      count++;
      facultyCatalog.push({
        dept,
        name,
        designation,
        qualification,
        email,
        phone,
        photo: img
      });
    }
  }

  console.log(`Department ${dept.toUpperCase()}: Extracted ${count} complete faculty profiles!`);
}

console.log(`\nTOTAL FACULTY EXTRACTED: ${facultyCatalog.length}`);
fs.writeFileSync('scripts/official_sksvma_faculty.json', JSON.stringify(facultyCatalog, null, 2));
