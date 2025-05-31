import fs from 'fs';
import path from 'path';
import jsonminify from 'jsonminify';

const directory = './dist/assets';

let totalOriginalSize = 0;
let totalMinifiedSize = 0;

function formatSize(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB';
}

function minifyJsonFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      minifyJsonFiles(filePath);
    } else if (path.extname(file) === '.json') {
      const originalSize = stat.size;
      const content = fs.readFileSync(filePath, 'utf8');
      const minified = jsonminify(content);
      fs.writeFileSync(filePath, minified);

      const minifiedSize = Buffer.byteLength(minified, 'utf8');

      totalOriginalSize += originalSize;
      totalMinifiedSize += minifiedSize;

      console.log(`✔ Minified: ${filePath}`);
      console.log(`   Size: ${formatSize(originalSize)} → ${formatSize(minifiedSize)}\n`);
    }
  });
}

minifyJsonFiles(directory);

console.log('--- Summary ---');
console.log(`Total Original Size : ${formatSize(totalOriginalSize)}`);
console.log(`Total Minified Size : ${formatSize(totalMinifiedSize)}`);
console.log(`Total Saved         : ${formatSize(totalOriginalSize - totalMinifiedSize)}`);
