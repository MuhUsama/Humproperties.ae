const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting data migration...');

  try {
    // 1. Migrate Listings
    const databasePath = path.join(process.cwd(), 'src', 'lib', 'database.json');
    if (fs.existsSync(databasePath)) {
      const rawData = fs.readFileSync(databasePath, 'utf8');
      const listings = JSON.parse(rawData);
      
      console.log(`Found ${listings.length} listings in database.json`);
      
      for (const item of listings) {
        try {
          await prisma.listing.create({
            data: {
              title: item.title,
              price: item.price,
              location: item.location,
              city: item.city || "Dubai",
              propertyType: item.propertyType || "Residential",
              category: item.category || "Apartment",
              beds: typeof item.beds === 'number' ? item.beds : parseInt(item.beds) || 0,
              baths: typeof item.baths === 'number' ? item.baths : parseInt(item.baths) || 0,
              sqft: String(item.sqft || "0"),
              image: item.image || "",
              status: item.status || "FOR SALE",
              galleryImages: Array.isArray(item.galleryImages) ? item.galleryImages : [],
              description: item.description || null,
              features: Array.isArray(item.features) ? item.features : [],
              createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            }
          });
          console.log(`Migrated listing: ${item.title}`);
        } catch (err) {
          console.error(`Failed to migrate listing: ${item.title}`, err.message);
        }
      }
    } else {
      console.log('database.json not found, skipping listings.');
    }

    // 2. Migrate Blogs
    const blogsPath = path.join(process.cwd(), 'src', 'lib', 'blogs.json');
    if (fs.existsSync(blogsPath)) {
      const rawBlogs = fs.readFileSync(blogsPath, 'utf8');
      const blogs = JSON.parse(rawBlogs);
      
      console.log(`Found ${blogs.length} blogs in blogs.json`);
      
      for (const item of blogs) {
        try {
          // check if exists
          const existing = await prisma.blog.findUnique({ where: { slug: item.slug } });
          if (!existing) {
             await prisma.blog.create({
               data: {
                 title: item.title,
                 slug: item.slug,
                 excerpt: item.excerpt || "",
                 content: item.content || "",
                 image: item.image || null,
                 author: item.author || "Mohd. Alfalasi",
                 published: item.published !== undefined ? item.published : true,
                 createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
               }
             });
             console.log(`Migrated blog: ${item.title}`);
          }
        } catch (err) {
          console.error(`Failed to migrate blog: ${item.title}`, err.message);
        }
      }
    } else {
      console.log('blogs.json not found, skipping blogs.');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
