'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

export default function UserMenu({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (!user) {
    return (
      <Link 
        href="/login" 
        // Themed Login Button
        className="px-6 py-2.5 rounded-full bg-accent text-accent-foreground hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 duration-300 text-[11px] font-semibold tracking-widest cursor-pointer"
      >
        Login
      </Link>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        // Themed Toggle Button
        className="flex items-center gap-1 text-foreground/60 hover:text-foreground hover:bg-foreground/5 px-3 py-1.5 rounded-lg transition-all uppercase text-[11px] font-semibold tracking-widest cursor-pointer"
      >
        Manager
        <svg className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <div 
        // Themed Dropdown Container
        className={`absolute right-0 mt-4 w-48 bg-card-bg rounded-xl shadow-2xl border border-card-border overflow-hidden py-1 z-50 transition-all duration-200 origin-top-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="px-4 py-3 border-b border-card-border">
           <p className="text-[10px] text-foreground/40 uppercase tracking-widest">Signed in as</p>
           <p className="text-xs font-bold truncate text-foreground">{user.email}</p>
        </div>

        <Link 
          href="/dashboard" 
          onClick={() => setIsOpen(false)}
          className="block px-4 py-3 text-sm text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition cursor-pointer"
        >
          Profile Dashboard
        </Link>
        
        <Link 
          href="/settings"
          onClick={() => setIsOpen(false)}
          className="block px-4 py-3 text-sm text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition cursor-pointer"
        >
          Settings
        </Link>
        
        <button className="w-full text-left px-4 py-3 text-sm text-foreground/30 cursor-not-allowed hover:bg-foreground/5 transition flex justify-between items-center">
          Blog 
          <span className="text-[9px] border border-card-border rounded px-1 text-foreground/30">SOON</span>
        </button>
        
        <div className="border-t border-card-border my-1"></div>
        
        <button 
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition font-medium cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}