import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/components/brutal/AuthProvider';
import { PwaRegister } from '@/components/pwa/PwaRegister';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  applicationName: 'Delhi Civic',
  title: 'Delhi Civic — Report. Track. Fix.',
  description: 'A public civic platform for Delhi residents to report civic problems and track their resolution.',
  keywords: ['Delhi', 'Civic', 'Complaints', 'Municipal', 'Government', 'Issues'],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-16.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#dc2626',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Delhi Civic',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'msapplication-TileColor': '#dc2626',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#dc2626',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${spaceMono.variable}`}>
      <body className="flex flex-col min-h-screen overflow-x-hidden">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-civic-white focus:px-4 focus:py-3 focus:font-bold focus:shadow-brutal">
          Skip to main content
        </a>
        <PwaRegister />
        <AuthProvider>
          <Header />
          <main id="main-content" tabIndex={-1} className="flex-1 overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
