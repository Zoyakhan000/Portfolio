'use client';

const getReadingTime = (content?: string) => {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
};


import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  FileText, 
  Layers, 
  Sparkles,
  Instagram, 
  Linkedin, 
  Twitter, 
  Github
} from 'lucide-react';
import { motion } from 'motion/react';

interface CustomPage {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
}

const DEFAULT_CUSTOM_PAGES: CustomPage[] = [
  {
    id: "1",
    title: "Our Philosophy",
    slug: "philosophy",
    seoTitle: "Our Design & Performance Philosophy | Fiza Rafi",
    seoDescription: "Explore our principles on deep simplicity, absolute craftsmanship, visual rhythm, and modern tech integration by Fiza Rafi.",
    content: `## Behind Our Work

We believe in deep simplicity, absolute craftsmanship, and design that stands the test of time.

### Key Principles
1. **User Focus**: Every pixel serves the user's intent.
2. **Visual Rhythm**: High contrast, balanced padding, and clean typography.
3. **Modern Tech**: Integrating motion and interaction design into fluid products.

Feel free to explore our services or get in touch for custom inquiries!`
  },
  {
    id: "2",
    title: "FAQ & Pricing Details",
    slug: "faq-pricing",
    seoTitle: "FAQ & Custom Retainer Pricing | Fiza Rafi",
    seoDescription: "In-depth details on design retainers, Shopify development specs, and e-commerce growth consulting rates with Fiza Rafi.",
    content: `## FAQ & Custom Pricing

If you have questions about custom design retainer services or single project specifications, see below.

### General Retainer Options
* **Startup Catalyst**: $4,500/month (Includes 15 hours/week UI consultancy, custom mockups, and priority revisions).
* **Enterprise Scale**: $9,000/month (Includes 35 hours/week dedicated design sprint lead, component-by-component Figma architecture, and unlimited iterations).

Contact us directly to lock in pricing for 2026.`
  },
  {
    id: "3",
    title: "Services Detail",
    slug: "services-detail",
    seoTitle: "Digital Marketing & Shopify Development Services | Fiza Rafi",
    seoDescription: "Explore custom product design work, visual aesthetics, typography pairing strategy, responsive layout audits, and user testing frameworks by Fiza Rafi.",
    content: `## Comprehensive Growth & Development Services

We help ambitious brands scale rapidly across UAE, Pakistan, and global markets with performance marketing and custom Shopify solutions.

### Core Solutions
1. **Google Ads & PMax**: Search, Shopping, and Performance Max campaigns optimized for high ROAS.
2. **Meta Ads Scaling**: Data-driven creative testing, retargeting funnels, and scaling frameworks on Instagram & Facebook.
3. **Technical SEO & Audits**: Structural silo architecture, speed optimization, and on-page technical enhancements.
4. **Shopify Development**: Custom Liquid section development, sub-1.5s load speeds, and conversion rate optimization.`
  },
  {
    id: "4",
    title: "About Fiza Rafi",
    slug: "about-story",
    seoTitle: "About Fiza Rafi | Digital Marketing Manager & Shopify Developer",
    seoDescription: "Learn about Fiza Rafi's journey, experience scaling AED 1.2M+ in revenue across 100+ projects in UAE & Pakistan.",
    content: `## My Journey & Approach

With over 5 years of hands-on experience in performance marketing, technical SEO, and e-commerce development, I help businesses transform traffic into scalable revenue.

### Strategic Highlights
* **AED 1.2M+ Revenue Generated**: Proven campaigns across hospitality, e-commerce retail, and B2B sectors.
* **100+ Projects Delivered**: Custom Shopify themes, technical search engine optimizations, and paid acquisition funnels.
* **Dual Region Focus**: Deep market understanding in both the UAE (Dubai Marina) and Pakistan.`
  },
  {
    id: "5",
    title: "Privacy Policy",
    slug: "privacy-policy",
    seoTitle: "Privacy Policy | Fiza Rafi",
    seoDescription: "Privacy policy for rizwansaddique.site detailing data collection, usage, contact form privacy, and user security.",
    content: `## Privacy Policy

Your privacy is paramount. This policy details how personal information collected through rizwansaddique.site is handled.

### Data Collection & Usage
* Information submitted via our contact forms (Name, Email, Phone, Project Details) is strictly used to evaluate and respond to project inquiries.
* We do not sell, rent, or share personal information with third parties.
* Standard web analytics may be collected anonymously to improve site performance and user experience.`
  },
  {
    id: "6",
    title: "Terms of Service",
    slug: "terms-of-service",
    seoTitle: "Terms of Service | Fiza Rafi",
    seoDescription: "Terms of service and engagement guidelines for digital marketing and Shopify development services by Fiza Rafi.",
    content: `## Terms of Service

Welcome to rizwansaddique.site. By accessing or requesting services on this site, you agree to these terms.

### Services & Intellectual Property
* All custom code, design strategies, and consulting outputs delivered under contract belong to the client upon full payment.
* Content on this website is protected by copyright and intellectual property rights.`
  }
];

export default function CustomPageDetail() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [page, setPage] = useState<CustomPage | null>(() => {
    return DEFAULT_CUSTOM_PAGES.find((p) => p.slug === slug) || null;
  });
  const [loading, setLoading] = useState(false);
  const [otherPages, setOtherPages] = useState<CustomPage[]>(() => {
    return DEFAULT_CUSTOM_PAGES.filter((p) => p.slug !== slug);
  });

  useEffect(() => {
    if (!slug) return;
    try {
      const saved = localStorage.getItem('rizwan_custom_pages');
      const pageList: CustomPage[] = saved ? JSON.parse(saved) : DEFAULT_CUSTOM_PAGES;
      const found = pageList.find((p) => p.slug === slug);
      
      if (found) {
        setPage(found);
      }
      setOtherPages(pageList.filter((p) => p.slug !== slug));
    } catch (e) {
      console.error(e);
    }
  }, [slug]);

  // Dynamic SEO Meta Tags update
  useEffect(() => {
    if (!page) return;

    const computedTitle = page.seoTitle?.trim() 
      ? page.seoTitle.trim() 
      : `${page.title} | Fiza Rafi`;
      
    const computedDesc = page.seoDescription?.trim()
      ? page.seoDescription.trim()
      : `Read ${page.title} on Fiza Rafi's digital marketing and Shopify development portfolio.`;

    // 1. Update Document Title
    document.title = computedTitle;

    // Helper to safely set or insert head meta tags
    const updateOrCreateMeta = (selector: string, attrName: string, attrVal: string, contentVal: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // 2. SEO & OpenGraph Meta Tags
    updateOrCreateMeta('meta[name="description"]', 'name', 'description', computedDesc);
    updateOrCreateMeta('meta[property="og:title"]', 'property', 'og:title', computedTitle);
    updateOrCreateMeta('meta[property="og:description"]', 'property', 'og:description', computedDesc);
    updateOrCreateMeta('meta[property="og:url"]', 'property', 'og:url', `https://rizwansaddique.site/custom-pages/${page.slug}`);
    updateOrCreateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', computedTitle);
    updateOrCreateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', computedDesc);
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#15120E] text-[#F9F7F2] flex items-center justify-center font-mono text-xs">
        <span className="w-2 h-2 bg-[#E59500] rounded-full animate-ping mr-2" />
        LOADING CUSTOM PAGE...
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-[#15120E] text-[#F9F7F2] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold font-mono text-[#E59500] mb-2">PAGE NOT FOUND</h2>
        <p className="text-xs text-[#A69D92] mb-6">The page you are looking for does not exist or has been deleted.</p>
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

  // Parses markdown syntax dynamically
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
      {page && (
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
                  name: page.title,
                  item: `https://rizwansaddique.site/custom-pages/${page.slug}`,
                },
              ],
            }),
          }}
        />
      )}
      
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
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </button>
        </div>
      </header>

      {/* CORE LAYOUT GRID */}
      <main className="w-full max-w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12 md:py-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Editorial Article Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <FileText className="w-5 h-5 text-[#E59500]" />
              <span className="text-xs font-mono text-[#6B6053] tracking-widest uppercase">✦ DYNAMIC CUSTOM PAGE</span>
              <span className="text-xs font-mono text-[#6B6053]">•</span>
              <span className="text-xs font-mono text-[#E59500] tracking-widest uppercase font-bold">{getReadingTime(page.content)}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F9F7F2] leading-tight mb-8">
              {page.title}
            </h1>
            
            <article className="prose prose-invert max-w-none prose-p:leading-relaxed bg-[#231F17]/20 border border-[#2C2419]/50 rounded-3xl p-6 sm:p-10">
              {renderContent(page.content || '')}
            </article>
          </div>

          {/* Sidebar Area with Other Pages */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#231F17]/30 border border-[#2C2419] p-6 rounded-3xl">
              <h3 className="text-xs font-mono text-[#E59500] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                EXPLORE PAGES
              </h3>
              
              <div className="space-y-3">
                {otherPages.map((op) => (
                  <button
                    key={op.id}
                    onClick={() => router.push(`/custom-pages/${op.slug}`)}
                    className="w-full p-4 rounded-xl bg-[#15120E] border border-[#2C2419] hover:border-[#E59500] text-left transition-all duration-300 group flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-[#F9F7F2] group-hover:text-[#E59500] transition-colors">
                        {op.title}
                      </h4>
                      <p className="text-[10px] font-mono text-[#6B6053] mt-1">/custom-pages/{op.slug}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#6B6053] group-hover:text-[#E59500] transition-colors" />
                  </button>
                ))}

                {otherPages.length === 0 && (
                  <p className="text-center text-xs text-[#6B6053] italic py-4">No other custom pages available.</p>
                )}
              </div>
            </div>

            {/* Direct Connect Promo */}
            <div className="bg-[#E59500]/5 border border-[#E59500]/20 p-6 rounded-3xl text-center flex flex-col items-center">
              <Sparkles className="w-8 h-8 text-[#E59500] mb-3 animate-pulse" />
              <h4 className="font-bold text-sm text-[#F9F7F2] mb-2">Need Bespoke Development?</h4>
              <p className="text-xs text-[#A69D92] leading-relaxed mb-4">
                Let&apos;s build an intricate layout tailored directly for your SaaS workspace, dashboard or web properties.
              </p>
              <button
                onClick={() => router.push('/?section=contact')}
                className="w-full py-2 bg-[#E59500] hover:bg-[#F1A417] text-[#15120E] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Connect With Me
              </button>
            </div>
          </div>

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
