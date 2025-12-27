'use client'

import { Tables } from '@/types/supabase'

interface Props {
    posts: Tables<'posts'>[]
    onEdit: (post: Tables<'posts'>) => void
    onDelete: (id: number) => void
}

const getImageUrl = (path: string | null) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`
}

export default function BlogPostList({ posts, onEdit, onDelete }: Props) {
  if (posts.length === 0) {
    return (
        <div className="text-center py-12 text-foreground/40 border-2 border-dashed border-card-border rounded-2xl">
            No insights found. Write your first article.
        </div>
    )
  }

  return (
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
            
            <div className="flex gap-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={() => onEdit(post)} 
                    className="bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground px-4 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold uppercase tracking-wide"
                >
                    Edit
                </button>
                <button 
                    onClick={() => onDelete(post.id)} 
                    className="bg-background border border-card-border text-foreground/60 hover:text-red-500 hover:border-red-200 px-4 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold uppercase tracking-wide"
                >
                    Delete
                </button>
            </div>
        </div>
    ))}
    </div>
  )
}