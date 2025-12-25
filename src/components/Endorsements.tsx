'use client'

import { useEffect, useRef } from 'react'
import { Tables } from '@/types/supabase'

interface Props {
  endorsements: Tables<'endorsements'>[]
  speed: number
}

const getImageUrl = (path: string | null) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`
}

export default function Endorsements({ endorsements, speed }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const GAP = 32
    const ANIMATION_MS = 1000
    const intervalId = setInterval(() => {
      const firstItem = track.firstElementChild as HTMLElement
      if (!firstItem) return
      const itemHeight = firstItem.offsetHeight
      const totalScroll = itemHeight + GAP
      track.style.transform = `translateY(-${totalScroll}px)`
      setTimeout(() => {
        track.style.transition = 'none'
        track.appendChild(firstItem)
        track.style.transform = 'translateY(0)'
        void track.offsetWidth
        track.style.transition = `transform ${ANIMATION_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`
      }, ANIMATION_MS)
    }, speed)
    return () => clearInterval(intervalId)
  }, [speed, endorsements])

  return (
    <section className="relative mb-20" data-aos="fade-up">
      <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] mb-12 border-b border-card-border pb-4">
        Endorsements
      </h3>
      
      <div className="h-[600px] overflow-hidden relative select-none">
        
        <div 
            className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, var(--background) 20%, transparent)' }}
        ></div>
        
        <div 
            className="absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to top, var(--background) 20%, transparent)' }}
        ></div>
        
        <div ref={trackRef} className="flex flex-col gap-8 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]">
          {endorsements.map((end) => (
            <div key={end.id} className="bg-card-bg p-10 rounded-[2rem] border border-card-border shadow-sm">
              <div className="flex items-start gap-5 mb-6">
                {end.image_url ? (
                  <img 
                    src={getImageUrl(end.image_url)!} 
                    alt={end.name}
                    className="w-12 h-12 rounded-full object-cover border border-card-border shadow-md shrink-0" 
                  />
                ) : (
                  <div className={`w-12 h-12 bg-gradient-to-br ${end.color_class} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shrink-0`}>
                    {end.name[0]}
                  </div>
                )}

                <div>
                  {end.linkedin_url ? (
                    <a 
                        href={end.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-bold text-foreground text-lg hover:text-accent transition-colors flex items-center gap-2 group cursor-pointer"
                    >
                        {end.name}
                        <svg className="w-3 h-3 text-foreground/30 group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  ) : (
                    <div className="font-bold text-foreground text-lg">{end.name}</div>
                  )}
                  
                  <div className="text-xs text-foreground/50 font-medium uppercase tracking-wider">{end.role}</div>
                </div>
              </div>
              <p className="text-foreground/70 leading-relaxed font-light">"{end.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}