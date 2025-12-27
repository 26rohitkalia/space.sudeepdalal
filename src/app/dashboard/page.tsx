import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileTab from '@/components/dashboard/ProfileTab'
import HistoryTab from '@/components/dashboard/HistoryTab'
import EducationTab from '@/components/dashboard/EducationTab'
import EndorsementsTab from '@/components/dashboard/EndorsementsTab'
import ProjectsTab from '@/components/dashboard/ProjectsTab'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  const tab = params.tab || 'profile'
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  let { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (!profile) {
    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        headline: 'Sourcing. <br><span class="text-gradient">Strategized.</span>',
        sub_headline: 'Edit your bio...',
        profile_image: 'profile.jpg',
        ticker_speed: 3500,
        show_linkedin: true
      })
      .select()
      .single()
    profile = newProfile
  }

  const [
    { data: experiences },
    { data: education },
    { data: endorsements },
    { data: projects }
  ] = await Promise.all([
    supabase.from('experiences').select('*').eq('user_id', user.id).order('order_index', { ascending: true }),
    supabase.from('education').select('*').eq('user_id', user.id).order('order_index', { ascending: true }),
    supabase.from('endorsements').select('*').eq('user_id', user.id).order('created_at', { ascending: true }),
    supabase.from('projects').select('*').eq('user_id', user.id).order('order_index', { ascending: true })
  ])

  return (
    <div>
      {tab === 'profile' && profile && (
        <ProfileTab profile={profile} />
      )}

      {tab === 'history' && (
        <HistoryTab experiences={experiences || []} />
      )}

      {tab === 'projects' && profile && (
        <ProjectsTab 
            projects={projects || []} 
            experiences={experiences || []} 
            profile={profile}
        />
      )}

      {tab === 'education' && (
        <EducationTab education={education || []} />
      )}

      {tab === 'endorsements' && profile && (
        <EndorsementsTab 
          endorsements={endorsements || []} 
          tickerSpeed={profile.ticker_speed || 3500} 
        />
      )}
    </div>
  )
}