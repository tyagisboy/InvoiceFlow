const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico').default;

const pngPath = path.join(__dirname, 'icon.png');
const icoPath = path.join(__dirname, 'icon.ico');

console.log('Generating multi-resolution ICO file...');
pngToIco(pngPath)
  .then(buf => {
    fs.writeFileSync(icoPath, buf);
    console.log('Successfully created multi-resolution icon.ico at:', icoPath);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error converting icon:', err);
    process.exit(1);
  });
