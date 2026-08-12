import { Blob } from './Blob'
import { Food } from './Food'

export class World {
  width: number
  height: number
  blobs: Blob[]
  foods: Food[]

  private readonly foodSpawnChance = 0.04
  private readonly maxFood = 150

  constructor(width: number, height: number, initialPopulation: number) {
    this.width = width
    this.height = height
    this.blobs = []
    this.foods = []

    for (let i = 0; i < initialPopulation; i++) {
      this.addRandomBlob()
    }

    for (let i = 0; i < 50; i++) {
      this.addRandomFood()
    }
  }

  addRandomBlob() {
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
    this.spawnFood()

    for (const blob of this.blobs) {
      blob.update(this.width, this.height, this.foods)
    }

    this.blobs = this.blobs.filter((blob) => blob.isAlive())
  }

  private spawnFood() {
    if (Math.random() < this.foodSpawnChance) {
      this.addRandomFood()
    }
  }
}