import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/Hero'
import Endorsements from '@/components/Endorsements'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: profile } = await supabase.from('profiles').select('*').single()
  const { data: experiences } = await supabase.from('experiences').select('*').order('order_index')
  const { data: education } = await supabase.from('education').select('*').order('order_index')
  const { data: endorsements } = await supabase.from('endorsements').select('*').order('created_at')

  if (!profile) {
    return <div className="p-8">Please log in to the dashboard to create your profile.</div>
  }

  return (
    <div className="bg-[#f4f4f5]">
      <Hero profile={profile} />

      <div className="relative z-10 pb-40 max-w-4xl mx-auto px-6">
        <header className="mb-24 pt-10" data-aos="fade-up">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.05]"
              dangerouslySetInnerHTML={{ __html: profile.headline || '' }} />
          <div className="text-xl text-gray-500 leading-relaxed max-w-2xl"
              dangerouslySetInnerHTML={{ __html: profile.sub_headline || '' }} />
        </header>
        <section className="mb-40">
          <h3 data-aos="fade-up" className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-16">Professional History</h3>
          <div className="space-y-20 border-l border-gray-200 ml-3 pl-12 md:pl-20 relative">
            {experiences?.map((exp) => (
              <div key={exp.id} className="relative group" data-aos="fade-up">
                <div className={`absolute -left-[3.65rem] md:-left-[5.65rem] top-2.5 w-4 h-4 ${exp.color_class} rounded-full ring-8 ring-white`} />
                <h4 className="text-3xl font-bold text-gray-900">{exp.company}</h4>
                <div className="text-lg font-medium text-gray-800 mb-4">{exp.role} | {exp.duration}</div>
                <div className="text-gray-500 text-base leading-relaxed max-w-2xl prose prose-sm"
                     dangerouslySetInnerHTML={{ __html: exp.description || '' }} />
              </div>
            ))}
          </div>
        </section>
        <section className="mb-40">
          <h3 data-aos="fade-up" className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-12">Education</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {education?.map((edu, i) => (
              <div key={edu.id} data-aos="fade-up" data-aos-delay={i * 100} className="bg-white/60 p-8 rounded-3xl border border-white">
                <h4 className="text-xl font-bold text-gray-900 mb-1">{edu.degree}</h4>
                <p className="text-base text-gray-600 font-medium">{edu.field}</p>
                <div className="mt-4 text-sm text-gray-400">{edu.institution}</div>
              </div>
            ))}
          </div>
        </section>
        <Endorsements endorsements={endorsements || []} speed={profile.ticker_speed || 3500} />
      </div>
    </div>
  )
}