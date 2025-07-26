import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Poppins } from "next/font/google"
import { Luckiest_Guy } from "next/font/google"
import { Shrikhand } from "next/font/google"
import { Titan_One } from "next/font/google"
import { Orbitron } from "next/font/google"
import { Baloo_Bhai_2 } from "next/font/google"
import { Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import CursorFollower from "@/components/cursor-follower"
import ScrollIndicator from "@/components/scroll-indicator"
import BackgroundGradient from "@/components/background-gradient"
import { Toaster } from "react-hot-toast"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const balooBhai2 = Baloo_Bhai_2({
  subsets: ["latin"],
  variable: "--font-baloo-bhai-2",
  display: "swap",
  weight: ["400", "700"], // Add desired font weights
})
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "700"], // Add desired font weights
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "700"], // Add desired font weights
})
const shrikhand = Shrikhand({
  subsets: ['latin'],
  weight: '400', // Only 400 available for this font
})
const titanOne = Titan_One({
  subsets: ['latin'],
  weight: '400', // Only 400 available for this font
})

const luckiest = Luckiest_Guy({
  subsets: ['latin'],
  weight: '400', // Only 400 available for this font
});

export const metadata: Metadata = {
  title: "Suryabrata Sahoo | Web Developer",
  description: "Portfolio website of Jane Doe, a web developer specializing in modern web applications.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CursorFollower />
          <ScrollIndicator />
          <BackgroundGradient />
          <Toaster position="bottom-center"
            reverseOrder={true} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'