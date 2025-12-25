'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const theme = formData.get('theme') as string
  const fontFamily = formData.get('font_family') as string
  const fontFile = formData.get('custom_font_file') as File
  
  let customFontUrl = undefined

  if (fontFile && fontFile.size > 0) {
    const filename = `${user.id}/${Date.now()}-${fontFile.name}`
    const { data, error } = await supabase.storage.from('fonts').upload(filename, fontFile)
    if (!error) customFontUrl = data.path
  }

  const updates: any = {
    theme,
    font_family: fontFamily,
    updated_at: new Date().toISOString(),
  }

  if (customFontUrl) {
    updates.custom_font_url = customFontUrl
  }

  await supabase.from('profiles').update(updates).eq('id', user.id)
  revalidatePath('/', 'layout') 
  revalidatePath('/settings')
}