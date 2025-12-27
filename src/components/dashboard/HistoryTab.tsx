'use client'

import { useState } from 'react'
import { Tables } from '@/types/supabase'
import { deleteExperience, upsertExperience } from '@/app/dashboard/actions/experience'
import RichTextEditor from '@/components/ui/RichTextEditor'
import { toast } from 'sonner'

export default function HistoryTab({ experiences }: { experiences: Tables<'experiences'>[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [description, setDescription] = useState('')

  const handleEdit = (exp: Tables<'experiences'>) => {
    setEditingId(exp.id)
    setDescription(exp.description || '')
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddNew = () => {
    setEditingId(null)
    setDescription('')
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setDescription('')
  }

  const handleDelete = (id: number) => {
    toast("Are you sure you want to delete this experience?", {
      action: {
        label: "Delete",
        onClick: async () => {
            await deleteExperience(id)
            toast.success("Deleted successfully")
        }
      },
      cancel: { label: "Cancel", onClick: () => {} } 
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Professional History</h2>
        {!isFormOpen && (
          <button 
            onClick={handleAddNew}
            className="bg-accent text-accent-foreground px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:opacity-90 transition cursor-pointer border border-card-border"
          >
            + Add Experience
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-card-bg p-8 rounded-[2rem] shadow-sm border border-card-border transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-foreground/40 uppercase">
              {editingId ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <button onClick={handleCancel} className="text-xs text-red-500 font-bold uppercase hover:underline cursor-pointer">
              Cancel
            </button>
          </div>

          <form action={async (formData) => {
            await upsertExperience(formData)
            toast.success("Saved successfully")
            handleCancel()
          }}>
            {editingId && <input type="hidden" name="id" value={editingId} />}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input 
                name="company" 
                placeholder="Company Name" 
                defaultValue={experiences.find(e => e.id === editingId)?.company}
                required 
                className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none transition placeholder-foreground/30"
              />
              <input 
                name="role" 
                placeholder="Job Title" 
                defaultValue={experiences.find(e => e.id === editingId)?.role}
                required 
                className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none transition placeholder-foreground/30"
              />
              <input 
                name="duration" 
                placeholder="Duration (e.g. 2020 - Present)" 
                defaultValue={experiences.find(e => e.id === editingId)?.duration}
                required 
                className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none transition placeholder-foreground/30"
              />
              <select 
                name="color_class" 
                defaultValue={experiences.find(e => e.id === editingId)?.color_class || 'bg-blue-600'}
                className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none cursor-pointer"
              >
                <option value="bg-blue-600">Blue Dot</option>
                <option value="bg-gray-300">Gray Dot</option>
                <option value="bg-green-500">Green Dot</option>
                <option value="bg-purple-500">Purple Dot</option>
                <option value="bg-accent">Theme Accent Dot</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Description</label>
              <div className="text-foreground">
                <RichTextEditor content={description} onChange={(html) => setDescription(html)} />
              </div>
              <input type="hidden" name="description" value={description} />
            </div>

            <button type="submit" className="w-full bg-accent text-accent-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 shadow-lg transition transform active:scale-[0.99] cursor-pointer">
              {editingId ? 'Update Experience' : 'Save Experience'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-card-bg p-6 rounded-2xl border border-card-border flex justify-between items-start hover:shadow-md transition group">
            <div className="flex gap-4">
              <div className="mt-1 text-foreground/20 cursor-grab active:cursor-grabbing">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${exp.color_class === 'bg-accent' ? 'bg-accent' : exp.color_class}`}></span>
                    <h4 className="font-bold text-lg text-foreground">{exp.company}</h4>
                </div>
                <div className="text-sm text-foreground/60 font-medium mb-2">{exp.role} | {exp.duration}</div>
                
                <div 
                  className="text-foreground/70 text-sm prose prose-sm max-w-none prose-p:text-foreground/70 prose-strong:text-foreground"
                  dangerouslySetInnerHTML={{ __html: exp.description || '' }} 
                />
              </div>
            </div>

            <div className="flex gap-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleEdit(exp)} 
                className="bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold uppercase tracking-wide"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(exp.id)} 
                className="bg-background border border-card-border text-foreground/60 hover:text-red-500 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold uppercase tracking-wide"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {experiences.length === 0 && !isFormOpen && (
            <div className="text-center py-10 text-foreground/40 border-2 border-dashed border-card-border rounded-2xl">
                No history added yet. Click "Add Experience" to start.
            </div>
        )}
      </div>
    </div>
  )
}