'use client'

import { useState } from 'react'
import { Tables } from '@/types/supabase'
import { deleteEducation, upsertEducation } from '@/app/dashboard/actions'

export default function EducationTab({ education }: { education: Tables<'education'>[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleEdit = (edu: Tables<'education'>) => {
    setEditingId(edu.id)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setEditingId(null)
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingId(null)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Education</h2>
        {!isFormOpen && (
          <button onClick={handleAddNew} className="bg-black text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-gray-800 transition">
            + Add Education
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 ring-2 ring-blue-50/50 transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase">{editingId ? 'Edit' : 'Add New'}</h3>
            <button onClick={handleCancel} className="text-xs text-red-400 font-bold uppercase hover:text-red-600">Cancel</button>
          </div>

          <form action={async (formData) => { await upsertEducation(formData); handleCancel(); }}>
            {editingId && <input type="hidden" name="id" value={editingId} />}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select 
                name="type" 
                defaultValue={education.find(e => e.id === editingId)?.type || 'POSTGRADUATE'}
                className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none"
              >
                <option value="POSTGRADUATE">Postgraduate</option>
                <option value="UNDERGRADUATE">Undergraduate</option>
              </select>
              <input name="degree" placeholder="Degree (e.g. MBA)" defaultValue={education.find(e => e.id === editingId)?.degree} required className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none" />
              <input name="field" placeholder="Field (e.g. Supply Chain)" defaultValue={education.find(e => e.id === editingId)?.field} required className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none" />
              <input name="institution" placeholder="University Name" defaultValue={education.find(e => e.id === editingId)?.institution} required className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none" />
              <input name="year" placeholder="Year (e.g. 2019-2023)" defaultValue={education.find(e => e.id === editingId)?.year} required className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none" />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition transform active:scale-95">
              {editingId ? 'Update' : 'Save'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu.id} className="bg-white p-6 rounded-xl border border-gray-200 flex justify-between items-start hover:shadow-md transition group">
            <div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full mb-2 inline-block ${edu.type === 'POSTGRADUATE' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 bg-gray-100'}`}>
                {edu.type}
              </span>
              <h4 className="font-bold text-lg">{edu.degree}</h4>
              <div className="text-sm text-gray-500">{edu.field}</div>
              <div className="text-xs text-gray-400 mt-1">{edu.institution} | {edu.year}</div>
            </div>
            <div className="flex gap-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(edu)} className="text-blue-500 hover:text-blue-700 font-bold">Edit</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => deleteEducation(edu.id)} className="text-red-400 hover:text-red-600">Delete</button>
            </div>
          </div>
        ))}
        {education.length === 0 && !isFormOpen && <div className="text-center py-10 text-gray-400">No education added yet.</div>}
      </div>
    </div>
  )
}