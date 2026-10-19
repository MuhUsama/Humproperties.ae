const fs = require('fs');
const https = require('https');
const path = require('path');

const sections = [
  { file: 'src/components/ServicesSection.tsx', name: 'services' },
  { file: 'src/components/AboutSection.tsx', name: 'about' },
  { file: 'src/components/InvestSection.tsx', name: 'invest' },
  { file: 'src/components/AgentsSection.tsx', name: 'agents' }
];

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
  const publicBase = path.join(__dirname, 'public', 'home-assets');
  if (!fs.existsSync(publicBase)) {
    fs.mkdirSync(publicBase, { recursive: true });
  }

  const urlMap = {};

  for (const section of sections) {
    const dirPath = path.join(publicBase, section.name);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(__dirname, section.file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find all unique unsplash URLs
    const regex = /https:\/\/images\.unsplash\.com\/[^"'\s`]+/g;
    const matches = [...new Set(content.match(regex) || [])];

    for (let i = 0; i < matches.length; i++) {
      const url = matches[i];
      if (!urlMap[url]) {
        const ext = url.includes('format=png') ? '.png' : '.jpg';
        const filename = `${section.name}-${i + 1}${ext}`;
        const relativePath = `/home-assets/${section.name}/${filename}`;
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
    console.log(`Updated ${section.file}`);
  }
}

processFiles().catch(console.error);
