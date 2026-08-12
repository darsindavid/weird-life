import { useEffect, useRef, useState } from 'react'
import { World } from './simulation/World'
import './App.css'

const WORLD_WIDTH = 800
const WORLD_HEIGHT = 500
const SIMULATION_TPS = 20

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [population, setPopulation] = useState(0)
  const [foodCount, setFoodCount] = useState(0)

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
    let lastSimulationTime = performance.now()

    const simulationInterval = 1000 / SIMULATION_TPS

    const animate = (currentTime: number) => {
      if (currentTime - lastSimulationTime >= simulationInterval) {
        world.update()
        lastSimulationTime = currentTime

        setPopulation(world.blobs.length)
        setFoodCount(world.foods.length)
      }

      context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

      for (const food of world.foods) {
        context.beginPath()
        context.arc(food.x, food.y, 3, 0, Math.PI * 2)
        context.fill()
      }

      for (const blob of world.blobs) {
        context.beginPath()
        context.arc(blob.x, blob.y, 6, 0, Math.PI * 2)
        context.fill()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <main>
      <section className="header">
        <div>
          <h1>Weird Life</h1>
          <p>A tiny world full of creatures with questionable decision-making.</p>
        </div>

        <div className="stats">
          <span>Population: {population}</span>
          <span>Food: {foodCount}</span>
        </div>
      </section>

      <canvas
        ref={canvasRef}
        width={WORLD_WIDTH}
        height={WORLD_HEIGHT}
      />
    </main>
  )
}

export default App