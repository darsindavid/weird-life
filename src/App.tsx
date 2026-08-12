import { useEffect, useRef, useState } from 'react'
import { DEFAULT_ENVIRONMENT } from './simulation/Environment'
import { World } from './simulation/World'
import './App.css'

const WORLD_WIDTH = 800
const WORLD_HEIGHT = 500

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worldRef = useRef<World | null>(null)

  const [running, setRunning] = useState(true)
  const [simulationSpeed, setSimulationSpeed] = useState(20)

  const [population, setPopulation] = useState(0)
  const [foodCount, setFoodCount] = useState(0)
  const [tick, setTick] = useState(0)
  const [births, setBirths] = useState(0)
  const [deaths, setDeaths] = useState(0)

  const [averageSpeed, setAverageSpeed] = useState(0)
  const [averageVision, setAverageVision] = useState(0)
  const [averageMetabolism, setAverageMetabolism] = useState(0)

  if (!worldRef.current) {
    worldRef.current = new World(DEFAULT_ENVIRONMENT, 50)
  }

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    let animationFrameId: number
    let lastSimulationTime = performance.now()

    const animate = (currentTime: number) => {
      const world = worldRef.current

      if (!world) {
        return
      }

      if (running) {
        const interval = 1000 / simulationSpeed

        if (currentTime - lastSimulationTime >= interval) {
          world.update()

          lastSimulationTime = currentTime

          setPopulation(world.blobs.length)
          setFoodCount(world.foods.length)
          setTick(world.tick)
          setBirths(world.births)
          setDeaths(world.deaths)

          setAverageSpeed(world.getAverageSpeed())
          setAverageVision(world.getAverageVision())
          setAverageMetabolism(world.getAverageMetabolism())
        }
      }

      context.clearRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT,
      )
      for (
  const region of world.environment.regions
) {
  if (region.type === 'meadow') {
    context.fillStyle = '#e8f5e9'
  } else if (region.type === 'barren') {
    context.fillStyle = '#f5f5f5'
  } else {
    context.fillStyle = '#e8f0f0'
  }

  context.fillRect(
    region.x,
    region.y,
    region.width,
    region.height,
  )
}
context.strokeStyle = '#cccccc'
context.lineWidth = 1

for (
  const region of world.environment.regions
) {
  context.strokeRect(
    region.x,
    region.y,
    region.width,
    region.height,
  )
}

      for (const food of world.foods) {
        context.beginPath()

        context.arc(
          food.x,
          food.y,
          3,
          0,
          Math.PI * 2,
        )

        context.fill()
      }

      for (const blob of world.blobs) {
  const radius = 4 + blob.genome.speed * 2

  const region = world.getRegionAt(
    blob.x,
    blob.y,
  )

  if (region?.type === 'swamp') {
    context.fillStyle = '#6b8e6b'
  } else if (region?.type === 'barren') {
    context.fillStyle = '#777777'
  } else {
    context.fillStyle = '#222222'
  }

  context.beginPath()

  context.arc(
    blob.x,
    blob.y,
    radius,
    0,
    Math.PI * 2,
  )

  context.fill()
}

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [running, simulationSpeed])

  const resetWorld = () => {
    const newWorld = new World(
      DEFAULT_ENVIRONMENT,
      50,
    )

    worldRef.current = newWorld

    setPopulation(newWorld.blobs.length)
    setFoodCount(newWorld.foods.length)
    setTick(newWorld.tick)
    setBirths(newWorld.births)
    setDeaths(newWorld.deaths)

    setAverageSpeed(newWorld.getAverageSpeed())
    setAverageVision(newWorld.getAverageVision())
    setAverageMetabolism(
      newWorld.getAverageMetabolism(),
    )
  }

  return (
    <main>
      <header>
        <div>
          <h1>Weird Life</h1>

          <p>
            A tiny world full of creatures
            with questionable decision-making.
          </p>
        </div>

        <div className="controls">
          <button
            onClick={() =>
              setRunning((value) => !value)
            }
          >
            {running ? 'Pause' : 'Run'}
          </button>

          <button onClick={resetWorld}>
            Reset
          </button>

          <label>
            Speed

            <input
              type="range"
              min="1"
              max="60"
              value={simulationSpeed}
              onChange={(event) =>
                setSimulationSpeed(
                  Number(event.target.value),
                )
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
          <strong>{tick}</strong>
          <span>Ticks</span>
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
          <strong>
            {averageSpeed.toFixed(2)}
          </strong>
        </div>

        <div>
          <span>Average vision</span>
          <strong>
            {averageVision.toFixed(0)}
          </strong>
        </div>

        <div>
          <span>Average metabolism</span>
          <strong>
            {averageMetabolism.toFixed(3)}
          </strong>
        </div>
      </section>
    </main>
  )
}

export default App