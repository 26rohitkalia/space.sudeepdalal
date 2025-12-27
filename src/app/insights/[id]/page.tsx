import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const getImageUrl = (path: string | null) => {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: post, error } = await supabase
    .from('posts')
    .select('*') 
    .eq('id', id)
    .single()
  if (error || !post) {
    console.error("Error fetching post:", error)
    redirect('/insights')
  }

  const dateStr = new Date(post.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  const authorName = "Sudeep Dalal" 

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 font-sans text-foreground">
      <div className="max-w-4xl mx-auto">
        <Link href="/insights" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-accent mb-12 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Insights
        </Link>
        {(post.layout_type === 'classic' || !post.layout_type) && (
            <article className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <header className="mb-12 text-center max-w-2xl mx-auto">
                    <div className="flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest text-foreground/40 mb-6">
                        {post.show_date && <span>{dateStr}</span>}
                        {post.show_author && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-accent"></span>
                                <span>By {authorName}</span>
                            </>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-8">{post.title}</h1>
                    {post.summary && <p className="text-xl text-foreground/60 leading-relaxed">{post.summary}</p>}
                </header>

                {post.image_url && (
                    <div className="w-full aspect-video rounded-3xl overflow-hidden mb-16 border border-card-border shadow-sm">
                        <img src={getImageUrl(post.image_url)!} className="w-full h-full object-cover" />
                    </div>
                )}

                <div 
                    className="prose prose-lg prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-li:text-foreground/80 max-w-2xl mx-auto"
                    dangerouslySetInnerHTML={{ __html: post.content || '' }}
                />
            </article>
        )}
        {post.layout_type === 'editorial' && (
             <article className="animate-in fade-in duration-700">
                <div className="relative w-full h-[60vh] rounded-3xl overflow-hidden mb-12 shadow-2xl">
                    {post.image_url ? (
                        <img src={getImageUrl(post.image_url)!} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-accent"></div>
                    )}
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-3xl">
                        <div className="text-white/80 text-xs font-bold uppercase tracking-widest mb-4">{dateStr}</div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
                    </div>
                </div>

                <div className="grid md:grid-cols-12 gap-8">
                    <div className="md:col-span-4">
                        <div className="sticky top-32 border-l-2 border-accent pl-6">
                            <h3 className="font-bold text-foreground mb-2">Summary</h3>
                            <p className="text-sm text-foreground/60 leading-relaxed italic mb-8">{post.summary}</p>
                            
                            {post.show_author && (
                                <div>
                                    <h3 className="font-bold text-foreground text-xs uppercase tracking-widest mb-1">Written By</h3>
                                    <p className="text-sm text-foreground/60">{authorName}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div 
                        className="md:col-span-8 prose prose-lg prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-li:text-foreground/80"
                        dangerouslySetInnerHTML={{ __html: post.content || '' }}
                    />
                </div>
             </article>
        )}
        {post.layout_type === 'split' && (
             <article className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
                    <div className="md:sticky md:top-32">
                        <div className="text-accent text-xs font-bold uppercase tracking-widest mb-6">{dateStr}</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">{post.title}</h1>
                        <p className="text-lg text-foreground/60 mb-8 border-l border-card-border pl-6">{post.summary}</p>
                        {post.image_url && (
                             <div className="w-full aspect-square rounded-2xl overflow-hidden border border-card-border shadow-sm">
                                <img src={getImageUrl(post.image_url)!} className="w-full h-full object-cover" />
                             </div>
                        )}
                    </div>
                    
                    <div className="pt-8 md:pt-0">
                         <div 
                            className="prose prose-headings:text-foreground prose-p:text-foreground/80 prose-strong:text-foreground prose-li:text-foreground/80"
                            dangerouslySetInnerHTML={{ __html: post.content || '' }}
                        />
                    </div>
                </div>
             </article>
        )}

      </div>
    </div>
  )
}