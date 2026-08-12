export class Blob {
  x: number
  y: number
  vx: number
  vy: number
  energy: number
  age: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y

    this.vx = (Math.random() - 0.5) * 2
    this.vy = (Math.random() - 0.5) * 2

    this.energy = 100
    this.age = 0
  }

  update(width: number, height: number) {
    this.x += this.vx
    this.y += this.vy

    this.age += 1
    this.energy -= 0.05

    if (this.x <= 0 || this.x >= width) {
      this.vx *= -1
    }

    if (this.y <= 0 || this.y >= height) {
      this.vy *= -1
    }
  }

  isAlive() {
    return this.energy > 0
  }
}