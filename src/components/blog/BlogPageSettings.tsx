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
    <form action={handleSettings} className="bg-card-bg text-foreground p-8 rounded-2xl shadow-sm border border-card-border space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-card-border">
            <div>
                <h3 className="font-bold text-xl text-foreground">Blog Page Settings</h3>
                <p className="text-xs text-foreground/60 mt-1">Customize the header text of your public /insights page.</p>
            </div>
            <button type="submit" className="bg-accent text-accent-foreground px-6 py-2 rounded-lg text-xs font-bold shadow-md hover:opacity-90 transition cursor-pointer">
                Save Page Settings
            </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2">Page Title</label>
                <input 
                    name="insights_header_title" 
                    defaultValue={profile?.insights_header_title || 'Insights.'} 
                    className="w-full bg-background border border-card-border rounded-xl p-3 text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent font-bold text-lg transition-all" 
                />
            </div>
            <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-2">Page Subtitle</label>
                <textarea 
                    name="insights_header_subtitle" 
                    rows={2} 
                    defaultValue={profile?.insights_header_subtitle || 'Thoughts on strategic sourcing...'} 
                    className="w-full bg-background border border-card-border rounded-xl p-3 text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent transition-all" 
                />
            </div>
        </div>
      </form>
  )
}