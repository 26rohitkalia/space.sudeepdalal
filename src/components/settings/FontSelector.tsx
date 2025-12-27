'use client'

import { useState, useRef, useEffect } from 'react'
import { FONTS } from '@/app/settings/constants'

interface Props {
  currentFont: string
  onChange: (fontName: string) => void
}

export default function FontSelector({ currentFont, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [openDirection, setOpenDirection] = useState<'down' | 'up'>('down')
  const dropdownRef = useRef<HTMLDivElement>(null)

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
        if (spaceBelow < 320) {
            setOpenDirection('up')
        } else {
            setOpenDirection('down')
        }
    }
    setIsOpen(!isOpen)
  }

  return (
    // DYNAMIC Z-INDEX HERE
    <div className={`relative ${isOpen ? 'z-[60]' : 'z-30'}`} ref={dropdownRef}>
      <label className="block text-xs font-bold text-foreground/40 uppercase tracking-widest mb-4">Typography</label>
      
      <input type="hidden" name="font_family" value={currentFont} />
      
      <button 
        type="button"
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-4 rounded-xl border border-card-border bg-background text-foreground hover:bg-card-bg transition-colors shadow-sm cursor-pointer"
      >
        <div className="flex flex-col items-start text-left">
            <span className="text-sm font-bold truncate pr-4">{currentFont}</span>
            <span className="text-[10px] text-foreground/50 uppercase tracking-wider">
                {FONTS.find(f => f.name === currentFont)?.type || 'Custom'}
            </span>
        </div>
        <svg className={`w-4 h-4 text-foreground/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div 
            onWheel={(e) => e.stopPropagation()} 
            className={`absolute z-[100] w-full bg-card-bg border border-card-border rounded-xl shadow-2xl max-h-72 overflow-y-auto overscroll-contain custom-scrollbar p-2 ${openDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}`}
        >
            {FONTS.map((font) => (
                <button
                    key={font.name}
                    type="button"
                    onClick={() => {
                        onChange(font.name)
                        setIsOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg flex justify-between items-center transition-colors group mb-1 cursor-pointer ${currentFont === font.name ? 'bg-accent text-accent-foreground' : 'hover:bg-foreground/5 text-foreground'}`}
                >
                    <div className="flex-1 min-w-0 pr-2">
                        <span className="block text-sm font-medium truncate" style={{ fontFamily: font.name !== 'Custom' ? `"${font.name}", sans-serif` : 'inherit' }}>
                            {font.name}
                        </span>
                        <span className={`text-[9px] uppercase tracking-widest opacity-60 ${currentFont === font.name ? 'text-accent-foreground' : 'text-foreground/40'}`}>
                            {font.type}
                        </span>
                    </div>
                    {currentFont === font.name && (
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    )}
                </button>
            ))}
        </div>
      )}

      {currentFont === 'Custom' && (
        <div className="bg-background/50 p-4 mt-4 rounded-xl border border-card-border border-dashed animate-in fade-in slide-in-from-top-2">
            <label className="block text-[10px] font-bold text-foreground/40 uppercase mb-2">Upload Font File (.ttf / .woff2)</label>
            <input type="file" name="custom_font_file" accept=".ttf,.otf,.woff,.woff2" className="text-xs w-full text-foreground" />
            <p className="text-[10px] text-foreground/40 mt-2">Note: Custom fonts won't appear in preview until saved.</p>
        </div>
      )}
    </div>
  )
}