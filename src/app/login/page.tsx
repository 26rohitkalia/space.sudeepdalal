'use client'

import { login } from './actions'
import ImageCaptcha, { CaptchaRef } from '@/components/ui/ImageCaptcha'
import { useState, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [captcha, setCaptcha] = useState({ answer: '', signature: '' })
  const captchaRef = useRef<CaptchaRef>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!captcha.answer) return

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.set('captcha_answer', captcha.answer)
    formData.set('captcha_signature', captcha.signature)

    const res = await login(formData)

    if (res?.error) {
      toast.error(res.error)
      captchaRef.current?.reset()
      setLoading(false)
    } else {
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-background">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
          <p className="text-foreground/50 mt-2">Sign in to manage your portfolio.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input name="email" type="email" placeholder="Email" required className="w-full bg-card-bg border border-card-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition shadow-sm placeholder-foreground/40" />
          </div>
          <div>
            <input name="password" type="password" placeholder="Password" required className="w-full bg-card-bg border border-card-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition shadow-sm placeholder-foreground/40" />
          </div>

          <ImageCaptcha ref={captchaRef} onVerify={(ans, sig) => setCaptcha({ answer: ans, signature: sig })} />

          <button
            type="submit"
            disabled={loading || !captcha.answer}
            className="w-full bg-foreground text-background font-medium py-3 rounded-lg hover:opacity-90 transition shadow-lg transform active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}