'use client'

import { useState } from 'react'
import { updateProfile } from '@/app/dashboard/actions'
import { Tables } from '@/types/supabase'
import { toast } from 'sonner'
import RichTextEditor from '@/components/ui/RichTextEditor'

const getImageUrl = (path: string | null) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`
}

export default function ProfileTab({ profile }: { profile: Tables<'profiles'> }) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(getImageUrl(profile.profile_image))

  const [heroTitle, setHeroTitle] = useState(profile.hero_title || '')
  const [heroSubtitle, setHeroSubtitle] = useState(profile.hero_subtitle || '')
  const [headline, setHeadline] = useState(profile.headline || '')
  const [subHeadline, setSubHeadline] = useState(profile.sub_headline || '')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      await updateProfile(formData)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to save changes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Profile Settings</h2>
      </div>

      <form action={handleSubmit} className="bg-card-bg p-10 rounded-[2.5rem] shadow-sm border border-card-border">
        <div className="grid md:grid-cols-12 gap-12">
          
          <div className="md:col-span-4 flex flex-col items-center pt-4 space-y-8">
            <div className="relative group cursor-pointer w-64 h-64">
              <div className="w-full h-full rounded-full overflow-hidden border-[8px] border-card-bg shadow-2xl bg-background relative z-10">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/30">No Image</div>
                )}
              </div>
              
              <label className="absolute inset-0 z-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-full"></div>
                <div className="relative bg-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 text-black">
                  Change
                </div>
                <input type="file" name="profile_image" className="hidden" accept="image/png, image/jpeg" onChange={handleImageChange} />
              </label>
            </div>
            
            <div className="text-center">
              <h3 className="text-sm font-bold text-foreground">Profile Photo</h3>
              <p className="text-xs text-foreground/50 mt-1">JPG, PNG up to 5MB</p>
            </div>
          </div>

          <div className="md:col-span-8 space-y-8">
            
            <div className="bg-accent text-accent-foreground p-6 rounded-2xl border border-accent/20 space-y-6">
              <h3 className="text-sm font-bold text-accent-foreground/60 border-b border-accent-foreground/20 pb-2 uppercase tracking-widest">
                Hero Section Card
              </h3>
              <div>
                <label className="block text-xs font-bold text-accent-foreground/50 uppercase tracking-widest mb-2">Card Title (Name)</label>
                <div className="text-black"> {/* Wrapper to reset text color for editor inside dark accent card */}
                    <RichTextEditor content={heroTitle} onChange={setHeroTitle} />
                </div>
                <input type="hidden" name="hero_title" value={heroTitle} />
              </div>
              <div>
                <label className="block text-xs font-bold text-accent-foreground/50 uppercase tracking-widest mb-2">Card Subtitle (Role)</label>
                <div className="text-black">
                    <RichTextEditor content={heroSubtitle} onChange={setHeroSubtitle} />
                </div>
                <input type="hidden" name="hero_subtitle" value={heroSubtitle} />
              </div>
            </div>

            <div className="bg-background/50 p-6 rounded-2xl border border-card-border space-y-6">
              <h3 className="text-sm font-bold text-foreground/40 border-b border-card-border pb-2 uppercase tracking-widest">
                Main Page Content
              </h3>
              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-widest mb-3">Page Headline</label>
                <RichTextEditor content={headline} onChange={setHeadline} />
                <input type="hidden" name="headline" value={headline} />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground/60 uppercase tracking-widest mb-3">Bio / Summary</label>
                <RichTextEditor content={subHeadline} onChange={setSubHeadline} />
                <input type="hidden" name="sub_headline" value={subHeadline} />
              </div>
            </div>
            
            <div className="bg-background/50 p-6 rounded-2xl border border-card-border space-y-6">
              <h3 className="text-sm font-bold text-foreground border-b border-card-border pb-2 uppercase tracking-widest">Social Connections</h3>
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded shrink-0 font-bold text-xs">LI</div>
                <div className="flex-1">
                  <input type="text" name="linkedin_url" defaultValue={profile.linkedin_url || ''} placeholder="LinkedIn URL" className="w-full text-sm p-3 border border-card-border bg-card-bg text-foreground shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="show_linkedin" defaultChecked={profile.show_linkedin || false} className="rounded text-accent w-4 h-4 cursor-pointer accent-accent" />
                  <span className="text-xs font-bold text-foreground/60 uppercase">Show</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-800 text-white rounded shrink-0 font-bold text-xs">FB</div>
                <div className="flex-1">
                  <input type="text" name="facebook_url" defaultValue={profile.facebook_url || ''} placeholder="Facebook URL" className="w-full text-sm p-3 border border-card-border bg-card-bg text-foreground shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="show_facebook" defaultChecked={profile.show_facebook || false} className="rounded text-accent w-4 h-4 cursor-pointer accent-accent" />
                  <span className="text-xs font-bold text-foreground/60 uppercase">Show</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center bg-pink-600 text-white rounded shrink-0 font-bold text-xs">IG</div>
                <div className="flex-1">
                  <input type="text" name="instagram_url" defaultValue={profile.instagram_url || ''} placeholder="Instagram URL" className="w-full text-sm p-3 border border-card-border bg-card-bg text-foreground shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="show_instagram" defaultChecked={profile.show_instagram || false} className="rounded text-accent w-4 h-4 cursor-pointer accent-accent" />
                  <span className="text-xs font-bold text-foreground/60 uppercase">Show</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-foreground/40 italic">Auto-saves to database</span>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-accent text-accent-foreground px-10 py-3.5 rounded-xl font-semibold hover:opacity-90 hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}