'use client'

import { useState } from 'react'
import { Tables } from '@/types/supabase'
import { deleteEndorsement, upsertEndorsement } from '@/app/dashboard/actions/endorsements'
import { updateTickerSpeed } from '@/app/dashboard/actions/profile'
import { toast } from 'sonner'

interface Props {
  endorsements: Tables<'endorsements'>[]
  tickerSpeed: number
}

const getImageUrl = (path: string | null) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`
}

export default function EndorsementsTab({ endorsements, tickerSpeed }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [speed, setSpeed] = useState(tickerSpeed)
  const [preview, setPreview] = useState<string | null>(null)

  const handleEdit = (end: Tables<'endorsements'>) => {
    setEditingId(end.id)
    setPreview(getImageUrl(end.image_url))
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddNew = () => {
    setEditingId(null)
    setPreview(null)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setPreview(null)
  }

  const handleDelete = (id: number) => {
    toast("Delete this endorsement?", {
      action: {
        label: "Delete",
        onClick: async () => {
            await deleteEndorsement(id)
            toast.success("Deleted")
        }
      },
      cancel: { label: "Cancel" }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Ticker Speed Settings */}
      <div className="bg-accent text-accent-foreground p-6 rounded-2xl shadow-lg flex justify-between items-center border border-card-border">
        <div>
          <h3 className="font-bold text-lg">Ticker Speed</h3>
          <p className="text-xs text-accent-foreground/60">Controls scroll speed (lower is faster).</p>
        </div>
        <form action={updateTickerSpeed} className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <input 
              type="range" 
              name="ticker_speed" 
              min="1000" 
              max="8000" 
              step="100" 
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="accent-accent-foreground cursor-pointer"
            />
            <span className="text-xs font-mono mt-1">{speed}ms</span>
          </div>
          <button type="submit" className="bg-background text-foreground px-4 py-2 rounded-lg text-xs font-bold hover:opacity-80 transition cursor-pointer">Save Speed</button>
        </form>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Endorsements</h2>
        {!isFormOpen && (
          <button 
            onClick={handleAddNew} 
            className="bg-accent text-accent-foreground px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:opacity-90 transition cursor-pointer border border-card-border"
          >
            + Add Endorsement
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-card-bg p-8 rounded-[2rem] shadow-sm border border-card-border transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-foreground/40 uppercase">{editingId ? 'Edit' : 'Add New'}</h3>
            <button onClick={handleCancel} className="text-xs text-red-500 font-bold uppercase hover:underline cursor-pointer">Cancel</button>
          </div>

          <form action={async (formData) => { 
            await upsertEndorsement(formData)
            toast.success('Endorsement saved')
            handleCancel() 
          }}>
            {editingId && <input type="hidden" name="id" value={editingId} />}
            <div className="grid grid-cols-12 gap-6 mb-6">
              <div className="col-span-3 flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-background border-2 border-dashed border-card-border relative group cursor-pointer hover:border-accent transition-colors">
                  {preview ? (
                     <img src={preview} className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-foreground/30 text-xs text-center font-medium">No Photo</div>
                  )}
                  <input type="file" name="image_file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Upload Photo</span>
              </div>
              <div className="col-span-9 grid grid-cols-2 gap-4">
                <input name="name" placeholder="Name" defaultValue={endorsements.find(e => e.id === editingId)?.name} required className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none placeholder-foreground/30" />
                <input name="role" placeholder="Role / Title" defaultValue={endorsements.find(e => e.id === editingId)?.role} required className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none placeholder-foreground/30" />
                
                <input name="linkedin_url" placeholder="LinkedIn Profile URL" defaultValue={endorsements.find(e => e.id === editingId)?.linkedin_url || ''} className="col-span-2 p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none placeholder-foreground/30" />
                
                <select name="color_class" defaultValue={endorsements.find(e => e.id === editingId)?.color_class || 'from-blue-500 to-blue-700'} className="col-span-2 p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none cursor-pointer">
                  <option value="from-blue-500 to-blue-700">Fallback: Blue Gradient</option>
                  <option value="from-purple-500 to-pink-500">Fallback: Purple Gradient</option>
                  <option value="bg-gray-800">Fallback: Solid Dark</option>
                </select>
                
                <textarea name="text" rows={3} placeholder="Endorsement Text" defaultValue={endorsements.find(e => e.id === editingId)?.text} required className="col-span-2 p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none placeholder-foreground/30" />
              </div>
            </div>

            <button type="submit" className="w-full bg-accent text-accent-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 shadow-lg transition transform active:scale-[0.99] cursor-pointer">
              {editingId ? 'Update Endorsement' : 'Save Endorsement'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {endorsements.map((end) => (
          <div key={end.id} className="bg-card-bg p-6 rounded-2xl border border-card-border hover:shadow-md transition flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {end.image_url ? (
                   <img src={getImageUrl(end.image_url)!} className="w-10 h-10 rounded-full object-cover border border-card-border shadow-sm" />
                ) : (
                   <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${end.color_class} flex items-center justify-center text-white font-bold text-xs`}>
                     {end.name[0]}
                   </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate text-foreground">{end.name}</h4>
                  <div className="text-[10px] text-foreground/50 uppercase truncate">{end.role}</div>
                  {end.linkedin_url && (
                    <a href={end.linkedin_url} target="_blank" className="text-[10px] text-accent hover:underline flex items-center gap-1 mt-0.5 cursor-pointer">
                       View LinkedIn
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  )}
                </div>
              </div>
              <p className="text-foreground/70 text-sm italic line-clamp-3">"{end.text}"</p>
            </div>
            <div className="flex gap-3 text-sm mt-4 pt-4 border-t border-card-border opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleEdit(end)} 
                className="bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold uppercase tracking-wide"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(end.id)} 
                className="bg-background border border-card-border text-foreground/60 hover:text-red-500 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold uppercase tracking-wide"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}