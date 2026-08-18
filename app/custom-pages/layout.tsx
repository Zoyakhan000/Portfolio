import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Pages & Resources',
  description: 'Specialized landing pages, tools, and digital resources designed and managed by Fiza Rafi.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rizwansaddique.site/custom-pages',
    title: 'Custom Pages & Resources | Fiza Rafi',
    description: 'Specialized landing pages, tools, and digital resources designed and managed by Fiza Rafi.',
    siteName: 'Fiza Rafi Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Pages & Resources | Fiza Rafi',
    description: 'Specialized landing pages, tools, and digital resources designed and managed by Fiza Rafi.',
    creator: '@fizarafir',
  },
};

export default function CustomPagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
