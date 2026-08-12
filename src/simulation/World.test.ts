import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { World } from './World'
import { DEFAULT_ENVIRONMENT } from './Environment'

describe('World', () => {
  let world: World

  beforeEach(() => {
    // Seed Math.random for deterministic tests
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    // Restore mocks to prevent leakage into other test files
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('creates the requested number of initial Blobs', () => {
      const initialPopulation = 25
      world = new World(DEFAULT_ENVIRONMENT, initialPopulation)
      expect(world.blobs).toHaveLength(initialPopulation)
    })

    it('creates default population when not specified', () => {
      world = new World(DEFAULT_ENVIRONMENT)
      expect(world.blobs).toHaveLength(50)
    })

    it('initial Blobs have sequential IDs starting at 1', () => {
      const initialPopulation = 10
      world = new World(DEFAULT_ENVIRONMENT, initialPopulation)

      for (let i = 0; i < initialPopulation; i++) {
        expect(world.blobs[i].id).toBe(i + 1)
      }
    })

    it('every initial Blob has a corresponding CreatureRecord in the genetic archive', () => {
      const initialPopulation = 15
      world = new World(DEFAULT_ENVIRONMENT, initialPopulation)

      for (const blob of world.blobs) {
        const record = world.getCreatureRecord(blob.id)
        expect(record).not.toBeNull()
        expect(record?.id).toBe(blob.id)
      }
    })

    it('initial CreatureRecords have correct properties', () => {
      world = new World(DEFAULT_ENVIRONMENT, 1)
      const blob = world.blobs[0]
      const record = world.getCreatureRecord(blob.id)

      expect(record).toEqual({
        id: blob.id,
        parentId: null,
        generation: 0,
        genome: blob.genome,
        birthTick: 0,
        deathTick: null,
        children: 0,
        foodEaten: 0,
      })
    })

    it('initializes with zero ticks, births, and deaths', () => {
      world = new World(DEFAULT_ENVIRONMENT, 5)

      expect(world.tick).toBe(0)
      expect(world.births).toBe(0)
      expect(world.deaths).toBe(0)
    })

    it('initializes environment dimensions correctly', () => {
      world = new World(DEFAULT_ENVIRONMENT, 1)

      expect(world.width).toBe(DEFAULT_ENVIRONMENT.width)
      expect(world.height).toBe(DEFAULT_ENVIRONMENT.height)
    })

    it('initializes with food items', () => {
      world = new World(DEFAULT_ENVIRONMENT, 1)

      expect(world.foods.length).toBeGreaterThan(0)
    })
  })

  describe('getCreatureRecord', () => {
    beforeEach(() => {
      world = new World(DEFAULT_ENVIRONMENT, 10)
    })

    it('returns the correct record for an existing creature', () => {
      const blobId = world.blobs[3].id
      const record = world.getCreatureRecord(blobId)

      expect(record).not.toBeNull()
      expect(record?.id).toBe(blobId)
    })

    it('returns null for a non-existent creature', () => {
      const record = world.getCreatureRecord(999)

      expect(record).toBeNull()
    })

    it('returns the record with matching parent ID for initial creatures', () => {
      const record = world.getCreatureRecord(world.blobs[0].id)

      expect(record?.parentId).toBeNull()
    })

    it('returns the record with matching generation for initial creatures', () => {
      const record = world.getCreatureRecord(world.blobs[0].id)

      expect(record?.generation).toBe(0)
    })
  })

  describe('getCreatureHistory', () => {
    beforeEach(() => {
      world = new World(DEFAULT_ENVIRONMENT, 5)
    })

    it('returns all archived creatures', () => {
      const history = world.getCreatureHistory()

      expect(history).toHaveLength(world.blobs.length)
    })

    it('preserves initial creature records after multiple updates', () => {
      const initialBlobIds = world.blobs.map((b) => b.id)

      world.update()
      world.update()
      world.update()

      const history = world.getCreatureHistory()
      const historyIds = history.map((r) => r.id)

      // All original creatures should still be in history
      for (const id of initialBlobIds) {
        expect(historyIds).toContain(id)
      }
    })

    it('preserves records for all initial blobs in history', () => {
      const blobIds = world.blobs.map(b => b.id)
      const history = world.getCreatureHistory()
      const historyIds = history.map(r => r.id)

      for (const id of blobIds) {
        expect(historyIds).toContain(id)
      }
    })


  })

  describe('reproduction and archive', () => {
    it('offspring receives archive record with correct parentId and generation when creature reproduces', () => {
      world = new World(DEFAULT_ENVIRONMENT, 1)
      const parent = world.blobs[0]
      const parentId = parent.id
      const parentGeneration = parent.generation
      const initialHistoryCount = world.getCreatureHistory().length

      // Give parent enough energy to reproduce
      parent.energy = parent.genome.reproductionThreshold + 10

      world.update()

      const newHistory = world.getCreatureHistory()
      expect(newHistory.length).toBeGreaterThan(initialHistoryCount)

      // Find the offspring (should be the newest ID)
      const offspring = world.blobs.find(
        (blob) => blob.parentId === parentId,
      )
      expect(offspring).toBeDefined()

      if (offspring) {
        const offspringRecord = world.getCreatureRecord(
          offspring.id,
        )
        expect(offspringRecord).not.toBeNull()
        expect(offspringRecord?.parentId).toBe(parentId)
        expect(offspringRecord?.generation).toBe(
          parentGeneration + 1,
        )
      }
    })
  })

  describe('genome preservation in archive', () => {
    beforeEach(() => {
      world = new World(DEFAULT_ENVIRONMENT, 3)
    })

    it('archived records preserve a copy of the creatures genome', () => {
      const blob = world.blobs[0]
      const record = world.getCreatureRecord(blob.id)

      expect(record?.genome).toEqual(blob.genome)
    })

    it('archived genome is not the same object as the blob genome', () => {
      const blob = world.blobs[0]
      const record = world.getCreatureRecord(blob.id)

      expect(record?.genome).not.toBe(blob.genome)
    })

    it('modifying blob genome does not affect archived record', () => {
      const blob = world.blobs[0]
      const originalSpeed = blob.genome.speed
      const record = world.getCreatureRecord(blob.id)

      const archivedSpeed = record?.genome.speed

      // Modify the blob's genome
      blob.genome.speed = 999

      // Archived record should be unchanged
      expect(record?.genome.speed).toBe(archivedSpeed)
      expect(record?.genome.speed).not.toBe(999)
    })


  })

  describe('archive operations', () => {
    beforeEach(() => {
      world = new World(DEFAULT_ENVIRONMENT, 8)
    })

    it('maintains archive records for all creatures', () => {
      const allBlobIds = world.blobs.map(b => b.id)
      const allRecords = world.getCreatureHistory()
      const allRecordIds = allRecords.map(r => r.id)

      for (const id of allBlobIds) {
        expect(allRecordIds).toContain(id)
      }
    })

    it('archive entries have birth tick set to world tick at creation', () => {
      const record = world.getCreatureRecord(world.blobs[0].id)

      expect(record?.birthTick).toBe(world.tick)
    })

    it('initial creature records have null death tick', () => {
      const record = world.getCreatureRecord(world.blobs[0].id)

      expect(record?.deathTick).toBeNull()
    })

    it('initial creature records have zero children count', () => {
      const record = world.getCreatureRecord(world.blobs[0].id)

      expect(record?.children).toBe(0)
    })

    it('initial creature records have zero food eaten count', () => {
      const record = world.getCreatureRecord(world.blobs[0].id)

      expect(record?.foodEaten).toBe(0)
    })
  })
})
