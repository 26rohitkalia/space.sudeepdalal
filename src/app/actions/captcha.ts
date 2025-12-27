'use server'

import { createHmac, randomInt } from 'crypto'

const SECRET = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'default-secret-key'

const randomColor = (min = 50, max = 150) => {
  const r = randomInt(min, max)
  const g = randomInt(min, max)
  const b = randomInt(min, max)
  return `rgb(${r},${g},${b})`
}

export async function getNewCaptcha() {
  const width = 200
  const height = 60
  const charCount = 5
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' 
  let text = ''
  
  let svgContent = ''

  for (let i = 0; i < 7; i++) {
    svgContent += `<line x1="${randomInt(0, width)}" y1="${randomInt(0, height)}" x2="${randomInt(0, width)}" y2="${randomInt(0, height)}" stroke="${randomColor(180, 220)}" stroke-width="${randomInt(1, 3)}" />`
  }

  for (let i = 0; i < charCount; i++) {
    const char = chars[randomInt(0, chars.length)]
    text += char
    
    const x = 20 + (i * 35) + randomInt(-5, 5)
    const y = 40 + randomInt(-5, 5)
    const rot = randomInt(-20, 20)
    const fontSize = randomInt(35, 45)
    
    svgContent += `<text x="${x}" y="${y}" 
      transform="rotate(${rot}, ${x}, ${y})" 
      fill="${randomColor()}" 
      font-family="Arial, sans-serif" 
      font-size="${fontSize}px" 
      font-weight="bold"
      style="user-select: none;">${char}</text>`
  }

  for (let i = 0; i < 30; i++) {
    svgContent += `<circle cx="${randomInt(0, width)}" cy="${randomInt(0, height)}" r="${randomInt(1, 3)}" fill="${randomColor(150, 200)}" opacity="0.5" />`
  }

  const svg = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" style="background-color: #f4f4f5; border-radius: 8px;">${svgContent}</svg>`

  const signature = createHmac('sha256', SECRET)
    .update(text.toLowerCase())
    .digest('hex')

  return {
    svg,
    signature
  }
}

export async function verifyCaptchaToken(answer: string, signature: string) {
  if (!answer || !signature) return false
  
  const expected = createHmac('sha256', SECRET)
    .update(answer.trim().toLowerCase())
    .digest('hex')
    
  return expected === signature
}