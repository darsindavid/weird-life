export interface Environment {
  width: number
  height: number

  foodSpawnChance: number
  foodEnergy: number
  maxFood: number
  maxPopulation: number

  mutationStrength: number
}

export const DEFAULT_ENVIRONMENT: Environment = {
  width: 800,
  height: 500,

  foodSpawnChance: 0.12,
  foodEnergy: 25,
  maxFood: 200,
  maxPopulation: 200,

  mutationStrength: 1,
}