export type RegionType =
  | 'meadow'
  | 'barren'
  | 'swamp'

export interface Region {
  type: RegionType
  x: number
  y: number
  width: number
  height: number

  foodSpawnMultiplier: number
  energyCostMultiplier: number
}

export const REGION_STYLES: Record<
  RegionType,
  {
    label: string
    fill: string
  }
> = {
  meadow: {
    label: 'Meadow',
    fill: '#e8f5e9',
  },

  barren: {
    label: 'Barren',
    fill: '#f5f5f5',
  },

  swamp: {
    label: 'Swamp',
    fill: '#e8f0f0',
  },
}