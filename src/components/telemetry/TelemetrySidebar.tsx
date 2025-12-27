'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function TelemetrySidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-card-bg border-r border-card-border transition-all duration-300 flex flex-col relative z-20 shrink-0`}>
      <div className="p-6 flex items-center justify-between">
        <span className={`${!isOpen && 'hidden'} font-bold tracking-widest text-xs uppercase text-foreground/40 whitespace-nowrap`}>
          System Status
        </span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-foreground/40 hover:text-accent cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-4 mt-4">
        <Link 
          href="/telemetry" 
          className={`flex items-center gap-4 p-3 rounded-xl transition group cursor-pointer whitespace-nowrap ${pathname === '/telemetry' ? 'bg-accent text-accent-foreground shadow-md' : 'hover:bg-background text-foreground/70 hover:text-foreground'}`}
        >
          <div className="w-8 h-8 min-w-[2rem] flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          </div>
          <span className={`${!isOpen && 'hidden'} text-sm font-bold`}>Overview</span>
        </Link>

        <div className="my-4 border-t border-card-border"></div>

        <Link 
          href="/dashboard"
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-background text-foreground/60 hover:text-foreground transition group cursor-pointer whitespace-nowrap"
        >
          <div className="w-8 h-8 min-w-[2rem] flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </div>
          <span className={`${!isOpen && 'hidden'} text-sm font-medium`}>Back to Dashboard</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-card-border">
        <button onClick={handleLogout} className="flex items-center gap-4 p-2 text-red-400 hover:text-red-500 transition w-full whitespace-nowrap cursor-pointer">
          <svg className="w-5 h-5 min-w-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span className={`${!isOpen && 'hidden'} text-xs font-bold uppercase tracking-widest`}>Log Out</span>
        </button>
      </div>
    </aside>
  )
}