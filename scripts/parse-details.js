const fs = require('fs');

const depts = ['cse', 'civil', 'eee', 'ece', 'ise', 'mech'];

const allFaculty = [];

for (const dept of depts) {
  const html = fs.readFileSync(`scripts/${dept}.html`, 'utf8');
  
  // Faculty entries in WordPress elementor/wp-content often use column or team member widgets
  // Let's find patterns like:
  // image + name + designation / qualification / email / phone
  
  // Regular expression to find image src, name, and following text
  // Let's do a block-based parser
  console.log(`\n================== PARSING ${dept.toUpperCase()} ==================`);

  // Split by common elementor widget or team card
  // Search for images in uploads and nearby text
  const imgMatches = [...html.matchAll(/<img[^>]+src=["'](https?:\/\/[^"']+\/wp-content\/uploads\/[^"']+)["'][^>]*>/gi)];
  
  console.log(`Found ${imgMatches.length} images in ${dept}`);
  
  // Let's inspect each image and surrounding 500 characters
  imgMatches.forEach((m, idx) => {
    const src = m[1];
    if (src.includes('logo') || src.includes('header') || src.includes('banner') || src.includes('icon') || src.includes('Naac') || src.includes('naac')) {
      return;
    }
    const start = Math.max(0, m.index - 100);
    const end = Math.min(html.length, m.index + 800);
    const snippet = html.substring(start, end).replace(/\s+/g, ' ');
    
    // Extract potential name, designation, qualification, email, phone
    const emailMatch = snippet.match(/([a-zA-Z0-9._-]+@agadiengcollege\.com)/i);
    const phoneMatch = snippet.match(/(\+?91[\s-]?[0-9]{5}[\s-]?[0-9]{5}|\b[6-9][0-9]{9}\b)/);
    
    // Extract heading or bold text (name)
    const nameMatch = snippet.match(/<(?:h[3-6]|b|strong|span)[^>]*>(?:Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)\s*([^<]+)<\/(?:h[3-6]|b|strong|span)>/i);
    
    if (nameMatch || emailMatch) {
      console.log({
        dept,
        img: src,
        name: nameMatch ? nameMatch[0].replace(/<[^>]+>/g, '').trim() : 'Unknown',
        email: emailMatch ? emailMatch[1] : null,
        phone: phoneMatch ? phoneMatch[1] : null,
        snippet: snippet.substring(0, 200)
      });
    }
  });
}
