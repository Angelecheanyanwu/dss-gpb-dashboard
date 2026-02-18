'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Provider } from 'react-redux';
import { store } from '@/store';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>DSS GPB Dashboard</title>
        <meta name="description" content="Secure Data Monitor - Advanced real-time surveillance system" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <ThemeProvider>
            <ThemeToggle />
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
