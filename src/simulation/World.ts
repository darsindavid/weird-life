import { Blob } from './Blob'
import { Food } from './Food'

export class World {
  width: number
  height: number
  blobs: Blob[]
  foods: Food[]

  generation: number
  births: number
  deaths: number

  private readonly foodSpawnChance = 0.12
  private readonly maxFood = 200
  private readonly maxPopulation = 200

  constructor(width: number, height: number, initialPopulation: number) {
    this.width = width
    this.height = height
    this.blobs = []
    this.foods = []

    this.generation = 0
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
    if (this.blobs.length >= this.maxPopulation) {
      return
    }

    const blob = new Blob(
      Math.random() * this.width,
      Math.random() * this.height,
    )

    this.blobs.push(blob)
  }

  addRandomFood() {
    if (this.foods.length >= this.maxFood) {
      return
    }

    const food = new Food(
      Math.random() * this.width,
      Math.random() * this.height,
    )

    this.foods.push(food)
  }

  update() {
    this.generation += 1

    this.spawnFood()

    const offspring: Blob[] = []

    for (const blob of this.blobs) {
      blob.update(this.width, this.height, this.foods)

      if (
        blob.canReproduce() &&
        this.blobs.length + offspring.length < this.maxPopulation
      ) {
        offspring.push(blob.reproduce())
      }
    }

    this.blobs.push(...offspring)

    this.births += offspring.length

    const populationBeforeDeath = this.blobs.length

    this.blobs = this.blobs.filter((blob) => blob.isAlive())

    this.deaths += populationBeforeDeath - this.blobs.length
  }

  getAverageSpeed() {
    if (this.blobs.length === 0) {
      return 0
    }

    const total = this.blobs.reduce(
      (sum, blob) => sum + blob.genome.speed,
      0,
    )

    return total / this.blobs.length
  }

  getAverageVision() {
    if (this.blobs.length === 0) {
      return 0
    }

    const total = this.blobs.reduce(
      (sum, blob) => sum + blob.genome.vision,
      0,
    )

    return total / this.blobs.length
  }

  getAverageMetabolism() {
    if (this.blobs.length === 0) {
      return 0
    }

    const total = this.blobs.reduce(
      (sum, blob) => sum + blob.genome.metabolism,
      0,
    )

    return total / this.blobs.length
  }

  private spawnFood() {
    if (Math.random() < this.foodSpawnChance) {
      this.addRandomFood()
    }
  }
}