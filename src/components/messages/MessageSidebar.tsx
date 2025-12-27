'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function MessageSidebar({ unreadCount }: { unreadCount: number }) {
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'inbox'
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-16 md:w-60 bg-card-bg border-r border-card-border flex flex-col justify-between z-20 shrink-0 h-full">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-card-border">
            <span className="hidden md:block font-bold tracking-widest text-xs uppercase text-foreground/40">Mailbox</span>
            <svg className="w-6 h-6 md:hidden text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </div>

        <nav className="p-3 space-y-1">
            <Link 
            href="/messages" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${view === 'inbox' ? 'bg-accent/10 text-accent font-medium' : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'}`}
            >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
            <span className="hidden md:flex flex-1 justify-between items-center text-sm">
                Inbox
                {unreadCount > 0 && <span className="bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[1.25rem] text-center">{unreadCount}</span>}
            </span>
            </Link>

            <Link 
            href="/messages?view=saved" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${view === 'saved' ? 'bg-accent/10 text-accent font-medium' : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'}`}
            >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            <span className="hidden md:block text-sm">Saved</span>
            </Link>
        </nav>
      </div>

      <div className="p-3 border-t border-card-border space-y-1">
        <Link 
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-all"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          <span className="hidden md:block text-sm">Dashboard</span>
        </Link>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span className="hidden md:block text-sm">Log Out</span>
        </button>
      </div>
    </aside>
  )
}