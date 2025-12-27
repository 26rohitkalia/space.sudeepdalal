'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function upsertEndorsement(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const id = formData.get('id')
  const imageFile = formData.get('image_file') as File
  let imagePath = undefined

  if (imageFile && imageFile.size > 0) {
    const filename = `endorsements/${Date.now()}-${imageFile.name}`
    const { data, error } = await supabase.storage.from('portfolio').upload(filename, imageFile)
    if (!error) imagePath = data.path
  }
  const data: any = {
    user_id: user.id,
    name: formData.get('name'),
    role: formData.get('role'),
    text: formData.get('text'),
    color_class: formData.get('color_class'),
    linkedin_url: formData.get('linkedin_url'), 
  }
  if (imagePath) data.image_url = imagePath 
  if (id) {
    await supabase.from('endorsements').update(data).eq('id', id)
  } else {
    await supabase.from('endorsements').insert(data)
  }
  revalidatePath('/dashboard')
}

export async function deleteEndorsement(id: number) {
  const supabase = await createClient()
  await supabase.from('endorsements').delete().eq('id', id)
  revalidatePath('/dashboard')
}