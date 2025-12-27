'use client'

import { useState } from 'react'
import { Tables } from '@/types/supabase'
import RichTextEditor from '@/components/ui/RichTextEditor'

interface Props {
  editingId: number | null
  post: Tables<'posts'> | undefined
  onCancel: () => void
  onSubmit: (formData: FormData) => Promise<void>
  loading: boolean
}

const getImageUrl = (path: string | null) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`
}

export default function BlogPostForm({ editingId, post, onCancel, onSubmit, loading }: Props) {
  const [content, setContent] = useState(post?.content || '')
  const [preview, setPreview] = useState<string | null>(post?.image_url ? getImageUrl(post.image_url) : null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('content', content)
    onSubmit(formData)
  }

  return (
    <div className="bg-card-bg p-8 rounded-[2rem] shadow-sm border border-card-border transition-all animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-foreground/40 uppercase">{editingId ? 'Edit Post' : 'Compose New Post'}</h3>
        <button type="button" onClick={onCancel} className="text-xs text-red-500 font-bold uppercase hover:underline cursor-pointer">Cancel</button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
        {editingId && <input type="hidden" name="id" value={editingId} />}

        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
                <div>
                    <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Headline</label>
                    <input name="title" placeholder="Article Title" defaultValue={post?.title} required className="w-full p-4 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none text-lg font-bold placeholder-foreground/30" />
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Short Summary</label>
                    <textarea name="summary" rows={2} defaultValue={post?.summary || ''} className="w-full p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none placeholder-foreground/30" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Main Content</label>
                    <div className="text-foreground">
                        <RichTextEditor content={content} onChange={setContent} />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-background/50 p-6 rounded-xl border border-card-border space-y-4">
                    <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Publishing Status</label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-background transition border border-transparent hover:border-card-border">
                        <input type="checkbox" name="is_published" defaultChecked={post?.is_published || false} className="w-5 h-5 accent-accent rounded" />
                        <div className="text-foreground">
                            <span className="block text-sm font-bold">Publicly Visible</span>
                            <span className="text-[10px] text-foreground/40">Show on insights page</span>
                        </div>
                    </label>
                </div>

                <div className="bg-background/50 p-6 rounded-xl border border-card-border space-y-4 text-foreground">
                    <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Metadata Options</label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" name="show_date" defaultChecked={post?.show_date ?? true} className="accent-accent rounded" />
                        <span className="text-sm">Show Publish Date</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" name="show_author" defaultChecked={post?.show_author ?? true} className="accent-accent rounded" />
                        <span className="text-sm">Show Author Name</span>
                    </label>
                </div>

                <div className="bg-background/50 p-6 rounded-xl border border-card-border text-foreground">
                    <label className="block text-xs font-bold text-foreground/40 uppercase mb-4">Article Layout</label>
                    <div className="space-y-2">
                        {['classic', 'editorial', 'split'].map(layout => (
                            <label key={layout} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-background transition">
                                <input type="radio" name="layout_type" value={layout} defaultChecked={(post?.layout_type || 'classic') === layout} className="accent-accent" />
                                <span className="text-sm capitalize">{layout}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="bg-background/50 p-6 rounded-xl border border-card-border">
                    <label className="block text-xs font-bold text-foreground/40 uppercase mb-4">Cover Image</label>
                    
                    <div className="space-y-3">
                        <label className="relative block w-full h-48 rounded-xl overflow-hidden border-2 border-dashed border-card-border hover:border-accent hover:bg-accent/5 transition-all cursor-pointer group">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/30">
                                    <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span className="text-xs font-bold uppercase tracking-widest">Select Image</span>
                                </div>
                            )}
                            
                            <input type="file" name="image_file" accept="image/*" onChange={handleImageChange} className="hidden" />
                            
                            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest shadow-lg">
                                    {preview ? 'Change Image' : 'Upload Image'}
                                </span>
                            </div>
                        </label>
                        <p className="text-[10px] text-foreground/40 text-center">
                            Changing the image deletes the old file automatically.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-6 border-t border-card-border">
            <button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-bold hover:opacity-90 shadow-lg transition transform active:scale-[0.99] disabled:opacity-50 cursor-pointer">
            {loading ? 'Saving...' : (editingId ? 'Update Post' : 'Create Post')}
            </button>
        </div>
        </form>
    </div>
  )
}