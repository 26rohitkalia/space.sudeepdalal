import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const getImageUrl = (path: string | null) => {
  if (!path) return null
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`
}

export default async function InsightsPage() {
  const supabase = await createClient()

  const { data: profile } = await supabase.from('profiles').select('insights_header_title, insights_header_subtitle').single()

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 font-sans text-foreground">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-24" data-aos="fade-up">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.05]">
            {profile?.insights_header_title || 'Insights.'}
          </h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl">
            {profile?.insights_header_subtitle || 'Thoughts on strategic sourcing, market trends, and supply chain management.'}
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {posts?.map((post, i) => (
            <Link 
              href={`/insights/${post.id}`} 
              key={post.id} 
              className="group block"
              data-aos="fade-up"
              data-aos-delay={i * 100}
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-card-bg border border-card-border mb-6 relative">
                {post.image_url ? (
                  <img 
                    src={getImageUrl(post.image_url)!} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-accent/5 text-foreground/20 font-bold uppercase tracking-widest text-xs">
                    No Image
                  </div>
                )}
                
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300"></div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-foreground/40">
                  {post.show_date && new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  <span className="w-1 h-1 rounded-full bg-accent"></span>
                  <span>{post.layout_type}</span>
                </div>

                <h2 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h2>

                <p className="text-foreground/60 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>

                <span className="inline-block text-xs font-bold underline decoration-accent/50 underline-offset-4 mt-2 group-hover:text-accent transition-colors">
                  Read Article
                </span>
              </div>
            </Link>
          ))}
        </div>

        {(!posts || posts.length === 0) && (
            <div className="py-20 text-center border-y border-card-border">
                <h3 className="text-xl font-bold text-foreground/40">No insights published yet.</h3>
                <p className="text-foreground/30 mt-2">Check back soon for updates.</p>
            </div>
        )}

      </div>
    </div>
  )
}