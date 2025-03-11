const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '../dist/libs/saba-games');
const targetDir = path.join(__dirname, '../../public/saba-games');

async function copyBuildFiles() {
  try {
    await fs.ensureDir(targetDir);
    await fs.copy(sourceDir, targetDir);
    console.log(
      'Successfully copied saba-games build files to public directory',
    );
  } catch (err) {
    console.error('Error copying build files:', err);
    process.exit(1);
  }
}

copyBuildFiles();
