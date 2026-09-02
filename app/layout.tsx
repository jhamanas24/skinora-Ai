import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const serifFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Skinora AI — Know Before You Buy | AI Skincare Compatibility',
  description:
    'Skinora AI is an AI-powered skincare product compatibility platform. Analyze visible skin characteristics, match active formulation ingredients, and visualize plausible cosmetic simulations before purchasing.',
  keywords: [
    'skincare AI',
    'product compatibility',
    'skin analysis',
    'cosmetic simulation',
    'vitamin c serum',
    'know before you buy',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${serifFont.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 selection:bg-skinora-200 selection:text-skinora-900 font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
