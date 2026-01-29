'use client'

import { useEffect, useRef } from 'react'

interface P5SketchProps {
  sketchPath: string
}

export default function P5Sketch({ sketchPath }: P5SketchProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current || !containerRef.current) return
    
    // Check if already loaded for this sketch
    const sketchName = sketchPath.includes('stick-fighter') ? 'stickFighter' : 'stickShooter'
    if ((window as any)[`${sketchName}Loaded`]) return
    
    loadedRef.current = true
    ;(window as any)[`${sketchName}Loaded`] = true

    const loadEverything = async () => {
      // Step 1: Load Supabase (doesn't matter when)
      if (!(window as any).supabase) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
          script.onload = () => resolve()
          script.onerror = () => resolve()
          document.head.appendChild(script)
        })
      }

      // Step 2: Load sketch.js FIRST (defines setup() and draw())
      await new Promise<void>((resolve) => {
        if (document.querySelector(`script[src="${sketchPath}"]`)) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = sketchPath
        script.onload = () => {
          // Wait a moment for functions to be defined
          setTimeout(resolve, 100)
        }
        script.onerror = () => {
          console.error(`Failed to load sketch: ${sketchPath}`)
          resolve()
        }
        document.body.appendChild(script)
      })

      // Step 3: Load p5.js LAST (it will find setup() and draw())
      await new Promise<void>((resolve) => {
        if ((window as any).p5) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js'
        script.onload = () => {
          setTimeout(resolve, 100)
        }
        script.onerror = () => resolve()
        document.head.appendChild(script)
      })
    }

    loadEverything()

    return () => {
      // Don't cleanup - let scripts stay loaded
    }
  }, [sketchPath])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#FFFFFF'
      }}
    />
  )
}
