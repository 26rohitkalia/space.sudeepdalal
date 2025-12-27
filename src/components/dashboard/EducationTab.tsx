'use client'

import { useState } from 'react'
import { Tables } from '@/types/supabase'
import { deleteEducation, upsertEducation } from '@/app/dashboard/actions/education'
import { toast } from 'sonner'

export default function EducationTab({ education }: { education: Tables<'education'>[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleEdit = (edu: Tables<'education'>) => {
    setEditingId(edu.id)
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddNew = () => {
    setEditingId(null)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingId(null)
  }

  const handleDelete = (id: number) => {
    toast("Delete this education entry?", {
      action: {
        label: "Delete",
        onClick: async () => {
            await deleteEducation(id)
            toast.success("Entry deleted")
        }
      },
      cancel: { label: "Cancel", onClick: () => {} }
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Education</h2>
        {!isFormOpen && (
          <button 
            onClick={handleAddNew} 
            className="bg-accent text-accent-foreground px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:opacity-90 transition cursor-pointer border border-card-border"
          >
            + Add Education
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-card-bg p-8 rounded-[2rem] shadow-sm border border-card-border transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-foreground/40 uppercase">{editingId ? 'Edit' : 'Add New'}</h3>
            <button onClick={handleCancel} className="text-xs text-red-500 font-bold uppercase hover:underline cursor-pointer">Cancel</button>
          </div>

          <form action={async (formData) => { await upsertEducation(formData); toast.success('Saved successfully'); handleCancel(); }}>
            {editingId && <input type="hidden" name="id" value={editingId} />}
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <select 
                name="type" 
                defaultValue={education.find(e => e.id === editingId)?.type || 'POSTGRADUATE'}
                className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none cursor-pointer"
              >
                <option value="POSTGRADUATE">Postgraduate</option>
                <option value="UNDERGRADUATE">Undergraduate</option>
                <option value="CERTIFICATION">Certification</option>
              </select>
              <input name="degree" placeholder="Degree (e.g. MBA)" defaultValue={education.find(e => e.id === editingId)?.degree} required className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none placeholder-foreground/30" />
              <input name="field" placeholder="Field (e.g. Supply Chain)" defaultValue={education.find(e => e.id === editingId)?.field} required className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none placeholder-foreground/30" />
              <input name="institution" placeholder="University Name" defaultValue={education.find(e => e.id === editingId)?.institution} required className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none placeholder-foreground/30" />
              <input name="year" placeholder="Year (e.g. 2019-2023)" defaultValue={education.find(e => e.id === editingId)?.year} required className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none placeholder-foreground/30" />
            </div>

            <button type="submit" className="w-full bg-accent text-accent-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 shadow-lg transition transform active:scale-[0.99] cursor-pointer">
              {editingId ? 'Update' : 'Save'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="bg-card-bg p-6 rounded-2xl border border-card-border flex justify-between items-start hover:shadow-md transition group">
            <div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block ${edu.type === 'POSTGRADUATE' ? 'text-accent bg-accent/10' : 'text-foreground/50 bg-background border border-card-border'}`}>
                {edu.type}
              </span>
              <h4 className="font-bold text-lg text-foreground">{edu.degree}</h4>
              <div className="text-sm text-foreground/60">{edu.field}</div>
              <div className="text-xs text-foreground/40 mt-1">{edu.institution} | {edu.year}</div>
            </div>
            <div className="flex gap-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleEdit(edu)} 
                className="bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold uppercase tracking-wide"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(edu.id)} 
                className="bg-background border border-card-border text-foreground/60 hover:text-red-500 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold uppercase tracking-wide"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {education.length === 0 && !isFormOpen && (
            <div className="text-center py-10 text-foreground/40 border-2 border-dashed border-card-border rounded-2xl">
                No education added yet.
            </div>
        )}
      </div>
    </div>
  )
}