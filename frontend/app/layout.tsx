/**
 * Root Layout
 * App-wide layout component with metadata and global styles
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SWRProvider } from '@/lib/swr';
import WebVitalsReporter from '@/components/WebVitalsReporter';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Soundcore KCP - Knowledge Control Plane',
    template: '%s | Soundcore KCP',
  },
  description: 'AI-driven enterprise knowledge operating system for Anker Soundcore',
  keywords: [
    'Soundcore',
    'Knowledge Management',
    'AI',
    'Content Generation',
    'Customer Service',
    'Analytics',
  ],
  authors: [{ name: 'Anker Soundcore Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://soundcore-kcp.com',
    siteName: 'Soundcore KCP',
    title: 'Soundcore KCP - Knowledge Control Plane',
    description: 'AI-driven enterprise knowledge operating system',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-gray-50">
        <WebVitalsReporter />
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
