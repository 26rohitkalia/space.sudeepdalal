'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function upsertEducation(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id')
  const data = {
    user_id: user.id,
    degree: formData.get('degree'),
    field: formData.get('field'),
    institution: formData.get('institution'),
    year: formData.get('year'),
    type: formData.get('type'),
  }

  if (id) {
    await supabase.from('education').update(data).eq('id', id)
  } else {
    const { data: max } = await supabase.from('education').select('order_index').order('order_index', { ascending: false }).limit(1).single()
    await supabase.from('education').insert({ ...data, order_index: (max?.order_index ?? 0) + 1 })
  }
  revalidatePath('/dashboard')
}

export async function deleteEducation(id: number) {
  const supabase = await createClient()
  await supabase.from('education').delete().eq('id', id)
  revalidatePath('/dashboard')
}