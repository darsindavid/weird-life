import { useEffect, useRef, useState } from 'react'
import { World } from './simulation/World'
import './App.css'

const WORLD_WIDTH = 800
const WORLD_HEIGHT = 500
const SIMULATION_TPS = 20

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [running, setRunning] = useState(true)
  const [simulationSpeed, setSimulationSpeed] = useState(20)

  const [population, setPopulation] = useState(0)
  const [foodCount, setFoodCount] = useState(0)
  const [generation, setGeneration] = useState(0)
  const [births, setBirths] = useState(0)
  const [deaths, setDeaths] = useState(0)

  const [averageSpeed, setAverageSpeed] = useState(0)
  const [averageVision, setAverageVision] = useState(0)
  const [averageMetabolism, setAverageMetabolism] = useState(0)

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

    const animate = (currentTime: number) => {
      if (running) {
        const simulationInterval = 1000 / simulationSpeed

        if (currentTime - lastSimulationTime >= simulationInterval) {
          world.update()
          lastSimulationTime = currentTime

          setPopulation(world.blobs.length)
          setFoodCount(world.foods.length)
          setGeneration(world.generation)
          setBirths(world.births)
          setDeaths(world.deaths)

          setAverageSpeed(world.getAverageSpeed())
          setAverageVision(world.getAverageVision())
          setAverageMetabolism(world.getAverageMetabolism())
        }
      }

      context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT)

      for (const food of world.foods) {
        context.beginPath()
        context.arc(food.x, food.y, 3, 0, Math.PI * 2)
        context.fill()
      }

      for (const blob of world.blobs) {
        const radius = 4 + blob.genome.speed * 2

        context.beginPath()
        context.arc(blob.x, blob.y, radius, 0, Math.PI * 2)
        context.fill()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [running, simulationSpeed])

  return (
    <main>
      <header>
        <div>
          <h1>Weird Life</h1>
          <p>
            A tiny world full of creatures with questionable
            decision-making.
          </p>
        </div>

        <div className="controls">
          <button onClick={() => setRunning((value) => !value)}>
            {running ? 'Pause' : 'Run'}
          </button>

          <label>
            Speed
            <input
              type="range"
              min="1"
              max="60"
              value={simulationSpeed}
              onChange={(event) =>
                setSimulationSpeed(Number(event.target.value))
              }
            />
            {simulationSpeed} TPS
          </label>
        </div>
      </header>

      <section className="stats">
        <div>
          <strong>{population}</strong>
          <span>Population</span>
        </div>

        <div>
          <strong>{foodCount}</strong>
          <span>Food</span>
        </div>

        <div>
          <strong>{generation}</strong>
          <span>Generation</span>
        </div>

        <div>
          <strong>{births}</strong>
          <span>Births</span>
        </div>

        <div>
          <strong>{deaths}</strong>
          <span>Deaths</span>
        </div>
      </section>

      <canvas
        ref={canvasRef}
        width={WORLD_WIDTH}
        height={WORLD_HEIGHT}
      />

      <section className="traits">
        <h2>Population Traits</h2>

        <div>
          <span>Average speed</span>
          <strong>{averageSpeed.toFixed(2)}</strong>
        </div>

        <div>
          <span>Average vision</span>
          <strong>{averageVision.toFixed(0)}</strong>
        </div>

        <div>
          <span>Average metabolism</span>
          <strong>{averageMetabolism.toFixed(3)}</strong>
        </div>
      </section>
    </main>
  )
}

export default App