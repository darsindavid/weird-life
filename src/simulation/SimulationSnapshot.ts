import type { CreatureRecord } from './CreatureRecord'
import type { Region } from './Region'

export interface BlobSnapshot {
  id: number
  parentId: number | null
  generation: number

  x: number
  y: number

  energy: number
  age: number
  children: number
  foodEaten: number

  genome: {
    speed: number
    vision: number
    metabolism: number
    reproductionThreshold: number
  }
}

export interface FoodSnapshot {
  x: number
  y: number
  energy: number
}

export interface WorldSnapshot {
  width: number
  height: number

  tick: number
  births: number
  deaths: number

  blobs: BlobSnapshot[]
  foods: FoodSnapshot[]
  regions: Region[]

  history: CreatureRecord[]

  averageSpeed: number
  averageVision: number
  averageMetabolism: number
}