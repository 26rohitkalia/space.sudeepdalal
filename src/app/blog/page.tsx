import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BlogManager from '@/components/blog/BlogManager'

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="h-full flex flex-col">
       <div className="mb-8 flex justify-between items-end border-b border-card-border pb-4">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Content Manager</h1>
                <p className="text-foreground/50 mt-1">Manage insights and articles independently.</p>
            </div>
       </div>

       <div className="flex-1">
            <BlogManager posts={posts || []} profile={profile!} />
       </div>
    </div>
  )
}