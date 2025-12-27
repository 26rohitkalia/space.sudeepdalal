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