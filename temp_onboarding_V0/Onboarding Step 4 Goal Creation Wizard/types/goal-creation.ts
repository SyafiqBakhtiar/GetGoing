export type GoalCreationStep =
  | "goal-title"
  | "goal-tag"
  | "start-date"
  | "duration"
  | "game-plans"
  | "habit-boosters"
  | "review"

export interface Goal {
  title: string
  notes?: string
  tags: string[]
  startDate?: Date
  duration?: number // in weeks
  gamePlans: GamePlan[]
  habitBoosters: HabitBooster[]
}

export interface GamePlan {
  id: string
  title: string
  notes?: string
}

export interface HabitBooster {
  id: string
  title: string
  frequency: "daily" | "weekly" | "monthly" | "custom"
  daysPerWeek?: number // for weekly
  daysPerMonth?: number // for monthly
  customSchedule?: string // for custom
}
