import { Food } from './Food'
import {
  createRandomGenome,
  mutateGenome,
  type Genome,
} from './Genome'

export class Blob {
  x: number
  y: number
  vx: number
  vy: number
  energy: number
  age: number
  genome: Genome

  private readonly eatingDistance = 8

  constructor(
    x: number,
    y: number,
    genome: Genome = createRandomGenome(),
    energy = 100,
  ) {
    this.x = x
    this.y = y

    this.vx = (Math.random() - 0.5) * 2
    this.vy = (Math.random() - 0.5) * 2

    this.energy = energy
    this.age = 0
    this.genome = genome
  }

  update(
  width: number,
  height: number,
  foods: Food[],
  energyCostMultiplier = 1,
) {
    this.age += 1

    this.energy -=
  this.getEnergyCost() * energyCostMultiplier

    const nearestFood = this.findNearestFood(foods)

    if (nearestFood) {
      this.moveTowards(nearestFood.x, nearestFood.y)
    } else {
      this.wander()
    }

    this.x += this.vx
    this.y += this.vy

    this.handleBoundaries(width, height)

    this.tryToEat(nearestFood, foods)
  }

  private getEnergyCost() {
    const movementCost =
      Math.abs(this.vx) * 0.012 +
      Math.abs(this.vy) * 0.012

    const speedCost =
      this.genome.speed * 0.006

    const visionCost =
      this.genome.vision * 0.00004

    return (
      this.genome.metabolism +
      movementCost +
      speedCost +
      visionCost
    )
  }

  private findNearestFood(foods: Food[]) {
    let nearestFood: Food | null = null
    let nearestDistance = this.genome.vision

    for (const food of foods) {
      const distance = this.distanceTo(food.x, food.y)

      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestFood = food
      }
    }

    return nearestFood
  }

  private moveTowards(targetX: number, targetY: number) {
    const dx = targetX - this.x
    const dy = targetY - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance === 0) {
      return
    }

    this.vx += (dx / distance) * 0.05
    this.vy += (dy / distance) * 0.05

    this.limitSpeed()
  }

  private wander() {
    this.vx += (Math.random() - 0.5) * 0.08
    this.vy += (Math.random() - 0.5) * 0.08

    this.limitSpeed()
  }

  private limitSpeed() {
    const speed = Math.sqrt(
      this.vx * this.vx + this.vy * this.vy,
    )

    if (speed > this.genome.speed) {
      this.vx =
        (this.vx / speed) * this.genome.speed

      this.vy =
        (this.vy / speed) * this.genome.speed
    }
  }

  private handleBoundaries(
    width: number,
    height: number,
  ) {
    if (this.x <= 0 || this.x >= width) {
      this.vx *= -1
      this.x = Math.max(
        0,
        Math.min(this.x, width),
      )
    }

    if (this.y <= 0 || this.y >= height) {
      this.vy *= -1
      this.y = Math.max(
        0,
        Math.min(this.y, height),
      )
    }
  }

  private tryToEat(
    food: Food | null,
    foods: Food[],
  ) {
    if (!food) {
      return
    }

    if (
      this.distanceTo(food.x, food.y) <=
      this.eatingDistance
    ) {
      this.energy += food.energy

      const foodIndex = foods.indexOf(food)

      if (foodIndex !== -1) {
        foods.splice(foodIndex, 1)
      }
    }
  }

  canReproduce() {
    return (
      this.energy >=
      this.genome.reproductionThreshold
    )
  }

  reproduce(mutationStrength: number) {
    const offspringEnergy = this.energy / 2

    this.energy = offspringEnergy

    const offspringGenome = mutateGenome(
      this.genome,
      mutationStrength,
    )

    return new Blob(
      this.x + (Math.random() - 0.5) * 10,
      this.y + (Math.random() - 0.5) * 10,
      offspringGenome,
      offspringEnergy,
    )
  }

  private distanceTo(x: number, y: number) {
    const dx = x - this.x
    const dy = y - this.y

    return Math.sqrt(dx * dx + dy * dy)
  }

  isAlive() {
    return this.energy > 0
  }
}