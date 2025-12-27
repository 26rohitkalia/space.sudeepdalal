import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MessageSidebar from '@/components/messages/MessageSidebar'

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { count } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  return (
    <div className="bg-background min-h-screen pt-24 pb-8 px-4 md:px-8 font-sans antialiased text-foreground flex flex-col">
      <div className="flex flex-1 bg-card-bg rounded-2xl shadow-2xl overflow-hidden border border-card-border max-w-screen-2xl mx-auto w-full h-[80vh] md:h-[85vh]">
        <MessageSidebar unreadCount={count || 0} />
        <main className="flex-1 h-full overflow-hidden relative bg-background/30">
          {children}
        </main>
      </div>
    </div>
  )
}