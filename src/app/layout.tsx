import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import Navbar from '@/components/Navbar'
import SmoothScroll from '@/components/SmoothScroll'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })

export const metadata: Metadata = {
  title: 'Sudeep Dalal | Strategic Sourcing',
  description: 'Portfolio of Sudeep Dalal, Procurement & Supply Chain Manager.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">
        <SmoothScroll />
        <Navbar />
        <main>{children}</main>
        <Toaster position="bottom-right" richColors /> 
      </body>
    </html>
  )
}