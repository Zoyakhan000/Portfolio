import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services & Solutions',
  description: 'Full-suite digital growth and e-commerce services including Google Ads PPC, Meta Ads scaling, Shopify theme customization, SEO audits, and conversion optimization by Fiza Rafi.',
  keywords: [
    'Digital Marketing Services',
    'Shopify Development Services',
    'Google Ads Management',
    'Meta Ads Agency Services',
    'SEO Optimization Service',
    'E-Commerce CRO Audits',
    'Fiza Rafi Services',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rizwansaddique.site/services',
    title: 'Services & Solutions | Fiza Rafi',
    description: 'Full-suite digital growth and e-commerce services including Google Ads PPC, Meta Ads scaling, Shopify theme customization, SEO audits, and conversion optimization by Fiza Rafi.',
    siteName: 'Fiza Rafi Portfolio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'Fiza Rafi Services & Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services & Solutions | Fiza Rafi',
    description: 'Full-suite digital growth and e-commerce services including Google Ads PPC, Meta Ads scaling, Shopify theme customization, SEO audits, and conversion optimization by Fiza Rafi.',
    creator: '@fizarafir',
    images: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200'],
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
