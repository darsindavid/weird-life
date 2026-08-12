import { Blob } from './Blob'
import { Food } from './Food'
import {
  DEFAULT_ENVIRONMENT,
  type Environment,
} from './Environment'
import type { Region } from './Region'

export class World {
  width: number
  height: number

  blobs: Blob[]
  foods: Food[]

  tick: number
  births: number
  deaths: number

  readonly environment: Environment

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
      Math.random() * this.width,
      Math.random() * this.height,
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

      if (
        blob.canReproduce() &&
        this.blobs.length +
          offspring.length <
          this.environment.maxPopulation
      ) {
        offspring.push(
          blob.reproduce(
            this.environment.mutationStrength,
          ),
        )
      }
    }

    this.blobs.push(...offspring)

    this.births += offspring.length

    const populationBeforeDeath =
      this.blobs.length

    this.blobs =
      this.blobs.filter((blob) =>
        blob.isAlive(),
      )

    this.deaths +=
      populationBeforeDeath -
      this.blobs.length
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
getRegionAt(x: number, y: number): Region | null {
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
private addFoodToRegion(region: Region) {
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
}