'use client'

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import AOS from 'aos'
import 'aos/dist/aos.css' 

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    AOS.init({
      duration: 800,
      offset: 50,
      easing: 'ease-out-cubic',
      once: true,
    })
  }, [])

  return null
}