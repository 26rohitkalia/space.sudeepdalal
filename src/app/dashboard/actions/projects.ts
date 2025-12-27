'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function upsertProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const id = formData.get('id')
  const files = formData.getAll('images') as File[]
  const existingImagesStr = formData.get('existing_images') as string
  let imagePaths: string[] = existingImagesStr ? JSON.parse(existingImagesStr) : []

  if (files.length > 0) {
    for (const file of files) {
      if (file.size > 0) {
        const filename = `projects/${user.id}/${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage.from('portfolio').upload(filename, file)
        if (!error && data) imagePaths.push(data.path)
      }
    }
  }

  const data = {
    user_id: user.id,
    experience_id: formData.get('experience_id') ? parseInt(formData.get('experience_id') as string) : null,
    title: formData.get('title'),
    short_description: formData.get('short_description'),
    long_description: formData.get('long_description'),
    layout_type: formData.get('layout_type'),
    images: imagePaths,
  }

  if (id) {
    await supabase.from('projects').update(data).eq('id', id)
  } else {
    const { data: max } = await supabase.from('projects').select('order_index').order('order_index', { ascending: false }).limit(1).single()
    await supabase.from('projects').insert({ ...data, order_index: (max?.order_index ?? 0) + 1 })
  }
  revalidatePath('/dashboard')
  revalidatePath('/')
  revalidatePath('/projects')
}

export async function deleteProject(id: number) {
  const supabase = await createClient()
  await supabase.from('projects').delete().eq('id', id)
  revalidatePath('/dashboard')
}

export async function updateProjectsViewLayout(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('profiles').update({
        projects_view_layout: formData.get('projects_view_layout'),
        projects_header_title: formData.get('projects_header_title'),
        projects_header_subtitle: formData.get('projects_header_subtitle'),
    }).eq('id', user.id)
    
    revalidatePath('/dashboard')
    revalidatePath('/projects')
}