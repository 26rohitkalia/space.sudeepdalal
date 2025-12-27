'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const imageFile = formData.get('profile_image') as File
  let profileImagePath = undefined

  if (imageFile && imageFile.size > 0) {
    const filename = `${user.id}/${Date.now()}-${imageFile.name}`
    const { data, error } = await supabase.storage.from('portfolio').upload(filename, imageFile)
    if (!error) profileImagePath = data.path
  }

  const updates: any = {
    headline: formData.get('headline'),
    sub_headline: formData.get('sub_headline'),
    linkedin_url: formData.get('linkedin_url'),
    facebook_url: formData.get('facebook_url'),
    instagram_url: formData.get('instagram_url'),
    hero_title: formData.get('hero_title'),  
    hero_subtitle: formData.get('hero_subtitle'),
    show_linkedin: formData.get('show_linkedin') === 'on',
    show_facebook: formData.get('show_facebook') === 'on',
    show_instagram: formData.get('show_instagram') === 'on',
    updated_at: new Date().toISOString(),
  }

  if (profileImagePath) updates.profile_image = profileImagePath

  await supabase.from('profiles').update(updates).eq('id', user.id)
  revalidatePath('/dashboard')
}

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

export async function updateTickerSpeed(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const speed = formData.get('ticker_speed')
  
  if (speed) {
    await supabase
      .from('profiles')
      .update({ ticker_speed: parseInt(speed.toString()) })
      .eq('id', user.id)
  }
  revalidatePath('/dashboard')
}

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