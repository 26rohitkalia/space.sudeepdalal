'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { verifyCaptchaToken } from '@/app/actions/captcha'

export async function sendMessage(formData: FormData) {
  const captchaAnswer = formData.get('captcha_answer') as string
  const captchaSignature = formData.get('captcha_signature') as string

  const isValid = await verifyCaptchaToken(captchaAnswer, captchaSignature)
  if (!isValid) return { error: 'Incorrect captcha code.' }

  const supabase = await createClient()
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    message: formData.get('message') as string,
  }

  const { error } = await supabase.from('contact_messages').insert(data)

  if (error) return { error: 'Failed to send message.' }

  revalidatePath('/messages')
  return { success: true }
}