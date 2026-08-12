import type { Region } from './Region'

export interface Environment {
  width: number
  height: number

  foodSpawnChance: number
  foodEnergy: number
  maxFood: number
  maxPopulation: number

  mutationStrength: number

  regions: Region[]
}

export const DEFAULT_ENVIRONMENT: Environment = {
  width: 800,
  height: 500,

  foodSpawnChance: 0.12,
  foodEnergy: 25,
  maxFood: 200,
  maxPopulation: 200,

  mutationStrength: 1,

  regions: [
    {
      type: 'meadow',
      x: 0,
      y: 0,
      width: 400,
      height: 250,
      foodSpawnMultiplier: 1.8,
      energyCostMultiplier: 1,
    },

    {
      type: 'barren',
      x: 400,
      y: 0,
      width: 400,
      height: 250,
      foodSpawnMultiplier: 0.35,
      energyCostMultiplier: 1.15,
    },

    {
      type: 'swamp',
      x: 0,
      y: 250,
      width: 400,
      height: 250,
      foodSpawnMultiplier: 1.2,
      energyCostMultiplier: 1.35,
    },

    {
      type: 'meadow',
      x: 400,
      y: 250,
      width: 400,
      height: 250,
      foodSpawnMultiplier: 1.8,
      energyCostMultiplier: 1,
    },
  ],
}