'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Check, 
  Sparkles, 
  ArrowRight,
  Tv, 
  Globe, 
  Share2, 
  Cpu, 
  Wrench,
  Clock,
  Briefcase,
  Users,
  ShieldCheck,
  Code,
  LineChart,
  Zap
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

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const idString = params?.id as string;
  const serviceId = parseInt(idString);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rizwan_services');
      const loadedServices = saved ? JSON.parse(saved) : DEFAULT_SERVICES;
      
      const found = loadedServices.find((s: ServiceItem) => s.id === serviceId) || loadedServices[serviceId - 1];
      
      Promise.resolve().then(() => {
        setServices(loadedServices);
        if (found) {
          setService(found);
        }
        setLoading(false);
      });
    } catch (e) {
      const loadedServices = DEFAULT_SERVICES;
      const found = loadedServices.find((s: ServiceItem) => s.id === serviceId);
      Promise.resolve().then(() => {
        setServices(loadedServices);
        setService(found || loadedServices[0]);
        setLoading(false);
      });
    }
  }, [serviceId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#15120E] text-[#F9F7F2] flex items-center justify-center font-mono text-xs">
        <span className="w-2 h-2 bg-[#E59500] rounded-full animate-ping mr-2" />
        LOADING SERVICE PROFILE...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#15120E] text-[#F9F7F2] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold font-mono">Service item not found</h2>
        <button
          onClick={() => router.push('/services')}
          className="px-6 py-2.5 bg-[#E59500] text-[#15120E] text-xs font-bold uppercase rounded-xl cursor-pointer"
        >
          Return to Services
        </button>
      </div>
    );
  }

  // Get service icon
  const getServiceIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('brand') || t.includes('design') || t.includes('graphic')) {
      return <Tv className="w-10 h-10 text-[#E59500]" />;
    } else if (t.includes('web') || t.includes('code') || t.includes('develop')) {
      return <Globe className="w-10 h-10 text-[#E59500]" />;
    } else if (t.includes('marketing') || t.includes('seo') || t.includes('market')) {
      return <Share2 className="w-10 h-10 text-[#E59500]" />;
    } else if (t.includes('ai') || t.includes('agent') || t.includes('smart')) {
      return <Cpu className="w-10 h-10 text-[#E59500]" />;
    } else {
      return <Wrench className="w-10 h-10 text-[#E59500]" />;
    }
  };

  // Generate sub-details based on title
  const getServiceStats = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('brand')) {
      return [
        { label: "Delivery Time", value: "2-3 Weeks" },
        { label: "Asset Quality", value: "Vector 8K" },
        { label: "Revisions", value: "Unlimited" }
      ];
    } else if (t.includes('web')) {
      return [
        { label: "Performance", value: "98/100 LCP" },
        { label: "Code Coverage", value: "95% Unit" },
        { label: "Average Setup", value: "3-4 Weeks" }
      ];
    } else if (t.includes('marketing')) {
      return [
        { label: "Typical ROI", value: "3.5x - 5x" },
        { label: "Audience Lift", value: "+240% YoY" },
        { label: "Reporting", value: "Bi-Weekly" }
      ];
    } else if (t.includes('ai')) {
      return [
        { label: "Model Latency", value: "<1.2 Seconds" },
        { label: "Automation ROI", value: "+40% Hours" },
        { label: "Integration", value: "API & REST" }
      ];
    } else {
      return [
        { label: "Setup Pipeline", value: "1-2 Days" },
        { label: "Lead Qualification", value: "+60% CTR" },
        { label: "Active Bots", value: "24/7/365" }
      ];
    }
  };

  // Service processes
  const processes = service.processes && service.processes.length > 0
    ? service.processes
    : [
        {
          step: "01",
          title: "Discovery & Analysis",
          desc: "We analyze your audience, look at market bottlenecks, outline client-side challenges, and map out structured workflow paths to succeed."
        },
        {
          step: "02",
          title: "Creative Strategy",
          desc: "Translating challenges into high-level visual wireframes, systems architecture, prompt pipelines, or marketing schemas."
        },
        {
          step: "03",
          title: "Development & Testing",
          desc: "Implementing the design with robust React styling, writing flawless server routes, calibrating agent weights, or assembling WhatsApp chat flows."
        },
        {
          step: "04",
          title: "Deployment & Support",
          desc: "Publishing the app to secure web hosting, launching the marketing broadcast, or integrating agent modules with custom database systems."
        }
      ];

  const stats = service.stats && service.stats.length > 0
    ? service.stats
    : getServiceStats(service.title);

  return (
    <div className="relative min-h-screen bg-[#15120E] text-[#F9F7F2] selection:bg-[#E59500] selection:text-[#15120E]">
      
      {/* BREADCRUMB JSON-LD SCHEMA */}
      {service && (
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
                  name: 'Services',
                  item: 'https://rizwansaddique.site/services',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: service.title,
                  item: `https://rizwansaddique.site/services/${service.id}`,
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
            onClick={() => router.push('/services')}
            className="px-4 py-2 bg-[#231F17] hover:bg-[#2F2920] border border-[#2C2419] text-[#A69D92] hover:text-[#E59500] rounded-full text-xs font-bold uppercase transition-all tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Services
          </button>
        </div>
      </header>

      {/* SERVICE HERO DETAILED */}
      <section className="py-20 md:py-32 relative overflow-hidden border-b border-[#2C2419]/50">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E59500]/5 border border-[#E59500]/10 rounded-full text-[10px] font-mono text-[#E59500] uppercase font-semibold">
            <Sparkles className="w-3 h-3 text-[#E59500]" /> Service Profile {service.num || `0${serviceId}`}
          </div>
          <div className="flex justify-center">
            <div className="p-5 bg-[#E59500]/5 rounded-3xl border border-[#E59500]/10 shadow-xl mb-4">
              {getServiceIcon(service.title)}
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F9F7F2] leading-none">
            {service.title}
          </h1>
          <p className="text-sm sm:text-lg text-[#A69D92] max-w-2xl mx-auto leading-relaxed">
            {service.desc}
          </p>

          {/* STATS MATRIX */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-[#231F17]/30 border border-[#2C2419] rounded-2xl p-5 text-center">
                <span className="text-[10px] font-mono text-[#6B6053] uppercase block mb-1">{stat.label}</span>
                <span className="text-xl font-extrabold text-[#E59500]">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DETAILED DELIVERABLES & WHAT WE BUILD */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Deliverables detail */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono text-[#E59500] uppercase tracking-widest block font-bold">
              ✦ CORE SCOPE & DELIVERABLES
            </span>
            <h2 className="text-3xl font-extrabold text-[#F9F7F2] tracking-tight">
              What We Create For You
            </h2>
            <p className="text-sm text-[#A69D92] leading-relaxed">
              Every deliverable is crafted to fit your brand identity, business strategy, and operations workflow. No generic templates, no compromised integrations.
            </p>

            <div className="grid grid-cols-1 gap-4 pt-4">
              {service.highlights.map((highlight, idx) => (
                <div key={idx} className="bg-[#231F17]/20 border border-[#2C2419] rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#E59500]/10 border border-[#E59500]/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-[#E59500]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#F9F7F2]">{highlight}</h4>
                    <p className="text-xs text-[#A69D92] leading-relaxed">
                      Custom configured, tested, and fully integrated spec engineered with best practice methodologies.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right box process summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[#231F17]/30 border border-[#2C2419] rounded-3xl p-8 space-y-6">
              <h3 className="text-lg font-bold text-[#F9F7F2] border-b border-[#2C2419] pb-4">
                Service Overview
              </h3>
              
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#E59500]" />
                  <span className="text-xs text-[#A69D92]">Standard turnaround of {stats[0].value}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4 text-[#E59500]" />
                  <span className="text-xs text-[#A69D92]">Fully responsive and mobile adaptive specs</span>
                </li>
                <li className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-[#E59500]" />
                  <span className="text-xs text-[#A69D92]">Dedicated collaboration on Figma & Teams</span>
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#E59500]" />
                  <span className="text-xs text-[#A69D92]">30 Days post-deployment support & guarantee</span>
                </li>
              </ul>

              <button
                onClick={() => router.push(`/?tab=contact&service=${encodeURIComponent(service.title)}`)}
                className="w-full py-3.5 bg-[#E59500] hover:bg-[#F1A417] text-[#15120E] text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <span>Order This Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* PROCESS TIMELINE ACCORDION */}
      <section className="py-20 border-t border-[#2C2419]/50 bg-[#231F17]/10">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#E59500] uppercase tracking-widest block font-bold">
              ✦ STEP-BY-STEP WORKFLOW
            </span>
            <h2 className="text-3xl font-extrabold text-[#F9F7F2] tracking-tight">
              My Design &amp; Build Process
            </h2>
            <p className="text-sm text-[#A69D92] max-w-lg mx-auto">
              How we take your product requirements from absolute scratch to high-converting production deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {processes.map((proc, idx) => (
              <div key={idx} className="bg-[#15120E]/50 border border-[#2C2419] p-6 rounded-2xl relative space-y-3">
                <span className="font-mono text-3xl font-extrabold text-[#E59500]/10 absolute right-6 top-6 select-none">
                  {proc.step}
                </span>
                <h3 className="text-base font-bold text-[#F9F7F2] flex items-center gap-2">
                  <span className="text-[#E59500] font-mono">●</span> {proc.title}
                </h3>
                <p className="text-xs text-[#A69D92] leading-relaxed">
                  {proc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER NAV / LINK */}
      <footer className="py-16 border-t border-[#2C2419] text-center space-y-6">
        <button
          onClick={() => router.push('/services')}
          className="px-6 py-2.5 bg-[#231F17] hover:bg-[#2F2920] border border-[#2C2419] text-[#A69D92] hover:text-[#F9F7F2] rounded-xl text-xs font-bold uppercase transition-all tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Services Directory
        </button>
        <p className="text-xs text-[#6B6053] font-mono">
          © 2026 Fiza Rafi. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
