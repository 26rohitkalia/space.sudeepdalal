import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const getImageUrl = (path: string) => 
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase.from('projects').select('*, experiences(*)').eq('id', id).single()

  if (!project) redirect('/')

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-accent mb-12 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Home
        </Link>

        {project.layout_type === 'standard' && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
             <header className="max-w-3xl mb-16">
                <span className="text-accent font-mono text-sm mb-4 block">{project.experiences?.company}</span>
                <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 tracking-tight leading-[0.9]">{project.title}</h1>
                <div className="prose prose-lg prose-headings:text-foreground prose-p:text-foreground/70 prose-strong:text-foreground" dangerouslySetInnerHTML={{ __html: project.long_description || '' }} />
             </header>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.images?.map((img: string, i: number) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-card-border shadow-lg">
                        <img src={getImageUrl(img)} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                    </div>
                ))}
             </div>
          </div>
        )}

        {project.layout_type === 'split' && (
          <div className="grid lg:grid-cols-2 gap-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="lg:sticky lg:top-32 h-fit">
                <span className="text-accent font-mono text-sm mb-4 block">{project.experiences?.company}</span>
                <h1 className="text-5xl font-bold text-foreground mb-8 tracking-tight">{project.title}</h1>
                <div className="prose prose-lg prose-headings:text-foreground prose-p:text-foreground/70 prose-strong:text-foreground" dangerouslySetInnerHTML={{ __html: project.long_description || '' }} />
             </div>
             <div className="space-y-8">
                {project.images?.map((img: string, i: number) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-card-border shadow-lg">
                        <img src={getImageUrl(img)} className="w-full h-auto object-cover" />
                    </div>
                ))}
             </div>
          </div>
        )}

        {project.layout_type === 'hero' && (
            <div className="animate-in fade-in duration-700">
                {project.images?.[0] && (
                    <div className="w-full h-[60vh] rounded-[2rem] overflow-hidden mb-16 shadow-2xl relative">
                         <img src={getImageUrl(project.images[0])} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/30"></div>
                         <div className="absolute bottom-12 left-12">
                            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-2">{project.title}</h1>
                            <span className="text-white/80 font-mono text-lg">{project.experiences?.company}</span>
                         </div>
                    </div>
                )}
                <div className="max-w-3xl mx-auto prose prose-xl prose-headings:text-foreground prose-p:text-foreground/70 prose-strong:text-foreground" dangerouslySetInnerHTML={{ __html: project.long_description || '' }} />
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16 max-w-5xl mx-auto">
                    {project.images?.slice(1).map((img: string, i: number) => (
                        <div key={i} className="rounded-xl overflow-hidden border border-card-border h-64">
                            <img src={getImageUrl(img)} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                        </div>
                    ))}
                </div>
            </div>
        )}

        {project.layout_type === 'gallery' && (
             <div className="animate-in fade-in duration-700">
                <header className="text-center max-w-4xl mx-auto mb-20">
                    <span className="text-accent font-mono text-sm mb-4 block uppercase tracking-widest">{project.experiences?.company}</span>
                    <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-8 tracking-tighter">{project.title}</h1>
                    <div className="text-xl text-foreground/60 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: project.short_description || '' }} />
                </header>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 mb-20">
                    {project.images?.map((img: string, i: number) => (
                        <div key={i} className="break-inside-avoid rounded-2xl overflow-hidden border border-card-border shadow-md">
                            <img src={getImageUrl(img)} className="w-full h-auto" />
                        </div>
                    ))}
                    <div className="break-inside-avoid bg-card-bg p-8 rounded-2xl border border-card-border">
                         <div className="prose prose-sm prose-headings:text-foreground prose-p:text-foreground/70" dangerouslySetInnerHTML={{ __html: project.long_description || '' }} />
                    </div>
                </div>
             </div>
        )}

      </div>
    </div>
  )
}