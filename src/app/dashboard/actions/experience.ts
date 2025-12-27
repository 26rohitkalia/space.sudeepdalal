'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function upsertExperience(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id')
  const data = {
    user_id: user.id,
    company: formData.get('company'),
    role: formData.get('role'),
    duration: formData.get('duration'),
    description: formData.get('description'),
    color_class: formData.get('color_class'),
  }

  if (id) {
    await supabase.from('experiences').update(data).eq('id', id)
  } else {
    const { data: max } = await supabase.from('experiences').select('order_index').order('order_index', { ascending: false }).limit(1).single()
    await supabase.from('experiences').insert({ ...data, order_index: (max?.order_index ?? 0) + 1 })
  }
  revalidatePath('/dashboard')
}

export async function deleteExperience(id: number) {
  const supabase = await createClient()
  await supabase.from('experiences').delete().eq('id', id)
  revalidatePath('/dashboard')
}