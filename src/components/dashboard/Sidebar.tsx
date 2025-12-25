'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface SidebarProps {
  profileImage: string | null
}

export default function Sidebar({ profileImage }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside 
      className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-accent text-accent-foreground transition-all duration-300 flex flex-col relative z-20 shrink-0`}
    >
      <div className="p-6 flex items-center justify-between">
        <span className={`${!sidebarOpen && 'hidden'} font-bold tracking-widest text-xs uppercase text-accent-foreground/60 whitespace-nowrap`}>
          Control Center
        </span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-accent-foreground/60 hover:text-accent-foreground cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
      
      <nav className="flex-1 px-4 space-y-4 mt-4 overflow-hidden">
        <Link 
          href="/dashboard?tab=profile" 
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent-foreground/10 transition group cursor-pointer whitespace-nowrap"
        >
          <div className="w-8 h-8 min-w-[2rem] rounded-full overflow-hidden border border-accent-foreground/20 bg-accent-foreground/10">
            {profileImage ? (
              <img src={profileImage} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <div className="w-full h-full bg-accent-foreground/20" />
            )}
          </div>
          <span className={`${!sidebarOpen && 'hidden'} text-sm font-medium`}>Profile & Bio</span>
        </Link>

        <Link 
          href="/dashboard?tab=history"
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent-foreground/10 transition group cursor-pointer whitespace-nowrap"
        >
          <div className="w-8 h-8 min-w-[2rem] rounded-lg bg-accent-foreground/10 flex items-center justify-center text-accent-foreground/60 group-hover:text-accent-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          </div>
          <span className={`${!sidebarOpen && 'hidden'} text-sm font-medium`}>Work History</span>
        </Link>

        <Link 
          href="/dashboard?tab=education"
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent-foreground/10 transition group cursor-pointer whitespace-nowrap"
        >
          <div className="w-8 h-8 min-w-[2rem] rounded-lg bg-accent-foreground/10 flex items-center justify-center text-accent-foreground/60 group-hover:text-accent-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
          </div>
          <span className={`${!sidebarOpen && 'hidden'} text-sm font-medium`}>Education</span>
        </Link>
        <Link 
          href="/dashboard?tab=endorsements"
          className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent-foreground/10 transition group cursor-pointer whitespace-nowrap"
        >
          <div className="w-8 h-8 min-w-[2rem] rounded-lg bg-accent-foreground/10 flex items-center justify-center text-accent-foreground/60 group-hover:text-accent-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
          </div>
          <span className={`${!sidebarOpen && 'hidden'} text-sm font-medium`}>Endorsements</span>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-accent-foreground/10 overflow-hidden">
        <button onClick={handleLogout} className="flex items-center gap-4 p-2 text-red-400 hover:text-red-300 transition w-full whitespace-nowrap cursor-pointer">
          <svg className="w-5 h-5 min-w-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span className={`${!sidebarOpen && 'hidden'} text-xs font-bold uppercase tracking-widest`}>Log Out</span>
        </button>
      </div>
    </aside>
  )
}