import { createClient } from '@/lib/supabase/server'
import MessageManager from '@/components/messages/MessageManager'

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>
}) {
  const { view } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false })

  if (view === 'saved') {
    query = query.eq('is_saved', true)
  }

  const { data: messages } = await query

  return (
    <MessageManager messages={messages || []} view={view || 'inbox'} />
  )
}