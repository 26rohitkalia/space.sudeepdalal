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

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Settings...</div>

  return (
    <div className="bg-[#f4f4f5] min-h-screen pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
             <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
             <Link href="/dashboard" className="text-xs font-bold uppercase text-gray-400 hover:text-black transition">Back to Dashboard</Link>
          </div>
          
          <form action={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 space-y-8">
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                    { id: 'default', name: 'Default', bg: '#f4f4f5', fg: '#171717' },
                    { id: 'light-warm', name: 'Paper (Warm)', bg: '#FDFBF7', fg: '#4A4036' },
                    { id: 'light-corporate', name: 'Corporate (Cool)', bg: '#F0F4F8', fg: '#102A43' },
                    { id: 'dark-modern', name: 'Dark Slate', bg: '#09090b', fg: '#ffffff' },
                    { id: 'dark-oled', name: 'OLED Black', bg: '#000000', fg: '#00E5FF' },
                    { id: 'futuristic', name: 'Futuristic', bg: '#030014', fg: '#6366f1' },
                ].map((t) => (
                  <label 
                    key={t.id} 
                    className={`cursor-pointer p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${previewTheme === t.id ? 'border-black ring-1 ring-black' : 'border-gray-100 hover:border-gray-300'}`}
                  >
                    <input 
                        type="radio" 
                        name="theme" 
                        value={t.id} 
                        checked={previewTheme === t.id} 
                        onChange={() => setPreviewTheme(t.id)} 
                        className="hidden" 
                    />
                    <div className="w-6 h-6 rounded-full border border-gray-200 shadow-sm" style={{ background: t.bg }}></div>
                    <span className="text-xs font-bold text-gray-600">{t.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Typography</label>
              <div className="space-y-4">
                 <select 
                    name="font_family" 
                    value={previewFont} 
                    onChange={(e) => setPreviewFont(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none text-sm font-medium cursor-pointer"
                 >
                    <option value="Inter">Inter (Clean Sans)</option>
                    <option value="Serif">Playfair Display (Elegant Serif)</option>
                    <option value="Mono">Space Mono (Tech/Code)</option>
                    <option value="Condensed">Oswald (Bold Condensed)</option>
                    <option value="Custom">Custom Upload...</option>
                 </select>

                 {previewFont === 'Custom' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 border-dashed">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Upload Font File (.ttf / .woff2)</label>
                        <input type="file" name="custom_font_file" accept=".ttf,.otf,.woff,.woff2" className="text-xs w-full" />
                        <p className="text-[10px] text-gray-400 mt-2">Note: Custom fonts won't appear in preview until saved.</p>
                    </div>
                 )}
              </div>
            </div>

            <button 
                type="submit" 
                className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition shadow-xl hover:shadow-2xl cursor-pointer"
            >
                Save Configuration
            </button>
          </form>
        </div>

        <div className="lg:col-span-8 sticky top-28 h-[calc(100vh-160px)]">
           <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4 px-2">
                 <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Live Preview</h2>
                 <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">
                    Mode: {previewTheme} | Font: {previewFont}
                 </span>
              </div>
              
              <div 
                className="flex-1 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-200 relative isolate"
                data-theme={previewTheme}
                style={{ 
                    fontFamily: getPreviewFontStyle(),
                    background: 'var(--background)',
                    color: 'var(--foreground)'
                }}
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            {previewTheme === 'futuristic' && (
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            )}

                            <div className="relative z-10">
                                <h1 className="text-6xl font-bold leading-[0.9] mb-2" dangerouslySetInnerHTML={{ __html: profile.hero_title || 'Sudeep<br>Dalal' }}></h1>
                                <p className="text-lg opacity-80" dangerouslySetInnerHTML={{ __html: profile.hero_subtitle || 'Manager' }}></p>
                            </div>

                            {previewTheme === 'futuristic' && (
                                <div className="absolute top-4 right-4 text-[10px] font-mono border border-white/50 px-2 py-1 rounded text-white/80">
                                    SYS.ONLINE
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="max-w-xl">
                        <h2 className="text-4xl font-bold mb-4 leading-tight" dangerouslySetInnerHTML={{ __html: profile.headline }}></h2>
                        <p className="opacity-60 mb-12 text-lg">
                            This is how your bio text will look. {profile.sub_headline}
                        </p>

                        <div className="space-y-6 pl-6 border-l-2" style={{ borderColor: 'var(--card-border)' }}>
                            <div className="group">
                                <h3 className="text-2xl font-bold">{profile.company || 'Company Name'}</h3>
                                <p className="opacity-60 font-medium">{profile.role} | 2020-Present</p>
                                <p className="mt-2 text-sm opacity-50">Led strategic sourcing initiatives resulting in 15% cost reduction across global categories.</p>
                            </div>
                            <div className="group opacity-50">
                                <h3 className="text-2xl font-bold">Previous Corp</h3>
                                <p className="opacity-60 font-medium">Buyer | 2018-2020</p>
                            </div>
                        </div>

                        <div className="mt-16">
                            <h3 className="text-xs font-bold opacity-40 uppercase tracking-[0.2em] mb-6">Endorsements</h3>
                            <div 
                                className="p-6 rounded-2xl border"
                                style={{ 
                                    backgroundColor: 'var(--card-bg)',
                                    borderColor: 'var(--card-border)'
                                }}
                            >
                                <div className="flex gap-4 items-center mb-4">
                                    <div className="w-10 h-10 rounded-full" style={{ background: 'var(--accent)' }}></div>
                                    <div>
                                        <div className="font-bold text-sm">Jane Doe</div>
                                        <div className="text-xs opacity-50">Director of Supply Chain</div>
                                    </div>
                                </div>
                                <p className="text-sm opacity-70 italic">
                                    "Sudeep is an incredible asset to any team. His vision for procurement strategy is unmatched."
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