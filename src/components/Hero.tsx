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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                <span>Resume</span>
            </a>
        )}

        {profile.show_linkedin && profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" className="hero-bubble bubble-linkedin">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                <span>LinkedIn</span>
            </a>
        )}

        {profile.show_facebook && profile.facebook_url && (
             <a href={profile.facebook_url} target="_blank" className="hero-bubble bubble-facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                <span>Facebook</span>
             </a>
        )}

        {profile.show_instagram && profile.instagram_url && (
             <a href={profile.instagram_url} target="_blank" className="hero-bubble bubble-instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>Instagram</span>
             </a>
        )}
      </div>

      <div className="h-[85vh]"></div>
    </>
  )
}