'use client';

const getReadingTime = (content?: string) => {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
};


import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Shield, 
  ArrowUpRight, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Github,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { motion } from 'motion/react';

interface BlogPost {
  id: number;
  image: string;
  category: string;
  title: string;
  date: string;
  author: string;
  content?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
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
    content: `# The Magic Behind Clean Interfaces: Secrets of Negative Space

In modern interface design, negative space (often referred to as whitespace) is not merely empty space or "wasted screen estate." It is one of the most powerful active elements in your visual layout toolbelt. 

When handled with precision, negative space defines information hierarchy, groups related elements, isolates calls to action, and creates a sense of luxurious visual rhythm.

---

## 1. Defining Information Hierarchy
Without breathing room, every element on the screen screams for the user's attention at the same volume. Negative space acts as a volume dial. By wrapping an element in ample negative space, you raise its visual volume without increasing its size or changing its color.

---

## 2. Spatial Grouping (The Gestalt Laws)
The Gestalt law of proximity states that objects close to each other are perceived as a single group. By designing consistent gutters and margins, you create visual chunks that the human brain can scan and categorize in milliseconds.

### Simple Guidelines for Balanced Spacing:
* **The 8px Grid Rule**: Align all margins, padding, and height dimensions to multiples of 8 (e.g., 8px, 16px, 24px, 32px, 48px, 64px). This creates natural, proportional mathematical rhythm.
* **Inner Padding vs Outer Margin**: Always make sure the space separating items inside a card is smaller than the space separating the cards themselves.

---

## Conclusion
True craftsmanship comes from what you leave out, not what you pack in. The next time you draft a layout in Figma, try increasing your padding by 50% and notice how much more premium and legible your design instantly becomes.`
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
    category: "Process",
    title: "From Concept to Clicks: The Art of Responsive Web Design",
    date: "02 June 2026",
    author: "Fiza Rafi",
    description: "How to craft beautiful, fluid-grid layout containers and typography that adapt flawlessly to any screen size.",
    content: `# From Concept to Clicks: The Art of Responsive Web Design

Designing for the web means designing for fluid containers. A layout is never static; it must bend, compress, and restack gracefully from a tiny mobile viewport up to a wide 4K display.

---

## The Mobile-First Principle
By prioritizing the smallest screen size first, you force yourself to strip away unnecessary cosmetic noise and focus purely on the core user action. If your value proposition isn't clear in a single 375px column, no amount of desktop columns will fix it.

---

## Fluid Typography and Layouts
Instead of hardcoding absolute pixel dimensions, leverage modern CSS units and flexbox grids:
* **Clamp scale**: Use modern functions like \`clamp(1rem, 2vw + 1rem, 2.5rem)\` to scale typography dynamically without jumping breakpoints.
* **Dynamic Container Widths**: Use \`max-w-7xl mx-auto px-4\` to frame your layouts nicely on ultra-wide monitors.

---

## Conclusion
A premium digital experience is not built on device compromises. Designing with relative systems ensures your aesthetic pairs are perfectly balanced across any display.`
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1581291518655-9523c932dedf?auto=format&fit=crop&q=80&w=800",
    category: "Technology",
    title: "The Art of Building Apps That Truly Connect with Users",
    date: "28 May 2026",
    author: "Fiza Rafi",
    description: "Deep dive into aesthetic usability, fluid micro-interactions, and visual feedback that keep users engaged.",
    content: `# The Art of Building Apps That Truly Connect with Users

What separates an app that is opened daily from one that is uninstalled in five minutes? It isn't the number of features, nor is it complex server code. It is structural clarity, aesthetic trust, and emotional feedback.

---

## 1. Aesthetic Usability Effect
Users perceive beautiful products as more usable and trustworthy. When an app features paired display typography, balanced color accents, and generous spatial padding, users are more forgiving of minor system hiccups and are more willing to invest time learning the system.

---

## 2. Micro-interactions and Motion
Motion shouldn't be decorative. A subtle fade-in transition, a smooth hover scale, or a springy sliding line guides the user's eye and provides physical feedback to digital actions.

---

## 3. Human Centered Feedback
Ensure every state (loading, error, empty) is designed with the same care as the primary dashboard. Transparent loaders, descriptive error cues, and clear call-to-actions help reassure users that they are in safe hands.`
  },
];

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? parseInt(params.id as string) : null;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Global scroll read progress calculation
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
      const saved = localStorage.getItem('rizwan_blogs');
      const blogsList: BlogPost[] = saved ? JSON.parse(saved) : DEFAULT_BLOGS;
      const found = blogsList.find((b) => b.id === id);
      
      Promise.resolve().then(() => {
        if (found) {
          // Map dynamic content if not existing
          if (!found.content) {
            const matchedDefault = DEFAULT_BLOGS.find((d) => d.id === found.id || d.title === found.title);
            found.content = matchedDefault?.content || `# ${found.title}\n\nThis is a custom-created blog post by ${found.author}. Feel free to write rich articles in the Admin panel!`;
          }
          setBlog(found);
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

  // Dynamic SEO Meta Tags update
  useEffect(() => {
    if (!blog) return;

    const computedTitle = blog.seoTitle?.trim() 
      ? blog.seoTitle.trim() 
      : `${blog.title} | Fiza Rafi Journal`;
      
    const computedDesc = blog.seoDescription?.trim()
      ? blog.seoDescription.trim()
      : (blog.description || `Read ${blog.title} by ${blog.author} on Fiza Rafi's digital marketing and design journal.`);

    document.title = computedTitle;

    const updateOrCreateMeta = (selector: string, attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    updateOrCreateMeta('meta[name="description"]', 'name', 'description', computedDesc);
    updateOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', computedTitle);
    updateOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', computedDesc);
    updateOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', `https://rizwansaddique.site/blog/${blog.id}`);
    updateOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', computedTitle);
    updateOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', computedDesc);
  }, [blog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#15120E] text-[#F9F7F2] flex items-center justify-center font-mono text-xs">
        <span className="w-2 h-2 bg-[#E59500] rounded-full animate-ping mr-2" />
        LOADING BLOG ARTICLE...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#15120E] text-[#F9F7F2] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold font-mono text-[#E59500] mb-2">ARTICLE NOT FOUND</h2>
        <p className="text-xs text-[#A69D92] mb-6">The article you are looking for does not exist or has been deleted.</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-[#E59500] text-[#15120E] text-xs font-bold uppercase rounded-full tracking-wider hover:bg-white transition-colors cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back Home
        </button>
      </div>
    );
  }

  // Helper to render bold text cleanly
  const renderFormattedText = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={i} className="text-[#F9F7F2] font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  // Simple parser to render markdown cleanly without third party libraries
  const renderContent = (text: string) => {
    if (!text) return null;
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    return lines.map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F9F7F2] mt-8 mb-4 border-b border-[#2C2419] pb-3">
            {line.replace('# ', '')}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl sm:text-2xl font-bold tracking-tight text-[#E59500] mt-8 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-base sm:text-lg font-bold text-[#F9F7F2] mt-6 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line === '---') {
        return <hr key={index} className="my-8 border-[#2C2419]" />;
      }
      if (/^\d+\.\s/.test(line)) {
        const numMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          const num = numMatch[1];
          const rest = numMatch[2];
          
          let title = '';
          let body = rest;

          if (rest.startsWith('**') && rest.includes('**')) {
            const boldEnd = rest.indexOf('**', 2);
            if (boldEnd !== -1) {
              title = rest.substring(2, boldEnd);
              body = rest.substring(boldEnd + 2).trim();
            }
          } else if (rest.includes(': ')) {
            const colonIdx = rest.indexOf(': ');
            title = rest.substring(0, colonIdx);
            body = rest.substring(colonIdx + 2).trim();
          }

          return (
            <div key={index} className="flex items-start gap-3.5 my-3.5 p-4 bg-[#1C1712]/70 border border-[#2C2419] rounded-2xl shadow-sm">
              <span className="w-7 h-7 rounded-xl bg-[#E59500]/15 border border-[#E59500]/30 text-[#E59500] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 font-mono">
                {num}
              </span>
              <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                {title ? (
                  <div>
                    <h4 className="font-bold text-[#E59500] text-sm mb-1">{title}</h4>
                    <p className="text-[#A69D92]">{renderFormattedText(body)}</p>
                  </div>
                ) : (
                  <p className="text-[#A69D92]">{renderFormattedText(rest)}</p>
                )}
              </div>
            </div>
          );
        }
      }
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const content = line.replace(/^[\*\-]\s+/, '');
        return (
          <div key={index} className="flex items-start gap-2.5 my-2.5 pl-2 text-[#A69D92]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E59500] shrink-0 mt-2" />
            <p className="text-xs sm:text-sm leading-relaxed flex-1">
              {renderFormattedText(content)}
            </p>
          </div>
        );
      }

      return (
        <p key={index} className="text-xs sm:text-sm text-[#A69D92] leading-relaxed mb-4">
          {renderFormattedText(line)}
        </p>
      );
    });
  };

  return (
    <div className="relative min-h-screen bg-[#15120E] text-[#F9F7F2] selection:bg-[#E59500] selection:text-[#15120E]">
      
      {/* BREADCRUMB JSON-LD SCHEMA */}
      {blog && (
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
                  name: 'Blog',
                  item: 'https://rizwansaddique.site/blog',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: blog.title,
                  item: `https://rizwansaddique.site/blog/${blog.id}`,
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
          {/* Logo */}
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
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Navigation & category badge */}
        <div className="flex items-center gap-4 mb-6">
          <span className="bg-[#E59500] text-[#15120E] font-mono text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
            {blog.category}
          </span>
          <div className="flex items-center gap-4 text-xs font-mono text-[#6B6053] flex-wrap">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#E59500]" /> {blog.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-[#E59500]" /> By {blog.author}</span>
            <span>•</span>
            <span className="text-[#E59500] font-bold">{getReadingTime(blog.content)}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F9F7F2] tracking-tight mb-4 leading-tight">
          {blog.title}
        </h1>

        {blog.description && (
          <p className="text-sm sm:text-base text-[#A69D92] leading-relaxed mb-8 max-w-3xl border-l-2 border-[#E59500] pl-4 italic">
            {blog.description}
          </p>
        )}

        {/* Cover Image */}
        <div className="w-full h-64 sm:h-[480px] rounded-3xl overflow-hidden border border-[#2C2419] mb-12 relative bg-[#231F17]">
          <Image 
            src={blog.image} 
            alt={blog.title} 
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            priority
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Rendered markdown contents */}
        <article className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-[#F9F7F2] text-justify bg-[#231F17]/20 border border-[#2C2419]/50 rounded-3xl p-6 sm:p-10">
          {renderContent(blog.content || '')}
        </article>

        {/* Dynamic CTA */}
        <div className="mt-16 bg-[#231F17]/30 border border-[#2C2419] rounded-3xl p-8 text-center flex flex-col items-center max-w-2xl mx-auto">
          <span className="text-[10px] font-mono text-[#E59500] uppercase tracking-widest block mb-2">✦ CRAFT WITH ME</span>
          <h3 className="font-bold text-lg text-[#F9F7F2] mb-3">Like this perspective? Let&apos;s design together</h3>
          <p className="text-xs text-[#A69D92] leading-relaxed mb-6">
            I help modern startups and global brands translate intricate processes into meticulous, balanced typography, and highly intuitive layouts.
          </p>
          <button 
            onClick={() => router.push('/?section=contact')}
            className="px-6 py-3 bg-[#E59500] hover:bg-[#F1A417] text-[#15120E] text-xs font-bold uppercase tracking-wider rounded-full transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-[#E59500]/10"
          >
            Inquire about starting a project <ArrowUpRight className="w-4 h-4" />
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

    </div>
  );
}
