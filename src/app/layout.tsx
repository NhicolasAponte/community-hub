import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ResponsiveNavHeader from "@/components/nav/responsive-nav-header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "The Queer Connection",
  description: "Connect with your local queer community!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col">
          <ResponsiveNavHeader />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
