import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin | ARYPlusD",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased bg-background text-foreground min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
