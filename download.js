const https = require('https');
const fs = require('fs');

const url = 'https://cdn.coverr.co/videos/coverr-dubai-marina-skyline-4735/1080p.mp4';
const file = fs.createWriteStream('public/hero-video.mp4');

https.get(url, function(response) {
  if (response.statusCode === 301 || response.statusCode === 302) {
    https.get(response.headers.location, function(redirectResponse) {
      redirectResponse.pipe(file);
    });
  } else {
    response.pipe(file);
  }
}).on('error', function(err) {
  console.error(err);
});
