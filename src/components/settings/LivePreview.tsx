'use client'

interface Props {
  theme: string
  font: string
  profile: any
}

export default function LivePreview({ theme, font, profile }: Props) {
  
  const getPreviewFontStyle = () => {
    if (font === 'Custom') return 'inherit'
    return `"${font}", sans-serif`
  }

  return (
    <div className="sticky top-28 h-[calc(100vh-160px)]">
        <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Live Preview</h2>
            <span className="text-xs text-foreground/60 bg-card-bg px-2 py-1 rounded-md border border-card-border shadow-sm">
                Mode: {theme} | Font: {font}
            </span>
        </div>
        
        <div 
            className="flex-1 rounded-[2.5rem] overflow-hidden shadow-2xl border border-card-border relative isolate bg-background text-foreground transition-all duration-500"
            style={{ fontFamily: getPreviewFontStyle() }}
        >
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-8">
                
                <div className="mb-20 mt-10">
                    <div 
                        className="w-full h-80 rounded-3xl relative overflow-hidden flex items-end p-8 mb-8 transition-all duration-500"
                        style={{ 
                            background: 'var(--accent)',
                            color: 'var(--accent-foreground)'
                            }}
                    >
                        <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }}></div>
                        
                        {theme === 'futuristic' && (
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        )}

                        <div className="relative z-10">
                            <h1 className="text-6xl font-bold leading-[0.9] mb-2" dangerouslySetInnerHTML={{ __html: profile.hero_title || 'Sudeep<br>Dalal' }}></h1>
                            <p className="text-lg opacity-80" dangerouslySetInnerHTML={{ __html: profile.hero_subtitle || 'Manager' }}></p>
                        </div>

                        {theme === 'terminal' && (
                            <div className="absolute top-4 right-4 text-xs font-mono opacity-60">
                                &gt; SYSTEM.READY
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-xl">
                    <h2 className="text-4xl font-bold mb-4 leading-tight text-foreground" dangerouslySetInnerHTML={{ __html: profile.headline }}></h2>
                    <p className="text-foreground/60 mb-12 text-lg">
                        This is how your bio text will look. {profile.sub_headline}
                    </p>

                    <div className="space-y-6 pl-6 border-l-2" style={{ borderColor: 'var(--card-border)' }}>
                        <div className="group">
                            <h3 className="text-2xl font-bold text-foreground">{profile.company || 'Company Name'}</h3>
                            <p className="text-foreground/60 font-medium">{profile.role} | 2020-Present</p>
                            <p className="mt-2 text-sm text-foreground/50">Led strategic sourcing initiatives resulting in 15% cost reduction.</p>
                        </div>
                        <div className="group opacity-50">
                            <h3 className="text-2xl font-bold text-foreground">Previous Corp</h3>
                            <p className="text-foreground/60 font-medium">Buyer | 2018-2020</p>
                        </div>
                    </div>

                    <div className="mt-16">
                        <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-[0.2em] mb-6">Endorsements</h3>
                        <div className="p-6 rounded-2xl border bg-card-bg border-card-border">
                            <div className="flex gap-4 items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-accent"></div>
                                <div>
                                    <div className="font-bold text-sm text-foreground">Jane Doe</div>
                                    <div className="text-xs text-foreground/50">Director of Supply Chain</div>
                                </div>
                            </div>
                            <p className="text-sm text-foreground/70 italic">
                                "Sudeep is an incredible asset to any team."
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        </div>
    </div>
  )
}