'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ArrowRight,
  Search,
  Instagram, 
  Linkedin, 
  Twitter, 
  Github,
  Layers,
  Sparkles,
  Tag
} from 'lucide-react';
import { motion } from 'motion/react';
import FooterNewsletterForm from '@/components/FooterNewsletterForm';

interface Project {
  id: number;
  category: 'web' | 'ui-ux' | 'app' | 'all';
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats: { label: string; value: string }[];
  tags: string[];
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    category: 'app',
    title: "BakeryShop",
    subtitle: "Bakery Shop Mobile App Portfolio",
    description: "A gorgeous, sensory-focused mobile application for an artisan bakery. Seamless ordering, interactive crust customization, and clean aesthetic micro-interactions.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    stats: [
      {label: "User Rating", value: "4.9/5"},
      {label: "Conversion Rate", value: "+38%"},
      {label: "Active Users", value: "14K+"},
    ],
    tags: ["Figma", "UI/UX Design", "Mobile App"],
  },
  {
    id: 2,
    category: 'web',
    title: "LÉclat Store",
    subtitle: "Clothing Store - Clothing & E-Commerce Website",
    description: "A luxury editorial e-commerce experience designed for a premium sustainable fashion brand. Focused on stunning typography, seamless grid layouts, and smooth transition previews.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
    stats: [
      {label: "Checkout Speed", value: "1.2s"},
      {label: "Sales Revenue", value: "+45%"},
      {label: "Visual Rating", value: "98/100"},
    ],
    tags: ["Web Design", "Sustainable", "Figma Design"],
  },
  {
    id: 3,
    category: 'ui-ux',
    title: "CloudPulse SaaS",
    subtitle: "SaaS Analytical Monitoring Dashboard",
    description: "A highly complex real-time cloud infrastructure monitoring workspace. Simplifying high-density data visualizations, metric feeds, and dark/light system states.",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
    stats: [
      {label: "Response Speed", value: "Realtime"},
      {label: "Cognitive Load", value: "-25%"},
      {label: "Custom Widgets", value: "40+"},
    ],
    tags: ["Dashboard", "UI/UX Architecture", "Design System"],
  },
];

export default function ProjectDirectoryPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['SaaS', 'E-commerce', 'Dashboard']);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'web' | 'ui-ux' | 'app'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rizwan_projects') || localStorage.getItem('jenny_projects');
      if (saved) {
        setProjects(JSON.parse(saved));
      }
      const savedSearches = localStorage.getItem('rizwan_recent_searches_project');
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
      localStorage.setItem('rizwan_recent_searches_project', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('rizwan_recent_searches_project');
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedFilter === 'all' || project.category === selectedFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#15120E] text-[#F9F7F2] flex items-center justify-center font-mono text-xs">
        <span className="w-2 h-2 bg-[#E59500] rounded-full animate-ping mr-2" />
        LOADING SHOWCASE...
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
            ✦ SELECTED CASE STUDIES &amp; WORKS
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F9F7F2] max-w-3xl mx-auto leading-none mb-6">
            Portfolio <span className="text-[#E59500]">Showcase</span>
          </h1>
          <p className="text-sm sm:text-base text-[#A69D92] max-w-lg mx-auto leading-relaxed">
            Deliberate spatial design, clean layouts, custom analytics dashboards, and highly polished mobile visual frameworks.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-10 relative space-y-3">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#6B6053]" />
              <input
                type="text"
                placeholder="Search projects by tag or title..."
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

      {/* FILTER & WORKS SHOWCASE */}
      <main className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-16">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'web', label: 'Web Design' },
            { id: 'ui-ux', label: 'UI/UX Design' },
            { id: 'app', label: 'Mobile Apps' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedFilter(btn.id as any)}
              className={`px-4.5 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                selectedFilter === btn.id
                  ? 'bg-[#E59500] text-[#15120E]'
                  : 'bg-[#231F17] hover:bg-[#2F2920] text-[#A69D92] hover:text-[#F9F7F2] border border-[#2C2419]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              onClick={() => router.push(`/project/${project.id}`)}
              className="group bg-[#231F17]/25 border border-[#2C2419] hover:border-[#E59500]/60 rounded-3xl overflow-hidden transition-all duration-500 flex flex-col h-full cursor-pointer shadow-lg hover:shadow-black/40"
            >
              {/* Image Container */}
              <div className="w-full h-52 relative overflow-hidden bg-[#231F17]">
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text Context */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-black text-[#E59500] uppercase tracking-widest bg-[#E59500]/10 px-2 py-0.5 rounded">
                      {project.category === 'web' ? 'Web' : project.category === 'app' ? 'Mobile App' : 'UI/UX'}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#F9F7F2] group-hover:text-[#E59500] transition-colors leading-tight">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#A69D92] leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Tags and Case Action */}
                <div className="pt-4 border-t border-[#2C2419]/50 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[9px] font-mono text-[#6B6053]">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-[#E59500] group-hover:text-white transition-colors flex items-center gap-1 font-bold">
                    View Journal <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20 bg-[#231F17]/10 rounded-3xl border border-dashed border-[#2C2419]">
            <Layers className="w-10 h-10 text-[#6B6053] mx-auto mb-3" />
            <h3 className="font-bold text-[#F9F7F2] text-sm">No matching case studies</h3>
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
                Get Case Study Deep Dives
              </h3>
              <p className="text-xs font-medium mt-1 text-[#15120E]/80">
                Exclusive insights into ROAS optimization, e-commerce scaling, and custom web architecture.
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
