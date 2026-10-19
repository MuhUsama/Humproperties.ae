import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';

// Extend the Parser type to grab the image enclosure and source tag if available
const parser = new Parser({
  customFields: {
    item: [
      ['News:Image', 'newsImage'],
      ['News:Source', 'sourceName'] // Bing News provides the exact publisher here
    ],
  }
});

export const revalidate = 86400; // Cache this route for 24 hours

export async function GET() {
  try {
    // Expanded search query to include commercial, investment, and luxury real estate
    const feedUrl = 'https://www.bing.com/news/search?q=Dubai+%22real+estate%22+%28luxury+OR+commercial+OR+investment%29&format=rss';
    const feed = await parser.parseURL(feedUrl);

    // Strictly filter out any news older than 2 days
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const recentItems = feed.items.filter(item => {
      if (!item.pubDate) return true;
      const pubDate = new Date(item.pubDate);
      return pubDate >= twoDaysAgo;
    });

    let topItems = recentItems.slice(0, 4);
    
    // Fallback: If we don't have enough recent items, backfill with older items to ensure 4 cards are shown
    if (topItems.length < 4) {
      const olderItems = feed.items.filter(item => {
        if (!item.pubDate) return false;
        const pubDate = new Date(item.pubDate);
        return pubDate < twoDaysAgo;
      });
      const itemsNeeded = 4 - topItems.length;
      topItems = [...topItems, ...olderItems.slice(0, itemsNeeded)];
    }

    const newsItems = await Promise.all(topItems.map(async (item, index) => {
      let cleanTitle = item.title || "";
      let sourceName = item.sourceName || "Dubai News";
      
      // Extract actual publisher domain from Bing's redirect URL as fallback
      try {
        if (!item.sourceName && item.link && item.link.includes("&url=")) {
          const encodedUrl = item.link.split("&url=")[1].split("&")[0];
          const decodedUrl = decodeURIComponent(encodedUrl);
          const hostname = new URL(decodedUrl).hostname.replace('www.', '');
          
          const domainName = hostname.split('.')[0];
          if (domainName) {
            sourceName = domainName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          }
        }
      } catch (e) {
        // Fallback to title parsing if URL parsing fails
        if (cleanTitle.includes(" - ")) {
          const parts = cleanTitle.split(" - ");
          sourceName = parts.pop() || "Dubai News";
          cleanTitle = parts.join(" - ");
        }
      }

      // Clean snippet (remove HTML tags)
      let snippet = (item.contentSnippet || item.content || "").replace(/<\/?[^>]+(>|$)/g, "");
      if (snippet.length > 150) snippet = snippet.substring(0, 150) + '...';

      // Use Bing's cached thumbnail if available (Bypasses all Cloudflare blocks!)
      let imageUrl = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80";
      
      if (item.newsImage) {
        // rss-parser might return the string or an object depending on XML structure
        let rawImage = typeof item.newsImage === 'string' ? item.newsImage : item.newsImage._;
        if (rawImage) {
          // Upgrade Bing HTTP thumbnails to HTTPS and force high-resolution with edge-to-edge Smart Crop
          if (rawImage.includes('bing.com/th')) {
            rawImage = rawImage.replace('http://', 'https://');
            rawImage += '&w=800&h=600&c=7&rs=1'; // c=7 is Smart Crop (no padding)
          }
          imageUrl = rawImage;
        }
      }
      
      try {
        if (item.link && !item.newsImage) {
          // If Bing didn't cache an image, attempt a direct fetch 
          const encodedUrl = item.link.split("&url=")[1].split("&")[0];
          const decodedUrl = decodeURIComponent(encodedUrl);
          
          const res = await fetch(decodedUrl, { 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            redirect: 'follow',
            next: { revalidate: 86400 } 
          });
          
          if (res.ok) {
            const html = await res.text();
            const $ = cheerio.load(html);
            // Look for Open Graph image meta tag, twitter image, or standard image meta tag
            const ogImage = $('meta[property="og:image"]').attr('content') 
                         || $('meta[name="twitter:image"]').attr('content')
                         || $('meta[property="og:image:url"]').attr('content')
                         || $('meta[itemprop="image"]').attr('content');
                         
            if (ogImage && !ogImage.includes("googleusercontent") && ogImage.startsWith("http")) {
              imageUrl = ogImage;
            }
          }
        }
      } catch (e) {
        console.error("Failed to scrape image for link:", item.link);
      }

      return {
        id: index + 1,
        title: cleanTitle,
        snippet: snippet,
        date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recent",
        image: imageUrl,
        source: sourceName,
        link: item.link
      };
    }));

    return NextResponse.json({ news: newsItems });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
