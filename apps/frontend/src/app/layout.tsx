import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/libs/toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AIMS Platform',
  description: 'Artificial Intelligence Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
} 