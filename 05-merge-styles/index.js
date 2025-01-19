const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

function mergeStyles() {
  fs.mkdir(outputDir, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating project-dist directory:', err);
      return;
    }

    const writeStream = fs.createWriteStream(outputFile);

    fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error('Error reading styles directory:', err);
        writeStream.close();
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(stylesDir, file.name);

        if (file.isFile() && path.extname(file.name) === '.css') {
          const readStream = fs.createReadStream(filePath, 'utf-8');

          readStream.pipe(writeStream, { end: false });

          readStream.on('error', (err) => {
            console.error(`Error reading file ${file.name}:`, err);
          });

          readStream.on('end', () => {
            writeStream.write('\n');
          });
        }
      });
    });

    writeStream.on('error', (err) => {
      console.error('Error writing to bundle.css:', err);
    });
  });
}

mergeStyles();
