import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';

// Lazy load components that are below the fold for better initial load performance
const ListingsSection = dynamic(() => import('@/components/ListingsSection'), { ssr: true });
const AboutSection = dynamic(() => import('@/components/AboutSection'), { ssr: true });
const ServicesSection = dynamic(() => import('@/components/ServicesSection'), { ssr: true });
const NewsSection = dynamic(() => import('@/components/NewsSection'), { ssr: true });
const InvestSection = dynamic(() => import('@/components/InvestSection'), { ssr: true });
const BlogSection = dynamic(() => import('@/components/BlogSection'), { ssr: true });
const AgentsSection = dynamic(() => import('@/components/AgentsSection'), { ssr: true });
const ContactSection = dynamic(() => import('@/components/ContactSection'), { ssr: true });
const FaqSection = dynamic(() => import('@/components/common/FaqSection'), { ssr: true });
import { getFaqsByCategory } from '@/lib/faqData';

export default function Home() {
  const homeFaqs = getFaqsByCategory('general');
  return (
    <main className="min-h-screen bg-[#faf9f7] pt-20 overflow-x-hidden">
      {/* Hero section is loaded immediately for fast LCP (Largest Contentful Paint) */}
      <HeroSection />
      
      {/* Below the fold sections are lazy-loaded */}
      <ListingsSection />
      <ServicesSection />
      <AboutSection />
      <BlogSection />
      <InvestSection />
      <NewsSection />
      <AgentsSection />
      <ContactSection />
      <FaqSection faqs={homeFaqs} />
    </main>
  );
}
