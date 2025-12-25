import type { Metadata } from 'next'
import { Inter, Playfair_Display, Space_Mono, Oswald } from 'next/font/google'
import Navbar from '@/components/Navbar'
import SmoothScroll from '@/components/SmoothScroll'
import { Toaster } from 'sonner'
import { createClient } from '@/lib/supabase/server'
import ThemeRegistry from '@/components/ThemeRegistry'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })

export const metadata: Metadata = {
  title: 'Sudeep Dalal | Strategic Sourcing',
  description: 'Portfolio of Sudeep Dalal',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let themeSettings = { theme: 'default', font_family: 'Inter', custom_font_url: null }
  
  if (user) {
    const { data } = await supabase.from('profiles').select('theme, font_family, custom_font_url').eq('id', user.id).single()
    if (data) themeSettings = data as any
  } else {
      const { data } = await supabase.from('profiles').select('theme, font_family, custom_font_url').limit(1).single()
      if (data) themeSettings = data as any
  }

  const activeTheme = themeSettings.theme || 'default';

  return (
    <html lang="en" data-theme={activeTheme} className={`${inter.variable} ${playfair.variable} ${spaceMono.variable} ${oswald.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeRegistry 
            theme={activeTheme} 
            fontFamily={themeSettings.font_family}
            customFontUrl={themeSettings.custom_font_url}
        />
        <SmoothScroll />
        <Navbar />
        <main>{children}</main>
        <Toaster position="bottom-right" richColors /> 
      </body>
    </html>
  )
}