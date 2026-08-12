import type { Genome } from './Genome'

export interface CreatureRecord {
  id: number
  parentId: number | null
  generation: number

  genome: Genome

  birthTick: number
  deathTick: number | null

  children: number
  foodEaten: number
}