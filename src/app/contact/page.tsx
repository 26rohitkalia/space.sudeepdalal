'use client'

import { useState } from 'react'
import { sendMessage } from './actions'
import { toast } from 'sonner'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const res = await sendMessage(formData)
    
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success("Message sent successfully!")
      ;(e.target as HTMLFormElement).reset()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 font-sans text-foreground">
      <div className="max-w-xl mx-auto">
        <header className="mb-12 text-center" data-aos="fade-up">
          <h1 className="text-5xl font-bold tracking-tight mb-4">Get in Touch</h1>
        </header>

        <div className="bg-card-bg p-8 md:p-10 rounded-[2.5rem] border border-card-border shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-foreground/40 uppercase mb-2 tracking-widest">Full Name</label>
              <input name="name" required className="w-full p-4 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none transition" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-foreground/40 uppercase mb-2 tracking-widest">Email Address</label>
                <input type="email" name="email" required className="w-full p-4 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none transition"  />
              </div>
              <div>
                <label className="block text-xs font-bold text-foreground/40 uppercase mb-2 tracking-widest">Phone Number</label>
                <input type="tel" name="phone" required className="w-full p-4 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none transition"  />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground/40 uppercase mb-2 tracking-widest">Message</label>
              <textarea name="message" required rows={5} className="w-full p-4 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none transition resize-none"  />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-bold hover:opacity-90 shadow-lg transition transform active:scale-[0.99] disabled:opacity-50 cursor-pointer uppercase tracking-widest text-xs"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}