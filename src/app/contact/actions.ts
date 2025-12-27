'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(formData: FormData) {
  const supabase = await createClient()

  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    message: formData.get('message') as string,
  }

  const { error } = await supabase.from('contact_messages').insert(data)

  if (error) {
    return { error: 'Failed to send message. Please try again.' }
  }

  revalidatePath('/messages')
  return { success: true }
}