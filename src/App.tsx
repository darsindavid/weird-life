import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from 'react'

import CreaturePanel from './CreaturePanel'
import HistoryPanel from './HistoryPanel'
import HistoricalCreaturePanel from './HistoricalCreaturePanel'

import type {
  BlobSnapshot,
  WorldSnapshot,
} from './simulation/SimulationSnapshot'

import './App.css'

const WORLD_WIDTH = 800
const WORLD_HEIGHT = 500

type WorkerResponse =
  | {
      type: 'snapshot'
      snapshot: WorldSnapshot
    }
  | {
      type: 'selection'
      blob: BlobSnapshot | null
    }

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const workerRef = useRef<Worker | null>(null)
  const latestSnapshotRef = useRef<WorldSnapshot | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const [running, setRunning] = useState(true)
  const [simulationSpeed, setSimulationSpeed] = useState(20)
  const [snapshot, setSnapshot] = useState<WorldSnapshot | null>(null)

  const [selectedBlobId, setSelectedBlobId] =
    useState<number | null>(null)

  const [selectedHistoryId, setSelectedHistoryId] =
    useState<number | null>(null)

  useEffect(() => {
    const worker = new Worker(
      new URL(
        './simulation/simulation.worker.ts',
        import.meta.url,
      ),
      {
        type: 'module',
      },
    )

    workerRef.current = worker

    const handleMessage = (
      event: MessageEvent<WorkerResponse>,
    ) => {
      const message = event.data

      if (message.type === 'snapshot') {
        latestSnapshotRef.current = message.snapshot
        setSnapshot(message.snapshot)
      }
    }

    worker.addEventListener(
      'message',
      handleMessage,
    )

    return () => {
      worker.removeEventListener(
        'message',
        handleMessage,
      )

      worker.terminate()
      workerRef.current = null
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const render = () => {
      const currentSnapshot =
        latestSnapshotRef.current

      if (currentSnapshot) {
        renderWorld(
          context,
          currentSnapshot,
          selectedBlobId,
        )
      }

      animationFrameRef.current =
        requestAnimationFrame(render)
    }

    animationFrameRef.current =
      requestAnimationFrame(render)

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(
          animationFrameRef.current,
        )
      }
    }
  }, [selectedBlobId])

  const sendWorkerMessage = (
    message:
      | {
          type: 'start'
          speed: number
        }
      | {
          type: 'pause'
        }
      | {
          type: 'set-speed'
          speed: number
        }
      | {
          type: 'reset'
        },
  ) => {
    workerRef.current?.postMessage(message)
  }

  const toggleRunning = () => {
    const nextRunning = !running

    setRunning(nextRunning)

    if (nextRunning) {
      sendWorkerMessage({
        type: 'start',
        speed: simulationSpeed,
      })
    } else {
      sendWorkerMessage({
        type: 'pause',
      })
    }
  }

  const handleSpeedChange = (speed: number) => {
    setSimulationSpeed(speed)

    sendWorkerMessage({
      type: 'set-speed',
      speed,
    })
  }

  const resetWorld = () => {
    setSelectedBlobId(null)
    setSelectedHistoryId(null)

    sendWorkerMessage({
      type: 'reset',
    })
  }

  const handleCanvasClick = (
    event: MouseEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current
    const currentSnapshot =
      latestSnapshotRef.current

    if (!canvas || !currentSnapshot) {
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

    let closestBlobId: number | null = null
    let closestDistance = Infinity

    for (const blob of currentSnapshot.blobs) {
      const dx = blob.x - x
      const dy = blob.y - y

      const distance = Math.sqrt(
        dx * dx + dy * dy,
      )

      const radius =
        4 + blob.genome.speed * 2

      const hitRadius =
        Math.max(14, radius + 6)

      if (
        distance < hitRadius &&
        distance < closestDistance
      ) {
        closestDistance = distance
        closestBlobId = blob.id
      }
    }

    setSelectedHistoryId(null)
    setSelectedBlobId(closestBlobId)
  }

  const population =
    snapshot?.blobs.length ?? 0

  const foodCount =
    snapshot?.foods.length ?? 0

  const tick =
    snapshot?.tick ?? 0

  const births =
    snapshot?.births ?? 0

  const deaths =
    snapshot?.deaths ?? 0

  const averageSpeed =
    snapshot?.averageSpeed ?? 0

  const averageVision =
    snapshot?.averageVision ?? 0

  const averageMetabolism =
    snapshot?.averageMetabolism ?? 0

  const history =
    snapshot?.history ?? []

  const handleHistorySelect = (id: number) => {
    const record = history.find(
      (item) => item.id === id,
    )

    if (!record) {
      return
    }

    setSelectedHistoryId(id)

    const liveBlob =
      snapshot?.blobs.find(
        (blob) => blob.id === id,
      )

    if (liveBlob) {
      setSelectedBlobId(id)
    } else {
      setSelectedBlobId(null)
    }
  }

  const selectedBlob =
    selectedBlobId === null ||
    snapshot === null
      ? null
      : snapshot.blobs.find(
          (blob) =>
            blob.id === selectedBlobId,
        ) ?? null

  const selectedHistoryRecord =
    selectedHistoryId === null
      ? null
      : history.find(
          (record) =>
            record.id === selectedHistoryId,
        ) ?? null

  const clearInspector = () => {
    setSelectedBlobId(null)
    setSelectedHistoryId(null)
  }

  return (
    <main className="app-shell">
      {/* ───────────────── HEADER ───────────────── */}

      <header className="app-header">
        <div className="brand">
          <div
            className="brand-mark"
            aria-hidden="true"
          >
            W
          </div>

          <div className="brand-copy">
            <strong>Weird Life</strong>
            <span>Artificial ecosystem</span>
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
                ? 'Simulation running'
                : 'Simulation paused'}
            </span>
          </div>

          <div
            className="meta-pill"
            title="How many simulation steps have passed since the world was created."
          >
            <span>World age</span>
            <strong>
              {tick.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="header-controls">
          <button
            type="button"
            className="control-button primary"
            onClick={toggleRunning}
            aria-label={
              running
                ? 'Pause simulation'
                : 'Resume simulation'
            }
          >
            <span aria-hidden="true">
              {running ? 'Ⅱ' : '▶'}
            </span>

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
            <span className="speed-label">
              Simulation speed
            </span>

            <div className="speed-slider-row">
              <span className="speed-min">
                Slow
              </span>

              <input
                type="range"
                min="1"
                max="60"
                value={simulationSpeed}
                onChange={(event) =>
                  handleSpeedChange(
                    Number(event.target.value),
                  )
                }
                aria-label="Simulation speed"
              />

              <span className="speed-max">
                Fast
              </span>
            </div>

            <strong>
              {simulationSpeed} steps / sec
            </strong>
          </label>
        </div>
      </header>

      {/* ───────────────── MAIN WORKSPACE ───────────────── */}

      <div className="workspace">
        {/* ───────────── WORLD COLUMN ───────────── */}

        <section
          className="viewport-column"
          aria-labelledby="world-heading"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                OBSERVATION DECK
              </span>

              <h1 id="world-heading">
                The World
              </h1>
            </div>

            <p>
              Creatures search for food,
              spend energy, reproduce, and
              pass traits to their offspring.
            </p>
          </div>

          {/* TELEMETRY */}

          <div
            className="telemetry-bar"
            aria-label="Simulation telemetry"
          >
            <div
              className="telemetry-item"
              title="The number of creatures currently alive."
            >
              <span>Creatures alive</span>
              <strong>{population}</strong>
            </div>

            <div
              className="telemetry-item"
              title="The number of food items currently available."
            >
              <span>Food available</span>
              <strong>{foodCount}</strong>
            </div>

            <div
              className="telemetry-item"
              title="How many simulation steps have passed."
            >
              <span>World age</span>
              <strong>
                {tick.toLocaleString()}
              </strong>
            </div>

            <div
              className="telemetry-item"
              title="Total creatures born since the simulation began."
            >
              <span>Births</span>
              <strong>{births}</strong>
            </div>

            <div
              className="telemetry-item"
              title="Total creatures that have died since the simulation began."
            >
              <span>Deaths</span>
              <strong>{deaths}</strong>
            </div>
          </div>

          {/* WORLD VIEWPORT */}

          <div className="canvas-frame">
            <canvas
              ref={canvasRef}
              width={WORLD_WIDTH}
              height={WORLD_HEIGHT}
              onClick={handleCanvasClick}
              aria-label="Interactive simulation world. Click a creature to inspect it."
            />

            <div className="canvas-overlay">
              <div className="world-legend">
                <span className="legend-item">
                  <span className="legend-dot creature-dot" />
                  Creature
                </span>

                <span className="legend-item">
                  <span className="legend-dot food-dot" />
                  Food
                </span>

                <span className="legend-item">
                  <span className="legend-dot selected-dot" />
                  Selected
                </span>
              </div>

              {!selectedBlob && (
                <div className="canvas-hint">
                  Click a creature to inspect
                </div>
              )}
            </div>
          </div>

          {/* TERRAIN KEY */}

          <div className="world-key">
            <span>
              <i className="region-swatch meadow-swatch" />
              Meadow
            </span>

            <span>
              <i className="region-swatch barren-swatch" />
              Barren
            </span>

            <span>
              <i className="region-swatch swamp-swatch" />
              Swamp
            </span>

            <span className="world-key-note">
              Terrain affects how much energy
              creatures spend moving.
            </span>
          </div>

          {/* LIVE POPULATION */}

          <section
            className="traits-panel"
            aria-labelledby="traits-title"
          >
            <div className="traits-heading">
              <div>
                <span className="eyebrow">
                  POPULATION
                </span>

                <h2 id="traits-title">
                  Live traits
                </h2>
              </div>

              <span className="muted-label">
                Average across living creatures
              </span>
            </div>

            <div className="trait-grid">
              <div
                className="trait-item"
                title="How quickly creatures can move."
              >
                <span>
                  Movement speed
                </span>

                <strong>
                  {averageSpeed.toFixed(2)}
                </strong>

                <small>
                  How quickly they can move
                </small>
              </div>

              <div
                className="trait-item"
                title="How far creatures can detect nearby food."
              >
                <span>
                  Food detection
                </span>

                <strong>
                  {averageVision.toFixed(0)}
                </strong>

                <small>
                  Sensing range
                </small>
              </div>

              <div
                className="trait-item"
                title="Baseline energy consumed by creatures each simulation step."
              >
                <span>
                  Energy use
                </span>

                <strong>
                  {averageMetabolism.toFixed(3)}
                </strong>

                <small>
                  Energy per step
                </small>
              </div>
            </div>
          </section>

          {/* HISTORY */}

          <section className="history-section">
            <div className="history-section-heading">
              <div>
                <span className="eyebrow">
                  ARCHIVE
                </span>

                <h2>
                  Creature history
                </h2>
              </div>

              <span className="history-count">
                {history.length.toLocaleString()}
                {' '}records
              </span>
            </div>

            <HistoryPanel
              records={history}
              selectedId={selectedHistoryId}
              onSelect={handleHistorySelect}
            />
          </section>
        </section>

        {/* ───────────── INSPECTOR COLUMN ───────────── */}

        <aside
          className="inspector-column"
          aria-label="Creature inspector"
        >
          <div className="inspector-shell">
            {selectedBlob ? (
              <CreaturePanel
                blob={selectedBlob}
                onClose={clearInspector}
              />
            ) : selectedHistoryRecord ? (
              <HistoricalCreaturePanel
                record={selectedHistoryRecord}
                onClose={clearInspector}
              />
            ) : (
              <div className="inspector-empty">
                <div className="inspector-empty-top">
                  <span className="eyebrow">
                    INSPECTOR
                  </span>

                  <span className="inspector-empty-index">
                    01
                  </span>
                </div>

                <div className="empty-icon">
                  ○
                </div>

                <h2>
                  Select a creature
                </h2>

                <p>
                  Click a creature in the
                  simulation or choose one
                  from the archive to inspect
                  its life, traits, and lineage.
                </p>

                <div className="empty-tip">
                  <span className="empty-tip-label">
                    INSPECTION MODE
                  </span>

                  <strong>
                    Live or archived
                  </strong>

                  <span>
                    Living creatures expose
                    their current state.
                    Archived creatures preserve
                    their evolutionary history.
                  </span>
                </div>

                <div className="empty-shortcuts">
                  <div>
                    <span className="shortcut-key">
                      CLICK
                    </span>
                    <span>
                      Select creature
                    </span>
                  </div>

                  <div>
                    <span className="shortcut-key">
                      ARCHIVE
                    </span>
                    <span>
                      Inspect lineage
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  )
}

function renderWorld(
  context: CanvasRenderingContext2D,
  snapshot: WorldSnapshot,
  selectedBlobId: number | null,
) {
  context.clearRect(
    0,
    0,
    WORLD_WIDTH,
    WORLD_HEIGHT,
  )

  for (const region of snapshot.regions) {
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

  for (const region of snapshot.regions) {
    context.strokeRect(
      region.x,
      region.y,
      region.width,
      region.height,
    )
  }

  for (const food of snapshot.foods) {
    context.fillStyle = '#c8f7c5'

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

  for (const blob of snapshot.blobs) {
    const radius =
      4 + blob.genome.speed * 2

    const region =
      snapshot.regions.find(
        (candidate) =>
          blob.x >= candidate.x &&
          blob.x <
            candidate.x +
              candidate.width &&
          blob.y >= candidate.y &&
          blob.y <
            candidate.y +
              candidate.height,
      )

    if (region?.type === 'swamp') {
      context.fillStyle = '#6b8e6b'
    } else if (
      region?.type === 'barren'
    ) {
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

    if (blob.id === selectedBlobId) {
      context.beginPath()

      context.arc(
        blob.x,
        blob.y,
        radius + 5,
        0,
        Math.PI * 2,
      )

      context.strokeStyle = '#ff6b00'
      context.lineWidth = 3
      context.stroke()
    }
  }
}

export default App