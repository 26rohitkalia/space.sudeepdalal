import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import UserMenu from './UserMenu'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#F5F5F7]/80 backdrop-blur-xl border-b border-gray-200/50 transition-all duration-500 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        <Link 
          href="/" 
          className="text-xs font-bold tracking-[0.2em] uppercase text-black hover:opacity-60 transition-opacity z-50 antialiased"
        >
          Sudeep Dalal
        </Link>

        <div className="hidden md:flex gap-10 text-[11px] font-semibold tracking-widest text-gray-500">
          <Link href="/#profile" className="nav-link hover:text-black transition-colors">PROFILE</Link>
          <button className="nav-link hover:text-black transition-colors cursor-not-allowed opacity-50">PROJECTS</button>
          <button className="nav-link hover:text-black transition-colors cursor-not-allowed opacity-50">INSIGHTS</button>
          <button className="nav-link hover:text-black transition-colors cursor-not-allowed opacity-50">CONTACT</button>
        </div>

        <div className="text-[11px] font-semibold tracking-widest flex items-center gap-6">
          <UserMenu user={user} />
        </div>
      </div>
    </nav>
  )
}