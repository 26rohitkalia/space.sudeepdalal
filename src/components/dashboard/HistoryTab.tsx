'use client'

import { useState } from 'react'
import { Tables } from '@/types/supabase'
import { deleteExperience, upsertExperience } from '@/app/dashboard/actions/experience'
import RichTextEditor from '@/components/ui/RichTextEditor'

export default function HistoryTab({ experiences }: { experiences: Tables<'experiences'>[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  const [description, setDescription] = useState('')

  const handleEdit = (exp: Tables<'experiences'>) => {
    setEditingId(exp.id)
    setDescription(exp.description || '')
    setIsFormOpen(true)
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Professional History</h2>
        {!isFormOpen && (
          <button 
            onClick={handleAddNew}
            className="bg-accent text-accent-foreground px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:opacity-90 transition cursor-pointer"
          >
            + Add Experience
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-card-bg p-6 rounded-2xl shadow-sm border border-card-border transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-foreground/50 uppercase">
              {editingId ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <button onClick={handleCancel} className="text-xs text-red-400 font-bold uppercase hover:text-red-600 cursor-pointer">
              Cancel
            </button>
          </div>

          <form action={async (formData) => {
            await upsertExperience(formData)
            handleCancel()
          }}>
            {editingId && <input type="hidden" name="id" value={editingId} />}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input 
                name="company" 
                placeholder="Company Name" 
                defaultValue={experiences.find(e => e.id === editingId)?.company}
                required 
                className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:bg-card-bg focus:ring-2 focus:ring-accent outline-none transition"
              />
              <input 
                name="role" 
                placeholder="Job Title" 
                defaultValue={experiences.find(e => e.id === editingId)?.role}
                required 
                className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:bg-card-bg focus:ring-2 focus:ring-accent outline-none transition"
              />
              <input 
                name="duration" 
                placeholder="Duration (e.g. 2020 - Present)" 
                defaultValue={experiences.find(e => e.id === editingId)?.duration}
                required 
                className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:bg-card-bg focus:ring-2 focus:ring-accent outline-none transition"
              />
              <select 
                name="color_class" 
                defaultValue={experiences.find(e => e.id === editingId)?.color_class || 'bg-blue-600'}
                className="p-3 border border-card-border rounded-xl bg-background text-foreground focus:bg-card-bg outline-none cursor-pointer"
              >
                <option value="bg-blue-600">Blue Dot</option>
                <option value="bg-gray-300">Gray Dot</option>
                <option value="bg-green-500">Green Dot</option>
                <option value="bg-purple-500">Purple Dot</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Description</label>
              <RichTextEditor content={description} onChange={(html) => setDescription(html)} />
              <input type="hidden" name="description" value={description} />
            </div>

            <button type="submit" className="bg-accent text-accent-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 shadow-lg transition transform active:scale-95 cursor-pointer">
              {editingId ? 'Update Experience' : 'Save Experience'}
            </button>
          </form>
        </div>
      )}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-card-bg p-6 rounded-xl border border-card-border flex justify-between items-start hover:shadow-md transition group">
            <div className="flex gap-4">
              <div className="mt-1 text-foreground/20 cursor-grab active:cursor-grabbing">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${exp.color_class}`}></span>
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
              <button onClick={() => handleEdit(exp)} className="text-blue-500 hover:text-blue-700 font-bold cursor-pointer">Edit</button>
              <span className="text-foreground/20">|</span>
              <button onClick={() => deleteExperience(exp.id)} className="text-red-400 hover:text-red-600 cursor-pointer">Delete</button>
            </div>
          </div>
        ))}
        
        {experiences.length === 0 && !isFormOpen && (
            <div className="text-center py-10 text-foreground/40">
                No history added yet. Click "Add Experience" to start.
            </div>
        )}
      </div>
    </div>
  )
}