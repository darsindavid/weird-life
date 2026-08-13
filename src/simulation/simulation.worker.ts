import { DEFAULT_ENVIRONMENT } from './Environment'
import { World } from './World'
import type {
  BlobSnapshot,
  WorldSnapshot,
} from './SimulationSnapshot'
type WorkerMessage =
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
    }
  | {
      type: 'select'
      id: number | null
    }

let world = new World(
  DEFAULT_ENVIRONMENT,
  50,
)

let running = true
let simulationSpeed = 20
let intervalId: ReturnType<typeof setInterval> | null = null

function createSnapshot(): WorldSnapshot {
  const blobs: BlobSnapshot[] =
    world.blobs.map((blob) => ({
      id: blob.id,
      parentId: blob.parentId,
      generation: blob.generation,

      x: blob.x,
      y: blob.y,

      energy: blob.energy,
      age: blob.age,
      children: blob.children,
      foodEaten: blob.foodEaten,

      genome: {
        speed: blob.genome.speed,
        vision: blob.genome.vision,
        metabolism: blob.genome.metabolism,
        reproductionThreshold:
          blob.genome.reproductionThreshold,
      },
    }))

  return {
    width: world.width,
    height: world.height,

    tick: world.tick,
    births: world.births,
    deaths: world.deaths,

    blobs,

    foods: world.foods.map((food) => ({
      x: food.x,
      y: food.y,
      energy: food.energy,
    })),

    regions: world.environment.regions,

history: world.getCreatureHistory(),

averageSpeed:
  world.getAverageSpeed(),

    averageVision:
      world.getAverageVision(),

    averageMetabolism:
      world.getAverageMetabolism(),
  }
}

function sendSnapshot() {
  self.postMessage({
    type: 'snapshot',
    snapshot: createSnapshot(),
  })
}

function runSimulationStep() {
  if (!running) {
    return
  }

  world.update()
  sendSnapshot()
}

function restartTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }

  const interval = 1000 / simulationSpeed

  intervalId = setInterval(
    runSimulationStep,
    interval,
  )
}

function resetWorld() {
  world = new World(
    DEFAULT_ENVIRONMENT,
    50,
  )

  sendSnapshot()
}

self.onmessage = (
  event: MessageEvent<WorkerMessage>,
) => {
  const message = event.data

  switch (message.type) {
    case 'start':
      running = true
      simulationSpeed = message.speed
      restartTimer()
      break

    case 'pause':
      running = false

      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }

      break

    case 'set-speed':
      simulationSpeed = message.speed

      if (running) {
        restartTimer()
      }

      break

    case 'reset':
      resetWorld()
      break

    case 'select': {
      const blob =
        message.id === null
          ? null
          : world.getBlobById(message.id)

      self.postMessage({
        type: 'selection',
        blob: blob
          ? {
              id: blob.id,
              parentId: blob.parentId,
              generation: blob.generation,

              x: blob.x,
              y: blob.y,

              energy: blob.energy,
              age: blob.age,
              children: blob.children,
              foodEaten: blob.foodEaten,

              genome: {
                speed: blob.genome.speed,
                vision: blob.genome.vision,
                metabolism:
                  blob.genome.metabolism,
                reproductionThreshold:
                  blob.genome
                    .reproductionThreshold,
              },
            }
          : null,
      })

      break
    }
  }
}

sendSnapshot()
restartTimer()