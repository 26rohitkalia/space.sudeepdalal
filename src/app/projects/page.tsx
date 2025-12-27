import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ProjectsIndexPage() {
  const supabase = await createClient()

  const { data: profile } = await supabase.from('profiles').select('projects_view_layout, projects_header_title, projects_header_subtitle').single()
  const { data: projects } = await supabase.from('projects').select('*, experiences(company)').order('order_index')

  const layout = profile?.projects_view_layout || 'list'
  const title = profile?.projects_header_title || 'Selected Works'
  const subtitle = profile?.projects_header_subtitle || 'A collection of strategic initiatives and sourcing projects.'

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">{title}</h1>
            <p className="text-xl text-foreground/60 max-w-2xl">{subtitle}</p>
        </header>

        {layout === 'list' && (
            <div className="space-y-0 divide-y divide-card-border border-t border-b border-card-border">
                {projects?.map((proj, i) => (
                    <Link href={`/projects/${proj.id}`} key={proj.id} className="group block py-12 hover:bg-card-bg transition-colors -mx-6 px-6">
                        <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12">
                            <span className="text-xs font-mono text-foreground/40 w-12 shrink-0">{(i + 1).toString().padStart(2, '0')}</span>
                            <div className="flex-1">
                                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">{proj.title}</h2>
                                <p className="text-foreground/60 max-w-xl text-lg line-clamp-2">{proj.short_description}</p>
                            </div>
                            <div className="md:text-right shrink-0">
                                <span className="text-xs font-bold uppercase tracking-widest text-foreground/40 block mb-1">{proj.experiences?.company || 'Independent'}</span>
                                <span className="text-xs border border-card-border px-2 py-1 rounded-full text-foreground/40 group-hover:border-accent group-hover:text-accent transition-colors">View Case Study</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        )}

        {layout === 'grid' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects?.map((proj) => (
                    <Link href={`/projects/${proj.id}`} key={proj.id} className="group bg-card-bg rounded-[2rem] border border-card-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="aspect-video bg-accent/5 relative overflow-hidden">
                             {proj.images && proj.images[0] ? (
                                <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${proj.images[0]}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                             ) : (
                                <div className="w-full h-full bg-gradient-to-br from-accent/10 to-transparent"></div>
                             )}
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">{proj.experiences?.company}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">{proj.title}</h3>
                            <p className="text-foreground/60 text-sm line-clamp-3 mb-6">{proj.short_description}</p>
                            <span className="text-xs font-bold underline decoration-accent/50 underline-offset-4 group-hover:text-accent transition-colors">Read More</span>
                        </div>
                    </Link>
                ))}
            </div>
        )}

        {layout === 'minimal' && (
            <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
                {projects?.map((proj) => (
                    <Link href={`/projects/${proj.id}`} key={proj.id} className="group border-t border-foreground py-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-3xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">{proj.title}</h3>
                            <svg className="w-6 h-6 text-foreground group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </div>
                        <p className="text-lg text-foreground/60">{proj.short_description}</p>
                    </Link>
                ))}
            </div>
        )}
      </div>
    </div>
  )
}