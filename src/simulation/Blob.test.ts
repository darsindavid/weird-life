import { describe, expect, it } from 'vitest'
import { Blob } from './Blob'
import { Food } from './Food'
import type { Genome } from './Genome'

const createGenome = (): Genome => ({
  speed: 1,
  vision: 50,
  metabolism: 0.01,
  reproductionThreshold: 100,
})

describe('Blob', () => {
  it('stores the supplied id', () => {
    const blob = new Blob(7, 10, 20, createGenome())

    expect(blob.id).toBe(7)
  })

  it('has generation 0 and no parent by default', () => {
    const blob = new Blob(8, 10, 20, createGenome(), 100, null, 0)

    expect(blob.generation).toBe(0)
    expect(blob.parentId).toBeNull()
  })

  it('starts with age, children, and foodEaten at zero', () => {
    const blob = new Blob(9, 10, 20, createGenome())

    expect(blob.age).toBe(0)
    expect(blob.children).toBe(0)
    expect(blob.foodEaten).toBe(0)
  })

  it('increments age when update is called', () => {
    const blob = new Blob(10, 10, 20, createGenome())

    blob.update(200, 200, [], 0)

    expect(blob.age).toBe(1)
  })

  it('increases energy and foodEaten when it eats food', () => {
    const blob = new Blob(11, 10, 10, createGenome(), 50)
    const food = new Food(12, 11, 25)
    const beforeEnergy = blob.energy

    blob.update(200, 200, [food], 0)

    expect(blob.energy).toBe(beforeEnergy + food.energy)
    expect(blob.foodEaten).toBe(1)
  })

  it('creates a child with a new id, the parent id as parentId, and the next generation', () => {
    const parent = new Blob(12, 15, 15, createGenome(), 100, null, 3)

    const child = parent.reproduce(99, 1)

    expect(child.id).toBe(99)
    expect(child.id).not.toBe(parent.id)
    expect(child.parentId).toBe(parent.id)
    expect(child.generation).toBe(parent.generation + 1)
  })

  it('increments the parent children count during reproduction', () => {
    const parent = new Blob(13, 15, 15, createGenome(), 100)

    parent.reproduce(100, 1)

    expect(parent.children).toBe(1)
  })

  it('creates an offspring genome that is a mutated copy instead of the same object', () => {
    const parent = new Blob(14, 15, 15, createGenome(), 100)

    const child = parent.reproduce(101, 1)

    expect(child.genome).not.toBe(parent.genome)
  })
})
