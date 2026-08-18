'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  ArrowRight,
  Search,
  Instagram, 
  Linkedin, 
  Twitter, 
  Github,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import FooterNewsletterForm from '@/components/FooterNewsletterForm';

interface BlogPost {
  id: number;
  image: string;
  category: string;
  title: string;
  date: string;
  author: string;
  content?: string;
  description?: string;
}

const DEFAULT_BLOGS: BlogPost[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
    category: "UI Design",
    title: "The Magic Behind Clean Interfaces: Secrets of Negative Space",
    date: "15 June 2026",
    author: "Fiza Rafi",
    description: "Explore the delicate balance of empty space, margins, and layout rhythm to create modern, clean, and highly legible interfaces.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
    category: "Process",
    title: "From Concept to Clicks: The Art of Responsive Web Design",
    date: "02 June 2026",
    author: "Fiza Rafi",
    description: "How to craft beautiful, fluid-grid layout containers and typography that adapt flawlessly to any screen size.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1581291518655-9523c932dedf?auto=format&fit=crop&q=80&w=800",
    category: "Technology",
    title: "The Art of Building Apps That Truly Connect with Users",
    date: "28 May 2026",
    author: "Fiza Rafi",
    description: "Deep dive into aesthetic usability, fluid micro-interactions, and visual feedback that keep users engaged.",
  },
];

export default function BlogDirectoryPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>(DEFAULT_BLOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['UI Design', 'Negative Space', 'Responsive']);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rizwan_blogs');
      if (saved) {
        setBlogs(JSON.parse(saved));
      }
      const savedSearches = localStorage.getItem('rizwan_recent_searches_blog');
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveSearchTerm = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem('rizwan_recent_searches_blog', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('rizwan_recent_searches_blog');
  };

  const categories = ['all', ...Array.from(new Set(blogs.map((b) => b.category)))];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#15120E] text-[#F9F7F2] flex items-center justify-center font-mono text-xs">
        <span className="w-2 h-2 bg-[#E59500] rounded-full animate-ping mr-2" />
        LOADING DESIGN JOURNAL...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#15120E] text-[#F9F7F2] selection:bg-[#E59500] selection:text-[#15120E]">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-[#15120E]/90 backdrop-blur-md border-b border-[#2C2419]">
        <div className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-full bg-[#E59500] flex items-center justify-center font-bold text-[#15120E] text-xl">
              R
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-[#F9F7F2]">
              Fiza<span className="text-[#E59500]">.</span>
            </span>
          </div>

          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-[#231F17] hover:bg-[#2F2920] border border-[#2C2419] text-[#A69D92] hover:text-[#E59500] rounded-full text-xs font-bold uppercase transition-all tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Showcase
          </button>
        </div>
      </header>

      {/* DIRECTORY HERO */}
      <section className="py-16 md:py-24 border-b border-[#2C2419]/50 relative overflow-hidden bg-[#231F17]/10">
        <div className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 text-center relative z-10">
          <span className="text-xs font-mono tracking-widest text-[#E59500] uppercase block mb-3">
            ✦ DESIGN MEMORANDUMS &amp; IDEAS
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F9F7F2] max-w-3xl mx-auto leading-none mb-6">
            The Design <span className="text-[#E59500]">Journal</span>
          </h1>
          <p className="text-sm sm:text-base text-[#A69D92] max-w-lg mx-auto leading-relaxed">
            Perspectives on digital craftsmanship, responsive container grids, balanced typography pairings, and modern usability diagnostics.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-10 relative space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#6B6053]" />
              <input
                type="text"
                placeholder="Search design articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveSearchTerm(searchQuery);
                  }
                }}
                className="w-full bg-[#231F17] border border-[#2C2419] rounded-full pl-11 pr-6 py-3 text-xs text-[#F9F7F2] focus:border-[#E59500] outline-none shadow-lg"
              />
            </div>

            {/* Recent Searches Pills */}
            {recentSearches.length > 0 && (
              <div className="flex items-center justify-center gap-1.5 flex-wrap text-[10px] font-mono">
                <span className="text-[#6B6053]">Recent Searches:</span>
                {recentSearches.map((term, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearchQuery(term);
                      saveSearchTerm(term);
                    }}
                    className="px-2.5 py-0.5 rounded-full bg-[#231F17] hover:bg-[#E59500] text-[#A69D92] hover:text-[#15120E] border border-[#2C2419] transition-all cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
                <button
                  onClick={clearRecentSearches}
                  className="text-[#6B6053] hover:text-red-400 ml-1 underline cursor-pointer"
                  title="Clear search history"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FILTER & JOURNAL LIST */}
      <main className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#E59500] text-[#15120E]'
                  : 'bg-[#231F17] hover:bg-[#2F2920] text-[#A69D92] hover:text-[#F9F7F2] border border-[#2C2419]'
              }`}
            >
              {cat === 'all' ? 'All Journeys' : cat}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <article 
              key={blog.id}
              onClick={() => router.push(`/blog/${blog.id}`)}
              className="group bg-[#231F17]/20 border border-[#2C2419] rounded-3xl overflow-hidden cursor-pointer hover:border-[#E59500]/60 transition-all duration-500 flex flex-col h-full"
            >
              <div className="w-full h-48 overflow-hidden relative bg-[#231F17]">
                <Image 
                  src={blog.image} 
                  alt={blog.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#E59500] uppercase block">
                    {blog.category}
                  </span>
                  <h3 className="font-bold text-base sm:text-lg text-[#F9F7F2] leading-snug group-hover:text-[#E59500] transition-colors">
                    {blog.title}
                  </h3>
                  {blog.description && (
                    <p className="text-xs text-[#A69D92] line-clamp-2 leading-relaxed mt-2">
                      {blog.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#2C2419]/50 text-[11px] font-mono text-[#6B6053]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#E59500]" />
                    <span>{blog.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#A69D92] group-hover:text-[#E59500] transition-colors font-bold">
                    <span>Read Case</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-20 bg-[#231F17]/10 rounded-3xl border border-dashed border-[#2C2419]">
            <BookOpen className="w-10 h-10 text-[#6B6053] mx-auto mb-3" />
            <h3 className="font-bold text-[#F9F7F2] text-sm">No articles matched your request</h3>
            <p className="text-xs text-[#6B6053] mt-1">Try resetting filters or clear search query.</p>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#100D09] pt-16 pb-8 text-[#A69D92] border-t border-[#2C2419]">
        <div className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          
          {/* Newsletter Banner */}
          <div className="bg-[#E59500] rounded-3xl p-6 sm:p-10 text-[#15120E] flex flex-col md:flex-row items-center justify-between gap-6 mb-12 shadow-xl">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Subscribe to Design Memorandums
              </h3>
              <p className="text-xs font-medium mt-1 text-[#15120E]/80">
                Get monthly perspectives on UI architecture, negative space, and growth marketing.
              </p>
            </div>
            <FooterNewsletterForm />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            
            <div className="md:col-span-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                <div className="w-10 h-10 rounded-full bg-[#E59500] flex items-center justify-center font-bold text-[#15120E] text-xl">
                  R
                </div>
                <span className="font-sans font-bold text-xl tracking-tight text-[#F9F7F2]">
                  Fiza<span className="text-[#E59500]">.</span>
                </span>
              </div>
              <p className="text-xs text-[#6B6053] leading-relaxed max-w-xs">
                Proven revenue scaling, high ROAS performance marketing, and Shopify Development solutions for global e-commerce and digital growth brands.
              </p>
            </div>

            <div className="md:col-span-6 flex flex-col items-start md:items-end justify-between gap-4">
              <div className="flex items-center gap-3">
                <a href="https://instagram.com/fizarafir" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#231F17]/50 border border-[#2C2419] flex items-center justify-center text-[#6B6053] hover:text-[#E59500] hover:border-[#E59500] transition-colors"><Instagram className="w-4 h-4" /></a>
                <a href="https://www.linkedin.com/in/fizarafir" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#231F17]/50 border border-[#2C2419] flex items-center justify-center text-[#6B6053] hover:text-[#E59500] hover:border-[#E59500] transition-colors"><Linkedin className="w-4 h-4" /></a>
                <a href="https://x.com/fizarafir" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#231F17]/50 border border-[#2C2419] flex items-center justify-center text-[#6B6053] hover:text-[#E59500] hover:border-[#E59500] transition-colors"><Twitter className="w-4 h-4" /></a>
                <a href="https://github.com/Fizasaeed61" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#231F17]/50 border border-[#2C2419] flex items-center justify-center text-[#6B6053] hover:text-[#E59500] hover:border-[#E59500] transition-colors"><Github className="w-4 h-4" /></a>
              </div>
              <p className="text-xs text-[#6B6053]">© 2026 Fiza Rafi. All rights reserved.</p>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
