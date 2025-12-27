'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function upsertPost(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const idRaw = formData.get('id')
    const id = idRaw ? parseInt(idRaw.toString()) : null
    
    const imageFile = formData.get('image_file') as File
    let imagePath = undefined

    if (imageFile && imageFile.size > 0) {
        if (imageFile.size > 4 * 1024 * 1024) {
             return { error: 'Image is too large. Max size is 4MB.' }
        }

        if (id) {
            const { data: oldPost } = await supabase.from('posts').select('image_url').eq('id', id).single()
            if (oldPost?.image_url) {
                await supabase.storage.from('portfolio').remove([oldPost.image_url])
            }
        }

        const cleanName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, '')
        const filename = `insights/${user.id}/${Date.now()}-${cleanName}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage.from('portfolio').upload(filename, imageFile)
        
        if (uploadError) return { error: `Upload failed: ${uploadError.message}` }
        imagePath = uploadData.path
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

    let dbError;
    if (id) {
      const { error } = await supabase.from('posts').update(data).eq('id', id)
      dbError = error
    } else {
      const { error } = await supabase.from('posts').insert(data)
      dbError = error
    }

    if (dbError) return { error: dbError.message }
    
    revalidatePath('/blog')
    revalidatePath('/insights')
    return { success: true }

  } catch (err: any) {
    return { error: 'An unexpected server error occurred.' }
  }
}

export async function deletePost(id: number) {
  try {
    const supabase = await createClient()
    
    const { data: post } = await supabase.from('posts').select('image_url').eq('id', id).single()
    
    if (post?.image_url) {
        await supabase.storage.from('portfolio').remove([post.image_url])
    }

    const { error } = await supabase.from('posts').delete().eq('id', id)
    
    if (error) return { error: error.message }
    
    revalidatePath('/blog')
    revalidatePath('/insights')
    return { success: true }
  } catch (e) {
    return { error: 'Failed to delete post' }
  }
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