import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BlogManager from '@/components/blog/BlogManager'
import { Tables } from '@/types/supabase'

export default async function PostsDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: fetchedPosts } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const posts: Tables<'posts'>[] = fetchedPosts || []

  return (
    <div className="h-full flex flex-col">
       <div className="mb-8 flex justify-between items-end border-b border-card-border pb-4">
            <div>
                <Link 
                  href="/dashboard" 
                  className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors mb-2 flex items-center gap-1"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Profile Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Content Manager</h1>
            </div>
       </div>
       <div className="flex-1">
            <BlogManager posts={posts} profile={profile!} />
       </div>
    </div>
  )
}