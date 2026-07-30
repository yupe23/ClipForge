import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'ClipForge',
  description: 'AI-powered video repurposing for short-form social clips',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
        <body className="font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
}
