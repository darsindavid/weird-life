import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import { DEFAULT_ENVIRONMENT } from './simulation/Environment'
import { World } from './simulation/World'
import CreaturePanel from './CreaturePanel'
import './App.css'

const WORLD_WIDTH = 800
const WORLD_HEIGHT = 500

function App() {
  const canvasRef =
    useRef<HTMLCanvasElement>(null)

  const worldRef =
    useRef<World | null>(null)

  const [running, setRunning] =
    useState(true)

  const [simulationSpeed, setSimulationSpeed] =
    useState(20)

  const [population, setPopulation] =
    useState(0)

  const [foodCount, setFoodCount] =
    useState(0)

  const [tick, setTick] =
    useState(0)

  const [births, setBirths] =
    useState(0)

  const [deaths, setDeaths] =
    useState(0)

  const [averageSpeed, setAverageSpeed] =
    useState(0)

  const [averageVision, setAverageVision] =
    useState(0)

  const [averageMetabolism, setAverageMetabolism] =
    useState(0)

  const [selectedBlobId, setSelectedBlobId] =
    useState<number | null>(null)

  if (!worldRef.current) {
    worldRef.current = new World(
      DEFAULT_ENVIRONMENT,
      50,
    )
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
    let lastSimulationTime =
      performance.now()

    const animate = (
      currentTime: number,
    ) => {
      const world = worldRef.current

      if (!world) {
        return
      }

      if (running) {
        const interval =
          1000 / simulationSpeed

        if (
          currentTime -
            lastSimulationTime >=
          interval
        ) {
          world.update()

          lastSimulationTime =
            currentTime

          setPopulation(
            world.blobs.length,
          )

          setFoodCount(
            world.foods.length,
          )

          setTick(world.tick)

          setBirths(world.births)

          setDeaths(world.deaths)

          setAverageSpeed(
            world.getAverageSpeed(),
          )

          setAverageVision(
            world.getAverageVision(),
          )

          setAverageMetabolism(
            world.getAverageMetabolism(),
          )
        }
      }

      context.clearRect(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT,
      )

      for (
        const region of
        world.environment.regions
      ) {
        if (
          region.type === 'meadow'
        ) {
          context.fillStyle =
            '#e8f5e9'
        } else if (
          region.type === 'barren'
        ) {
          context.fillStyle =
            '#f5f5f5'
        } else {
          context.fillStyle =
            '#e8f0f0'
        }

        context.fillRect(
          region.x,
          region.y,
          region.width,
          region.height,
        )
      }

      context.strokeStyle =
        '#cccccc'

      context.lineWidth = 1

      for (
        const region of
        world.environment.regions
      ) {
        context.strokeRect(
          region.x,
          region.y,
          region.width,
          region.height,
        )
      }

      for (const food of world.foods) {
        context.fillStyle =
          '#c8f7c5'

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
        const radius =
          4 +
          blob.genome.speed * 2

        const region =
          world.getRegionAt(
            blob.x,
            blob.y,
          )

        if (
          region?.type === 'swamp'
        ) {
          context.fillStyle =
            '#6b8e6b'
        } else if (
          region?.type === 'barren'
        ) {
          context.fillStyle =
            '#777777'
        } else {
          context.fillStyle =
            '#222222'
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

        if (
          blob.id ===
          selectedBlobId
        ) {
          context.beginPath()

          context.arc(
            blob.x,
            blob.y,
            radius + 5,
            0,
            Math.PI * 2,
          )

          context.strokeStyle =
            '#ff6b00'

          context.lineWidth = 3

          context.stroke()
        }
      }

      animationFrameId =
        requestAnimationFrame(
          animate,
        )
    }

    animationFrameId =
      requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(
        animationFrameId,
      )
    }
  }, [
    running,
    simulationSpeed,
    selectedBlobId,
  ])

  const handleCanvasClick = (
    event: MouseEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const rect =
      canvas.getBoundingClientRect()

    const scaleX =
      WORLD_WIDTH / rect.width

    const scaleY =
      WORLD_HEIGHT / rect.height

    const x =
      (event.clientX - rect.left) *
      scaleX

    const y =
      (event.clientY - rect.top) *
      scaleY

    const world = worldRef.current

    if (!world) {
      return
    }

    let closestBlobId:
      number | null = null

    let closestDistance =
      Infinity

    for (const blob of world.blobs) {
      const dx = blob.x - x
      const dy = blob.y - y

      const distance =
        Math.sqrt(
          dx * dx +
          dy * dy,
        )

      if (
        distance < 14 &&
        distance <
          closestDistance
      ) {
        closestDistance =
          distance

        closestBlobId =
          blob.id
      }
    }

    setSelectedBlobId(
      closestBlobId,
    )
  }

  const resetWorld = () => {
    const newWorld =
      new World(
        DEFAULT_ENVIRONMENT,
        50,
      )

    worldRef.current =
      newWorld

    setSelectedBlobId(null)

    setPopulation(
      newWorld.blobs.length,
    )

    setFoodCount(
      newWorld.foods.length,
    )

    setTick(newWorld.tick)

    setBirths(newWorld.births)

    setDeaths(newWorld.deaths)

    setAverageSpeed(
      newWorld.getAverageSpeed(),
    )

    setAverageVision(
      newWorld.getAverageVision(),
    )

    setAverageMetabolism(
      newWorld.getAverageMetabolism(),
    )
  }

  const selectedBlob =
    selectedBlobId === null
      ? null
      : worldRef.current?.getBlobById(
          selectedBlobId,
        ) ?? null

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-group">
          <div
            className="brand-mark"
            aria-hidden="true"
          >
            W
          </div>

          <div className="brand-text">
            <span className="app-name">
              Weird Life
            </span>
          </div>
        </div>

        <div className="header-status">
          <div
            className="status-pill"
            aria-live="polite"
          >
            <span
              className={
                running
                  ? 'status-dot is-running'
                  : 'status-dot is-paused'
              }
              aria-hidden="true"
            />
            <span>
              {running
                ? 'Running'
                : 'Paused'}
            </span>
          </div>

          <div
            className="meta-pill"
            title="How long the world has been running in simulation ticks."
          >
            <span>World age</span>
            <strong>{tick}</strong>
          </div>
        </div>

        <div className="header-controls">
          <button
            type="button"
            className="control-button primary"
            onClick={() =>
              setRunning(
                (value) => !value,
              )
            }
          >
            {running ? 'Pause' : 'Run'}
          </button>

          <button
            type="button"
            className="control-button secondary"
            onClick={resetWorld}
          >
            Reset
          </button>

          <label className="speed-control">
            <span>Speed</span>

            <div className="speed-row">
              <input
                type="range"
                min="1"
                max="60"
                value={simulationSpeed}
                onChange={(event) =>
                  setSimulationSpeed(
                    Number(
                      event.target.value,
                    ),
                  )
                }
                aria-label="Simulation speed"
              />

              <output>
                {simulationSpeed} TPS
              </output>
            </div>
          </label>
        </div>
      </header>

      <div className="workspace-shell">
        <section
          className="viewport-column"
          aria-labelledby="world-heading"
        >
          <div className="viewport-topbar">
            <div>
              <span className="section-tag">
                Observation
              </span>

              <h2 id="world-heading">
                The World
              </h2>
            </div>

            <p className="viewport-note">
              Everything appears to be going
              normally. Probably.
            </p>
          </div>

          <div
            className="telemetry-bar"
            aria-label="Simulation telemetry"
          >
            <div
              className="telemetry-item"
              title="The number of creatures currently alive in the world."
            >
              <span>Creatures alive</span>
              <strong>{population}</strong>
            </div>

            <div
              className="telemetry-item"
              title="The amount of food available across the world."
            >
              <span>Food available</span>
              <strong>{foodCount}</strong>
            </div>

            <div
              className="telemetry-item"
              title="How long the world has been running in simulation ticks."
            >
              <span>World age</span>
              <strong>{tick}</strong>
            </div>

            <div
              className="telemetry-item"
              title="How many creatures have been born since the simulation started."
            >
              <span>Births</span>
              <strong>{births}</strong>
            </div>

            <div
              className="telemetry-item"
              title="How many creatures have died since the simulation started."
            >
              <span>Deaths</span>
              <strong>{deaths}</strong>
            </div>
          </div>

          <div className="canvas-shell">
            <canvas
              ref={canvasRef}
              width={WORLD_WIDTH}
              height={WORLD_HEIGHT}
              onClick={handleCanvasClick}
              aria-label="Simulation world canvas"
            />
          </div>

          <div
            className="traits-panel"
            aria-labelledby="traits-title"
          >
            <div className="traits-header">
              <h3 id="traits-title">
                Population traits
              </h3>

              <span className="mini-label">
                Live averages
              </span>
            </div>

            <div className="traits-list">
              <div
                className="trait-item"
                title="Movement speed = how quickly creatures can move."
              >
                <span>Movement speed</span>
                <strong>
                  {averageSpeed.toFixed(2)}
                </strong>
              </div>

              <div
                className="trait-item"
                title="Food detection range = how far creatures can detect food."
              >
                <span>Food detection</span>
                <strong>
                  {averageVision.toFixed(0)}
                </strong>
              </div>

              <div
                className="trait-item"
                title="Energy use = energy consumed each simulation step."
              >
                <span>Energy use</span>
                <strong>
                  {averageMetabolism.toFixed(3)}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <aside className="inspector-column">
          {selectedBlob ? (
            <CreaturePanel
              blob={selectedBlob}
              onClose={() =>
                setSelectedBlobId(null)
              }
            />
          ) : (
            <div className="empty-state">
              <span className="section-tag">
                Inspector
              </span>

              <h3>Select a creature</h3>

              <p>
                Click any creature in the world to
                inspect its traits and lineage.
              </p>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}

export default App