import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { JsonLd } from '@/components/json-ld';

export const viewport: Viewport = {
  themeColor: '#14b8a6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://postlytic-ten.vercel.app/'),
  title: {
    default: 'Postlytic | AI LinkedIn Post Analyzer & Viral Growth Tool',
    template: '%s | Postlytic',
  },
  description: 'Maximize your LinkedIn reach with Postlytic. Our AI-powered analytics tool predicts virality, optimizes hooks, and helps you grow your audience faster.',
  keywords: [
    'LinkedIn Analytics',
    'Post Analyzer',
    'Viral Content Tool',
    'LinkedIn Growth',
    'AI Writing Assistant',
    'Social Media Optimization',
    'Hook Generator',
    'Content Strategy',
  ],
  authors: [{ name: 'Postlytic Team' }],
  creator: 'Postlytic',
  publisher: 'Postlytic',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://postlytic-ten.vercel.app/',
    title: 'Postlytic | AI LinkedIn Post Analyzer',
    description: 'Stop guessing. Use AI to predict and improve your LinkedIn post performance before you publish.',
    siteName: 'Postlytic',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Postlytic AI Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Postlytic | AI LinkedIn Post Analyzer',
    description: 'Predict virality and grow your LinkedIn audience with AI.',
    images: ['/og-image.png'],
    creator: '@postlytic',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-bg-canvas text-fg-default">
        <Providers>
          <JsonLd />
          {children}
          <Toaster />
          <SonnerToaster />
        </Providers>
      </body>
    </html>
  );
}
