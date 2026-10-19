import Link from "next/link";
import blogsData from "@/lib/blogs.json";
import { Calendar, ArrowRight, User } from "lucide-react";
import Image from "next/image";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogsHub() {
  const blogs = [...blogsData]
    .filter(b => b.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const featuredBlog = blogs.length > 0 ? blogs[0] : null;
  const regularBlogs = blogs.length > 1 ? blogs.slice(1) : [];

  return (
    <main className="min-h-screen bg-[#faf9f7] pt-20 pb-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full p-5 md:p-10 lg:p-12 flex flex-col items-center justify-center h-[calc(100svh-5rem)]">
        <div className="relative w-full flex-1 min-h-[440px] rounded-[2rem] md:rounded-[2.5rem] bg-black isolate transform-gpu overflow-hidden flex items-center justify-center text-center shadow-none group px-6 py-12 md:px-24 md:py-20 animate-[fadeInUp_0.8s_ease-out_forwards]">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full scale-105 group-hover:scale-100 transition-transform duration-[10s] ease-out z-0">
            <img 
              src="/page-assets/blogs/blogs-1.webp" 
              alt="Dubai Architecture" 
              className="w-full h-full object-cover rounded-[2rem] md:rounded-[2.5rem]"
            />
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10"></div>
          </div>

          <div className="relative z-20 max-w-3xl flex flex-col items-center justify-center pt-8">
            <span className="text-[#d4af37] font-semibold tracking-[0.2em] text-xs md:text-sm uppercase mb-3 md:mb-4">
              Exclusive Insights
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4 leading-tight drop-shadow-md">
              Our Journal
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto font-light drop-shadow">
              Expert analysis, market updates, and buying guides straight from Mohd. Alfalasi's desk.
            </p>
          </div>
        </div>
      </section>

      <div className="w-full mx-auto px-6 lg:px-12 mt-12">

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No insights published yet. Check back soon!
          </div>
        ) : (
          <>
            {/* Featured Blog */}
            {featuredBlog && (
              <Link href={`/blogs/${featuredBlog.slug}`} className="group block mb-20 relative overflow-hidden rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-3/5 h-80 lg:h-[32rem] relative overflow-hidden">
                    <img 
                      src={featuredBlog.image || "/page-assets/blogs/blogs-2.webp"} 
                      alt={featuredBlog.title}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
                      <span className="text-[10px] font-bold tracking-widest text-[#C4A259] uppercase">Featured</span>
                    </div>
                  </div>
                  <div className="lg:w-2/5 p-10 md:p-14 flex flex-col justify-center">
                    <div className="flex items-center space-x-4 mb-6 text-xs font-bold tracking-widest uppercase text-gray-500">
                      <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-2 text-[#C4A259]" /> {new Date(featuredBlog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-black mb-6 leading-tight group-hover:text-[#C4A259] transition-colors">
                      {featuredBlog.title}
                    </h2>
                    <p className="text-gray-500 font-light leading-relaxed mb-10 line-clamp-3">
                      {featuredBlog.excerpt}
                    </p>
                    <div className="inline-flex items-center space-x-3 text-brand-black font-semibold mt-auto">
                      <span className="uppercase tracking-widest text-xs">Read Article</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid for remaining blogs */}
            {regularBlogs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularBlogs.map(blog => (
                  <Link key={blog.id} href={`/blogs/${blog.slug}`} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={blog.image || "/page-assets/blogs/blogs-3.webp"} 
                        alt={blog.title}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center space-x-4 mb-4 text-[10px] font-bold tracking-widest uppercase text-gray-400">
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-[#C4A259]" />
                        <span>{blog.author}</span>
                      </div>
                      <h3 className="text-xl font-heading font-bold text-brand-black mb-4 leading-snug group-hover:text-[#C4A259] transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-500 font-light text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <div className="inline-flex items-center space-x-2 text-brand-black font-semibold border-b-2 border-brand-black group-hover:border-[#C4A259] group-hover:text-[#C4A259] transition-colors pb-1 w-max">
                        <span className="uppercase tracking-widest text-[10px]">Read More</span>
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
