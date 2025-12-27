'use client'

import { useState } from 'react'
import { Tables } from '@/types/supabase'
import { deletePost, upsertPost } from '@/app/blog/actions'
import { toast } from 'sonner'
import BlogPageSettings from './BlogPageSettings'
import BlogPostForm from './BlogPostForm'
import BlogPostList from './BlogPostList'

interface Props {
  posts: Tables<'posts'>[]
  profile: Tables<'profiles'>
}

export default function BlogManager({ posts, profile }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEdit = (post: Tables<'posts'>) => {
    setEditingId(post.id)
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddNew = () => {
    setEditingId(null)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingId(null)
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    const result = await upsertPost(formData)
    
    if (result?.error) {
        toast.error(result.error)
    } else {
        toast.success(editingId ? 'Post updated' : 'Post created')
        handleCancel()
    }
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
      if(!confirm("Are you sure? This cannot be undone.")) return;
      const result = await deletePost(id)
      if (result?.error) toast.error(result.error)
      else toast.success("Post deleted")
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <BlogPageSettings profile={profile} />

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
        <BlogPostForm 
            editingId={editingId}
            post={posts.find(p => p.id === editingId)}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            loading={loading}
        />
      )}

      <BlogPostList 
          posts={posts} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
      />
    </div>
  )
}