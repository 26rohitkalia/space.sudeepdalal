'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function logVisit(path: string) {
  const supabase = await createClient()
  const headerStore = await headers()
  
  let ip = headerStore.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'
  if (ip === '::1') ip = '127.0.0.1'

  let country = 'Unknown'
  let city = 'Unknown'
  
  try {
    if (ip !== '127.0.0.1') {
      const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`, { next: { revalidate: 3600 } })
      const geo = await res.json()
      if (geo.status === 'success') {
        country = geo.country
        city = geo.city
      }
    }
  } catch (e) {
  }

  await supabase.from('analytics_visits').insert({
    path,
    ip_address: ip,
    country,
    city,
    user_agent: headerStore.get('user-agent')
  })
}