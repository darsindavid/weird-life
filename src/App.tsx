import { useEffect, useRef } from 'react'
import { World } from './simulation/World'
import './App.css'

const WORLD_WIDTH = 800
const WORLD_HEIGHT = 500

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const world = new World(WORLD_WIDTH, WORLD_HEIGHT, 50)

    let animationFrameId: number

    const animate = () => {
      world.update()

      context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

      for (const blob of world.blobs) {
        context.beginPath()
        context.arc(blob.x, blob.y, 5, 0, Math.PI * 2)
        context.fill()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <main>
      <h1>Weird Life</h1>

      <p>
        Something is probably evolving.
      </p>

      <canvas
        ref={canvasRef}
        width={WORLD_WIDTH}
        height={WORLD_HEIGHT}
      />
    </main>
  )
}

export default App