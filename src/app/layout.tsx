import { Outfit } from 'next/font/google';
import './globals.css';

import { ReduxProvider } from '@/components/common/ReduxProvider';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <ReduxProvider>{children}</ReduxProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
