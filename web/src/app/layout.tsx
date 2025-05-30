import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { font } from "@/fonts/font";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/providers/posthog-provider";
import Script from "next/script";
import { GoogleAnalytics } from '@next/third-parties/google'
import { GA_TRACKING_ID } from "@/lib/gtag";


export const metadata: Metadata = {
  title: "Rankify",
  description:
    "Analyze how your website performs in AI-powered search engines and get insights to improve your ranking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={` antialiased ${font.className} bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <Script
            defer
            data-domain="https://rankify-l7e3.onrender.com" // Replace with your domain
            src="https://analytics-code.vercel.app/tracking-script.js"
          />
          <GoogleAnalytics gaId={GA_TRACKING_ID} />
          <PostHogProvider>{children}</PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
