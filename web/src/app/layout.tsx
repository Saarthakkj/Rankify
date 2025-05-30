import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { font } from "@/fonts/font";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/providers/posthog-provider";

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
          <PostHogProvider>
            {children}
            </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
