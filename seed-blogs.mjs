import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dummyBlogs = [
  {
    title: "The Top 5 Luxury Areas to Invest in Dubai for 2026",
    slug: "top-5-luxury-areas-invest-dubai-2026",
    excerpt: "Discover the most exclusive neighborhoods yielding the highest ROI for luxury real estate investors this year.",
    content: "Dubai’s luxury real estate market continues to shatter global records. From the serene shores of Palm Jumeirah to the ultra-modern penthouses in Downtown Dubai, the city offers unparalleled opportunities for high-net-worth individuals. Whether you are seeking a primary residence with world-class amenities or a high-yielding investment property, these five neighborhoods stand above the rest.\n\n### 1. Palm Jumeirah\nStill the crown jewel of Dubai, beachfront villas here are seeing unprecedented demand. Known for its iconic fronds and unparalleled privacy, Palm Jumeirah offers residents direct private beach access, stunning views of the Arabian Gulf, and proximity to five-star resorts like Atlantis The Royal.\n\n### 2. Emirates Hills\nOften called the 'Beverly Hills of Dubai', this gated community remains the top choice for billionaires. Built around a world-class 18-hole golf course, the sprawling mansions in Emirates Hills offer massive plot sizes, extreme security, and a mature, lush landscape that is hard to find elsewhere in the city.\n\n### 3. Dubai Marina\nFor those who prefer a vibrant, high-rise luxury lifestyle, the Marina offers stunning waterfront penthouses. With hundreds of fine dining restaurants, luxury yachts, and a bustling promenade, this area is perfect for younger investors and executives who want to be in the center of the action.\n\n### 4. Jumeirah Bay Island\nHome to the exclusive Bulgari Resort and Residences, this man-made island shaped like a seahorse is the new hotspot for ultra-luxury mansions. With highly restricted access and only a limited number of plots, property values here have doubled in the past three years.\n\n### 5. Downtown Dubai\nYou can never go wrong with a view of the Burj Khalifa. The branded residences here (such as Armani and Baccarat) are performing exceptionally well. It is the ultimate location for those who appreciate cosmopolitan living, high-end retail at The Dubai Mall, and spectacular fountain shows from their balcony.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    author: "Mohd. Alfalasi",
    published: true,
  },
  {
    title: "Understanding Off-Plan Properties: A Buyer's Guide",
    slug: "understanding-off-plan-properties-buyers-guide",
    excerpt: "Is buying off-plan right for you? We break down the risks, rewards, and payment plans of buying pre-construction.",
    content: "Buying a property before it is built—known as buying 'off-plan'—is one of the most popular ways to invest in UAE real estate. But it requires careful navigation. The allure of securing a property at a lower price point and watching its value appreciate during construction is strong, but investors must understand the mechanics before committing capital.\n\n### The Benefits\n* **Lower Prices:** Off-plan properties are generally priced significantly lower than ready-to-move-in properties. Developers offer these discounts to secure early funding for their projects.\n* **Capital Appreciation:** As the project nears completion, the market value of your property naturally increases. By the time you receive the keys, your equity has often grown substantially.\n* **Flexible Payment Plans:** Developers often offer incredible post-handover payment plans. It is common to see structures where you pay 50% during construction and the remaining 50% over 3 to 5 years after you move in, entirely interest-free.\n* **Brand New Assets:** You are the first owner. Everything is brand new, under warranty, and built to the latest modern standards and energy-efficiency codes.\n\n### The Risks\n* **Construction Delays:** Delays can happen. This is why you must always buy from top-tier, reputable developers with a proven track record (like Emaar, Nakheel, or Damac).\n* **Market Fluctuations:** The market value could dip before completion, though Dubai's current trajectory remains strongly upward.\n* **Expectation vs. Reality:** Renderings can sometimes differ from the final product. Working with an experienced broker ensures you know exactly what specifications are guaranteed in your contract.\n\nOur advisory team specializes in mitigating these risks for our clients. We carefully vet every developer and project we recommend, ensuring your investment is secure and highly profitable.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    author: "Investment Team",
    published: true,
  },
  {
    title: "How to Secure a Golden Visa Through Real Estate",
    slug: "how-to-secure-golden-visa-real-estate",
    excerpt: "Everything you need to know about the UAE's 10-year Golden Visa program for property investors.",
    content: "The UAE Golden Visa is a long-term residence visa which enables foreign talents to live, work or study in the UAE while enjoying exclusive benefits. For real estate investors, the pathway is clear, straightforward, and highly attractive.\n\nUnlike traditional residency visas that require a local sponsor or employment contract, the Golden Visa puts you entirely in control of your residency status.\n\n### The Requirements\nTo qualify for the 10-year Golden Visa through real estate, you must meet the following criteria:\n* **Investment Threshold:** Purchase a property (or multiple properties) with a minimum total value of **AED 2 Million** (approximately $545,000 USD).\n* **Property Types:** The property can be residential, commercial, or hotel apartments. It can also be either ready-to-move-in or off-plan (under construction).\n* **Mortgages:** If the property is mortgaged, the bank must provide a NOC (No Objection Certificate), and a specific equity amount (usually AED 2 Million) must have already been paid to the developer or bank.\n* **Retention:** You must retain the property for at least two years.\n\n### The Benefits\n* **10 Years of Security:** Enjoy a decade of renewable residency without the stress of frequent renewals.\n* **No Sponsor Required:** You are your own sponsor.\n* **Family Sponsorship:** Ability to sponsor family members, including spouses and children regardless of their age.\n* **Domestic Staff:** Ability to sponsor an unlimited number of domestic helpers.\n* **Out-of-Country Flexibility:** Unlike standard visas that are cancelled if you stay outside the UAE for more than 6 months, Golden Visa holders can stay abroad indefinitely without losing their residency.\n\nAt Mohd. Alfalasi Real Estate, we handle the entire Golden Visa application process on behalf of our clients. From the initial property selection to the final visa stamping, our dedicated concierge team ensures a seamless, VIP experience.",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=80",
    author: "Mohd. Alfalasi",
    published: true,
  },
  {
    title: "Branded Residences: The Ultimate Status Symbol",
    slug: "branded-residences-ultimate-status-symbol",
    excerpt: "Why ultra-high-net-worth individuals are flocking to properties branded by Bugatti, Armani, and Baccarat.",
    content: "The concept of 'branded residences' is taking the Dubai luxury real estate market by storm. While a luxury penthouse is impressive, a penthouse designed, serviced, and branded by a globally renowned luxury marquee elevates the living experience to an entirely new echelon.\n\nDubai is currently the global capital of branded residences, boasting more projects than Miami or New York.\n\n### What are Branded Residences?\nThese are residential properties developed in collaboration with a luxury brand. The brand lends its name, design ethos, and often its world-class hospitality services to the building. \n\n### Top Examples in Dubai\n* **Bugatti Residences:** Located in Business Bay, this hyper-luxury tower features a car elevator that allows residents to park their supercars directly in their penthouses.\n* **Armani Residences:** Situated within the iconic Burj Khalifa, these apartments were personally designed by Giorgio Armani himself, featuring bespoke furnishings and direct access to the Armani Hotel services.\n* **Baccarat Residences:** Bringing French crystal elegance to Downtown Dubai, offering unobstructed views of the Burj Khalifa and unparalleled white-glove service.\n* **Bulgari Lighthouse:** Located on Jumeirah Bay Island, offering ultra-exclusive mansions in the sky with sprawling terraces.\n\n### Why Investors Love Them\nBeyond the prestige, branded residences command a significant premium—often 20% to 30% higher than non-branded luxury properties in the exact same location. They offer higher rental yields, superior capital appreciation, and a level of property management that ensures the asset remains pristine for decades.\n\nIf you are looking for the absolute pinnacle of luxury living, a branded residence is the definitive choice.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=80",
    author: "Investment Team",
    published: true,
  },
  {
    title: "The Rise of Eco-Luxury Villas in Dubai",
    slug: "rise-eco-luxury-villas-dubai",
    excerpt: "How sustainability is reshaping the high-end property market, from solar integration to smart home efficiency.",
    content: "Sustainability and luxury were once considered mutually exclusive in the real estate sector. Today, they are seamlessly intertwined. High-net-worth buyers in Dubai are increasingly demanding properties that not only offer opulence but also minimize environmental impact.\n\n### The Shift in Buyer Preferences\nThe modern luxury buyer is environmentally conscious. They want the grandeur of a mansion without the immense carbon footprint. This shift is driving developers to innovate rapidly.\n\n### Key Features of Eco-Luxury Homes\n* **Solar Integration:** Developments like Al Barari and Sustainable City have proven that solar panels can be integrated elegantly into modern architecture, powering everything from air conditioning to heated infinity pools.\n* **Smart Climate Control:** Next-generation smart homes use AI to learn your habits, automatically adjusting lighting, shading, and cooling to drastically reduce energy waste while maintaining perfect comfort.\n* **Sustainable Materials:** The use of locally sourced, sustainable materials like reclaimed wood, low-VOC paints, and recycled steel is becoming a hallmark of high-end design.\n* **Water Conservation:** Advanced greywater recycling systems are being used to maintain lush, tropical landscaping without straining the city's water supply.\n\nAs Dubai marches towards its 2040 Urban Master Plan, which heavily emphasizes sustainability, eco-luxury properties are not just a trend—they are the future of high-end real estate.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    author: "Mohd. Alfalasi",
    published: true,
  }
];

async function main() {
  console.log("Seeding dummy blogs...");
  for (const blog of dummyBlogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog,
    });
  }
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
