import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import UserMenu from './UserMenu'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let unreadCount = 0
  if (user) {
    const { count } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
    unreadCount = count || 0
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-card-border transition-all duration-500 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        <Link 
          href="/" 
          className="text-xs font-bold tracking-[0.2em] uppercase text-foreground hover:opacity-60 transition-opacity z-50 antialiased"
        >
          Sudeep Dalal
        </Link>

        <div className="hidden md:flex gap-10 text-[11px] font-semibold tracking-widest text-foreground/50">
          <Link href="/#profile" className="nav-link hover:text-foreground transition-colors">PROFILE</Link>
          <Link href="/projects" className="nav-link hover:text-foreground transition-colors">PROJECTS</Link>
          <Link href="/insights" className="nav-link hover:text-foreground transition-colors">INSIGHTS</Link>
          <Link href="/contact" className="nav-link hover:text-foreground transition-colors">CONTACT</Link>
        </div>

        <div className="text-[11px] font-semibold tracking-widest flex items-center gap-6">
          {user && (
            <Link href="/messages" className="relative text-foreground/60 hover:text-accent transition-colors group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
              )}
            </Link>
          )}
          <UserMenu user={user} />
        </div>
      </div>
    </nav>
  )
}