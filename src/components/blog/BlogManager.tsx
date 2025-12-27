'use client'

import { useState } from 'react'
import { Tables } from '@/types/supabase'
import { deletePost, upsertPost, updateBlogSettings } from '@/app/blog/actions'
import RichTextEditor from '@/components/ui/RichTextEditor'
import { toast } from 'sonner'

interface Props {
  posts: Tables<'posts'>[]
  profile: Tables<'profiles'>
}

const getImageUrl = (path: string | null) => {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`
}

export default function BlogManager({ posts, profile }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEdit = (post: Tables<'posts'>) => {
    setEditingId(post.id)
    setContent(post.content || '')
    setPreview(getImageUrl(post.image_url))
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setEditingId(null)
    setContent('')
    setPreview(null)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setContent('')
    setPreview(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      await upsertPost(formData)
      toast.success(editingId ? 'Post updated' : 'Post created')
      handleCancel()
    } catch (e: any) {
      toast.error(e.message || 'Error saving post')
    } finally {
      setLoading(false)
    }
  }

  const handleSettings = async (formData: FormData) => {
    await updateBlogSettings(formData)
    toast.success('Blog settings saved')
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
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

      <div className="flex justify-between items-center pt-4">
        <h2 className="text-2xl font-bold text-foreground">Articles</h2>
        {!isFormOpen && (
          <button 
            onClick={handleAddNew} 
            className="bg-card-bg border border-card-border text-foreground px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:border-accent hover:text-accent transition cursor-pointer"
          >
            + New Post
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-card-bg p-8 rounded-[2rem] shadow-sm border border-card-border transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-foreground/40 uppercase">{editingId ? 'Edit Post' : 'Compose New Post'}</h3>
            <button onClick={handleCancel} className="text-xs text-red-400 font-bold uppercase hover:text-red-600 cursor-pointer">Cancel</button>
          </div>

          <form action={handleSubmit} className="space-y-6">
            {editingId && <input type="hidden" name="id" value={editingId} />}

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Headline</label>
                        <input name="title" placeholder="Article Title" defaultValue={posts.find(p => p.id === editingId)?.title} required className="w-full p-4 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none text-lg font-bold placeholder-foreground/30" />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Short Summary</label>
                        <textarea name="summary" rows={2} defaultValue={posts.find(p => p.id === editingId)?.summary || ''} className="w-full p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none placeholder-foreground/30" />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Main Content</label>
                        <div className="text-foreground">
                            <RichTextEditor content={content} onChange={setContent} />
                        </div>
                        <input type="hidden" name="content" value={content} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-background/50 p-6 rounded-xl border border-card-border space-y-4">
                        <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Publishing Status</label>
                        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-background transition border border-transparent hover:border-card-border">
                            <input type="checkbox" name="is_published" defaultChecked={posts.find(p => p.id === editingId)?.is_published || false} className="w-5 h-5 accent-accent" />
                            <div className="text-foreground">
                                <span className="block text-sm font-bold">Publicly Visible</span>
                                <span className="text-[10px] text-foreground/40">Show on insights page</span>
                            </div>
                        </label>
                    </div>

                    <div className="bg-background/50 p-6 rounded-xl border border-card-border space-y-4 text-foreground">
                        <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Metadata Options</label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="show_date" defaultChecked={posts.find(p => p.id === editingId)?.show_date ?? true} className="accent-accent" />
                            <span className="text-sm">Show Publish Date</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" name="show_author" defaultChecked={posts.find(p => p.id === editingId)?.show_author ?? true} className="accent-accent" />
                            <span className="text-sm">Show Author Name</span>
                        </label>
                    </div>

                    <div className="bg-background/50 p-6 rounded-xl border border-card-border text-foreground">
                        <label className="block text-xs font-bold text-foreground/40 uppercase mb-4">Article Layout</label>
                        <div className="space-y-2">
                            {['classic', 'editorial', 'split'].map(layout => (
                                <label key={layout} className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-background transition">
                                    <input type="radio" name="layout_type" value={layout} defaultChecked={(posts.find(p => p.id === editingId)?.layout_type || 'classic') === layout} className="accent-accent" />
                                    <span className="text-sm capitalize">{layout}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-background/50 p-6 rounded-xl border border-card-border">
                        <label className="block text-xs font-bold text-foreground/40 uppercase mb-4">Cover Image</label>
                        <div className="relative w-full h-40 rounded-lg overflow-hidden border border-card-border bg-background mb-3 group cursor-pointer">
                             {preview ? (
                                <img src={preview} className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-foreground/30 text-xs">No Cover</div>
                             )}
                             <input type="file" name="image_file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity pointer-events-none">Click to Change</div>
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
      )}

      <div className="space-y-4">
        {posts.map((post) => (
            <div key={post.id} className="bg-card-bg p-6 rounded-2xl border border-card-border flex justify-between items-center group hover:shadow-md transition">
                <div className="flex gap-5 items-center">
                    <div className="w-20 h-14 rounded-lg bg-background border border-card-border overflow-hidden flex-shrink-0">
                        {post.image_url ? (
                            <img src={getImageUrl(post.image_url)!} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-foreground/20">Img</div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className={`w-2 h-2 rounded-full ${post.is_published ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                                {post.is_published ? 'Published' : 'Draft'}
                            </span>
                            <span className="text-[10px] text-foreground/40 border border-card-border px-1.5 rounded">{post.layout_type}</span>
                        </div>
                        <h4 className="text-lg font-bold text-foreground">{post.title}</h4>
                        <div className="text-xs text-foreground/50 truncate max-w-md">{post.summary}</div>
                    </div>
                </div>
                <div className="flex gap-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(post)} className="text-blue-500 hover:text-blue-600 cursor-pointer">Edit</button>
                    <button onClick={() => deletePost(post.id)} className="text-red-400 hover:text-red-600 cursor-pointer">Delete</button>
                </div>
            </div>
        ))}
        {posts.length === 0 && !isFormOpen && (
            <div className="text-center py-12 text-foreground/40 border-2 border-dashed border-card-border rounded-2xl">
                No insights found. Write your first article.
            </div>
        )}
      </div>
    </div>
  )
}