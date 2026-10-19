const https = require('https');
https.get('https://www.bing.com/news/search?q=Dubai+%22real+estate%22+%28luxury+OR+commercial+OR+investment%29&format=rss', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data.substring(0, 1000)));
});
