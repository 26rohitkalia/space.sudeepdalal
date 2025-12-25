'use client'

import { useState, useEffect } from 'react'
import { Tables } from '@/types/supabase'

const getImageUrl = (path: string | null) => {
  if (!path) return '/placeholder.jpg' 
  if (path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`
}

export default function Hero({ profile }: { profile: Tables<'profiles'> }) {
  const [mode, setMode] = useState<'initial' | 'center' | 'right'>('initial')
  const [textVisible, setTextVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setMode('center'), 100)
    const t2 = setTimeout(() => setTextVisible(true), 800)
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setMode('right')
        setTextVisible(false)
      } else {
        setMode('center')
        setTextVisible(true)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <div id="hero-card" className={`mode-${mode}`}>
        <img src={getImageUrl(profile.profile_image)} alt="Sudeep Dalal" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>
        <div id="hero-text" className={textVisible ? 'text-visible' : 'text-hidden'}>
        </div>
      </div>

      <div id="hero-actions" className={mode === 'right' ? 'active' : ''}>
         <a href={profile.linkedin_url || '#'} target="_blank" className="hero-bubble bubble-linkedin">LinkedIn</a>
      </div>
      <div className="h-[85vh]"></div>
    </>
  )
}