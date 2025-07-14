import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import ThemeToogle from "./components/ThemeToogle";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_BASE_URL as string),
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME || "QueryMind",
    template: "%s | " + process.env.NEXT_PUBLIC_APP_NAME,
  },
  description:
    "Chat with a Postgres database using natural language powered by the AI.",
  category: "technology",
  openGraph: {
    title: process.env.NEXT_PUBLIC_APP_NAME || "QueryMind",
    description:
      "Chat with a Postgres database using natural language powered by the AI.",
    url: "https://nextjs.org",
    siteName: process.env.NEXT_PUBLIC_APP_NAME || "QueryMind",
    images: [
      {
        url: (process.env.NEXT_BASE_URL as string) + "/opengraph.png", // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description:
      "Chat with a Postgres database using natural language powered by the AI.",
    creator: "https://x.com/Satnam_72",

    images: [(process.env.NEXT_BASE_URL as string) + "/opengraph.png"], // Must be an absolute URL
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistMono.className} ${GeistSans.className} relative overflow-x-hidden`}
      >
        <Toaster richColors duration={2000} />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeToogle />
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
