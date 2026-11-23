const https = require('https');
const fs = require('fs');

https.get('https://agadiengcollege.com/first-year-engineering/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    fs.writeFileSync('scripts/basic-science.html', data);
    console.log('Saved scripts/basic-science.html, length:', data.length);
  });
}).on('error', e => console.error(e.message));
