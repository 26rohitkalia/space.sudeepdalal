'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { getNewCaptcha } from '@/app/actions/captcha'

interface Props {
  onVerify: (answer: string, signature: string) => void
}

export interface CaptchaRef {
  reset: () => void
}

const ImageCaptcha = forwardRef<CaptchaRef, Props>(({ onVerify }, ref) => {
  const [svg, setSvg] = useState<string>('')
  const [signature, setSignature] = useState<string>('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    setAnswer('')
    onVerify('', '') 
    try {
      const data = await getNewCaptcha()
      setSvg(data.svg)
      setSignature(data.signature)
    } catch (e) {
      console.error("Captcha error", e)
    } finally {
      setLoading(false)
    }
  }

  useImperativeHandle(ref, () => ({
    reset: refresh
  }))

  useEffect(() => {
    refresh()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setAnswer(val)
    onVerify(val, signature)
  }

  return (
    <div className="bg-card-bg border border-card-border p-4 rounded-2xl space-y-4">
      <div className="flex justify-between items-center px-1">
        <label className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Security Check</label>
        <button 
            type="button" 
            onClick={refresh} 
            disabled={loading}
            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-accent hover:underline cursor-pointer disabled:opacity-50"
        >
          <svg className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          Refresh
        </button>
      </div>
      
      <div className="flex flex-col gap-3">
        {loading ? (
            <div className="w-full h-16 bg-card-border/20 animate-pulse rounded-xl" />
        ) : (
            <div 
                className="w-full h-16 rounded-xl overflow-hidden border border-card-border select-none"
                dangerouslySetInnerHTML={{ __html: svg }} 
            />
        )}
        
        <input 
          type="text" 
          value={answer}
          onChange={handleChange}
          placeholder="Type the characters above"
          className="w-full p-3 text-center border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none font-bold tracking-widest uppercase placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-foreground/30"
          maxLength={5}
          autoComplete="off"
        />
      </div>
    </div>
  )
})

ImageCaptcha.displayName = 'ImageCaptcha'

export default ImageCaptcha