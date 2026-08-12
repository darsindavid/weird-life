import { Blob } from './Blob'
import { Food } from './Food'
import {
  DEFAULT_ENVIRONMENT,
  type Environment,
} from './Environment'
import type { Region } from './Region'
import type { CreatureRecord } from './CreatureRecord'

export class World {
  width: number
  height: number

  blobs: Blob[]
  foods: Food[]

  tick: number
  births: number
  deaths: number

  readonly environment: Environment
  private nextBlobId: number
  private archive: Map<number, CreatureRecord>

  constructor(
    environment: Environment = DEFAULT_ENVIRONMENT,
    initialPopulation = 50,
  ) {
    this.environment = environment

    this.width = environment.width
    this.height = environment.height

    this.blobs = []
    this.foods = []

    this.tick = 0
    this.births = 0
    this.deaths = 0
    this.nextBlobId = 1
    this.archive = new Map()

    for (let i = 0; i < initialPopulation; i++) {
      this.addRandomBlob()
    }

    for (let i = 0; i < 75; i++) {
      this.addRandomFood()
    }
  }

  addRandomBlob() {
    if (
      this.blobs.length >=
      this.environment.maxPopulation
    ) {
      return
    }

    const blob = new Blob(
      this.nextBlobId,
      
      Math.random() * this.width,
      Math.random() * this.height,
    )

    this.nextBlobId += 1
    this.archive.set(
  blob.id,
  {
    id: blob.id,
    parentId: blob.parentId,
    generation: blob.generation,
    genome: { ...blob.genome },
    birthTick: this.tick,
    deathTick: null,
    children: 0,
    foodEaten: 0,
  },
)

    this.blobs.push(blob)
  }

  addRandomFood() {
    if (
      this.foods.length >=
      this.environment.maxFood
    ) {
      return
    }

    const food = new Food(
      Math.random() * this.width,
      Math.random() * this.height,
      this.environment.foodEnergy,
    )

    this.foods.push(food)
  }

  update() {
    this.tick += 1

    this.spawnFood()

    const offspring: Blob[] = []

    for (const blob of this.blobs) {
      const region = this.getRegionAt(
        blob.x,
        blob.y,
      )

      blob.update(
        this.width,
        this.height,
        this.foods,
        region?.energyCostMultiplier ?? 1,
      )
      const record = this.archive.get(
  blob.id,
)

if (record) {
  record.children = blob.children
  record.foodEaten = blob.foodEaten
}

      if (
        blob.canReproduce() &&
        this.blobs.length +
          offspring.length <
          this.environment.maxPopulation
      ) {
        const child = blob.reproduce(
  this.nextBlobId,
  this.environment.mutationStrength,
)

this.nextBlobId += 1

offspring.push(child)

this.archive.set(
  child.id,
  {
    id: child.id,
    parentId: child.parentId,
    generation: child.generation,
    genome: { ...child.genome },
    birthTick: this.tick,
    deathTick: null,
    children: 0,
    foodEaten: 0,
  },
)
      }
    }

    this.blobs.push(...offspring)

    this.births += offspring.length

    const survivors: Blob[] = []

for (const blob of this.blobs) {
  if (blob.isAlive()) {
    survivors.push(blob)
    continue
  }

  const record =
    this.archive.get(blob.id)

  if (record) {
    record.deathTick =
      this.tick

    record.children =
      blob.children

    record.foodEaten =
      blob.foodEaten
  }

  this.deaths += 1
}

this.blobs = survivors
  }

  getAverageSpeed() {
    if (this.blobs.length === 0) {
      return 0
    }

    return (
      this.blobs.reduce(
        (sum, blob) =>
          sum + blob.genome.speed,
        0,
      ) / this.blobs.length
    )
  }

  getAverageVision() {
    if (this.blobs.length === 0) {
      return 0
    }

    return (
      this.blobs.reduce(
        (sum, blob) =>
          sum + blob.genome.vision,
        0,
      ) / this.blobs.length
    )
  }

  getAverageMetabolism() {
    if (this.blobs.length === 0) {
      return 0
    }

    return (
      this.blobs.reduce(
        (sum, blob) =>
          sum + blob.genome.metabolism,
        0,
      ) / this.blobs.length
    )
  }

  getRegionAt(
    x: number,
    y: number,
  ): Region | null {
    return (
      this.environment.regions.find(
        (region) =>
          x >= region.x &&
          x < region.x + region.width &&
          y >= region.y &&
          y < region.y + region.height,
      ) ?? null
    )
  }

  getBlobById(id: number) {
    return (
      this.blobs.find(
        (blob) => blob.id === id,
      ) ?? null
    )
  }

  private spawnFood() {
    if (
      Math.random() >=
      this.environment.foodSpawnChance
    ) {
      return
    }

    const region =
      this.environment.regions[
        Math.floor(
          Math.random() *
            this.environment.regions.length,
        )
      ]

    const adjustedChance =
      Math.random() <
      region.foodSpawnMultiplier

    if (!adjustedChance) {
      return
    }

    this.addFoodToRegion(region)
  }

  private addFoodToRegion(
    region: Region,
  ) {
    if (
      this.foods.length >=
      this.environment.maxFood
    ) {
      return
    }

    const food = new Food(
      region.x +
        Math.random() * region.width,
      region.y +
        Math.random() * region.height,
      this.environment.foodEnergy,
    )

    this.foods.push(food)
  }
  getCreatureRecord(
  id: number,
) {
  return (
    this.archive.get(id) ?? null
  )
}
getCreatureHistory() {
  return Array.from(
    this.archive.values(),
  )
}
}
