const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

function copyDir(source, target) {
  fs.mkdir(target, { recursive: true }, (err) => {
    if (err) return console.error('Error creating target directory:', err);

    fs.readdir(source, { withFileTypes: true }, (err, entries) => {
      if (err) return console.error('Error reading source directory:', err);

      fs.readdir(target, (err, targetEntries) => {
        if (err) return console.error('Error reading target directory:', err);

        const sourceNames = new Set(entries.map((entry) => entry.name));

        targetEntries.forEach((targetName) => {
          if (!sourceNames.has(targetName)) {
            const targetPath = path.join(target, targetName);
            fs.rm(targetPath, { recursive: true, force: true }, (err) => {
              if (err) console.error('Error removing extra file/directory:', err);
            });
          }
        });

        entries.forEach((entry) => {
          const sourcePath = path.join(source, entry.name);
          const targetPath = path.join(target, entry.name);

          if (entry.isDirectory()) {
            copyDir(sourcePath, targetPath);
          } else if (entry.isFile()) {
            fs.copyFile(sourcePath, targetPath, (err) => {
              if (err) console.error('Error copying file:', err);
            });
          }
        });
      });
    });
  });
}

copyDir(sourceDir, targetDir);
