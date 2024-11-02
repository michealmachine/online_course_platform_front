import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MockInitializer } from '@/components/MockInitializer';
import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/contexts/auth-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '在线课程平台',
  description: '学习各种精品课程',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <AuthProvider>
          <MockInitializer />
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
