const fs = require('fs');
const html = fs.readFileSync('scripts/cse.html', 'utf8');
const matches = [...html.matchAll(/href=["'](https?:\/\/agadiengcollege\.com\/[^"']+)["']/gi)];
const links = new Set(matches.map(m => m[1]));
[...links].filter(l => l.includes('science') || l.includes('basic') || l.includes('first') || l.includes('general') || l.includes('math')).forEach(l => console.log(l));
