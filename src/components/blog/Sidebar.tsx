'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation' 
import { createClient } from '@/lib/supabase/client'

export default function BlogSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname() 
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login') 
  }

  return (
    <aside className={`${isOpen ? 'w-64' : 'w-20'} bg-accent text-accent-foreground transition-all duration-300 flex flex-col relative z-20 shrink-0 border-r border-accent-foreground/10`}>
      <div className="p-6 flex items-center justify-between">
        <span className={`${!isOpen && 'hidden'} font-bold tracking-widest text-xs uppercase text-accent-foreground/60 whitespace-nowrap`}>
          Blog Engine
        </span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-accent-foreground/60 hover:text-accent-foreground cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-4 mt-4 overflow-hidden">
        <Link 
          href="/blog" 
          className={`flex items-center gap-4 p-3 rounded-xl transition group cursor-pointer whitespace-nowrap ${pathname === '/blog' ? 'bg-accent-foreground/20 text-accent-foreground' : 'hover:bg-accent-foreground/10 text-accent-foreground/70 hover:text-accent-foreground'}`}
        >
          <div className="w-8 h-8 min-w-[2rem] rounded-lg bg-accent-foreground/10 flex items-center justify-center text-accent-foreground/60 group-hover:text-accent-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
          </div>
          <span className={`${!isOpen && 'hidden'} text-sm font-medium`}>All Posts</span>
        </Link>

      </nav>

      <div className="p-4 border-t border-accent-foreground/10 overflow-hidden">
        <button onClick={handleLogout} className="flex items-center gap-4 p-2 text-red-400 hover:text-red-300 transition w-full whitespace-nowrap cursor-pointer">
          <svg className="w-5 h-5 min-w-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span className={`${!isOpen && 'hidden'} text-xs font-bold uppercase tracking-widest`}>Log Out</span>
        </button>
      </div>
    </aside>
  )
}