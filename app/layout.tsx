import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import ScrollToTop from '@/components/ScrollToTop';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rizwansaddique.site';

export const metadata: Metadata = {
  title: {
    default: 'Fiza Rafi | Digital Marketing Manager & Shopify Developer — Dubai & Pakistan',
    template: '%s | Fiza Rafi'
  },
  description: 'Results-driven Digital Marketing Manager & Shopify Developer helping brands in UAE & Pakistan scale with Google Ads, Meta Ads, SEO & Shopify Development. 100+ projects, AED 1.2M+ revenue generated.',
  keywords: [
    'Digital Marketing Manager',
    'Shopify Developer',
    'Google Ads Expert',
    'Meta Ads',
    'SEO Dubai',
    'Shopify Development Pakistan',
  ],
  authors: [{ name: 'Fiza Rafi' }],
  creator: 'Fiza Rafi',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Fiza Rafi | Digital Marketing Manager & Shopify Developer',
    description: 'Results-driven Digital Marketing Manager & Shopify Developer helping brands in UAE & Pakistan scale with Google Ads, Meta Ads, SEO & Shopify Development. 100+ projects, AED 1.2M+ revenue generated.',
    siteName: 'Fiza Rafi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fiza Rafi | Digital Marketing Manager & Shopify Developer',
    description: 'Results-driven Digital Marketing Manager & Shopify Developer helping brands in UAE & Pakistan scale with Google Ads, Meta Ads, SEO & Shopify Development.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaOrgJSONLD = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Fiza Rafi',
    url: siteUrl,
    description: 'Results-driven Digital Marketing Manager & Shopify Developer helping brands in UAE & Pakistan scale with Google Ads, Meta Ads, SEO & Shopify Development.',
    image: `${siteUrl}/og-image.jpg`,
    sameAs: [
      'https://www.linkedin.com/in/fizarafir',
      'https://github.com/Fizasaeed61'
    ]
  };

  return (
    <html lang="en">
      <head>
        <Script id="schema-org" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(schemaOrgJSONLD)}
        </Script>
      </head>
      <body className="bg-[#0B0907] text-[#F9F7F2] antialiased selection:bg-[#E59500] selection:text-[#15120E]">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
