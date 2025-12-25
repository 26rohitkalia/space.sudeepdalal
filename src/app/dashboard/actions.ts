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