import { Blob } from './Blob'

export class World {
  width: number
  height: number
  blobs: Blob[]

  constructor(width: number, height: number, initialPopulation: number) {
    this.width = width
    this.height = height
    this.blobs = []

    for (let i = 0; i < initialPopulation; i++) {
      this.addRandomBlob()
    }
  }

  addRandomBlob() {
    const blob = new Blob(
      Math.random() * this.width,
      Math.random() * this.height,
    )

    this.blobs.push(blob)
  }

  update() {
    for (const blob of this.blobs) {
      blob.update(this.width, this.height)
    }

    this.blobs = this.blobs.filter((blob) => blob.isAlive())
  }
}