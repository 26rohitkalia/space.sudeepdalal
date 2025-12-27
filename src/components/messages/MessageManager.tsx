'use client'

import { useState } from 'react'
import { toggleReadStatus, toggleSaveStatus, deleteMessage } from '@/app/messages/actions'
import { toast } from 'sonner'

interface Message {
  id: number
  name: string
  email: string
  phone: string
  message: string
  is_read: boolean
  is_saved: boolean
  created_at: string
}

export default function MessageManager({ messages, view }: { messages: Message[], view: string }) {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const selectedMessage = messages.find(m => m.id === selectedId)

  const handleDelete = (id: number) => {
    toast("Permanently delete this message?", {
      action: {
        label: "Delete",
        onClick: async () => {
            await deleteMessage(id)
            if (selectedId === id) setSelectedId(null)
            toast.success("Message deleted")
        }
      },
      cancel: { label: "Cancel" }
    })
  }

  const handleToggleRead = async (msg: Message) => {
    await toggleReadStatus(msg.id, msg.is_read)
  }

  const handleToggleSave = async (msg: Message) => {
    await toggleSaveStatus(msg.id, msg.is_saved)
    if (view === 'saved' && msg.is_saved) setSelectedId(null) 
    toast.success(msg.is_saved ? "Removed from saved" : "Message saved")
  }

  return (
    <div className="flex h-full">
      <div className={`${selectedId ? 'hidden md:flex' : 'flex'} w-full md:w-[22rem] lg:w-[26rem] flex-col border-r border-card-border bg-card-bg/50`}>
        <div className="h-16 border-b border-card-border flex items-center px-4 shrink-0 bg-card-bg">
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">{messages.length} Messages</span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-foreground/30 p-8 text-center">
                <svg className="w-10 h-10 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <p className="text-sm">Inbox Zero.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div 
              key={msg.id}
              onClick={() => { setSelectedId(msg.id); if(!msg.is_read) handleToggleRead(msg); }}
              className={`
                group flex flex-col gap-1 p-4 border-b border-card-border cursor-pointer transition-colors relative
                ${selectedId === msg.id ? 'bg-accent/5' : 'hover:bg-foreground/5'}
                ${!msg.is_read ? 'bg-card-bg' : 'bg-transparent'}
              `}
            >
              {selectedId === msg.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent"></div>}
              
              <div className="flex justify-between items-baseline w-full">
                <h4 className={`text-sm truncate pr-2 ${!msg.is_read ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                    {msg.name}
                </h4>
                <span className={`text-[10px] whitespace-nowrap ${!msg.is_read ? 'text-accent font-bold' : 'text-foreground/40'}`}>
                    {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              <p className={`text-xs line-clamp-2 leading-relaxed ${!msg.is_read ? 'text-foreground font-medium' : 'text-foreground/50'}`}>
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${!selectedId ? 'hidden md:flex' : 'flex'} flex-1 bg-card-bg flex-col h-full overflow-hidden`}>
        {selectedMessage ? (
            <>
                <div className="h-16 border-b border-card-border flex items-center justify-between px-6 shrink-0">
                    <button onClick={() => setSelectedId(null)} className="md:hidden flex items-center text-xs font-bold uppercase tracking-widest text-foreground/50 hover:text-foreground">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        Back
                    </button>
                    <div className="flex gap-2 ml-auto">
                        <button 
                            onClick={() => handleToggleSave(selectedMessage)}
                            className={`p-2 rounded-md transition-colors ${selectedMessage.is_saved ? 'text-accent bg-accent/10' : 'text-foreground/40 hover:text-foreground hover:bg-foreground/5'}`}
                            title="Archive/Save"
                        >
                            <svg className="w-5 h-5" fill={selectedMessage.is_saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                        </button>
                        <button 
                            onClick={() => handleDelete(selectedMessage.id)}
                            className="p-2 rounded-md text-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a2 2 0 00-1-1h-4a2 2 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8 pb-8 border-b border-card-border">
                            <h1 className="text-3xl font-bold text-foreground mb-4">{selectedMessage.name}</h1>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                                <div className="flex items-center gap-2 text-foreground/60">
                                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    <a href={`mailto:${selectedMessage.email}`} className="hover:text-foreground hover:underline decoration-accent/50">{selectedMessage.email}</a>
                                </div>
                                <div className="flex items-center gap-2 text-foreground/60">
                                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    <a href={`tel:${selectedMessage.phone}`} className="hover:text-foreground hover:underline decoration-accent/50">{selectedMessage.phone}</a>
                                </div>
                                <div className="flex items-center gap-2 text-foreground/40 ml-auto">
                                    <span className="text-xs uppercase tracking-widest">{new Date(selectedMessage.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-sm md:prose-base prose-headings:text-foreground prose-p:text-foreground/80 max-w-none">
                            <p className="whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-foreground/20 p-8">
                <svg className="w-24 h-24 mb-4 stroke-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7.171-4.166a2 2 0 012.22 0l7.171 4.166A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"></path></svg>
                <span className="text-lg font-medium">Select a message to read</span>
            </div>
        )}
      </div>
    </div>
  )
}