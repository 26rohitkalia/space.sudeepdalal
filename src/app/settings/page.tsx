'use client'

import { useState, useEffect } from 'react'
import { updateSettings } from './actions'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FONTS } from './constants'
import ThemeSelector from '@/components/settings/ThemeSelector'
import FontSelector from '@/components/settings/FontSelector'
import LivePreview from '@/components/settings/LivePreview'

const MOCK_PROFILE = {
    headline: "Visualizing <br>The Future.",
    sub_headline: "Strategic Sourcing Manager",
    company: "Tech Corp",
    role: "Senior Buyer",
    hero_title: "Sudeep<br>Dalal",
    hero_subtitle: "Manager"
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(MOCK_PROFILE)
  const [previewTheme, setPreviewTheme] = useState('default')
  const [previewFont, setPreviewFont] = useState('Inter')
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return; }

      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        setPreviewTheme(data.theme || 'default')
        setPreviewFont(data.font_family || 'Inter')
      }
      setLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (previewFont === 'Custom') return
    const fontData = FONTS.find(f => f.name === previewFont)
    if (fontData && fontData.url) {
        const id = 'preview-font-link'
        let link = document.getElementById(id) as HTMLLinkElement
        if (!link) {
            link = document.createElement('link')
            link.id = id
            link.rel = 'stylesheet'
            document.head.appendChild(link)
        }
        link.href = fontData.url
    }
  }, [previewFont])

  const handleSubmit = async (formData: FormData) => {
    toast.loading('Saving theme...')
    await updateSettings(formData)
    toast.dismiss()
    toast.success('Site appearance updated!')
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-background text-foreground">Loading Settings...</div>

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 md:px-8 bg-background text-foreground transition-colors duration-500" data-theme={previewTheme}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
             <h1 className="text-3xl font-bold text-foreground">Site Settings</h1>
             <Link href="/dashboard" className="text-xs font-bold uppercase text-foreground/50 hover:text-foreground transition">Back to Dashboard</Link>
          </div>
          
          <form action={handleSubmit} className="bg-card-bg p-8 rounded-3xl shadow-lg border border-card-border space-y-8">
            <ThemeSelector currentTheme={previewTheme} onChange={setPreviewTheme} />
            
            <hr className="border-card-border" />
            
            <FontSelector currentFont={previewFont} onChange={setPreviewFont} />

            <button 
                type="submit" 
                className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition shadow-xl hover:shadow-2xl cursor-pointer"
            >
                Save Configuration
            </button>
          </form>
        </div>

        <div className="lg:col-span-8">
           <LivePreview theme={previewTheme} font={previewFont} profile={profile} />
        </div>

      </div>
    </div>
  )
}