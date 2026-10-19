const fetch = require('node-fetch');
async function run() {
  const res = await fetch("https://www.bing.com/news/search?q=Dubai+real+estate+luxury&format=rss");
  const xml = await res.text();
  console.log(xml.substring(0, 2000));
}
run();
