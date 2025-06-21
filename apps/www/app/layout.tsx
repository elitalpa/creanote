import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CommandProvider } from "@/components/command-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Creanote - Easily create organized notes",
  description:
    "A powerful CLI tool that helps you create and manage your notes in markdown format. Simple, portable, and designed for long-term access without vendor lock-in.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          defer
          data-domain="creanote.eliapps.com"
          data-api="/plausible/api/event"
          src="/plausible/js/script.js"
        ></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="creanote-ui-theme">
          <CommandProvider>{children}</CommandProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
