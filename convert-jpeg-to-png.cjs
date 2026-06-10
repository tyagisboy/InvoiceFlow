const { app, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

app.whenReady().then(() => {
  const jpegPath = 'H:\\AI Tools\\Invoice Generator\\icon.png';
  const pngDestPath = path.join(__dirname, 'icon.png');

  try {
    console.log('Loading image from:', jpegPath);
    const img = nativeImage.createFromPath(jpegPath);
    if (img.isEmpty()) {
      console.error('Failed to load image: Image is empty!');
      app.exit(1);
      return;
    }
    const pngBuffer = img.toPNG();
    fs.writeFileSync(pngDestPath, pngBuffer);
    console.log('Successfully converted JPEG to real PNG at:', pngDestPath);
    app.exit(0);
  } catch (e) {
    console.error('Error converting image:', e);
    app.exit(1);
  }
});
