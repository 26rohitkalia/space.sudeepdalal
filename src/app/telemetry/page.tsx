import { createClient } from '@/lib/supabase/server'

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default async function TelemetryPage() {
  const supabase = await createClient()

  const { data: visits } = await supabase
    .from('analytics_visits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1000)

  const { data: storage } = await supabase
    .from('storage_usage')
    .select('*')
    .single()

  const totalVisits = visits?.length || 0
  const uniqueVisitors = new Set(visits?.map(v => v.ip_address)).size
  
  const postViews: Record<string, number> = {}
  visits?.forEach(v => {
    if (v.path.startsWith('/insights/') && v.path !== '/insights') {
        const slug = v.path.replace('/insights/', '')
        postViews[slug] = (postViews[slug] || 0) + 1
    }
  })

  const locations: Record<string, number> = {}
  visits?.forEach(v => {
      const loc = v.city && v.country ? `${v.city}, ${v.country}` : 'Unknown'
      locations[loc] = (locations[loc] || 0) + 1
  })
  
  const topLocations = Object.entries(locations)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)

  const usedBytes = storage?.total_bytes || 0
  const freeTierLimit = 1073741824 
  const percentUsed = (usedBytes / freeTierLimit) * 100

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-foreground">Telemetry</h1>
        <p className="text-foreground/50 mt-1">Real-time usage and audience analytics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">Total Visits</h3>
            <div className="text-4xl font-bold text-foreground">{totalVisits}</div>
            <div className="text-xs text-foreground/50 mt-1">Last 1000 records</div>
        </div>
        <div className="bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">Unique Visitors</h3>
            <div className="text-4xl font-bold text-accent">{uniqueVisitors}</div>
            <div className="text-xs text-foreground/50 mt-1">Based on IP</div>
        </div>
        <div className="bg-card-bg p-6 rounded-2xl border border-card-border shadow-sm">
            <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-2">Storage Used</h3>
            <div className="text-4xl font-bold text-foreground">{formatBytes(usedBytes)}</div>
            <div className="w-full bg-background h-2 rounded-full mt-3 overflow-hidden border border-card-border">
                <div className="bg-accent h-full rounded-full transition-all" style={{ width: `${Math.min(percentUsed, 100)}%` }}></div>
            </div>
            <div className="text-xs text-foreground/50 mt-1 flex justify-between">
                <span>{percentUsed.toFixed(1)}% of Free Tier</span>
                <span>Max 1 GB</span>
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        
        <div className="bg-card-bg p-8 rounded-2xl border border-card-border shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                Reader Interest
            </h3>
            <div className="space-y-4">
                {Object.entries(postViews).length === 0 ? (
                    <div className="text-foreground/40 text-sm italic">No blog posts read yet.</div>
                ) : (
                    Object.entries(postViews)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([slug, count], i) => (
                        <div key={slug} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="text-xs font-mono text-foreground/30 w-4">0{i + 1}</span>
                                <span className="text-sm font-medium text-foreground truncate max-w-[200px] group-hover:text-accent transition-colors">.../{slug}</span>
                            </div>
                            <span className="text-xs font-bold bg-background border border-card-border px-2 py-1 rounded-md">{count} views</span>
                        </div>
                    ))
                )}
            </div>
        </div>

        <div className="bg-card-bg p-8 rounded-2xl border border-card-border shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Top Locations
            </h3>
            <div className="space-y-4">
                {topLocations.length === 0 ? (
                    <div className="text-foreground/40 text-sm italic">No location data available.</div>
                ) : (
                    topLocations.map(([loc, count], i) => (
                        <div key={loc} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-accent/50"></span>
                                <span className="text-sm font-medium text-foreground">{loc}</span>
                            </div>
                            <span className="text-xs text-foreground/50">{count} visits</span>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>

      <div className="bg-card-bg rounded-2xl border border-card-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-card-border bg-background/50">
            <h3 className="text-sm font-bold text-foreground">Live Traffic Log</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-foreground/40 uppercase bg-background border-b border-card-border">
                    <tr>
                        <th className="px-6 py-3">Time</th>
                        <th className="px-6 py-3">Page</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">IP Address</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                    {visits?.slice(0, 10).map((v) => (
                        <tr key={v.id} className="hover:bg-background/50 transition-colors">
                            <td className="px-6 py-3 font-mono text-xs">{new Date(v.created_at).toLocaleTimeString()}</td>
                            <td className="px-6 py-3 truncate max-w-[150px]">{v.path}</td>
                            <td className="px-6 py-3">{v.city ? `${v.city}, ${v.country}` : 'Unknown'}</td>
                            <td className="px-6 py-3 font-mono text-xs text-foreground/50">{v.ip_address}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}