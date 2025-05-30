import type { Metadata } from "next"
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { font } from "@/fonts/font";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/providers/posthog-provider";
import Script from "next/script";
import { AnalyticsProvider } from "@/providers/googleanalytics";
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
      <head>
        {/* Google Analytics - Global Site Tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-HW337EG7SD"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', ${GA_TRACKING_ID}, {Add commentMore actions
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
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

          {/* Your custom tracking script */}
          <Script
            defer
            data-domain="https://rankify-l7e3.onrender.com" // Replace with your domain
            src="https://analytics-code.vercel.app/tracking-script.js"
          />
          <AnalyticsProvider />

          <PostHogProvider>{children}</PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}