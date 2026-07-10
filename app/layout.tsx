import type { Metadata } from 'next';
import { AR_One_Sans, Geist } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

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
    <html
      lang="en"
      className={cn(
        'h-full',
        'antialiased',
        ArSans.className,
        'font-sans',
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
