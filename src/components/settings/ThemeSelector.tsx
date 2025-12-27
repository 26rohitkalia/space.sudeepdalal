'use client'

import { useState, useRef, useEffect } from 'react'
import { THEMES } from '@/app/settings/constants'

interface Props {
  currentTheme: string
  onChange: (themeId: string) => void
}

export default function ThemeSelector({ currentTheme, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [openDirection, setOpenDirection] = useState<'down' | 'up'>('down')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedTheme = THEMES.find(t => t.id === currentTheme) || THEMES[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
    return () => {
        document.body.style.overflow = ''
    }
  }, [isOpen])

  const toggleOpen = () => {
    if (!isOpen && dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        if (spaceBelow < 400) {
            setOpenDirection('up')
        } else {
            setOpenDirection('down')
        }
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className={`relative ${isOpen ? 'z-[60]' : 'z-40'}`} ref={dropdownRef}>
      <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-4">Select Theme</label>
      <input type="hidden" name="theme" value={currentTheme} />

      <button 
        type="button"
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-2 pl-4 rounded-xl border border-card-border bg-background text-foreground hover:bg-card-bg transition-colors shadow-sm cursor-pointer"
      >
        <div className="flex items-center gap-4">
            <div className="flex gap-1">
                <div className="w-4 h-4 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: selectedTheme.colors.bg }}></div>
                <div className="w-4 h-4 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: selectedTheme.colors.accent }}></div>
            </div>
            <span className="text-sm font-bold">{selectedTheme.name}</span>
        </div>
        <div className="p-2">
            <svg className={`w-4 h-4 text-foreground/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </button>

      {isOpen && (
        <div 
            onWheel={(e) => e.stopPropagation()} 
            className={`absolute left-0 right-0 z-[100] bg-card-bg border border-card-border rounded-xl shadow-2xl max-h-[400px] overflow-y-auto overscroll-contain custom-scrollbar p-4 ${openDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
        >
          <div className="grid grid-cols-2 gap-4">
            {THEMES.map((t) => (
            <label 
                key={t.id} 
                className={`cursor-pointer relative group transition-all duration-300 transform ${currentTheme === t.id ? 'scale-105 ring-2 ring-accent' : 'hover:scale-102 opacity-80 hover:opacity-100'}`}
                onClick={() => {
                    setTimeout(() => setIsOpen(false), 150)
                }}
            >
                <input 
                    type="radio" 
                    name="theme_selector_ui"
                    value={t.id} 
                    checked={currentTheme === t.id} 
                    onChange={() => onChange(t.id)} 
                    className="hidden" 
                />
                
                <div 
                    className={`rounded-xl overflow-hidden border h-24 flex flex-col shadow-sm ${t.extra || ''}`}
                    style={{ 
                        backgroundColor: t.colors.bg, 
                        borderColor: t.colors.border 
                    }}
                >
                    <div className="h-6 w-full flex items-center px-2 gap-1.5" style={{ backgroundColor: t.colors.accent }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                    </div>
                    
                    <div className="p-3 flex flex-col justify-between h-full">
                        <div className="w-16 h-1 rounded" style={{ backgroundColor: t.colors.border }}></div>
                        <div className="space-y-1">
                            <div className="w-full h-1 rounded opacity-20" style={{ backgroundColor: t.colors.fg }}></div>
                            <div className="w-2/3 h-1 rounded opacity-20" style={{ backgroundColor: t.colors.fg }}></div>
                        </div>
                        <span 
                            className="text-[10px] font-bold mt-1 self-end" 
                            style={{ color: t.colors.fg, fontFamily: t.font || 'inherit' }}
                        >
                            {t.name}
                        </span>
                    </div>
                </div>
            </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}