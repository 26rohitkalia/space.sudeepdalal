'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleReadStatus(id: number, currentStatus: boolean) {
  const supabase = await createClient()
  await supabase.from('contact_messages').update({ is_read: !currentStatus }).eq('id', id)
  revalidatePath('/messages')
}

export async function toggleSaveStatus(id: number, currentStatus: boolean) {
  const supabase = await createClient()
  await supabase.from('contact_messages').update({ is_saved: !currentStatus }).eq('id', id)
  revalidatePath('/messages')
}

export async function deleteMessage(id: number) {
  const supabase = await createClient()
  await supabase.from('contact_messages').delete().eq('id', id)
  revalidatePath('/messages')
}