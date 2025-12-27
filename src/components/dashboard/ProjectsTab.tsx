'use client'

import { useState } from 'react'
import { Tables } from '@/types/supabase'
import { deleteProject, upsertProject, updateProjectsViewLayout } from '@/app/dashboard/actions/projects'
import RichTextEditor from '@/components/ui/RichTextEditor'
import { toast } from 'sonner'

interface Props {
  projects: Tables<'projects'>[]
  experiences: Tables<'experiences'>[]
  profile: Tables<'profiles'>
}

const getImageUrl = (path: string) => 
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio/${path}`

export default function ProjectsTab({ projects, experiences, profile }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [longDesc, setLongDesc] = useState('')
  const [currentImages, setCurrentImages] = useState<string[]>([])
  const [uploadQueue, setUploadQueue] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [layoutPreference, setLayoutPreference] = useState(profile.projects_view_layout || 'list')

  const handleEdit = (proj: Tables<'projects'>) => {
    setEditingId(proj.id)
    setLongDesc(proj.long_description || '')
    setCurrentImages(proj.images || [])
    setUploadQueue([])
    setIsFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddNew = () => {
    setEditingId(null)
    setLongDesc('')
    setCurrentImages([])
    setUploadQueue([])
    setIsFormOpen(true)
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setLongDesc('')
    setCurrentImages([])
    setUploadQueue([])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setUploadQueue(Array.from(e.target.files))
    }
  }

  const removeCurrentImage = (index: number) => {
    setCurrentImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
        await upsertProject(formData)
        toast.success(editingId ? 'Project updated' : 'Project created')
        handleCancel()
    } catch (e) {
        toast.error('Error saving project')
    } finally {
        setLoading(false)
    }
  }

  const handleSettingsSubmit = async (formData: FormData) => {
      formData.set('projects_view_layout', layoutPreference)
      await updateProjectsViewLayout(formData)
      toast.success('Page settings saved')
  }

  const handleDelete = (id: number) => {
    toast("Delete this project?", {
      action: {
        label: "Delete",
        onClick: async () => {
            await deleteProject(id)
            toast.success("Project deleted")
        }
      },
      cancel: { label: "Cancel" }
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <form action={handleSettingsSubmit} className="bg-accent text-accent-foreground p-8 rounded-2xl shadow-lg space-y-8 border border-card-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-accent-foreground/10">
            <div>
                <h3 className="font-bold text-xl">Projects Page Settings</h3>
                <p className="text-xs text-accent-foreground/60">Customize the public appearance of /projects</p>
            </div>
            <button type="submit" className="bg-background text-foreground px-6 py-2 rounded-lg text-xs font-bold shadow-md hover:scale-105 transition cursor-pointer">
                Save Page Settings
            </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Page Title</label>
                    <input name="projects_header_title" defaultValue={profile.projects_header_title || 'Selected Works'} className="w-full bg-background/20 border border-white/10 rounded-xl p-3 text-accent-foreground placeholder-accent-foreground/30 focus:outline-none focus:ring-1 focus:ring-white/30" />
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Page Subtitle</label>
                    <textarea name="projects_header_subtitle" rows={2} defaultValue={profile.projects_header_subtitle || 'A collection of strategic initiatives.'} className="w-full bg-background/20 border border-white/10 rounded-xl p-3 text-accent-foreground placeholder-accent-foreground/30 focus:outline-none focus:ring-1 focus:ring-white/30" />
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">List Layout Style</label>
                <div className="flex bg-background/10 backdrop-blur-md p-1.5 rounded-xl border border-white/10 w-fit">
                    {[
                        { id: 'list', label: 'List', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg> },
                        { id: 'grid', label: 'Grid', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg> },
                        { id: 'minimal', label: 'Mini', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg> }
                    ].map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => setLayoutPreference(option.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer
                                ${layoutPreference === option.id 
                                    ? 'bg-background text-foreground shadow-lg scale-105' 
                                    : 'text-accent-foreground/60 hover:text-accent-foreground hover:bg-white/5'}
                            `}
                        >
                            {option.icon}
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </form>

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Projects</h2>
        {!isFormOpen && (
          <button 
            onClick={handleAddNew} 
            className="bg-accent text-accent-foreground px-5 py-2 rounded-lg text-sm font-bold shadow-lg hover:opacity-90 transition cursor-pointer border border-card-border"
          >
            + Add Project
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-card-bg p-8 rounded-[2rem] shadow-sm border border-card-border transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-foreground/50 uppercase">{editingId ? 'Edit Project' : 'New Project'}</h3>
            <button onClick={handleCancel} className="text-xs text-red-500 font-bold uppercase hover:underline cursor-pointer">Cancel</button>
          </div>

          <form action={handleSubmit} className="space-y-6">
            {editingId && <input type="hidden" name="id" value={editingId} />}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Project Title</label>
                    <input name="title" placeholder="Project Name" defaultValue={projects.find(p => p.id === editingId)?.title} required className="w-full p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none placeholder-foreground/30" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Associated Job</label>
                    <select name="experience_id" defaultValue={projects.find(p => p.id === editingId)?.experience_id || ''} className="w-full p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none cursor-pointer">
                        <option value="">-- Independent Project --</option>
                        {experiences.map(exp => (
                            <option key={exp.id} value={exp.id}>{exp.company} - {exp.role}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Short Description (Ticker/Card)</label>
                <textarea name="short_description" rows={2} defaultValue={projects.find(p => p.id === editingId)?.short_description || ''} className="w-full p-3 border border-card-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-accent outline-none placeholder-foreground/30" />
            </div>

            <div>
                <label className="block text-xs font-bold text-foreground/40 uppercase mb-2">Full Case Study (WYSIWYG)</label>
                <div className="text-foreground">
                     <RichTextEditor content={longDesc} onChange={setLongDesc} />
                </div>
                <input type="hidden" name="long_description" value={longDesc} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-card-border pt-6">
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-foreground/40 uppercase mb-4">Detail Page Layout</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['standard', 'split', 'gallery', 'hero'].map(layout => (
                            <label key={layout} className="cursor-pointer">
                                <input type="radio" name="layout_type" value={layout} defaultChecked={(projects.find(p => p.id === editingId)?.layout_type || 'standard') === layout} className="peer hidden" />
                                <div className="border border-card-border rounded-lg p-3 text-center text-xs font-bold text-foreground/60 peer-checked:bg-accent peer-checked:text-accent-foreground peer-checked:border-accent transition-all uppercase">
                                    {layout}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-8">
                    <label className="block text-xs font-bold text-foreground/40 uppercase mb-4">Project Gallery</label>
                    <input type="hidden" name="existing_images" value={JSON.stringify(currentImages)} />
                    <div className="flex flex-wrap gap-3 mb-4">
                        {currentImages.map((path, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-card-border group">
                                <img src={getImageUrl(path)} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeCurrentImage(idx)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-all cursor-pointer">Remove</button>
                            </div>
                        ))}
                        {uploadQueue.map((file, idx) => (
                             <div key={`new-${idx}`} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-accent border-dashed flex items-center justify-center bg-accent/5">
                                <span className="text-[9px] text-center p-1 truncate w-full text-foreground/60">{file.name}</span>
                             </div>
                        ))}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer bg-card-bg border border-card-border hover:border-accent rounded-xl p-3 w-fit transition-colors">
                        <svg className="w-5 h-5 text-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        <span className="text-xs font-bold text-foreground/60 uppercase">Add Images</span>
                        <input type="file" name="images" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-bold hover:opacity-90 shadow-lg transition transform active:scale-[0.99] disabled:opacity-50 cursor-pointer">
              {loading ? 'Saving Project...' : (editingId ? 'Update Project' : 'Create Project')}
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {projects.map((proj) => {
            const exp = experiences.find(e => e.id === proj.experience_id)
            return (
                <div key={proj.id} className="bg-card-bg p-6 rounded-2xl border border-card-border flex justify-between items-center group hover:shadow-md transition">
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-xl bg-background border border-card-border overflow-hidden flex-shrink-0">
                            {proj.images && proj.images[0] ? (
                                <img src={getImageUrl(proj.images[0])} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-foreground/20 font-bold">No IMG</div>
                            )}
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-foreground">{proj.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-foreground/50 font-medium uppercase tracking-wide">
                                <span className="bg-background px-2 py-1 rounded border border-card-border">{proj.layout_type} Layout</span>
                                {exp ? (
                                    <span>Linked: {exp.company}</span>
                                ) : (
                                    <span>Independent</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleEdit(proj)} 
                            className="bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold uppercase tracking-wide"
                        >
                            Edit
                        </button>
                        <button 
                            onClick={() => handleDelete(proj.id)} 
                            className="bg-background border border-card-border text-foreground/60 hover:text-red-500 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs font-bold uppercase tracking-wide"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  )
}