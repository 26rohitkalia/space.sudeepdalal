'use client'

import { motion } from 'framer-motion'
import { cn } from '@/utils/cn' 

interface Props {
  headline: string
  subHeadline: string
  isVisible: boolean
}

export default function HeroText({ headline, subHeadline, isVisible }: Props) {
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, 
        delayChildren: 0.5,    
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  }

  const item = {
    hidden: { 
      y: 40, 
      opacity: 0, 
      filter: 'blur(10px)',
      scale: 0.95
    },
    show: { 
      y: 0, 
      opacity: 1, 
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  }

  const line = {
    hidden: { width: 0, opacity: 0 },
    show: { 
      width: 64, 
      opacity: 0.8,
      transition: { duration: 1, ease: 'circOut' }
    }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate={isVisible ? "show" : "hidden"}
      className="absolute bottom-12 left-10 right-10 flex flex-col justify-end z-20"
    >
      <motion.div variants={item}>
        <h1 
          className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-6 leading-[0.9]"
          dangerouslySetInnerHTML={{ __html: headline }}
        />
      </motion.div>

      <motion.div 
        variants={line} 
        className="h-1.5 bg-white rounded-full mb-6 opacity-80"
      />
      
      <motion.div variants={item}>
        <div 
          className="text-gray-300 text-lg font-light leading-relaxed border-l border-white/40 pl-5 backdrop-blur-sm"
          dangerouslySetInnerHTML={{ __html: subHeadline }}
        />
      </motion.div>

    </motion.div>
  )
}