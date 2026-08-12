export interface Genome {
  speed: number
  vision: number
  metabolism: number
  reproductionThreshold: number
}

export function createRandomGenome(): Genome {
  return {
    speed: 0.8 + Math.random() * 1.2,
    vision: 80 + Math.random() * 120,
    metabolism: 0.015 + Math.random() * 0.025,
    reproductionThreshold: 140 + Math.random() * 60,
  }
}

export function mutateGenome(parent: Genome): Genome {
  return {
    speed: Math.max(0.5, parent.speed + randomMutation(0.15)),
    vision: Math.max(40, parent.vision + randomMutation(15)),
    metabolism: Math.max(
      0.005,
      parent.metabolism + randomMutation(0.005),
    ),
    reproductionThreshold: Math.max(
      100,
      parent.reproductionThreshold + randomMutation(10),
    ),
  }
}

function randomMutation(amount: number) {
  return (Math.random() - 0.5) * 2 * amount
}