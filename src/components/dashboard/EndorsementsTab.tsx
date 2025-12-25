'use client'

import { useState } from 'react'
import { Tables } from '@/types/supabase'
import { deleteEndorsement, upsertEndorsement, updateTickerSpeed } from '@/app/dashboard/actions'
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">Ticker Speed</h3>
          <p className="text-xs text-gray-400">Controls scroll speed (lower is faster).</p>
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
              className="accent-white"
            />
            <span className="text-xs font-mono mt-1">{speed}ms</span>
          </div>
          <button type="submit" className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 transition">Save Speed</button>
        </form>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Endorsements</h2>
        {!isFormOpen && (
          <button onClick={handleAddNew} className="bg-black text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-gray-800 transition">+ Add Endorsement</button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 ring-2 ring-blue-50/50 transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase">{editingId ? 'Edit' : 'Add New'}</h3>
            <button onClick={handleCancel} className="text-xs text-red-400 font-bold uppercase hover:text-red-600">Cancel</button>
          </div>

          <form action={async (formData) => { 
            await upsertEndorsement(formData)
            toast.success('Endorsement saved')
            handleCancel() 
          }}>
            {editingId && <input type="hidden" name="id" value={editingId} />}
            <div className="grid grid-cols-12 gap-6 mb-4">
              <div className="col-span-3 flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200 relative group">
                  {preview ? (
                     <img src={preview} className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center">No Photo</div>
                  )}
                  <input type="file" name="image_file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <span className="text-[10px] text-blue-500 font-bold uppercase">Upload Photo</span>
              </div>
              <div className="col-span-9 grid grid-cols-2 gap-4">
                <input name="name" placeholder="Name" defaultValue={endorsements.find(e => e.id === editingId)?.name} required className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none" />
                <input name="role" placeholder="Role / Title" defaultValue={endorsements.find(e => e.id === editingId)?.role} required className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none" />
                
                <input name="linkedin_url" placeholder="LinkedIn Profile URL" defaultValue={endorsements.find(e => e.id === editingId)?.linkedin_url || ''} className="col-span-2 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none" />
                
                <select name="color_class" defaultValue={endorsements.find(e => e.id === editingId)?.color_class || 'from-blue-500 to-blue-700'} className="col-span-2 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none">
                  <option value="from-blue-500 to-blue-700">Fallback: Blue Gradient</option>
                  <option value="from-purple-500 to-pink-500">Fallback: Purple Gradient</option>
                  <option value="bg-gray-800">Fallback: Solid Dark</option>
                </select>
                
                <textarea name="text" rows={3} placeholder="Endorsement Text" defaultValue={endorsements.find(e => e.id === editingId)?.text} required className="col-span-2 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none" />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition transform active:scale-[0.98]">
              {editingId ? 'Update Endorsement' : 'Save Endorsement'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {endorsements.map((end) => (
          <div key={end.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition flex flex-col justify-between group">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {end.image_url ? (
                   <img src={getImageUrl(end.image_url)!} className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm" />
                ) : (
                   <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${end.color_class} flex items-center justify-center text-white font-bold text-xs`}>
                     {end.name[0]}
                   </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{end.name}</h4>
                  <div className="text-[10px] text-gray-500 uppercase truncate">{end.role}</div>
                  {end.linkedin_url && (
                    <a href={end.linkedin_url} target="_blank" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                       View LinkedIn
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm italic line-clamp-3">"{end.text}"</p>
            </div>
            <div className="flex gap-3 text-sm mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(end)} className="text-blue-500 hover:text-blue-700 font-bold">Edit</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => deleteEndorsement(end.id)} className="text-red-400 hover:text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}