'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function upsertPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id')
  const imageFile = formData.get('image_file') as File
  let imagePath = undefined

  if (imageFile && imageFile.size > 0) {
    const filename = `insights/${user.id}/${Date.now()}-${imageFile.name}`
    const { data, error } = await supabase.storage.from('portfolio').upload(filename, imageFile)
    if (error) throw new Error(error.message)
    imagePath = data.path
  }

  const data: any = {
    user_id: user.id,
    title: formData.get('title'),
    summary: formData.get('summary'),
    content: formData.get('content'),
    layout_type: formData.get('layout_type'),
    is_published: formData.get('is_published') === 'on',
    show_date: formData.get('show_date') === 'on',
    show_author: formData.get('show_author') === 'on',
  }

  if (imagePath) data.image_url = imagePath

  if (id) {
    const { error } = await supabase.from('posts').update(data).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('posts').insert(data)
    if (error) throw new Error(error.message)
  }
  
  revalidatePath('/blog')
  revalidatePath('/insights')
}

export async function deletePost(id: number) {
  const supabase = await createClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/blog')
  revalidatePath('/insights')
}

export async function updateBlogSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('profiles').update({
    insights_header_title: formData.get('insights_header_title'),
    insights_header_subtitle: formData.get('insights_header_subtitle'),
  }).eq('id', user.id)

  revalidatePath('/blog')
  revalidatePath('/insights')
}