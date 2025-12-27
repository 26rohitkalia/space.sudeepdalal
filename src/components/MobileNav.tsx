'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

interface Props {
  user: User | null
  blogTitle: string
}

export default function MobileNav({ user, blogTitle }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="block md:hidden p-2 text-foreground focus:outline-none hover:opacity-70 transition-opacity"
        aria-label="Open Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-background text-foreground flex flex-col p-8 animate-in fade-in duration-200 overflow-y-auto">
            
            <div className="flex justify-end mb-8 shrink-0">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-foreground/60 hover:text-foreground transition-colors"
                    aria-label="Close Menu"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <nav className="flex flex-col gap-6 text-3xl font-bold tracking-tight text-foreground">
                <Link href="/#profile" onClick={() => setIsOpen(false)} className="border-b border-card-border pb-4 hover:text-accent transition-colors">PROFILE</Link>
                <Link href="/projects" onClick={() => setIsOpen(false)} className="border-b border-card-border pb-4 hover:text-accent transition-colors">PROJECTS</Link>
                <Link href="/insights" onClick={() => setIsOpen(false)} className="border-b border-card-border pb-4 uppercase hover:text-accent transition-colors">{blogTitle}</Link>
                <Link href="/contact" onClick={() => setIsOpen(false)} className="border-b border-card-border pb-4 hover:text-accent transition-colors">CONTACT</Link>
                
                {user && (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-accent text-xl mt-4 flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
                        Dashboard
                    </Link>
                )}
            </nav>
        </div>,
        document.body
      )}
    </>
  )
}