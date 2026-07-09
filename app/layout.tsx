import type { Metadata } from 'next';
import { AR_One_Sans } from 'next/font/google';
import './globals.css';

const ArSans = AR_One_Sans({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'TravelRight',
  description: 'TravelRight with us.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ArSans.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
