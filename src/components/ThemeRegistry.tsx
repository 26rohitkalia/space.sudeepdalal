'use client'

import { useEffect } from 'react'

interface Props {
  theme: string
  fontFamily: string
  customFontUrl: string | null
}

const FONTS_MAP: Record<string, string> = {
    'Inter': 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap',
    'Roboto': 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap',
    'Open Sans': 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap',
    'Lato': 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
    'Montserrat': 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap',
    'Poppins': 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;700&display=swap',
    'Raleway': 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;700&display=swap',
    'Nunito': 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;700&display=swap',
    'DM Sans': 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&display=swap',
    'Space Grotesk': 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&display=swap',
    'Playfair Display': 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
    'Merriweather': 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap',
    'Lora': 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap',
    'PT Serif': 'https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap',
    'Cinzel': 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap',
    'Space Mono': 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
    'Roboto Mono': 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;700&display=swap',
    'Fira Code': 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;700&display=swap',
    'IBM Plex Mono': 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;700&display=swap',
    'Oswald': 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;700&display=swap',
    'Bebas Neue': 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    'Syne': 'https://fonts.googleapis.com/css2?family=Syne:wght@400;700&display=swap',
}

const getFontUrl = (path: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fonts/${path}`
}

export default function ThemeRegistry({ theme, fontFamily, customFontUrl }: Props) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme || 'default')

    const root = document.documentElement
    
    // Handle Custom Uploaded Fonts
    if (fontFamily === 'Custom' && customFontUrl) {
        const styleId = 'custom-uploaded-font'
        let styleTag = document.getElementById(styleId) as HTMLStyleElement
        if (!styleTag) {
            styleTag = document.createElement('style')
            styleTag.id = styleId
            document.head.appendChild(styleTag)
        }
        
        const url = getFontUrl(customFontUrl)
        styleTag.textContent = `
            @font-face {
                font-family: 'CustomUploaded';
                src: url('${url}') format('truetype');
                font-weight: normal;
                font-style: normal;
            }
        `
        root.style.setProperty('--font-body', "'CustomUploaded', sans-serif")
    } 
    else if (fontFamily && fontFamily !== 'Custom') {
        const linkId = 'theme-font-link'
        let link = document.getElementById(linkId) as HTMLLinkElement
        
        const googleUrl = FONTS_MAP[fontFamily]

        if (googleUrl) {
            if (!link) {
                link = document.createElement('link')
                link.id = linkId
                link.rel = 'stylesheet'
                document.head.appendChild(link)
            }
            link.href = googleUrl
            root.style.setProperty('--font-body', `"${fontFamily}", sans-serif`)
        } else {
             root.style.setProperty('--font-body', '"Inter", sans-serif')
        }
    } else {
        root.style.setProperty('--font-body', '"Inter", sans-serif')
    }

  }, [theme, fontFamily, customFontUrl])

  return null
}