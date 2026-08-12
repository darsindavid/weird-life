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

export function mutateGenome(
  parent: Genome,
  mutationStrength = 1,
): Genome {
  return {
    speed: clamp(
      parent.speed + randomMutation(0.15 * mutationStrength),
      0.5,
      2.5,
    ),

    vision: clamp(
      parent.vision + randomMutation(15 * mutationStrength),
      40,
      300,
    ),

    metabolism: clamp(
      parent.metabolism + randomMutation(0.005 * mutationStrength),
      0.005,
      0.06,
    ),

    reproductionThreshold: clamp(
      parent.reproductionThreshold +
        randomMutation(10 * mutationStrength),
      100,
      220,
    ),
  }
}

function randomMutation(amount: number) {
  return (Math.random() - 0.5) * 2 * amount
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.max(minimum, Math.min(value, maximum))
}