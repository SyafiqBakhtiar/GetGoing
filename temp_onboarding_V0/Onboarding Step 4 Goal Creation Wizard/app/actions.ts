import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { GamePlan, HabitBooster } from "@/goal-creation"

export async function getAiTagsAndDuration(goalTitle: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Given the goal title: "${goalTitle}", suggest up to 3 relevant tags (categories) and a reasonable duration in weeks.
      
      Return the response as a JSON object with the following structure:
      {
        "tags": ["Tag1", "Tag2"],
        "duration": 52
      }
      
      Example for "Run a marathon":
      {
        "tags": ["Fitness", "Health"],
        "duration": 20
      }
      
      Example for "Learn to code":
      {
        "tags": ["Learning", "Career", "Productivity"],
        "duration": 26
      }
      
      Ensure tags are concise and relevant. The duration should be a number representing weeks.`,
    })

    const parsed = JSON.parse(text)
    return { tags: parsed.tags || [], duration: parsed.duration || null }
  } catch (error) {
    console.error("Error generating AI tags and duration:", error)
    return { tags: [], duration: null, error: (error as Error).message }
  }
}

export async function getAiMilestones(goalTitle: string): Promise<{ milestones: GamePlan[]; error?: string }> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Given the goal title: "${goalTitle}", suggest 3-5 actionable milestones (game plans) to achieve it. Each milestone should have a title and optionally notes.
      
      Return the response as a JSON array of objects with the following structure:
      [
        {
          "id": "unique_id_1",
          "title": "Milestone Title 1",
          "notes": "Optional notes for milestone 1"
        },
        {
          "id": "unique_id_2",
          "title": "Milestone Title 2"
        }
      ]
      
      Ensure each milestone has a unique 'id' (you can use a simple counter or timestamp for this), a 'title', and optionally 'notes'. Make the titles concise and actionable.`,
    })

    const parsed = JSON.parse(text)
    // Assign unique IDs if not present or if they are not unique
    const milestonesWithIds = parsed.map((milestone: Partial<GamePlan>) => ({
      id: milestone.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
      title: milestone.title || "",
      notes: milestone.notes || "",
    }))

    return { milestones: milestonesWithIds }
  } catch (error) {
    console.error("AI Milestone Suggestion Error:", error)
    return { milestones: [], error: (error as Error).message }
  }
}

export async function getAiHabitsAndLinks(
  goalTitle: string,
  milestones: GamePlan[],
): Promise<{ habits: HabitBooster[]; error?: string }> {
  try {
    const milestoneTitles = milestones.map((m) => m.title).join("; ")
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Given the main goal: "${goalTitle}" and its key milestones: "${milestoneTitles}", suggest 3-5 daily or weekly habit boosters that would help achieve this goal. Each habit should have a title and a frequency.
      
      Return the response as a JSON array of objects with the following structure:
      [
        {
          "id": "unique_id_1",
          "title": "Habit Title 1",
          "frequency": "daily"
        },
        {
          "id": "unique_id_2",
          "title": "Habit Title 2",
          "frequency": "weekly",
          "daysPerWeek": 3
        }
      ]
      
      Frequency can be "daily", "weekly", "monthly", or "custom". If "weekly", include "daysPerWeek" (1-7). If "monthly", include "daysPerMonth" (1-30). If "custom", include "customSchedule" (e.g., "every Monday and Thursday"). Ensure each habit has a unique 'id' (you can use a simple counter or timestamp for this), a 'title', and a 'frequency'.`,
    })

    const parsed = JSON.parse(text)
    const habitsWithIds = parsed.map((habit: Partial<HabitBooster>) => ({
      id: habit.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
      title: habit.title || "",
      frequency: habit.frequency || "daily",
      daysPerWeek: habit.daysPerWeek,
      daysPerMonth: habit.daysPerMonth,
      customSchedule: habit.customSchedule,
    }))

    return { habits: habitsWithIds }
  } catch (error) {
    console.error("AI Habit Suggestion Error:", error)
    return { habits: [], error: (error as Error).message }
  }
}
