'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { verifyCaptchaToken } from '@/app/actions/captcha'

export async function login(formData: FormData) {
  const captchaAnswer = formData.get('captcha_answer') as string
  const captchaSignature = formData.get('captcha_signature') as string

  const isValid = await verifyCaptchaToken(captchaAnswer, captchaSignature)
  if (!isValid) {
    return { error: 'Incorrect captcha code' }
  }

  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: 'Invalid credentials' }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}