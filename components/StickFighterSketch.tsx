'use client'

import { useEffect, useRef } from 'react'

export default function StickFighterSketch() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameLoadedRef = useRef(false)

  useEffect(() => {
    if (gameLoadedRef.current || !containerRef.current) return
    gameLoadedRef.current = true

    const initGame = async () => {
      // Step 1: Load Supabase
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
        if (document.querySelector('script[src="/stick-fighter/sketch.js"]')) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = '/stick-fighter/sketch.js'
        script.onload = () => {
          // Wait for functions to be defined
          setTimeout(resolve, 100)
        }
        script.onerror = () => {
          console.error('Failed to load sketch.js')
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
          setTimeout(resolve, 200)
        }
        script.onerror = () => resolve()
        document.head.appendChild(script)
      })
    }

    initGame()

    return () => {
      // Cleanup handled by p5.js
    }
  }, [])

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
