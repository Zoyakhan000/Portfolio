'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Tag, 
  CheckCircle2, 
  Shield, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Github,
  Award,
  Layers,
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Project {
  id: number;
  category: 'web' | 'ui-ux' | 'app' | 'all';
  title: string;
  subtitle: string;
  description: string;
  image: string;
  gallery?: string[];
  stats: { label: string; value: string; trend?: string; detail?: string }[];
  tags: string[];
  processContent?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
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
    processContent: `## Project Vision & UX Objectives
Our core challenge was translating the tactile, sensory-rich experience of entering a brick-and-mortar artisan bakery into a digital storefront. We designed a mobile app prioritizing visual texture, clear spatial distributions, and highly responsive micro-transactions.

### Key Milestones
1. **Interactive Crust Customization**: Built an immersive gesture-based interface allowing users to slide and tap their preferred crust style, flour grain ratios, and bake intensity.
2. **Seamless Frictionless Checkout**: Designed a single-screen checkout process backed by automated payment routing, resulting in a **38% conversion bump** compared to previous legacy sites.
3. **Accessibility Integration**: Configured touch targets to exceed 48px, optimized structural font contrast, and fully integrated screen reader voiceover descriptions.

## Visual Styling Choices
- **Color Accent**: Deep rich bronze (#E59500) paired with charcoal grey (#15120E).
- **Typography Pairing**: Elegant display headers paired with highly readable monospaced layout elements.
- **Micro-animations**: Staggered cards and springy loading transitions that elevate user delight.`
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
    processContent: `## The Rebranding & Platform Strategy
L'Éclat is a sustainable luxury fashion house. To honor their dedication to slow fashion and meticulous craftsmanship, we built an editorial-focused e-commerce experience that feels more like a premium high-art magazine than a standard grid-locked shopping cart.

### Key Solutions
* **Editorial Grids**: Designed modular asymmetric layout sections that highlight large, high-contrast imagery and keep negative space spacious and eye-safe.
* **Micro-interactions**: Created smooth hover previews that fade out secondary images and reveal textile information dynamically.
* **Instant Payments**: Optimized API handshakes and pre-rendered checkout components to compress delivery latency down to an exceptional **1.2s**.

## Execution & Craftsmanship
We avoided purple/blue generic gradients and default templates entirely. Every single block utilizes high-contrast off-whites and charcoal shades, ensuring a classic, timeless feel that matches the sustainable ethos of the apparel lines.`
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
    processContent: `## Overcoming Data Density Noise
CloudPulse provides real-time telemetry from thousands of microservices. The absolute highest UX priority was organizing this high-density feed into logical, scannable layouts without overwhelming cloud engineers.

### Designing the Bento Grid Analytics
1. **Adaptive Visual Hierarchy**: Positioned high-priority alert cards on the top left, bounded by a high-contrast accent ring.
2. **Dense Data Contrast**: Utilized custom dark mode color spectrums (muted cyans, clean ambers, and warning reds) engineered strictly to prevent eye fatigue.
3. **Interactive Widget Assembly**: Engineered an inline customizer panel letting developers pin, drag, and resize up to 40+ analytics widgets.

## Results & Impact
By separating dense telemetry streams with meticulous layout borders and consistent 8px gutters, we cut the cognitive onboarding time for cloud operators by **25%** and received design acclaim from global tech teams.`
  }
];

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? parseInt(params.id as string) : null;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // SEO Editing & AI States
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [seoSaved, setSeoSaved] = useState(false);
  const [autoDrafting, setAutoDrafting] = useState(false);
  const [generatingKeywords, setGeneratingKeywords] = useState(false);

  // Lightbox Modal States
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Global scroll read progress calculation
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (id === null) return;
    try {
      const saved = localStorage.getItem('rizwan_projects');
      const projectsList: Project[] = saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
      const found = projectsList.find((p) => p.id === id);
      
      Promise.resolve().then(() => {
        if (found) {
          // Map dynamic content if not existing
          if (!found.processContent) {
            const matchedDefault = DEFAULT_PROJECTS.find((d) => d.id === found.id || d.title === found.title);
            found.processContent = matchedDefault?.processContent || `## Growth Process & Methodology

This project showcases Fiza Rafi's signature strategic targeting, visual alignment, and conversion rate optimization.

### Core Phases
1. **Data Analytics Auditing**: Evaluated acquisition funnels, tracked pixel fires, and located user exit bottlenecks.
2. **Funnel Architecture & Copywriting**: Formulated premium custom landing pages on Shopify with targeted value propositions.
3. **Ad Targeting & Optimization**: Built laser-targeted lookalike and retargeting ads with high aesthetic consistency.`;
          }

          // Ensure project has gallery images array
          if (found.gallery === undefined) {
            found.gallery = [
              found.image,
              `https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200`,
              `https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200`
            ];
          }

          setProject(found);
          setSeoTitle(found.seoTitle || `${found.title} | Fiza Rafi Showcase`);
          setSeoDescription(found.seoDescription || found.description || '');
          setSeoKeywords(found.seoKeywords || (found.tags ? found.tags.join(', ') : ''));
        }
        setLoading(false);
      });
    } catch (e) {
      console.error(e);
      Promise.resolve().then(() => {
        setLoading(false);
      });
    }
  }, [id]);

  // Handle Save SEO Metadata to localStorage
  const handleSaveSeo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    const updatedProject: Project = {
      ...project,
      seoTitle,
      seoDescription,
      seoKeywords,
      description: seoDescription || project.description,
    };

    setProject(updatedProject);

    try {
      const saved = localStorage.getItem('rizwan_projects');
      const projectsList: Project[] = saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
      const updatedList = projectsList.map((p) => (p.id === project.id ? updatedProject : p));
      localStorage.setItem('rizwan_projects', JSON.stringify(updatedList));

      // Also sync jenny_projects
      localStorage.setItem('jenny_projects', JSON.stringify(updatedList));

      setSeoSaved(true);
      setTimeout(() => setSeoSaved(false), 3000);
      
      if (typeof document !== 'undefined') {
        document.title = seoTitle || `${updatedProject.title} | Fiza Rafi`;
      }
    } catch (err) {
      console.error('Error saving SEO metadata:', err);
    }
  };

  // AI Auto-Draft Description Handler
  const handleAutoDraftDescription = async () => {
    if (!project) return;
    setAutoDrafting(true);
    try {
      const res = await fetch('/api/auto-draft-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          subtitle: project.subtitle,
          category: project.category,
          processContent: project.processContent || '',
        }),
      });
      const data = await res.json();
      if (data.description) {
        setSeoDescription(data.description);
      }
    } catch (err) {
      console.error('Error auto-drafting description:', err);
    } finally {
      setAutoDrafting(false);
    }
  };

  // AI Auto-Generate Keywords Handler
  const handleGenerateKeywords = async () => {
    if (!project) return;
    setGeneratingKeywords(true);
    try {
      const res = await fetch('/api/generate-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          description: seoDescription || project.description,
          typeLabel: project.category,
          urlPath: `/project/${project.id}`,
        }),
      });
      const data = await res.json();
      if (data.keywords) {
        setSeoKeywords(data.keywords);
      }
    } catch (err) {
      console.error('Error generating keywords:', err);
    } finally {
      setGeneratingKeywords(false);
    }
  };

  const galleryList = project?.gallery && project.gallery.length > 0 
    ? project.gallery 
    : (project?.image ? [project.image] : []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = useCallback(() => {
    if (galleryList.length === 0) return;
    setLightboxIndex((prev) => (prev + 1) % galleryList.length);
  }, [galleryList.length]);

  const prevImage = useCallback(() => {
    if (galleryList.length === 0) return;
    setLightboxIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length);
  }, [galleryList.length]);

  // Keyboard navigation listener for Esc, Left, Right
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, nextImage, prevImage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#15120E] text-[#F9F7F2] flex items-center justify-center font-mono text-xs">
        <span className="w-2 h-2 bg-[#E59500] rounded-full animate-ping mr-2" />
        LOADING PROJECT DETAILS...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#15120E] text-[#F9F7F2] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold font-mono text-[#E59500] mb-2">PROJECT NOT FOUND</h2>
        <p className="text-xs text-[#A69D92] mb-6">The portfolio project you are looking for does not exist or has been deleted.</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-[#E59500] text-[#15120E] text-xs font-bold uppercase rounded-full tracking-wider hover:bg-white transition-colors cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Showcase
        </button>
      </div>
    );
  }

  // Parse custom format markup dynamically
  const renderMarkup = (text: string) => {
    return text.split('\n\n').map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-bold tracking-tight text-[#E59500] mt-10 mb-4 border-b border-[#2C2419] pb-3">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base sm:text-lg font-bold text-[#F9F7F2] mt-8 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const items = trimmed.split(/\n[\*\-]\s/);
        return (
          <ul key={idx} className="list-disc pl-5 my-5 space-y-2 text-[#A69D92]">
            {items.map((item, i) => (
              <li key={i} className="text-xs sm:text-sm leading-relaxed">
                {item.replace(/^[\*\-]\s/, '')}
              </li>
            ))}
          </ul>
        );
      }
      if (trimmed.startsWith('1. ')) {
        const items = trimmed.split(/\n\d+\.\s/);
        return (
          <ol key={idx} className="list-decimal pl-5 my-5 space-y-2 text-[#A69D92]">
            {items.map((item, i) => (
              <li key={i} className="text-xs sm:text-sm leading-relaxed">
                {item.replace(/^\d+\.\s/, '')}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <p key={idx} className="text-xs sm:text-sm text-[#A69D92] leading-relaxed mb-4 whitespace-pre-line text-justify">
          {trimmed.split('**').map((chunk, i) => {
            if (i % 2 === 1) {
              return <strong key={i} className="text-[#F9F7F2] font-semibold">{chunk}</strong>;
            }
            return chunk;
          })}
        </p>
      );
    });
  };

  return (
    <div className="relative min-h-screen bg-[#15120E] text-[#F9F7F2] selection:bg-[#E59500] selection:text-[#15120E]">
      
      {/* BREADCRUMB JSON-LD SCHEMA */}
      {project && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://rizwansaddique.site/',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Projects',
                  item: 'https://rizwansaddique.site/project',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: project.title,
                  item: `https://rizwansaddique.site/project/${project.id}`,
                },
              ],
            }),
          }}
        />
      )}
      
      {/* GLOBAL READ PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#2C2419] z-[100] overflow-hidden pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-[#E59500] via-[#F59E0B] to-[#38BDF8] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

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

      {/* BODY GRID */}
      <main className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12 md:py-20">
        
        {/* Intro Section */}
        <div className="max-w-3xl mb-12 animate-fadeIn">
          <span className="text-xs font-mono tracking-widest text-[#E59500] uppercase block mb-2">
            ✦ SELECTED CASE STUDY • {project.category === 'web' ? 'WEB DESIGN' : project.category === 'app' ? 'MOBILE APP' : 'UI/UX DESIGN'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F9F7F2] mb-4 leading-tight">
            {project.title}
          </h1>
          <p className="text-lg text-[#A69D92] font-medium leading-relaxed">
            {project.subtitle}
          </p>
        </div>

        {/* PROJECT ANALYTICS DASHBOARD ROW */}
        <div className="mb-12 bg-gradient-to-r from-[#1A1612] via-[#231F17] to-[#1A1612] border border-[#2C2419] p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#E59500]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#2C2419]">
            <div>
              <span className="text-[10px] font-mono text-[#E59500] uppercase tracking-widest block mb-1">
                ✦ PERFORMANCE & IMPACT METRICS
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#F9F7F2] tracking-tight">
                Project Analytics Dashboard
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#E59500]/10 border border-[#E59500]/30 text-[#E59500] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" /> Verified Live Metrics
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(project.stats && project.stats.length > 0 ? project.stats : [
              { label: "Conversion Rate", value: "+38%", trend: "↑ 18% vs baseline", detail: "Mobile checkout lift" },
              { label: "Page Load Speed", value: "0.8s", trend: "⚡ Core Web Vitals", detail: "Edge pre-render" },
              { label: "Active Cohort", value: "14K+", trend: "★ Top 1% Active", detail: "Verified user retention" },
            ]).map((stat, idx) => {
              let percentage = 85;
              if (stat.value.includes('%')) {
                const num = parseFloat(stat.value.replace(/[^0-9.]/g, ''));
                if (!isNaN(num)) percentage = Math.min(100, Math.max(25, num));
              } else if (stat.value.includes('s')) {
                percentage = 94;
              } else if (stat.value.includes('4.') || stat.value.includes('5.')) {
                percentage = 98;
              }

              return (
                <div 
                  key={idx} 
                  className="bg-[#15120E] border border-[#2C2419] hover:border-[#E59500]/40 p-5 rounded-2xl relative group transition-all duration-300 hover:scale-[1.02] shadow-md flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#A69D92] block">
                        {stat.label}
                      </span>
                      <p className="text-3xl sm:text-4xl font-black font-mono text-[#E59500] tracking-tight mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-[#231F17] text-[#10B981] border border-[#10B981]/20 shrink-0">
                      {stat.trend || '↑ High Impact'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-[#6B6053]">
                      <span>{stat.detail || 'Performance score metric'}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#231F17] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#E59500] via-[#F59E0B] to-[#10B981] rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Image & Editorial Copy Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Visual Showcase & Tags */}
          <div className="lg:col-span-7 space-y-8">
            <div 
              onClick={() => openLightbox(0)}
              className="rounded-3xl overflow-hidden border border-[#2C2419] bg-[#15120E] h-64 sm:h-[420px] relative group cursor-pointer shadow-xl hover:border-[#E59500]/50 transition-all duration-300"
            >
              <Image 
                src={galleryList[0] || project.image} 
                alt={project.title} 
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                <span className="px-3 py-1 rounded-full bg-[#15120E]/90 border border-[#2C2419] text-[#E59500] font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5" /> Click for Full Screen Lightbox
                </span>
                <span className="w-9 h-9 rounded-full bg-[#E59500] text-[#15120E] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Gallery Thumbnail Strip */}
            {galleryList.length > 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-[#E59500] uppercase tracking-widest flex items-center gap-1.5">
                    ✦ GALLERY SHOWCASE ({galleryList.length} ASSETS)
                  </h4>
                  <span className="text-[10px] text-[#A69D92] font-mono">Select image to inspect</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {galleryList.map((imgUrl, gIdx) => (
                    <div 
                      key={gIdx}
                      onClick={() => openLightbox(gIdx)}
                      className={`relative rounded-2xl overflow-hidden border ${gIdx === lightboxIndex ? 'border-[#E59500] ring-1 ring-[#E59500]' : 'border-[#2C2419] hover:border-[#E59500]/40'} bg-[#15120E] h-24 sm:h-28 cursor-pointer group transition-all`}
                    >
                      <Image 
                        src={imgUrl} 
                        alt={`Gallery ${gIdx + 1}`} 
                        fill
                        sizes="(max-width: 768px) 33vw, 20vw"
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors z-10" />
                      <div className="absolute bottom-1.5 left-1.5 bg-[#15120E]/80 text-[#F9F7F2] font-mono text-[9px] px-1.5 py-0.5 rounded border border-[#2C2419] z-10">
                        0{gIdx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-[#231F17]/20 border border-[#2C2419] p-6 rounded-2xl">
              <h4 className="text-xs font-mono text-[#E59500] uppercase tracking-widest mb-4">✦ TECHNICAL STACK & DISCIPLINES</h4>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="px-3.5 py-1.5 rounded-lg bg-[#15120E] border border-[#2C2419] text-[#A69D92] font-mono text-xs flex items-center gap-1.5"
                  >
                    <Tag className="w-3.5 h-3.5 text-[#E59500]" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Case study description content */}
          <div className="lg:col-span-5 bg-[#231F17]/35 border border-[#2C2419] rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-[#2C2419]">
              <Layers className="w-5 h-5 text-[#E59500]" />
              <h3 className="font-bold text-sm text-[#F9F7F2] uppercase tracking-wider">PROJECT DESIGN JOURNAL</h3>
            </div>
            
            <div className="prose prose-invert text-[#A69D92] max-w-none prose-p:leading-relaxed">
              {renderMarkup(project.processContent || '')}
            </div>
          </div>

        </div>

        {/* ADMIN SEO METADATA EDITOR SECTION */}
        <div className="mt-16 bg-[#1A1612] border border-[#2C2419] p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2C2419] mb-6 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E59500]/10 border border-[#E59500]/30 flex items-center justify-center text-[#E59500]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#F9F7F2] uppercase tracking-wider">
                  PROJECT SEO METADATA CONTROL CENTER
                </h3>
                <p className="text-[11px] text-[#A69D92]">
                  Customize search engine metadata for &quot;{project.title}&quot;. Updates sync directly to localStorage.
                </p>
              </div>
            </div>

            {seoSaved && (
              <span className="px-3.5 py-1.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-mono font-bold flex items-center gap-1.5 border border-[#10B981]/30 shadow-md">
                <CheckCircle2 className="w-4 h-4" /> Saved to localStorage!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSeo} className="space-y-5">
            <div>
              <label className="text-[10px] font-mono text-[#6B6053] uppercase block mb-1">
                SEO Title Tag
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="e.g. BakeryShop | Mobile App Case Study by Fiza Rafi"
                className="w-full bg-[#231F17] border border-[#2C2419] rounded-xl px-4 py-2.5 text-xs text-[#F9F7F2] focus:border-[#E59500] outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono text-[#6B6053] uppercase">
                  SEO Description (Meta Description)
                </label>
                <button
                  type="button"
                  disabled={autoDrafting}
                  onClick={handleAutoDraftDescription}
                  className="text-[10px] font-mono text-[#E59500] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  {autoDrafting ? 'Drafting with AI...' : 'AI Auto-Draft Description'}
                </button>
              </div>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="A high-impact case study detailing tactile bakery UI/UX, seamless checkout micro-interactions, and conversion rate optimization..."
                className="w-full bg-[#231F17] border border-[#2C2419] rounded-xl px-4 py-2.5 text-xs text-[#F9F7F2] focus:border-[#E59500] outline-none resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-mono text-[#6B6053] uppercase">
                  SEO Focus Keywords (Comma-separated)
                </label>
                <button
                  type="button"
                  disabled={generatingKeywords}
                  onClick={handleGenerateKeywords}
                  className="text-[10px] font-mono text-[#E59500] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  {generatingKeywords ? 'Generating Keywords...' : 'AI Auto-Generate Keywords'}
                </button>
              </div>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="bakery app design, ui ux mobile portfolio, conversion rate optimization, figma"
                className="w-full bg-[#231F17] border border-[#2C2419] rounded-xl px-4 py-2.5 text-xs text-[#F9F7F2] focus:border-[#E59500] outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#6B6053]">
                Target storage key: <code className="text-[#E59500]">rizwan_projects</code>
              </span>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#E59500] hover:bg-[#F1A417] text-[#15120E] text-xs font-bold uppercase rounded-xl tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Save SEO Metadata
              </button>
            </div>
          </form>
        </div>

        {/* Dynamic CTA */}
        <div className="mt-20 bg-[#231F17]/30 border border-[#2C2419] rounded-3xl p-8 text-center flex flex-col items-center max-w-2xl mx-auto">
          <span className="text-[10px] font-mono text-[#E59500] uppercase tracking-widest block mb-2">✦ WORK WITH JENNY</span>
          <h3 className="font-bold text-xl text-[#F9F7F2] mb-3">Interested in a similar setup?</h3>
          <p className="text-xs text-[#A69D92] leading-relaxed mb-6">
            Let&apos;s talk about building custom design architectures, dense analysis dashboards, or intuitive e-commerce systems tailored for your company.
          </p>
          <button 
            onClick={() => router.push('/?section=contact')}
            className="px-6 py-3 bg-[#E59500] hover:bg-[#F1A417] text-[#15120E] text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-[#E59500]/10"
          >
            Schedule Brief Strategy Consultation <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#100D09] pt-16 pb-8 text-[#A69D92] border-t border-[#2C2419] mt-24">
        <div className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
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

      {/* LIGHTWEIGHT FULL-SCREEN IMAGE LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 selection:bg-[#E59500]"
          >
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between text-[#F9F7F2] border-b border-[#2C2419]/80 pb-4 z-10">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#231F17] border border-[#2C2419] text-[#E59500] font-mono text-xs font-bold uppercase tracking-wider">
                  IMAGE {lightboxIndex + 1} OF {galleryList.length}
                </span>
                <span className="text-xs font-bold text-[#F9F7F2] hidden sm:inline-block truncate max-w-xs sm:max-w-md">
                  {project.title} — High Resolution Showcase
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#6B6053] hidden md:inline-block mr-2">
                  [ESC] Close • [←/→] Navigate
                </span>
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="p-2 bg-[#231F17] hover:bg-[#2F2920] border border-[#2C2419] text-[#A69D92] hover:text-[#E59500] rounded-full transition-all cursor-pointer shadow-lg"
                  title="Close Lightbox (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Stage & Centered Image */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden group">
              {/* Previous Image Button */}
              {galleryList.length > 1 && (
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-6 z-20 p-3 bg-[#15120E]/80 hover:bg-[#E59500] border border-[#2C2419] text-[#F9F7F2] hover:text-[#15120E] rounded-full transition-all cursor-pointer shadow-2xl backdrop-blur-md"
                  title="Previous Image (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Displayed Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="relative max-w-full max-h-[80vh] flex items-center justify-center rounded-2xl overflow-hidden border border-[#2C2419] bg-[#15120E] shadow-2xl"
                >
                  <Image
                    src={galleryList[lightboxIndex]}
                    alt={`${project.title} - Fullscreen View ${lightboxIndex + 1}`}
                    width={1200}
                    height={800}
                    unoptimized
                    className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Next Image Button */}
              {galleryList.length > 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-6 z-20 p-3 bg-[#15120E]/80 hover:bg-[#E59500] border border-[#2C2419] text-[#F9F7F2] hover:text-[#15120E] rounded-full transition-all cursor-pointer shadow-2xl backdrop-blur-md"
                  title="Next Image (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Info Bar & Thumbnails */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#2C2419]/80 pt-4 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-[#A69D92] font-mono">
                  Optimized Ultra-HD Render • 100% Quality
                </span>
              </div>

              {/* Interactive Thumbnail Nav Bar */}
              {galleryList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
                  {galleryList.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className={`w-12 h-10 rounded-lg overflow-hidden border transition-all cursor-pointer shrink-0 ${
                        idx === lightboxIndex
                          ? 'border-[#E59500] ring-2 ring-[#E59500]/50 scale-105'
                          : 'border-[#2C2419] opacity-50 hover:opacity-100'
                      }`}
                    >
                      <Image src={imgUrl} alt={`Thumb ${idx + 1}`} width={48} height={40} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
