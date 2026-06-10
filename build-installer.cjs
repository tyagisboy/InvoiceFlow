const winstaller = require('electron-winstaller');
const path = require('path');

async function build() {
  console.log('Building Windows Installer...');
  try {
    await winstaller.createWindowsInstaller({
      appDirectory: path.join(__dirname, 'dist-electron', 'Invoice Flow-win32-x64'),
      outputDirectory: path.join(__dirname, '..', 'Distribution'),
      authors: 'InvoiceFlow',
      exe: 'Invoice Flow.exe',
      setupExe: 'Invoice-Flow-Setup.exe',
      setupIcon: path.join(__dirname, 'icon.ico'),
      noMsi: true,
      description: 'Desktop Invoice Flow Application',
      title: 'Invoice Flow'
    });
    console.log('Successfully created Windows installer!');
  } catch (e) {
    console.error('Failed to create Windows installer:', e.stack || e.message || e);
    process.exit(1);
  }
}

build();
