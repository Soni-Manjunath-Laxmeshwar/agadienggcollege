const https = require('https');

https.get('https://agadiengcollege.com/', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const regex = /href=["'](https?:\/\/agadiengcollege\.com\/[^"']+)["']/gi;
    const links = new Set();
    let m;
    while ((m = regex.exec(data)) !== null) {
      links.add(m[1]);
    }
    console.log('Total links found:', links.size);
    const filtered = [...links].filter(l => 
      l.toLowerCase().includes('department') || 
      l.toLowerCase().includes('faculty') || 
      l.toLowerCase().includes('staff') || 
      l.toLowerCase().includes('civil') || 
      l.toLowerCase().includes('computer') || 
      l.toLowerCase().includes('mechanical') || 
      l.toLowerCase().includes('electronic') || 
      l.toLowerCase().includes('electrical') ||
      l.toLowerCase().includes('science')
    );
    console.log('Filtered department & faculty links:');
    filtered.forEach(l => console.log(' - ' + l));
  });
}).on('error', e => console.log('Error:', e.message));
