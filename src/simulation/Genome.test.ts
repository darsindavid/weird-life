import { describe, it, expect } from 'vitest'
import { createRandomGenome, mutateGenome } from './Genome'

describe('Genome', () => {
  it('createRandomGenome returns values within the defined bounds', () => {
    for (let i = 0; i < 100; i++) {
      const genome = createRandomGenome()

      expect(genome.speed).toBeGreaterThanOrEqual(0.8)
      expect(genome.speed).toBeLessThanOrEqual(2.0)

      expect(genome.vision).toBeGreaterThanOrEqual(80)
      expect(genome.vision).toBeLessThanOrEqual(200)

      expect(genome.metabolism).toBeGreaterThanOrEqual(0.015)
      expect(genome.metabolism).toBeLessThanOrEqual(0.04)

      expect(genome.reproductionThreshold).toBeGreaterThanOrEqual(140)
      expect(genome.reproductionThreshold).toBeLessThanOrEqual(200)
    }
  })

  it('mutateGenome returns a new genome object instead of the same object', () => {
    const parentGenome = {
      speed: 1.2,
      vision: 120,
      metabolism: 0.02,
      reproductionThreshold: 160,
    }

    const childGenome = mutateGenome(parentGenome)

    expect(childGenome).not.toBe(parentGenome)
    expect(childGenome).toEqual(expect.objectContaining({
      speed: expect.any(Number),
      vision: expect.any(Number),
      metabolism: expect.any(Number),
      reproductionThreshold: expect.any(Number),
    }))
  })

  it('mutated values do not drop below the safety limits', () => {
    const parentGenome = {
      speed: 0.5,
      vision: 40,
      metabolism: 0.005,
      reproductionThreshold: 100,
    }

    for (let i = 0; i < 100; i++) {
      const mutated = mutateGenome(parentGenome)

      expect(mutated.speed).toBeGreaterThanOrEqual(0.5)
      expect(mutated.vision).toBeGreaterThanOrEqual(40)
      expect(mutated.metabolism).toBeGreaterThanOrEqual(0.005)
      expect(mutated.reproductionThreshold).toBeGreaterThanOrEqual(100)
    }
  })
})
