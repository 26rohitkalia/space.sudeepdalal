'use client'

import { useEffect } from 'react'

interface Props {
  theme: string
  fontFamily: string
  customFontUrl: string | null
}

const getFontUrl = (path: string) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fonts/${path}`
}

export default function ThemeRegistry({ theme, fontFamily, customFontUrl }: Props) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme || 'default')

    const root = document.documentElement
    
    if (fontFamily === 'Custom' && customFontUrl) {
        const styleId = 'custom-font-style'
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
                src: url('${url}') format('truetype'); /* Assuming TTF/OTF mostly */
                font-weight: normal;
                font-style: normal;
            }
        `
        root.style.setProperty('--font-body', "'CustomUploaded', sans-serif")
    } else {
        // Handle Google/System fonts
        let fontName = 'Inter'
        switch(fontFamily) {
            case 'Serif': fontName = '"Playfair Display", serif'; break;
            case 'Mono': fontName = '"Space Mono", monospace'; break;
            case 'Condensed': fontName = '"Oswald", sans-serif'; break;
            default: fontName = '"Inter", sans-serif';
        }
        root.style.setProperty('--font-body', fontName)
    }

  }, [theme, fontFamily, customFontUrl])

  return null
}