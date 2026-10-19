import blogsData from "@/lib/blogs.json";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const blog = blogsData.find(b => b.slug === slug);

  if (!blog || !blog.published) {
    notFound();
  }

  const relatedBlogs = blogsData
    .filter(b => b.published && b.id !== blog.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f8f9fa] pt-32 pb-24">
      
      {/* Container for Hero and Content */}
      <div className="w-full mx-auto px-4 md:px-8">
        
        {/* Hero Section */}
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-[2rem] overflow-hidden shadow-xl mb-12">
          <img 
            src={blog.image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80"}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          
          {/* Top Breadcrumbs */}
          <div className="absolute top-6 left-6 z-10 flex space-x-2 text-xs font-medium bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-full text-white transition-colors cursor-pointer border border-white/10">
            <Link href="/" className="flex items-center"><ArrowLeft className="w-3.5 h-3.5 mr-1"/> Home</Link>
            <span>/</span>
            <Link href="/blogs">Blogs</Link>
            <span>/</span>
            <span className="truncate max-w-[200px] text-white/80">{blog.title}</span>
          </div>

          {/* Top Right Read Time */}
          <div className="absolute top-6 right-6 z-10 bg-white hover:bg-gray-50 text-blue-600 font-medium px-4 py-2 rounded-full text-sm shadow-sm transition-colors cursor-default">
            5 min read
          </div>

          {/* Title Box Overlay (Bottom Left) */}
          <div className="absolute bottom-0 left-0 max-w-3xl bg-black/60 backdrop-blur-md rounded-tr-[2rem] p-8 md:p-10 border-t border-r border-white/10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex items-center space-x-4">
              {/* Author Avatar */}
              <div className="w-12 h-12 rounded-full bg-brand-gold overflow-hidden flex items-center justify-center border-2 border-white/20 flex-shrink-0">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col text-sm">
                <span className="text-gray-300">Written by</span>
                <span className="font-bold text-white tracking-wide">{blog.author}</span>
                <span className="text-gray-400 text-xs mt-0.5">Updated: {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              
              {/* Table of Contents Mock */}
              <div className="mb-10 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-xl font-heading font-bold text-brand-black mb-4">Table of Contents</h3>
                <ul className="space-y-3 text-blue-600 font-medium">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3"></span>Introduction</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3"></span>Key Takeaways</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3"></span>Market Analysis</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3"></span>Investment Strategies</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3"></span>Conclusion</li>
                </ul>
              </div>

              {/* Prose Content */}
              <article className="prose prose-lg prose-gray max-w-none 
                prose-headings:font-heading prose-headings:font-bold prose-headings:text-brand-black
                prose-a:text-blue-600 hover:prose-a:text-blue-800 transition-colors
                prose-img:rounded-3xl prose-img:shadow-md
                leading-relaxed text-gray-700
              ">
                <ReactMarkdown>{blog.content}</ReactMarkdown>
              </article>
            </div>
          </div>

          {/* Sidebar / Empty Space (Right) */}
          <div className="hidden lg:block lg:col-span-4 relative">
            <div className="sticky top-32">
              {/* Could put related articles or form here in the future */}
            </div>
          </div>

        </div>

        {/* You May Also Like Section */}
        {relatedBlogs.length > 0 && (
          <section className="mt-20 pt-16 border-t border-gray-200">
            <h3 className="text-2xl font-heading font-bold text-brand-black mb-8">You May Also Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <Link href={`/blogs/${relatedBlog.slug}`} key={relatedBlog.id} className="group cursor-pointer">
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                    <img 
                      src={relatedBlog.image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"}
                      alt={relatedBlog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h4 className="text-lg font-heading font-bold text-brand-black group-hover:text-brand-gold transition-colors line-clamp-2">
                    {relatedBlog.title}
                  </h4>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                    {relatedBlog.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
