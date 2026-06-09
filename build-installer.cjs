const winstaller = require('electron-winstaller');
const path = require('path');

async function build() {
  console.log('Building Windows Installer...');
  try {
    await winstaller.createWindowsInstaller({
      appDirectory: path.join(__dirname, 'dist-electron', 'Invoice Generator-win32-x64'),
      outputDirectory: path.join(__dirname, '..', 'Distribution'),
      authors: 'InvoiceFlow',
      exe: 'Invoice Generator.exe',
      setupExe: 'Invoice-Generator-Setup.exe',
      noMsi: true,
      description: 'Desktop Invoice Generator Application',
      title: 'Invoice Generator'
    });
    console.log('Successfully created Windows installer!');
  } catch (e) {
    console.error('Failed to create Windows installer:', e.stack || e.message || e);
    process.exit(1);
  }
}

build();
