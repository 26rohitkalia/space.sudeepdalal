'use client'

import { useState, useEffect } from 'react'
import { updateSettings } from './actions'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const MOCK_PROFILE = {
    headline: "Visualizing <br>The Future.",
    sub_headline: "Strategic Sourcing Manager",
    company: "Tech Corp",
    role: "Senior Buyer",
    hero_title: "Sudeep<br>Dalal"
}

const THEMES = [
    { 
        id: 'default', name: 'Default', 
        colors: { bg: '#f4f4f5', fg: '#171717', accent: '#000000', border: '#e5e7eb' } 
    },
    { 
        id: 'light-warm', name: 'Paper', 
        colors: { bg: '#FDFBF7', fg: '#4A4036', accent: '#8C5E35', border: '#E6DCC9' } 
    },
    { 
        id: 'light-corporate', name: 'Corporate', 
        colors: { bg: '#F0F4F8', fg: '#102A43', accent: '#334E68', border: '#D9E2EC' } 
    },
    { 
        id: 'swiss', name: 'Swiss', 
        colors: { bg: '#ffffff', fg: '#000000', accent: '#ef4444', border: '#000000' },
        extra: 'border-2 border-black' 
    },
    { 
        id: 'executive', name: 'Executive', 
        colors: { bg: '#0f172a', fg: '#f1f5f9', accent: '#fbbf24', border: '#334155' } 
    },
    { 
        id: 'dark-modern', name: 'Dark Slate', 
        colors: { bg: '#09090b', fg: '#fafafa', accent: '#ffffff', border: '#27272a' } 
    },
    { 
        id: 'dark-oled', name: 'OLED', 
        colors: { bg: '#000000', fg: '#e5e5e5', accent: '#00E5FF', border: '#333333' } 
    },
    { 
        id: 'dracula', name: 'Dracula', 
        colors: { bg: '#282a36', fg: '#f8f8f2', accent: '#ff79c6', border: '#6272a4' } 
    },
    { 
        id: 'terminal', name: 'Terminal', 
        colors: { bg: '#0d1117', fg: '#4ade80', accent: '#4ade80', border: '#30363d' },
        font: 'Courier New'
    },
    { 
        id: 'futuristic', name: 'Futuristic', 
        colors: { bg: '#030014', fg: '#E0E7FF', accent: '#F43F5E', border: '#6366f1' },
        extra: 'shadow-[0_0_15px_#6366f1]' 
    },
]

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

  const handleSubmit = async (formData: FormData) => {
    toast.loading('Saving theme...')
    await updateSettings(formData)
    toast.dismiss()
    toast.success('Site appearance updated!')
  }

  const getPreviewFontStyle = () => {
     switch(previewFont) {
        case 'Serif': return 'var(--font-playfair)'
        case 'Mono': return 'var(--font-space)'
        case 'Condensed': return 'var(--font-oswald)'
        case 'Custom': return 'inherit' 
        default: return 'var(--font-inter)'
     }
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
            
            <div>
              <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-4">Select Theme</label>
              <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {THEMES.map((t) => (
                  <label 
                    key={t.id} 
                    className={`cursor-pointer relative group transition-all duration-300 transform ${previewTheme === t.id ? 'scale-105 ring-2 ring-accent' : 'hover:scale-102 opacity-80 hover:opacity-100'}`}
                  >
                    <input 
                        type="radio" 
                        name="theme" 
                        value={t.id} 
                        checked={previewTheme === t.id} 
                        onChange={() => setPreviewTheme(t.id)} 
                        className="hidden" 
                    />
                    
                    <div 
                        className={`rounded-xl overflow-hidden border h-24 flex flex-col shadow-sm ${t.extra || ''}`}
                        style={{ 
                            backgroundColor: t.colors.bg, 
                            borderColor: t.colors.border 
                        }}
                    >
                        <div className="h-6 w-full flex items-center px-2 gap-1.5" style={{ backgroundColor: t.colors.accent }}>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                        </div>
                        
                        <div className="p-3 flex flex-col justify-between h-full">
                            <div className="w-16 h-1 rounded" style={{ backgroundColor: t.colors.border }}></div>
                            <div className="space-y-1">
                                <div className="w-full h-1 rounded opacity-20" style={{ backgroundColor: t.colors.fg }}></div>
                                <div className="w-2/3 h-1 rounded opacity-20" style={{ backgroundColor: t.colors.fg }}></div>
                            </div>
                            <span 
                                className="text-[10px] font-bold mt-1 self-end" 
                                style={{ color: t.colors.fg, fontFamily: t.font || 'inherit' }}
                            >
                                {t.name}
                            </span>
                        </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-card-border" />

            <div>
              <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-4">Typography</label>
              <div className="space-y-4">
                 <select 
                    name="font_family" 
                    value={previewFont} 
                    onChange={(e) => setPreviewFont(e.target.value)}
                    className="w-full p-3 rounded-xl border border-card-border bg-background text-foreground focus:ring-2 focus:ring-accent outline-none text-sm font-medium cursor-pointer"
                 >
                    <option value="Inter">Inter (Clean Sans)</option>
                    <option value="Serif">Playfair Display (Elegant Serif)</option>
                    <option value="Mono">Space Mono (Tech/Code)</option>
                    <option value="Condensed">Oswald (Bold Condensed)</option>
                    <option value="Custom">Custom Upload...</option>
                 </select>

                 {previewFont === 'Custom' && (
                    <div className="bg-background/50 p-4 rounded-xl border border-card-border border-dashed">
                        <label className="block text-[10px] font-bold text-foreground/40 uppercase mb-2">Upload Font File (.ttf / .woff2)</label>
                        <input type="file" name="custom_font_file" accept=".ttf,.otf,.woff,.woff2" className="text-xs w-full text-foreground" />
                        <p className="text-[10px] text-foreground/40 mt-2">Note: Custom fonts won't appear in preview until saved.</p>
                    </div>
                 )}
              </div>
            </div>

            <button 
                type="submit" 
                className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition shadow-xl hover:shadow-2xl cursor-pointer"
            >
                Save Configuration
            </button>
          </form>
        </div>

        <div className="lg:col-span-8 sticky top-28 h-[calc(100vh-160px)]">
           <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4 px-2">
                 <h2 className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Live Preview</h2>
                 <span className="text-xs text-foreground/60 bg-card-bg px-2 py-1 rounded-md border border-card-border shadow-sm">
                    Mode: {previewTheme} | Font: {previewFont}
                 </span>
              </div>
              
              <div 
                className="flex-1 rounded-[2.5rem] overflow-hidden shadow-2xl border border-card-border relative isolate bg-background text-foreground transition-all duration-500"
                style={{ fontFamily: getPreviewFontStyle() }}
              >
                 <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-8">
                    
                    <div className="mb-20 mt-10">
                        <div 
                            className="w-full h-80 rounded-3xl relative overflow-hidden flex items-end p-8 mb-8 transition-all duration-500"
                            style={{ 
                                background: 'var(--accent)',
                                color: 'var(--accent-foreground)'
                             }}
                        >
                            <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }}></div>
                            
                            {previewTheme === 'futuristic' && (
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            )}

                            <div className="relative z-10">
                                <h1 className="text-6xl font-bold leading-[0.9] mb-2" dangerouslySetInnerHTML={{ __html: profile.hero_title || 'Sudeep<br>Dalal' }}></h1>
                                <p className="text-lg opacity-80" dangerouslySetInnerHTML={{ __html: profile.hero_subtitle || 'Manager' }}></p>
                            </div>

                            {previewTheme === 'terminal' && (
                                <div className="absolute top-4 right-4 text-xs font-mono opacity-60">
                                    &gt; SYSTEM.READY
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-xl">
                        <h2 className="text-4xl font-bold mb-4 leading-tight text-foreground" dangerouslySetInnerHTML={{ __html: profile.headline }}></h2>
                        <p className="text-foreground/60 mb-12 text-lg">
                            This is how your bio text will look. {profile.sub_headline}
                        </p>

                        <div className="space-y-6 pl-6 border-l-2" style={{ borderColor: 'var(--card-border)' }}>
                            <div className="group">
                                <h3 className="text-2xl font-bold text-foreground">{profile.company || 'Company Name'}</h3>
                                <p className="text-foreground/60 font-medium">{profile.role} | 2020-Present</p>
                                <p className="mt-2 text-sm text-foreground/50">Led strategic sourcing initiatives resulting in 15% cost reduction.</p>
                            </div>
                            <div className="group opacity-50">
                                <h3 className="text-2xl font-bold text-foreground">Previous Corp</h3>
                                <p className="text-foreground/60 font-medium">Buyer | 2018-2020</p>
                            </div>
                        </div>

                        <div className="mt-16">
                            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] mb-6">Endorsements</h3>
                            <div className="p-6 rounded-2xl border bg-card-bg border-card-border">
                                <div className="flex gap-4 items-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-accent"></div>
                                    <div>
                                        <div className="font-bold text-sm text-foreground">Jane Doe</div>
                                        <div className="text-xs text-foreground/50">Director of Supply Chain</div>
                                    </div>
                                </div>
                                <p className="text-sm text-foreground/70 italic">
                                    "Sudeep is an incredible asset to any team."
                                </p>
                            </div>
                        </div>
                    </div>

                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}