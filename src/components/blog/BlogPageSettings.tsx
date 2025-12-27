'use client'

import { updateBlogSettings } from '@/app/blog/actions'
import { Tables } from '@/types/supabase'
import { toast } from 'sonner'

export default function BlogPageSettings({ profile }: { profile: Tables<'profiles'> }) {
  const handleSettings = async (formData: FormData) => {
    await updateBlogSettings(formData)
    toast.success('Blog settings saved')
  }

  return (
    <form action={handleSettings} className="bg-accent text-accent-foreground p-8 rounded-2xl shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-accent-foreground/10">
            <div>
                <h3 className="font-bold text-xl">Blog Page Settings</h3>
                <p className="text-xs text-accent-foreground/60">Customize the header text of your public /insights page.</p>
            </div>
            <button type="submit" className="bg-background text-foreground px-6 py-2 rounded-lg text-xs font-bold shadow-md hover:scale-105 transition cursor-pointer border border-card-border">
                Save Page Settings
            </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Page Title</label>
                <input 
                    name="insights_header_title" 
                    defaultValue={profile?.insights_header_title || 'Insights.'} 
                    className="w-full bg-background/20 border border-accent-foreground/10 rounded-xl p-3 text-accent-foreground placeholder-accent-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent-foreground/30 font-bold text-lg" 
                />
            </div>
            <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Page Subtitle</label>
                <textarea 
                    name="insights_header_subtitle" 
                    rows={2} 
                    defaultValue={profile?.insights_header_subtitle || 'Thoughts on strategic sourcing...'} 
                    className="w-full bg-background/20 border border-accent-foreground/10 rounded-xl p-3 text-accent-foreground placeholder-accent-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent-foreground/30" 
                />
            </div>
        </div>
      </form>
  )
}