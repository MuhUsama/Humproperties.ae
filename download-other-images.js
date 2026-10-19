const fs = require('fs');
const https = require('https');
const path = require('path');

const servicesDir = path.join(__dirname, 'src', 'components', 'services');

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
      }
      
      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);
      
      fileStream.on('error', (err) => {
        reject(err);
      });
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

async function processFiles() {
  const publicBase = path.join(__dirname, 'public', 'services-assets');
  if (!fs.existsSync(publicBase)) {
    fs.mkdirSync(publicBase, { recursive: true });
  }

  const files = fs.readdirSync(servicesDir).filter(f => f.endsWith('.tsx'));

  for (const file of files) {
    const filePath = path.join(servicesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find all unique unsplash URLs
    const regex = /https:\/\/images\.unsplash\.com\/[^"'\s`]+/g;
    const matches = [...new Set(content.match(regex) || [])];

    if (matches.length > 0) {
      const baseName = path.basename(file, '.tsx').toLowerCase();
      const dirPath = path.join(publicBase, baseName);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const urlMap = {};

      for (let i = 0; i < matches.length; i++) {
        const url = matches[i];
        if (!urlMap[url]) {
          const ext = url.includes('format=png') ? '.png' : '.jpg';
          const filename = `${baseName}-${i + 1}${ext}`;
          const relativePath = `/services-assets/${baseName}/${filename}`;
          const absolutePath = path.join(dirPath, filename);
          
          console.log(`Downloading ${url} to ${absolutePath}`);
          try {
            await downloadImage(url, absolutePath);
            urlMap[url] = relativePath;
          } catch (e) {
            console.error(`Failed to download ${url}`, e);
          }
        }

        if (urlMap[url]) {
          content = content.split(url).join(urlMap[url]);
        }
      }

      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file}`);
    }
  }
}

processFiles().catch(console.error);
