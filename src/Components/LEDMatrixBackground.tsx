"use client"

import { useEffect, useRef } from 'react'

export default function LEDMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // LED Matrix configuration - matching the reference image
    const pixelSize = 8 // Size of each LED pixel
    const spacing = 24 // Space between pixels
    const cols = Math.floor(canvas.width / spacing)
    const rows = Math.floor(canvas.height / spacing)
    
    // Matrix to store pixel states
    const matrix: boolean[][] = []
    const animationMatrix: number[][] = []

    // Initialize matrix with random pixels
    for (let i = 0; i < rows; i++) {
      matrix[i] = []
      animationMatrix[i] = []
      for (let j = 0; j < cols; j++) {
        // Randomly light up about 15% of pixels initially
        matrix[i][j] = Math.random() < 0.05
        animationMatrix[i][j] = Math.random() * 1000 // Random animation offset
      }
    }

    // Animation variables
    let animationId: number
    let time = 0

    const animate = () => {
      // Clear canvas with dark background
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.002 // Reduced from 0.005 to make it even slower

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          // Create subtle animation - pixels occasionally turn on/off
          const animationOffset = animationMatrix[i][j]
          const shouldAnimate = Math.sin(time + animationOffset) > 0.998 // Changed from 0.995 to 0.998 for much less frequent changes
          
          if (shouldAnimate) {
            matrix[i][j] = Math.random() < 0.005 // 20% chance to be lit when animating
          }

          // Draw pixel if it's lit
          if (matrix[i][j]) {
            const x = j * spacing + (spacing - pixelSize) / 2
            const y = i * spacing + (spacing - pixelSize) / 2

            // Draw the blue square pixel - matching the reference image color
            ctx.fillStyle = '#2563eb' // Bright blue color
            ctx.fillRect(x, y, pixelSize, pixelSize)
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

   setInterval(() => animate(), 2000)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#0a0a0a' }} // Very dark background to match reference
    />
  )
}
