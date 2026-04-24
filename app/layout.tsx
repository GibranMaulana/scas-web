import type { Metadata } from "next";
import { Days_One, Geist, Geist_Mono } from "next/font/google";
import { Abel } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const abelSerif = Abel({
  style: "normal",
  variable: "--font-abel-serif",
  weight: ["400"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scas",
  description: "Smart Campus Attendance System",
};

const daysOne = Days_One({
  weight: ["400"],
  variable: "--font-days-serif",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${daysOne.variable} ${abelSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <Header />
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
