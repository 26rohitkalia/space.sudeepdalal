'use client'

import { Tables } from '@/types/supabase'
import Link from 'next/link'

export default function ProjectSlider({ projects }: { projects: Tables<'projects'>[] }) {
  if (!projects || projects.length === 0) return null

  let loopList = [...projects]
  while (loopList.length < 6) {
    loopList = [...loopList, ...projects]
  }
  const displayProjects = [...loopList, ...loopList]

  return (
    <div className="mt-12 mb-8 overflow-hidden relative group/slider">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        <h5 className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-8 pl-1 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
            Key Projects
        </h5>

        <div className="flex w-max animate-scroll">
            {displayProjects.map((proj, idx) => (
                <Link
                    href={`/projects/${proj.id}`}
                    key={`${proj.id}-${idx}`}
                    className="flex-shrink-0 w-72 md:w-96 bg-card-bg/50 backdrop-blur-sm border border-card-border rounded-xl p-6 mr-6 hover:bg-card-bg hover:border-accent hover:shadow-xl transition-all duration-300 group/card cursor-pointer relative top-0 hover:-top-1"
                >
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-bold uppercase text-foreground/40 tracking-widest border border-card-border px-2 py-1 rounded-md group-hover/card:text-accent group-hover/card:border-accent/30 transition-colors">
                            {proj.layout_type}
                        </span>
                        <svg className="w-5 h-5 text-foreground/20 group-hover/card:text-accent transition-colors -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </div>
                    
                    <h6 className="font-bold text-xl text-foreground mb-2 line-clamp-1 group-hover/card:text-accent transition-colors">
                        {proj.title}
                    </h6>
                    
                    <p className="text-sm text-foreground/60 line-clamp-2 leading-relaxed font-medium">
                        {proj.short_description}
                    </p>
                </Link>
            ))}
        </div>

        <style jsx>{`
          .animate-scroll {
            animation: infinite-scroll 60s linear infinite;
          }
          
          /* Using !important to ensure it overrides any conflicting specificities */
          .animate-scroll:hover {
            animation-play-state: paused !important;
          }

          @keyframes infinite-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
    </div>
  )
}