'use client'

import { useState, useEffect } from 'react'
import { Tables } from '@/types/supabase'
import HeroText from './HeroText'

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
    const t2 = setTimeout(() => setTextVisible(true), 600)

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
        <img src={getImageUrl(profile.profile_image)} alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>
        <HeroText 
            headline={profile.hero_title || 'Sudeep<br>Dalal'} 
            subHeadline={profile.hero_subtitle || 'Assistant Manager'} 
            isVisible={textVisible} 
        />
      </div>

      <div id="hero-actions" className={mode === 'right' ? 'active' : ''}>
        {profile.resume_file && (
            <a href={getImageUrl(profile.resume_file)} target="_blank" className="hero-bubble bubble-resume">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download CV
            </a>
        )}
        {profile.show_linkedin && profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" className="hero-bubble bubble-linkedin">LinkedIn</a>
        )}

        {profile.show_facebook && profile.facebook_url && (
             <a href={profile.facebook_url} target="_blank" className="hero-bubble bubble-facebook" style={{ background: '#fff', color: '#1877f2' }}>Facebook</a>
        )}

        {profile.show_instagram && profile.instagram_url && (
             <a href={profile.instagram_url} target="_blank" className="hero-bubble bubble-instagram" style={{ background: '#fff', color: '#d6249f' }}>Instagram</a>
        )}
      </div>

      <div className="h-[85vh]"></div>
    </>
  )
}