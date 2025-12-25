import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('profile_image')
    .eq('id', user.id)
    .single()

  let profileImage = null
  if (profile?.profile_image) {
    if (profile.profile_image.startsWith('http')) {
      profileImage = profile.profile_image
    } else {
        const { data } = supabase.storage.from('portfolio').getPublicUrl(profile.profile_image)
        profileImage = data.publicUrl
    }
  }

  return (
    <div className="bg-background min-h-screen pt-28 pb-8 px-8 font-sans antialiased text-foreground flex flex-col">
      <div className="flex flex-1 bg-card-bg rounded-3xl shadow-xl overflow-hidden border border-card-border max-w-7xl mx-auto w-full min-h-[600px]">
        <Sidebar profileImage={profileImage} />
        
        <main className="flex-1 bg-background/50 h-full overflow-y-auto p-10 relative custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}