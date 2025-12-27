import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BlogSidebar from '@/components/blog/Sidebar'

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  return (
    <div className="bg-background min-h-screen pt-28 pb-8 px-8 font-sans antialiased text-foreground flex flex-col">
      <div className="flex flex-1 bg-card-bg rounded-3xl shadow-xl overflow-hidden border border-card-border max-w-7xl mx-auto w-full min-h-[600px]">
        
        <BlogSidebar />
        
        <main className="flex-1 bg-background/50 h-full overflow-y-auto p-10 relative custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}