'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight,
  Search,
  Check,
  Sparkles,
  Layers,
  ChevronRight,
  PlusCircle,
  Wrench,
  Cpu,
  Tv,
  Globe,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceItem {
  id: number;
  num: string;
  title: string;
  desc: string;
  highlights: string[];
  stats?: { label: string; value: string }[];
  processes?: { step: string; title: string; desc: string }[];
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 1,
    num: "01",
    title: "Branding",
    desc: "Creating a cohesive, powerful visual identity for your business. We build brand guidelines, design guidelines, and define typography and custom color palettes that tell your story.",
    highlights: ["Graphic Designing", "Video Editing", "Content Creation", "Visual Identity Guidelines", "Logo & Typography"],
  },
  {
    id: 2,
    num: "02",
    title: "Web Development",
    desc: "Building high-performance, modern web architectures with robust frontends and scalable servers. Seamless styling, clean APIs, and optimized databases tailored to your specifications.",
    highlights: ["Next.js & React Development", "Custom CMS Systems", "Responsive Frontends", "RESTful API Gateways", "Database Architectures"],
  },
  {
    id: 3,
    num: "03",
    title: "Digital Marketing",
    desc: "Developing strategic growth campaigns that maximize conversion rates, expand audience reach, and scale digital sales channels across search engines and social platforms.",
    highlights: ["Search Engine Optimization (SEO)", "Social Media Marketing (SMM)", "Pay-Per-Click Advertising (PPC)", "Conversion Rate Optimization", "Growth Data Analytics"],
  },
  {
    id: 4,
    num: "04",
    title: "AI Agent",
    desc: "Engineering smart AI models, deep agentic workflows, and customized semantic capabilities into your platform. Automating high-friction client interaction and system tasks seamlessly.",
    highlights: ["LLM Fine-tuning & Embeddings", "Agentic Decision Workflows", "Dynamic LLM Prompting", "Semantic Search Routing", "RAG Pipeline Deployment"],
  },
  {
    id: 5,
    num: "05",
    title: "WhatsApp Automation",
    desc: "Optimizing communication channels with automated WhatsApp chat flows, lead qualification bots, and system alerts. Directly link CRM events and broadcast campaigns.",
    highlights: ["Automated Chat Flow Pipelines", "Lead Qualification Bots", "CRM Event Integrations", "System Notification Alerts", "High-Volume Broadcasters"],
  },
];

export default function ServicesDirectoryPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rizwan_services');
      const loadedServices = saved ? JSON.parse(saved) : DEFAULT_SERVICES;
      Promise.resolve().then(() => {
        setServices(loadedServices);
        setLoading(false);
      });
    } catch (e) {
      Promise.resolve().then(() => {
        setServices(DEFAULT_SERVICES);
        setLoading(false);
      });
    }
  }, []);

  const filteredServices = services.filter((service) => {
    return service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           service.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
           service.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#15120E] text-[#F9F7F2] flex items-center justify-center font-mono text-xs">
        <span className="w-2 h-2 bg-[#E59500] rounded-full animate-ping mr-2" />
        LOADING SERVICES...
      </div>
    );
  }

  // Helper to assign a relevant icon to each service title
  const getServiceIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('brand') || t.includes('design') || t.includes('graphic')) {
      return <Tv className="w-6 h-6 text-[#E59500]" />;
    } else if (t.includes('web') || t.includes('code') || t.includes('develop')) {
      return <Globe className="w-6 h-6 text-[#E59500]" />;
    } else if (t.includes('marketing') || t.includes('seo') || t.includes('market')) {
      return <Share2 className="w-6 h-6 text-[#E59500]" />;
    } else if (t.includes('ai') || t.includes('agent') || t.includes('smart')) {
      return <Cpu className="w-6 h-6 text-[#E59500]" />;
    } else {
      return <Wrench className="w-6 h-6 text-[#E59500]" />;
    }
  };

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

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/?tab=admin')}
              className="px-4 py-2 hover:bg-[#231F17] text-[#A69D92] hover:text-[#F9F7F2] text-xs font-bold uppercase transition-all tracking-wider rounded-xl cursor-pointer border border-[#2C2419]/50"
            >
              Admin Panel
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-[#231F17] hover:bg-[#2F2920] border border-[#2C2419] text-[#A69D92] hover:text-[#E59500] rounded-full text-xs font-bold uppercase transition-all tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Showcase
            </button>
          </div>
        </div>
      </header>

      {/* DIRECTORY HERO */}
      <section className="py-16 md:py-24 border-b border-[#2C2419]/50 relative overflow-hidden bg-[#231F17]/10">
        <div className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 text-center relative z-10">
          <span className="text-xs font-mono tracking-widest text-[#E59500] uppercase block mb-3">
            ✦ HIGH-IMPACT EXPERTISE
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F9F7F2] max-w-3xl mx-auto leading-none mb-6">
            Our Specialized <span className="text-[#E59500]">Services</span>
          </h1>
          <p className="text-sm sm:text-base text-[#A69D92] max-w-xl mx-auto leading-relaxed">
            Unifying rigorous branding, blazing fast web architectures, high-ROI marketing pipelines, smart autonomous AI workflows, and conversational WhatsApp systems.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-10 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search services or capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E1A14] border border-[#2C2419] text-[#F9F7F2] rounded-full px-6 py-3.5 pl-12 text-xs focus:border-[#E59500] outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-[#6B6053] absolute left-4.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </section>

      {/* SERVICES LIST GRID */}
      <section className="py-20 w-full max-w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {filteredServices.length === 0 ? (
          <div className="text-center py-20 bg-[#231F17]/10 border border-[#2C2419]/40 rounded-3xl">
            <Layers className="w-8 h-8 text-[#6B6053] mx-auto mb-3" />
            <p className="text-sm text-[#A69D92]">No services matched your search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  y: -8,
                  boxShadow: "0 22px 40px -12px rgba(229, 149, 0, 0.18), 0 12px 30px -8px rgba(0, 0, 0, 0.7)",
                  transition: { duration: 0.25, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-[#231F17]/40 border border-[#2C2419] rounded-3xl p-8 hover:border-[#E59500]/50 transition-colors group flex flex-col justify-between relative overflow-hidden"
                id={`service-card-${service.id}`}
              >
                <div className="space-y-6">
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-[#E59500]/5 rounded-2xl border border-[#E59500]/10">
                      {getServiceIcon(service.title)}
                    </div>
                    <span className="font-mono text-xs text-[#6B6053] font-bold">
                      {service.num || `0${index + 1}`}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#F9F7F2] group-hover:text-[#E59500] transition-colors tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-xs text-[#A69D92] leading-relaxed line-clamp-4">
                      {service.desc}
                    </p>
                  </div>

                  {/* Highlights List */}
                  <div className="pt-2 border-t border-[#2C2419]/30">
                    <span className="text-[10px] font-mono text-[#6B6053] uppercase tracking-wider block mb-3 font-semibold">
                      Featured Deliverables
                    </span>
                    <ul className="space-y-2">
                      {service.highlights.slice(0, 4).map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-[#F9F7F2]/90">
                          <Check className="w-3.5 h-3.5 text-[#E59500] shrink-0" />
                          <span className="truncate">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* View Button */}
                <div className="pt-8">
                  <button
                    onClick={() => router.push(`/services/${service.id || index + 1}`)}
                    className="w-full py-3 bg-[#231F17] group-hover:bg-[#E59500] text-[#A69D92] group-hover:text-[#15120E] text-xs font-bold uppercase tracking-wider rounded-2xl cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 border border-[#2C2419]/80 group-hover:border-transparent"
                  >
                    <span>Explore Service Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER CTA BRANDING */}
      <footer className="py-20 border-t border-[#2C2419] bg-[#1E1A14]/10">
        <div className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E59500]/5 border border-[#E59500]/10 rounded-full text-[10px] font-mono text-[#E59500] uppercase font-semibold">
            <Sparkles className="w-3 h-3 animate-spin" /> Let&apos;s Collaborate
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F9F7F2] max-w-2xl mx-auto leading-tight tracking-tight">
            Ready to deploy custom <span className="text-[#E59500]">excellence</span> for your brand?
          </h2>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <button
              onClick={() => router.push('/?tab=contact')}
              className="px-8 py-3.5 bg-[#E59500] hover:bg-[#F1A417] text-[#15120E] font-bold text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-lg"
            >
              Inquire Project
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-3.5 bg-transparent hover:bg-[#231F17] text-[#F9F7F2] border border-[#2C2419] font-bold text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer"
            >
              View Work Portfolio
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
