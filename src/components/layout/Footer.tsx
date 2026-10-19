import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AnimatedLogo from "@/components/common/AnimatedLogo";

export default async function Footer() {
  const settings = await prisma.setting.findMany();
  
  // Convert settings array to object
  const s = settings.reduce((acc, cur) => {
    acc[cur.key] = cur.value;
    return acc;
  }, {} as Record<string, string>);

  const phone = s['contact_phone'] || "+971 (04) 334 1131";
  const email = s['contact_email'] || "info@mfreuae.com";
  const address = s['contact_address'] || "Office 120, Snooker Point Building, Oud Metha, Dubai";
  const instagram = s['social_instagram'] || "";
  const facebook = s['social_facebook'] || "";
  const twitter = s['social_twitter'] || "";
  const linkedin = s['social_linkedin'] || "";
  const tiktok = s['social_tiktok'] || "";
  const youtube = s['social_youtube'] || "";
  
  const showInsta = s['show_instagram'] === 'true';
  const showFb = s['show_facebook'] === 'true';
  const showTw = s['show_twitter'] === 'true';
  const showLi = s['show_linkedin'] === 'true';
  const showTt = s['show_tiktok'] === 'true';
  const showYt = s['show_youtube'] === 'true';

  const isPageHidden = (slug: string) => s[`hide_page_${slug}`] === 'true';

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8 border-t border-[#333]">
      <div className="w-full mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <div className="flex flex-col items-start mb-6">
            <a href="/" aria-label="HUM Properties - Home">
              <AnimatedLogo
                light
                className="w-48 sm:w-56"
              />
            </a>
          </div>
          <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
            Discover exclusive luxury properties in Dubai with HUM Properties. Your premier destination for real estate investments, buying, and renting top-tier properties.
          </p>
          
          {/* Social Media Links */}
          <div className="flex space-x-4">
            {showInsta && instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            )}
            {showFb && facebook && (
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
            {showTw && twitter && (
              <a href={twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
            {showLi && linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            )}
            {showTt && tiktok && (
              <a href={tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 006.33 6.32 6.33 6.33 0 006.2-5.45V11.5a8.21 8.21 0 004.7 1.48V9.53a4.8 4.8 0 01-2.64-2.84z"/></svg>
              </a>
            )}
            {showYt && youtube && (
              <a href={youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[#333] flex items-center justify-center text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-colors">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-brand-gold">Quick Links</h3>
          <ul className="space-y-3 text-gray-300">
            {!isPageHidden('buy') && <li><Link href="/buy" className="hover:text-white transition">Buy Properties</Link></li>}
            {!isPageHidden('rent') && <li><Link href="/rent" className="hover:text-white transition">Rent Properties</Link></li>}
            {!isPageHidden('services') && <li><Link href="/services" className="hover:text-white transition">Property Services</Link></li>}
            {!isPageHidden('about') && <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>}
            {!isPageHidden('invest') && <li><Link href="/invest" className="hover:text-white transition">Invest in Dubai</Link></li>}
            {!isPageHidden('blogs') && <li><Link href="/blogs" className="hover:text-white transition">Insights & News</Link></li>}
            {!isPageHidden('faq') && <li><Link href="/faq" className="hover:text-white transition">FAQs</Link></li>}
            {!isPageHidden('contact') && <li><Link href="/contact" className="hover:text-brand-gold transition font-medium text-white">Contact Advisory Desk</Link></li>}
          </ul>
        </div>

        {/* Contact Info */}
        <div id="contact">
          <h3 className="text-lg font-semibold mb-6 text-brand-gold">Contact Us</h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 border border-[#333] rounded-full text-brand-gold flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-brand-gold uppercase tracking-wider font-semibold">Phone</p>
                <p className="text-lg text-white font-medium">{phone}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 border border-[#333] rounded-full text-brand-gold flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-brand-gold uppercase tracking-wider font-semibold">Email</p>
                <a href={`mailto:${email}`} className="text-lg text-white font-medium hover:text-brand-gold transition break-all">{email}</a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 border border-[#333] rounded-full text-brand-gold flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-brand-gold uppercase tracking-wider font-semibold">Visit Us</p>
                <p className="text-md text-white font-medium whitespace-pre-line">{address}</p>
                <p className="text-sm text-gray-400 mt-2"><a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold transition underline decoration-[#333]">Tap for directions</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-[#222] text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} HUM Properties. All rights reserved.</p>
      </div>
    </footer>
  );
}
