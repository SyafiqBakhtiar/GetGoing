"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Snackbar from "@/components/snackbar"
import ConfirmationScreen from "@/components/confirmation-screen" // Ensure this import is present
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CalendarIcon,
  StickyNote,
  Target,
  Clock,
  Zap,
  CheckCircle,
  Edit3,
  Trash2,
  Loader2,
  Search,
  Flag,
} from "lucide-react"
import { format } from "date-fns"
import type { Goal, GamePlan, HabitBooster, GoalCreationStep } from "./types/goal-creation"
import { getAiTagsAndDuration, getAiMilestones, getAiHabitsAndLinks } from "@/app/actions"
import { cn } from "@/lib/utils"

const steps: { key: GoalCreationStep; title: string; description?: string }[] = [
  { key: "goal-title", title: "What's your goal?" },
  {
    key: "goal-tag",
    title: "Pick categories that fit your goal",
  },
  { key: "start-date", title: "When would you like to begin your journey?" },
  { key: "duration", title: "How long do you think it'll take to achieve this goal?" },
  { key: "game-plans", title: "Every big goal needs small wins—what will yours be?" },
  { key: "habit-boosters", title: "What small daily wins will help you stay consistent?" },
  { key: "review", title: "Review & Confirm", description: "Let's make sure everything looks good" },
]

// Add scrollbar-hide utility
const scrollbarHideStyle = `
.scrollbar-hide {
-ms-overflow-style: none;
scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
display: none;
}
`

interface GoalCreationProps {
  isOnboarding?: boolean
}

// Skeleton components
const DurationSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-[100px] flex flex-col gap-3 p-4 items-center justify-center bg-white/5 border border-white/10",
        className,
      )}
    >
      <Skeleton className="size-8 rounded-full bg-primary-300/50" />
      <Skeleton className="h-5 w-3/4 bg-white/10" />
      <Skeleton className="h-4 w-1/2 bg-white/10" />
    </div>
  )
}

const MilestoneSkeleton = ({ className }: { className?: string } = {}) => {
  return (
    <div className={cn("rounded-2xl h-[80px] flex gap-3 p-4 items-start bg-white/5 border border-white/10", className)}>
      <div className="flex-shrink-0 w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
        <Skeleton className="size-4 rounded-full bg-primary-300/50" />
      </div>
      <div className="flex-1 space-y-3 min-w-0">
        <Skeleton className="h-5 w-full max-w-[70%] bg-white/10" />
        <Skeleton className="h-4 w-24 bg-white/10" />
      </div>
    </div>
  )
}

const HabitBoosterSkeleton = ({ showIcon = true, className }: { showIcon?: boolean; className?: string }) => {
  const width = Math.floor(Math.random() * 40) + 50
  return (
    <div
      className={cn("rounded-2xl h-[100px] flex gap-3 p-4 items-start bg-white/5 border border-white/10", className)}
    >
      {showIcon && (
        <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
          <Skeleton className="size-4 rounded-full bg-yellow-300/50" />
        </div>
      )}
      <div className="flex-1 space-y-3 min-w-0">
        <Skeleton
          className="h-5 w-full max-w-[--skeleton-width]"
          style={{ "--skeleton-width": `${width}%` } as React.CSSProperties}
        />
        <Skeleton className="h-4 w-24 bg-white/10" />
      </div>
    </div>
  )
}

export default function GoalCreation({ isOnboarding = true }: GoalCreationProps) {
  const [currentStep, setCurrentStep] = useState<GoalCreationStep>("goal-title")
  const [goal, setGoal] = useState<Goal>({
    title: "",
    notes: "",
    tags: [],
    gamePlans: [],
    habitBoosters: [],
  })
  const [showNotes, setShowNotes] = useState(false)
  const [isGoalInputFocused, setIsGoalInputFocused] = useState(false)
  const goalTitleInputRef = useRef<HTMLInputElement>(null)
  const [customTagInput, setCustomTagInput] = useState("")
  const [showCustomTagInput, setShowCustomTagInput] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null)
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<GoalCreationStep | null>(null)
  const [scrollBackToIndex, setScrollBackToIndex] = useState<number | null>(null)
  const [focusedMilestoneId, setFocusedMilestoneId] = useState<string | null>(null)

  // Snackbar states
  const [snackbarVisible, setSnackbarVisible] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [deletedItem, setDeletedItem] = useState<{
    type: "gameplan" | "habit"
    item: GamePlan | HabitBooster
    index: number
  } | null>(null)

  // Placeholder cycling states
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Milestone example cycling states
  const [currentMilestoneExampleIndex, setCurrentMilestoneExampleIndex] = useState(0)
  const milestoneIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const exampleMilestones = [
    "E.g., Successfully perform 30 consecutive push-ups to enhance upper body strength",
    "E.g., Sucessfully save $10000 to build emergency fund",
    "E.g., Complete my first distraction-free work week to improve focus and productivity",
    "E.g., Gain my first 1,000 social media followers to build my online presence.",
  ]

  const startMilestoneExampleCycling = useCallback(() => {
    if (milestoneIntervalRef.current) {
      clearInterval(milestoneIntervalRef.current)
    }
    milestoneIntervalRef.current = setInterval(() => {
      setCurrentMilestoneExampleIndex((prevIndex) => (prevIndex + 1) % exampleMilestones.length)
    }, 3000)
  }, [exampleMilestones.length])

  const stopMilestoneExampleCycling = useCallback(() => {
    if (milestoneIntervalRef.current) {
      clearInterval(milestoneIntervalRef.current)
      habitIntervalRef.current = null
    }
  }, [])

  // Habit booster example cycling states
  const [currentHabitExampleIndex, setCurrentHabitExampleIndex] = useState(0)
  const habitIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const exampleHabits = [
    "E.g., Drink 8 glasses of water daily.",
    "E.g., Read for 30 minutes before bed every night.",
    "E.g., Do 10 push-ups every morning after waking up.",
    "E.g., Write in a gratitude journal 3 times per week.",
    "E.g., Take a 15-minute walk during lunch break.",
  ]

  const startHabitExampleCycling = useCallback(() => {
    if (habitIntervalRef.current) {
      clearInterval(habitIntervalRef.current)
    }
    habitIntervalRef.current = setInterval(() => {
      setCurrentHabitExampleIndex((prevIndex) => (prevIndex + 1) % exampleHabits.length)
    }, 3000) // Cycle every 3 seconds
  }, [exampleHabits.length])

  const stopHabitExampleCycling = useCallback(() => {
    if (habitIntervalRef.current) {
      clearInterval(habitIntervalRef.current)
      habitIntervalRef.current = null
    }
  }, [])

  // AI Suggestion States
  const [aiSuggestedTags, setAiSuggestedTags] = useState<string[]>([])
  const [aiSuggestedDuration, setAiSuggestedDuration] = useState<number | null>(null)
  const [aiSuggestedGamePlans, setAiSuggestedGamePlans] = useState<GamePlan[]>([])
  const [aiSuggestedHabitBoosters, setAiSuggestedHabitBooster] = useState<HabitBooster[]>([])
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [isMilestoneAiLoading, setIsMilestoneAiLoading] = useState(false)
  const [isHabitAiLoading, setIsHabitAiLoading] = useState(false)

  // Duration states
  const [manualYearsInput, setManualYearsInput] = useState<string>("")
  const [manualYearsError, setManualYearsError] = useState<string | null>(null)
  const [showManualYearsInput, setShowManualYearsInput] = useState(false)

  // Tag search state
  const [tagSearchTerm, setTagSearchTerm] = useState("")

  // Initial application flags
  const [hasAppliedInitialMilestones, setHasAppliedInitialMilestones] = useState(false)
  const [hasAppliedInitialHabits, setHasAppliedInitialHabits] = useState(false)
  const [hasAppliedInitialTags, setHasAppliedInitialTags] = useState(false) // New state for tags

  // Review section states
  const reviewScrollRef = useRef<HTMLDivElement>(null)
  const [currentReviewSectionIndex, setCurrentReviewSectionIndex] = useState(0)

  // Confirmation screen state
  const [showConfirmationScreen, setShowConfirmationScreen] = useState(false)

  const exampleGoals = [
    "E.g., Save $10,000 for an emergency fund.",
    "E.g., Go 30 days without processed sugar for better health and energy.",
    "E.g., Launch my beverage soda can business.",
    "E.g., Cut 2 hours of daily screen time for the next 14 days.",
    "E.g., Run 5 kilometers without stopping",
  ]

  // Predefined tags and their properties
  const allAvailableTags = [
    {
      name: "Health",
      icon: "💪",
      color: "bg-emerald-500/20 border-emerald-400/30 hover:bg-emerald-500/30",
      keywords: ["health", "wellness", "medical", "fitness", "exercise", "diet", "nutrition"],
    },
    {
      name: "Career",
      icon: "💼",
      color: "bg-blue-500/20 border-blue-400/30 hover:bg-blue-500/30",
      keywords: ["career", "job", "work", "professional", "business", "promotion", "skill"],
    },
    {
      name: "Learning",
      icon: "📚",
      color: "bg-purple-500/20 border-purple-400/30 hover:bg-purple-500/30",
      keywords: ["learn", "study", "education", "course", "book", "skill", "knowledge"],
    },
    {
      name: "Fitness",
      icon: "🏃",
      color: "bg-orange-500/20 border-orange-400/30 hover:bg-orange-500/30",
      keywords: ["fitness", "exercise", "workout", "gym", "run", "strength", "cardio"],
    },
    {
      name: "Finance",
      icon: "💰",
      color: "bg-green-500/20 border-green-400/30 hover:bg-green-500/30",
      keywords: ["money", "finance", "budget", "save", "invest", "debt", "income"],
    },
    {
      name: "Relationships",
      icon: "❤️",
      color: "bg-red-500/20 border-red-400/30 hover:bg-red-500/30",
      keywords: ["relationships", "family", "friends", "love", "social", "community"],
    },
    {
      name: "Personal Growth",
      icon: "🌱",
      color: "bg-yellow-500/20 border-yellow-400/30 hover:bg-yellow-500/30",
      keywords: ["personal", "growth", "self-improvement", "mindset", "development"],
    },
    {
      name: "Creativity",
      icon: "🎨",
      color: "bg-pink-500/20 border-pink-400/30 hover:bg-pink-400/30",
      keywords: ["art", "creative", "design", "writing", "music", "hobby"],
    },
    {
      name: "Productivity",
      icon: "⏱️",
      color: "bg-cyan-500/20 border-cyan-400/30 hover:bg-cyan-500/30",
      keywords: ["productivity", "efficiency", "time management", "organization", "focus"],
    },
    {
      name: "Mindfulness",
      icon: "🧘",
      color: "bg-indigo-500/20 border-indigo-400/30 hover:bg-indigo-500/30",
      keywords: ["mindfulness", "meditation", "stress relief", "well-being", "peace"],
    },
  ]

  const tagMap = new Map(allAvailableTags.map((tag) => [tag.name.toLowerCase(), tag]))

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  // Declare currentDuration here so it's accessible to all cases
  const currentDuration = goal.duration || 0

  // Snackbar functions
  const showSnackbar = useCallback(
    (message: string, item: GamePlan | HabitBooster, type: "gameplan" | "habit", index: number) => {
      setSnackbarMessage(message)
      setDeletedItem({ type, item, index })
      setSnackbarVisible(true)
    },
    [],
  )

  const hideSnackbar = useCallback(() => {
    setSnackbarVisible(false)
    setDeletedItem(null)
  }, [])

  const handleUndo = useCallback(() => {
    if (!deletedItem) return

    if (deletedItem.type === "gameplan") {
      const updatedPlans = [...goal.gamePlans]
      updatedPlans.splice(deletedItem.index, 0, deletedItem.item as GamePlan)
      updateGoal({ gamePlans: updatedPlans })
    } else if (deletedItem.type === "habit") {
      const updatedHabits = [...goal.habitBoosters]
      updatedHabits.splice(deletedItem.index, 0, deletedItem.item as HabitBooster)
      updateGoal({ habitBoosters: updatedHabits })
    }

    hideSnackbar()
  }, [deletedItem, goal.gamePlans, goal.habitBoosters])

  // Placeholder cycling functions
  const startCycling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholderIndex((prevIndex) => (prevIndex + 1) % exampleGoals.length)
    }, 3000)
  }, [exampleGoals.length])

  const stopCycling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      habitIntervalRef.current = null
    }
  }, [])

  // Effects
  useEffect(() => {
    if (goal.title.length === 0 && !isGoalInputFocused) {
      startCycling()
    } else {
      stopCycling()
    }

    return () => {
      stopCycling()
    }
  }, [goal.title.length, isGoalInputFocused, startCycling, stopCycling])

  useEffect(() => {
    if (currentStep === "game-plans" && goal.gamePlans.length === 0 && !isMilestoneAiLoading) {
      startMilestoneExampleCycling()
    } else {
      stopMilestoneExampleCycling()
    }

    return () => {
      stopMilestoneExampleCycling()
    }
  }, [
    currentStep,
    goal.gamePlans.length,
    isMilestoneAiLoading,
    startMilestoneExampleCycling,
    stopMilestoneExampleCycling,
  ])

  useEffect(() => {
    // Start cycling if we're on game-plans step and not loading AI suggestions
    if (currentStep === "game-plans" && !isMilestoneAiLoading) {
      startMilestoneExampleCycling()
    } else {
      stopMilestoneExampleCycling()
    }

    return () => {
      stopMilestoneExampleCycling()
    }
  }, [currentStep, isMilestoneAiLoading, startMilestoneExampleCycling, stopMilestoneExampleCycling])

  // Add this new useEffect after the existing milestone cycling useEffect
  useEffect(() => {
    // Restart cycling when milestones are added/removed while on the game-plans step
    if (currentStep === "game-plans" && !isMilestoneAiLoading) {
      startMilestoneExampleCycling()
    }
  }, [goal.gamePlans.length, currentStep, isMilestoneAiLoading, startMilestoneExampleCycling])

  useEffect(() => {
    if (currentStep === "habit-boosters" && goal.habitBoosters.length === 0 && !isHabitAiLoading) {
      startHabitExampleCycling()
    } else {
      stopHabitExampleCycling()
    }

    return () => {
      stopHabitExampleCycling()
    }
  }, [currentStep, goal.habitBoosters.length, isHabitAiLoading, startHabitExampleCycling, stopHabitExampleCycling])

  const updateGoal = useCallback((updates: Partial<Goal>) => {
    setGoal((prev) => ({ ...prev, ...updates }))
  }, [])

  const formatDuration = useCallback((weeks: number) => {
    if (weeks === 0) return "Not set"
    if (weeks < 4) return `${weeks} week${weeks === 1 ? "" : "s"}`

    const years = Math.floor(weeks / 52)
    const remainingWeeksAfterYears = weeks % 52

    if (years >= 1) {
      const parts = []
      parts.push(`${years} year${years === 1 ? "" : "s"}`)
      if (remainingWeeksAfterYears > 0) {
        const months = Math.floor(remainingWeeksAfterYears / 4.33)
        if (months > 0) {
          parts.push(`${months} month${months === 1 ? "" : "s"}`)
        } else {
          parts.push(`${remainingWeeksAfterYears} week${remainingWeeksAfterYears === 1 ? "" : "s"}`)
        }
      }
      return parts.join(" and ")
    } else {
      const months = Math.round(weeks / 4.33)
      return months === 1 ? "1 month" : `${months} months`
    }
  }, [])

  const getDurationCategory = useCallback((weeks: number) => {
    if (weeks <= 4) return { label: "Sprint", color: "text-cyan-100", bg: "bg-cyan-500/40" }
    if (weeks <= 12) return { label: "Short-term", color: "text-blue-100", bg: "bg-blue-500/40" }
    if (weeks <= 52) return { label: "Medium-term", color: "text-green-100", bg: "bg-green-500/40" }
    if (weeks <= 260) return { label: "Long-term", color: "text-orange-100", bg: "bg-orange-500/40" }
    return { label: "Very Long-term", color: "text-red-100", bg: "bg-red-500/40" }
  }, [])

  // Auto-apply AI suggestions effects
  useEffect(() => {
    if (currentStep === "duration" && aiSuggestedDuration !== null && goal.duration === undefined) {
      updateGoal({ duration: aiSuggestedDuration })
    }
  }, [aiSuggestedDuration, currentStep, goal.duration, updateGoal])

  useEffect(() => {
    if (
      currentStep === "game-plans" &&
      aiSuggestedGamePlans.length > 0 &&
      goal.gamePlans.length === 0 &&
      !hasAppliedInitialMilestones
    ) {
      updateGoal({ gamePlans: aiSuggestedGamePlans })
      setHasAppliedInitialMilestones(true)
    }
  }, [aiSuggestedGamePlans, currentStep, goal.gamePlans.length, updateGoal, hasAppliedInitialMilestones])

  useEffect(() => {
    if (
      currentStep === "habit-boosters" &&
      aiSuggestedHabitBoosters.length > 0 &&
      goal.habitBoosters.length === 0 &&
      !hasAppliedInitialHabits
    ) {
      updateGoal({ habitBoosters: aiSuggestedHabitBoosters })
      setHasAppliedInitialHabits(true)
    }
  }, [aiSuggestedHabitBoosters, currentStep, goal.habitBoosters.length, updateGoal, hasAppliedInitialHabits])

  // Auto-apply AI tags when entering the step for the first time with suggestions
  useEffect(() => {
    if (currentStep === "goal-tag" && aiSuggestedTags.length > 0 && goal.tags.length === 0 && !hasAppliedInitialTags) {
      const newTags: string[] = []
      aiSuggestedTags.forEach((aiTag) => {
        const normalizedAiTag = aiTag.trim().toLowerCase()
        const matchedPreset = allAvailableTags.find((preset) => preset.name.toLowerCase() === normalizedAiTag)

        if (matchedPreset) {
          if (!newTags.includes(matchedPreset.name)) {
            newTags.push(matchedPreset.name)
          }
        } else {
          if (!newTags.includes(aiTag.trim())) {
            newTags.push(aiTag.trim())
          }
        }
      })
      updateGoal({ tags: [...new Set(newTags)] })
      setHasAppliedInitialTags(true) // Set the flag to true after applying
    }
  }, [aiSuggestedTags, currentStep, goal.tags.length, updateGoal, allAvailableTags, hasAppliedInitialTags])

  useEffect(() => {
    setHasAppliedInitialMilestones(false)
    setHasAppliedInitialHabits(false)
    setHasAppliedInitialTags(false) // Reset for tags too
  }, [goal.title])

  useEffect(() => {
    if (currentStep === "duration") {
      if (showManualYearsInput) {
        if (goal.duration && goal.duration > 52 && manualYearsInput === "") {
          setManualYearsInput((goal.duration / 52).toFixed(1).replace(/\.0$/, ""))
        }
      } else {
        setManualYearsInput("")
        setManualYearsError(null)
      }
    }
  }, [currentStep, goal.duration, showManualYearsInput, manualYearsInput])

  // Navigation functions
  const handleNext = useCallback(async () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      const nextStepKey = steps[nextIndex].key
      setCurrentStep(nextStepKey)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [currentStepIndex])

  const handlePrevious = useCallback(() => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [currentStepIndex])

  // Game plan functions
  const addGamePlan = useCallback(() => {
    const newGamePlan: GamePlan = {
      id: Date.now().toString(),
      title: "",
      notes: "",
    }
    updateGoal({ gamePlans: [...goal.gamePlans, newGamePlan] })
  }, [goal.gamePlans, updateGoal])

  const updateGamePlan = useCallback(
    (id: string, updates: Partial<GamePlan>) => {
      const updatedPlans = goal.gamePlans.map((plan) => (plan.id === id ? { ...plan, ...updates } : plan))
      updateGoal({ gamePlans: updatedPlans })
    },
    [goal.gamePlans, updateGoal],
  )

  const removeGamePlan = useCallback(
    (id: string) => {
      const planIndex = goal.gamePlans.findIndex((plan) => plan.id === id)
      const planToDelete = goal.gamePlans[planIndex]

      if (planToDelete) {
        const updatedPlans = goal.gamePlans.filter((plan) => plan.id !== id)
        updateGoal({ gamePlans: updatedPlans })
        showSnackbar("Milestone deleted", planToDelete, "gameplan", planIndex)
      }
    },
    [goal.gamePlans, updateGoal, showSnackbar],
  )

  // Habit booster functions
  const addHabitBooster = useCallback(() => {
    const newHabit: HabitBooster = {
      id: Date.now().toString(),
      title: "",
      frequency: "daily",
    }
    updateGoal({ habitBoosters: [...goal.habitBoosters, newHabit] })
  }, [goal.habitBoosters, updateGoal])

  const updateHabitBooster = useCallback(
    (id: string, updates: Partial<HabitBooster>) => {
      const updatedHabits = goal.habitBoosters.map((habit) => (habit.id === id ? { ...habit, ...updates } : habit))
      updateGoal({ habitBoosters: updatedHabits })
    },
    [goal.habitBoosters, updateGoal],
  )

  const removeHabitBooster = useCallback(
    (id: string) => {
      const habitIndex = goal.habitBoosters.findIndex((habit) => habit.id === id)
      const habitToDelete = goal.habitBoosters[habitIndex]

      if (habitToDelete) {
        const updatedHabits = goal.habitBoosters.filter((habit) => habit.id !== id)
        updateGoal({ habitBoosters: updatedHabits })
        showSnackbar("Habit deleted", habitToDelete, "habit", habitIndex)
      }
    },
    [goal.habitBoosters, updateGoal, showSnackbar],
  )

  const calculateTargetDate = useCallback(() => {
    if (goal.startDate && goal.duration) {
      const targetDate = new Date(goal.startDate)
      targetDate.setDate(targetDate.getDate() + goal.duration * 7)
      return targetDate
    }
    return null
  }, [goal.startDate, goal.duration])

  const moveGamePlan = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const draggedPlan = goal.gamePlans[dragIndex]
      const updatedPlans = [...goal.gamePlans]
      updatedPlans.splice(dragIndex, 1)
      updatedPlans.splice(hoverIndex, 0, draggedPlan)
      updateGoal({ gamePlans: updatedPlans })
    },
    [goal.gamePlans, updateGoal],
  )

  const handleConfirm = useCallback(() => {
    setShowConfirmationScreen(true)
  }, [])

  const handlePetIntroduction = useCallback(() => {
    setShowConfirmationScreen(false)
    setCurrentStep("goal-title")
    setGoal({
      title: "",
      notes: "",
      tags: [],
      gamePlans: [],
      habitBoosters: [],
    })
  }, [])

  // Review scroll functions
  const handleReviewScroll = useCallback((direction: "left" | "right") => {
    if (reviewScrollRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = reviewScrollRef.current
      const sectionWidth = clientWidth

      let newScrollLeft = scrollLeft
      if (direction === "right") {
        newScrollLeft = Math.min(scrollWidth - clientWidth, scrollLeft + sectionWidth)
      } else {
        newScrollLeft = Math.max(0, scrollLeft - sectionWidth)
      }
      reviewScrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" })
    }
  }, [])

  useEffect(() => {
    if (currentStep === "review") {
      return
    }

    const scrollElement = reviewScrollRef.current
    if (!scrollElement) {
      return
    }

    const handleScroll = () => {
      const { scrollLeft, clientWidth } = scrollElement
      const newIndex = Math.round(scrollLeft / clientWidth)
      setCurrentReviewSectionIndex(newIndex)
    }

    scrollElement.addEventListener("scroll", handleScroll)

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [currentStep])

  useEffect(() => {
    if (currentStep === "review" && scrollBackToIndex !== null && reviewScrollRef.current) {
      const scrollAmount = reviewScrollRef.current.clientWidth * scrollBackToIndex
      reviewScrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" })
      setScrollBackToIndex(null)
    }
  }, [currentStep, scrollBackToIndex])

  const renderStepContent = () => {
    switch (currentStep) {
      case "goal-title":
        return (
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <Textarea
                ref={goalTitleInputRef as React.RefObject<HTMLTextAreaElement>}
                placeholder={
                  goal.title.length > 0
                    ? ""
                    : isGoalInputFocused
                      ? "Enter your goal..."
                      : exampleGoals[currentPlaceholderIndex]
                }
                value={goal.title}
                onChange={(e) => {
                  updateGoal({ title: e.target.value })

                  e.target.style.height = "auto"
                  e.target.style.height = e.target.scrollHeight + "px"
                }}
                onFocus={() => {
                  setIsGoalInputFocused(true)
                  stopCycling()
                }}
                onBlur={async () => {
                  setIsGoalInputFocused(false)
                  if (goal.title.length === 0) {
                    startCycling()
                  }

                  if (goal.title.trim().length > 5) {
                    setIsAiLoading(true)
                    setIsMilestoneAiLoading(true)
                    setIsHabitAiLoading(true)

                    const [tagsDurationResult, milestonesResult] = await Promise.all([
                      getAiTagsAndDuration(goal.title),
                      getAiMilestones(goal.title),
                    ])

                    if (tagsDurationResult.error) {
                      console.error("AI Tags/Duration Suggestion Error:", tagsDurationResult.error)
                    } else {
                      setAiSuggestedTags(tagsDurationResult.tags)
                      setAiSuggestedDuration(tagsDurationResult.duration)
                    }
                    setIsAiLoading(false)

                    if (milestonesResult.error) {
                      console.error("AI Milestone Suggestion Error:", milestonesResult.error)
                    } else {
                      setAiSuggestedGamePlans(milestonesResult.milestones)
                    }
                    setIsMilestoneAiLoading(false)

                    const habitsResult = await getAiHabitsAndLinks(goal.title, milestonesResult.milestones)
                    if (habitsResult.error) {
                      console.error("AI Habit Suggestion Error:", habitsResult.error)
                    } else {
                      setAiSuggestedHabitBooster(habitsResult.habits)
                    }
                    setIsHabitAiLoading(false)
                  } else {
                    setAiSuggestedTags([])
                    setAiSuggestedDuration(null)
                    setAiSuggestedGamePlans([])
                    setAiSuggestedHabitBooster([])
                    setIsAiLoading(false)
                    setIsMilestoneAiLoading(false)
                    setIsHabitAiLoading(false)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    goalTitleInputRef.current?.blur()
                  }
                }}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/80 text-base md:text-lg p-4 md:p-6 rounded-2xl text-center w-full min-h-[96px] md:min-h-[112px] resize-none scrollbar-hide flex items-center focus-visible:outline-none focus-visible:ring-0"
                rows={1}
              />

              <div className="flex justify-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-purple-200 hover:text-white hover:bg-white/10 rounded-full px-4 py-3 md:px-6 md:py-3 min-h-[44px] text-sm md:text-base"
                >
                  <StickyNote className="w-4 h-4 mr-2" />
                  {showNotes ? "Hide notes" : goal.notes && goal.notes.length > 0 ? "Show notes" : "Add notes"}
                </Button>
              </div>

              {showNotes && (
                <Textarea
                  placeholder="Add any details about your goal..."
                  value={goal.notes}
                  onChange={(e) => updateGoal({ notes: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-2xl p-4 md:p-6 text-base md:text-lg scrollbar-hide focus-visible:outline-none focus-visible:ring-0"
                  rows={3}
                />
              )}
            </div>
            {isOnboarding && goal.title && (
              <div className="text-center mt-6">
                <div className="bg-gradient-to-r from-primary-500/10 to-purple-500/10 rounded-2xl p-4 border border-primary-400/20">
                  <p className="text-primary-200 text-sm md:text-base">
                    That's a powerful start! Let's build your path to success. ✨
                  </p>
                </div>
              </div>
            )}
          </div>
        )

      case "goal-tag":
        const finalDisplayTags = [...allAvailableTags]

        if (aiSuggestedTags.length > 0 && !isAiLoading) {
          aiSuggestedTags.forEach((aiTag) => {
            const existingTagIndex = finalDisplayTags.findIndex((tag) => tag.name.toLowerCase() === aiTag.toLowerCase())

            if (existingTagIndex !== -1) {
              finalDisplayTags[existingTagIndex] = {
                ...finalDisplayTags[existingTagIndex],
                description: "AI Suggestion",
                isAiSuggestion: true,
              }
            } else {
              if (!finalDisplayTags.some((tag) => tag.name.toLowerCase() === aiTag.toLowerCase())) {
                finalDisplayTags.push({
                  name: aiTag,
                  icon: "⚡",
                  color: "bg-purple-500/20 border-purple-400/30 hover:bg-purple-500/30",
                  keywords: [],
                  description: "AI Suggestion",
                  isAiSuggestion: true,
                  type: "ai-custom",
                })
              }
            }
          })
        }

        const displayableTags = finalDisplayTags.filter(
          (tag) =>
            tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase()) ||
            tag.keywords.some((keyword) => keyword.toLowerCase().includes(tagSearchTerm.toLowerCase())),
        )

        const toggleTag = (tagName: string) => {
          const newTags = goal.tags.includes(tagName)
            ? goal.tags.filter((tag) => tag !== tagName)
            : goal.tags.length < 3
              ? [...goal.tags, tagName]
              : goal.tags
          updateGoal({ tags: newTags })
        }

        const addCustomTag = (tagName: string) => {
          if (tagName.trim() && !goal.tags.includes(tagName.trim()) && goal.tags.length < 3) {
            updateGoal({ tags: [...goal.tags, tagName.trim()] })
            setCustomTagInput("")
            setTagSearchTerm("")
            setShowCustomTagInput(false)
          }
        }

        const customTagSuggestions = allAvailableTags
          .map((tag) => tag.name)
          .filter(
            (tag) =>
              tag.toLowerCase().includes(customTagInput.toLowerCase()) &&
              !goal.tags.includes(tag) &&
              customTagInput.length > 0,
          )
          .slice(0, 4)

        return (
          <div className="space-y-6 md:space-y-8">
            {goal.tags.length > 0 && (
              <div className="text-center">
                <p className="text-purple-200 text-sm mb-3">Selected tags:</p>
                <div className="flex flex-wrap justify-center gap-3 max-w-full">
                  {goal.tags.map((tag) => {
                    const matchedTag = tagMap.get(tag.toLowerCase())
                    const icon = matchedTag?.icon || "💡"
                    return (
                      <div
                        key={tag}
                        className="inline-flex items-center gap-3 rounded-full px-4 py-2 bg-white/15 border border-white/100 backdrop-blur-sm flex-shrink-0 relative"
                      >
                        <span className="text-xl">{icon}</span>
                        <span className="text-sm font-medium text-white">{tag}</span>
                        <button
                          onClick={() => toggleTag(tag)}
                          className="text-white/60 hover:text-white ml-2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-base"
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <Input
                placeholder="Search or add tags..."
                value={tagSearchTerm}
                onChange={(e) => {
                  setTagSearchTerm(e.target.value)
                  setShowCustomTagInput(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur()
                    e.preventDefault()
                  }
                }}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl pl-9 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>

            <div className="w-full overflow-hidden">
              {isAiLoading && goal.title.trim().length > 5 ? (
                <div className="text-center text-purple-300 flex items-center justify-center gap-2 py-8">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating AI tag suggestions...</span>
                </div>
              ) : displayableTags.length > 0 ? (
                <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                  {Array.from({ length: Math.ceil(displayableTags.length / 6) }, (_, pageIndex) => (
                    <div key={pageIndex} className="flex-shrink-0 w-full snap-center">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 leading-7 h-full auto-rows-fr">
                        {Array.from({ length: 6 }, (_, index) => {
                          const tag = displayableTags[pageIndex * 6 + index]

                          if (!tag) {
                            // Empty placeholder to maintain grid structure
                            return <div key={`placeholder-${index}`} className="invisible w-full h-full" />
                          }

                          const isSelected = goal.tags.includes(tag.name)
                          const isDisabled = !isSelected && goal.tags.length >= 3

                          return (
                            <button
                              key={tag.name}
                              onClick={() => toggleTag(tag.name)}
                              disabled={isDisabled}
                              className={`${
                                isSelected
                                  ? "bg-white/15 border-white/100 ring-1 ring-white/50"
                                  : "bg-white/5 border-white/20 hover:bg-white/10"
                              } ${
                                isDisabled ? "opacity-50 cursor-not-allowed" : ""
                              } rounded-3xl p-4 md:p-5 text-white transition-all duration-200 min-h-[90px] md:min-h-[100px] flex flex-col items-center justify-center gap-3 relative backdrop-blur-sm border w-full h-full`}
                            >
                              <span className="text-3xl md:text-4xl">{tag.icon}</span>
                              <span className="text-sm md:text-base font-medium text-center">{tag.name}</span>
                              {tag.isAiSuggestion && (
                                <div className="absolute bottom-2 right-2 w-4 h-4 flex items-center justify-center">
                                  <Zap className="w-3 h-3 text-yellow-300" />
                                </div>
                              )}
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-purple-300 py-8">
                  <p>No tags found matching "{tagSearchTerm}".</p>
                  {!showCustomTagInput && goal.tags.length < 3 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        addCustomTag(tagSearchTerm)
                      }}
                      className="mt-4 border-white/30 text-white hover:bg-white/20 rounded-full px-6 py-3 bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add "{tagSearchTerm}" as Custom Tag
                    </Button>
                  )}
                </div>
              )}

              {displayableTags.length > 6 && (
                <div className="flex justify-center gap-2 mt-4 text-purple-200 text-sm">
                  {displayableTags.length > 6 && <span>← Swipe for more →</span>}
                </div>
              )}
            </div>

            {/* NEW LOCATION for Apply AI Suggestions button */}
            {aiSuggestedTags.length > 0 && !aiSuggestedTags.every((tag) => goal.tags.includes(tag)) && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    const newTagsToAdd: string[] = []
                    aiSuggestedTags.forEach((aiTag) => {
                      const normalizedAiTag = aiTag.trim()
                      if (!goal.tags.includes(normalizedAiTag)) {
                        // Add only if not already present
                        newTagsToAdd.push(normalizedAiTag)
                      }
                    })
                    // Combine existing tags with new AI suggested tags, ensure uniqueness and max 3 tags
                    const combinedAndUniqueTags = Array.from(new Set([...goal.tags, ...newTagsToAdd])).slice(0, 3)
                    updateGoal({ tags: combinedAndUniqueTags })
                  }}
                  className="border-white/30 text-white hover:bg-white/20 rounded-full px-6 py-3 bg-transparent"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Apply AI Suggestions
                </Button>
              </div>
            )}
            {showCustomTagInput && goal.tags.length < 3 && (
              <div className="space-y-3 mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your tag..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        addCustomTag(customTagInput)
                      } else if (e.key === "Escape") {
                        setShowCustomTagInput(false)
                        setCustomTagInput("")
                      }
                    }}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl flex-1 focus-visible:outline-none focus-visible:ring-0"
                    autoFocus
                  />
                  <Button
                    onClick={() => addCustomTag(customTagInput)}
                    disabled={!customTagInput.trim() || goal.tags.length >= 3}
                    className="bg-primary-500 hover:bg-primary-600 text-white rounded-xl px-4 disabled:opacity-50"
                  >
                    Add
                  </Button>
                </div>

                {customTagSuggestions.length > 0 && goal.tags.length < 3 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-purple-300">Suggestions:</span>
                    {customTagSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => addCustomTag(suggestion)}
                        className="text-xs bg-white/10 hover:bg-white/20 text-white rounded-full px-3 py-1 border border-white/20 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowCustomTagInput(false)
                      setCustomTagInput("")
                    }}
                    className="text-purple-200 hover:text-white hover:bg-white/10 rounded-full px-4 text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {goal.tags.length >= 3 && (
              <p className="text-xs text-purple-300 mt-2 text-center">Maximum 3 tags allowed</p>
            )}
          </div>
        )

      case "start-date":
        const today = new Date()
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const startDateMidnight = goal.startDate
          ? new Date(goal.startDate.getFullYear(), goal.startDate.getMonth(), goal.startDate.getDate())
          : null
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        const nextWeek = new Date(today)
        nextWeek.setDate(nextWeek.getDate() + 7)

        const dateOptions = [
          { label: "Today", date: today, icon: "🚀", description: "Start right now!", type: "preset" },
          {
            label: "Tomorrow",
            date: tomorrow,
            icon: "☀️",
            description: "Give yourself a day to prepare",
            type: "preset",
          },
          { label: "Next Week", date: nextWeek, icon: "⏰", description: "Plan and get ready", type: "preset" },
          { label: "Pick a Custom Date", icon: "🗓️", description: "Choose any date on the calendar", type: "custom" },
        ]

        const isCustomDateSelected =
          goal.startDate &&
          !dateOptions
            .filter((opt) => opt.type === "preset")
            .some((opt) => goal.startDate && goal.startDate.toDateString() === opt.date.toDateString())

        return (
          <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {dateOptions.map((option) => {
                if (option.type === "custom") {
                  return (
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen} key={option.label}>
                      <PopoverTrigger asChild>
                        <button
                          onClick={() => {
                            updateGoal({ startDate: undefined }) // Clear any existing selection
                            setIsCalendarOpen(true)
                          }}
                          className={`${
                            isCustomDateSelected
                              ? "bg-white/15 border-white/100 ring-1 ring-white/50"
                              : "bg-white/5 border-white/20 hover:bg-white/10"
                          } border rounded-2xl p-4 md:p-5 text-white transition-all duration-200 hover:scale-105 min-h-[100px] md:min-h-[110px] flex flex-col items-center justify-center gap-2 relative`}
                        >
                          <span className="text-3xl md:text-4xl">{option.icon}</span>
                          <span className="text-base md:text-lg font-semibold">{option.label}</span>
                          <span className="text-xs md:text-sm text-purple-200 text-center leading-tight">
                            {option.description}
                          </span>
                          {isCustomDateSelected && (
                            <div className="absolute top-3 right-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0 bg-white border shadow-2xl"
                        align="center"
                        side="bottom"
                        sideOffset={8}
                        style={{ zIndex: 99999 }}
                        onOpenAutoFocus={(e) => e.preventDefault()}
                      >
                        <div className="relative z-[99999] bg-white rounded-xl overflow-hidden">
                          <Calendar
                            mode="single"
                            selected={goal.startDate}
                            onSelect={(date) => {
                              updateGoal({ startDate: date })
                              setIsCalendarOpen(false)
                            }}
                            initialFocus
                            className="rounded-xl"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  )
                } else {
                  const isSelected = goal.startDate && goal.startDate.toDateString() === option.date.toDateString()

                  return (
                    <button
                      key={option.label}
                      onClick={() => updateGoal({ startDate: option.date })}
                      className={`${
                        isSelected
                          ? "bg-white/15 border-white/100 ring-1 ring-white/50"
                          : "bg-white/5 border-white/20 hover:bg-white/10"
                      } border rounded-2xl p-4 md:p-5 text-white transition-all duration-200 hover:scale-105 min-h-[100px] md:min-h-[110px] flex flex-col items-center justify-center gap-2 relative`}
                    >
                      <span className="text-3xl md:text-4xl">{option.icon}</span>
                      <span className="text-base md:text-lg font-semibold">{option.label}</span>
                      <span className="text-xs md:text-sm text-purple-200 text-center leading-tight">
                        {option.description}
                      </span>
                      <span className="text-xs text-purple-300 mt-1">{format(option.date, "MMM d, yyyy")}</span>
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </button>
                  )
                }
              })}
            </div>

            {goal.startDate && (
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-white/10 rounded-2xl px-6 py-4 border border-white/20 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-primary-200" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold text-lg">{format(goal.startDate, "EEEE, MMMM d")}</p>
                    <p className="text-purple-200 text-sm">
                      {goal.startDate && goal.startDate.toDateString() !== today.toDateString()
                        ? goal.startDate < today
                          ? `Started ${Math.round((todayMidnight.getTime() - startDateMidnight!.getTime()) / (1000 * 60 * 60 * 24))} days ago 🥳`
                          : goal.startDate.toDateString() === tomorrow.toDateString()
                            ? "Starting tomorrow! 🌅"
                            : `${Math.round((startDateMidnight!.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24))} days from now 😎`
                        : "Starting today! 🎉"}
                    </p>
                  </div>
                  <button
                    onClick={() => updateGoal({ startDate: undefined })}
                    className="text-white/60 hover:text-white ml-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        )

      case "duration":
        const durationPresetsConfig = [
          { weeks: 4, label: "1 Month", icon: "🚀", description: "Quick wins & momentum", type: "preset" },
          { weeks: 12, label: "3 Months", icon: "🎯", description: "Focused sprint", type: "preset" },
          { weeks: 26, label: "6 Months", icon: "🌱", description: "Steady growth", type: "preset" },
          {
            label: "More than 1 year",
            icon: "⏳",
            description: "Set a custom duration in years",
            type: "custom-years",
          },
        ]

        const finalDisplayPresets = [...durationPresetsConfig]

        if (aiSuggestedDuration !== null && !isAiLoading) {
          const aiMatchesOneMonth = aiSuggestedDuration === 4
          const aiMatchesThreeMonths = aiSuggestedDuration === 12
          const aiMatchesSixMonths = aiSuggestedDuration === 26
          const aiMatchesMoreThan1Year = aiSuggestedDuration > 52

          const shouldReplaceSixMonths =
            !aiMatchesOneMonth && !aiMatchesThreeMonths && !aiMatchesSixMonths && !aiMatchesMoreThan1Year

          if (shouldReplaceSixMonths) {
            finalDisplayPresets[2] = {
              weeks: aiSuggestedDuration,
              label: formatDuration(aiSuggestedDuration),
              icon: "✨",
              description: "AI Suggestion",
              type: "preset",
              isAiSuggestion: true,
            }
          }
        }

        const category = goal.duration
          ? getDurationCategory(goal.duration)
          : { label: "Not set", color: "text-slate-100", bg: "bg-white/15" }

        return (
          <div className="text-center space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              {isAiLoading && goal.title.trim().length > 5 ? (
                <>
                  <DurationSkeleton />
                  <DurationSkeleton />
                  <DurationSkeleton />
                  <DurationSkeleton />
                </>
              ) : (
                finalDisplayPresets.map((preset) => {
                  let description = preset.description
                  let showAiZapIcon = false

                  if (aiSuggestedDuration !== null && !isAiLoading) {
                    if (preset.isAiSuggestion) {
                      showAiZapIcon = true
                    } else if (
                      (preset.type === "preset" && preset.weeks === aiSuggestedDuration) ||
                      (preset.type === "custom-years" && aiSuggestedDuration > 52)
                    ) {
                      showAiZapIcon = true
                    }
                  }

                  if (showAiZapIcon) {
                    description = "AI Suggestion"
                  }

                  const isSelected = preset.type === "preset" ? goal.duration === preset.weeks : showManualYearsInput

                  return (
                    <button
                      key={preset.label}
                      onClick={() => {
                        if (preset.type === "preset") {
                          updateGoal({ duration: preset.weeks })
                          setShowManualYearsInput(false)
                          setManualYearsInput("")
                          setManualYearsError(null)
                        } else {
                          setShowManualYearsInput(true)
                          updateGoal({ duration: undefined })
                          setManualYearsInput("")
                          setManualYearsError(null)
                        }
                      }}
                      className={`${
                        isSelected
                          ? "bg-white/15 border-white/100 ring-1 ring-white/50 scale-105"
                          : "bg-white/10 border-white/20 hover:bg-white/10"
                      } border rounded-2xl p-4 text-white transition-all duration-200 hover:scale-105 min-h-[100px] flex flex-col items-center justify-center gap-2 relative w-full`}
                    >
                      <span className="text-2xl md:text-3xl">{preset.icon}</span>
                      <span className="text-sm md:text-base font-semibold">{preset.label}</span>
                      <span className="text-xs text-purple-200 text-center leading-tight">{description}</span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {showAiZapIcon && (
                        <div className="absolute bottom-2 right-2 w-4 h-4 flex items-center justify-center">
                          <Zap className="w-3 h-3 text-yellow-300" />
                        </div>
                      )}
                    </button>
                  )
                })
              )}
            </div>
            {showManualYearsInput ? (
              <div className="space-y-4 mt-8">
                <p className="text-purple-200 text-sm mb-2">Enter duration in years:</p>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="e.g., 7"
                    value={manualYearsInput}
                    onChange={(e) => {
                      const value = e.target.value
                      setManualYearsInput(value)
                      setManualYearsError(null)

                      const years = Number(value)
                      if (value === "") {
                        updateGoal({ duration: undefined })
                      } else if (isNaN(years) || years <= 0) {
                        // Do not update goal.duration yet, let onBlur handle the error state
                      } else {
                        updateGoal({ duration: years * 52 })
                      }
                    }}
                    onBlur={() => {
                      const years = Number(manualYearsInput)
                      if (manualYearsInput === "") {
                        updateGoal({ duration: undefined })
                        setManualYearsError(null)
                      } else if (isNaN(years) || years <= 0) {
                        updateGoal({ duration: undefined })
                        setManualYearsError("Please enter a valid number of years (e.g., 1, 2.5).")
                      } else {
                        updateGoal({ duration: years * 52 })
                        setManualYearsError(null)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.currentTarget.blur()
                        e.preventDefault()
                      }
                    }}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl flex-1 focus-visible:outline-none focus-visible:ring-0"
                    min="0.1"
                    step="0.1"
                  />
                  <span className="text-white">years</span>
                  {manualYearsInput !== "" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setManualYearsInput("")
                        updateGoal({ duration: undefined })
                        setShowManualYearsInput(false)
                        setManualYearsError(null)
                      }}
                      className="text-white/60 hover:text-white hover:bg-white/20 rounded-full w-8 h-8"
                      title="Clear years input"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {manualYearsError && <p className="text-red-400 text-sm mt-1">{manualYearsError}</p>}
                {goal.duration && goal.duration <= 52 && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowManualYearsInput(false)
                      setManualYearsError(null)
                    }}
                    className="text-purple-200 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 text-sm mt-4"
                  >
                    Use Slider
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6 mt-8">
                <div className="text-center">
                  <p className="text-purple-200 text-sm mb-4">Or choose a custom duration:</p>
                </div>
                <div className="px-4">
                  <div className="flex justify-between text-sm text-purple-200 mb-2">
                    <span>1 week</span>
                    <span>1 year</span>
                  </div>
                  <Slider
                    value={[currentDuration]}
                    onValueChange={([value]) => {
                      updateGoal({ duration: value })
                      setShowManualYearsInput(false)
                      setManualYearsError(null)
                    }}
                    max={52}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}
            {goal.duration !== undefined && goal.duration > 0 && (
              <div className="text-center mt-6">
                <div className="inline-flex items-center gap-4 bg-white/10 rounded-2xl px-6 py-4 border border-white/20">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${category.bg} ${category.color}`}>
                    {category.label}
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-xl font-semibold text-white">
                      {showManualYearsInput && manualYearsInput && !manualYearsError && Number(manualYearsInput) > 0
                        ? formatDuration(goal.duration!)
                        : goal.duration
                          ? formatDuration(goal.duration)
                          : "Select a timeframe above"}
                    </div>
                    <div className="text-sm text-purple-200">
                      {Math.round(currentDuration)} {Math.round(currentDuration) === 1 ? "week" : "weeks"}
                    </div>
                  </div>
                  {goal.duration !== undefined && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        updateGoal({ duration: undefined })
                        setManualYearsInput("")
                        setShowManualYearsInput(false)
                        setManualYearsError(null)
                      }}
                      className="text-white/60 hover:text-white hover:bg-white/20 rounded-full w-8 h-8"
                      title="Reset duration"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}
            {goal.startDate && (
              <div className="space-y-4 mt-8">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-4">Your Timeline</h3>
                </div>
                <div className="w-full overflow-hidden">
                  <div className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                    {goal.startDate && (
                      <div className="flex-shrink-0 w-full max-w-sm mx-auto snap-center">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 h-full">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center">
                              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                                <span className="text-green-400 text-xl">🚀</span>
                              </div>
                              <p className="text-sm font-medium text-white">Start</p>
                              <p className="text-xs text-purple-200">{format(goal.startDate, "MMM d")}</p>
                            </div>

                            <div className="flex-1 mx-4">
                              <div className="text-center mb-2">
                                <div className="bg-white/20 rounded-full px-3 py-1 inline-block">
                                  <span className="text-xs font-medium text-white">
                                    {formatDuration(currentDuration)}
                                  </span>
                                </div>
                              </div>
                              <div className="relative">
                                <div className="h-2 bg-white/10 rounded-full">
                                  <div className="h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full w-full"></div>
                                </div>
                              </div>
                            </div>

                            <div className="text-center"></div>

                            <div className="text-center">
                              <div
                                className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center
                                mb-1"
                              >
                                <span className="text-blue-400 text-lg">🏆</span>
                              </div>
                              <p className="text-xs font-medium text-white">Goal</p>
                              <p className="text-xs text-purple-200">
                                {calculateTargetDate() && format(calculateTargetDate()!, "MMM d")}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
                            <div className="text-center">
                              <div className="text-sm font-medium text-white">25% Mark</div>
                              <div className="text-xs text-purple-200">
                                {goal.startDate &&
                                  format(
                                    new Date(
                                      goal.startDate.getTime() + currentDuration * 7 * 24 * 60 * 60 * 1000 * 0.25,
                                    ),
                                    "MMM d",
                                  )}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-white">Halfway</div>
                              <div className="text-xs text-purple-200">
                                {goal.startDate &&
                                  format(
                                    new Date(
                                      goal.startDate.getTime() + currentDuration * 7 * 24 * 60 * 60 * 1000 * 0.5,
                                    ),
                                    "MMM d",
                                  )}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-white">75% Mark</div>
                              <div className="text-xs text-purple-200">
                                {goal.startDate &&
                                  format(
                                    new Date(
                                      goal.startDate.getTime() + currentDuration * 7 * 24 * 60 * 60 * 1000 * 0.75,
                                    ),
                                    "MMM d",
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case "game-plans":
        const populatedGamePlans = goal.gamePlans.filter((plan) => plan.title.trim().length > 0)
        const canAddMilestone = populatedGamePlans.length === goal.gamePlans.length || goal.gamePlans.length === 0

        return (
          <div className="space-y-6 md:space-y-8">
            {isMilestoneAiLoading && goal.title.trim().length > 5 ? (
              <div className="text-center space-y-4">
                <div className="text-purple-300 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating AI milestone suggestions... This might take a moment.</span>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <MilestoneSkeleton key={i} />
                  ))}
                </div>
                <Button
                  onClick={() => {
                    setIsMilestoneAiLoading(false)
                    setAiSuggestedGamePlans([])
                  }}
                  variant="ghost"
                  className="text-purple-200 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 text-sm"
                >
                  Skip AI Suggestions
                </Button>
              </div>
            ) : null}

            {!isMilestoneAiLoading && goal.gamePlans.length === 0 && (
              <div className="text-center space-y-6">
                <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Flag className="w-8 h-8 text-primary-200" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Add Your First Milestone</h3>

                  {currentStep === "game-plans" && goal.gamePlans.length === 0 && !isMilestoneAiLoading && (
                    <div className="text-purple-300 text-xs mb-4 max-w-md mx-auto min-h-[2.5rem] flex items-center justify-center">
                      <p className="text-center leading-tight">{exampleMilestones[currentMilestoneExampleIndex]}</p>
                    </div>
                  )}

                  <p className="text-purple-200 text-sm mb-6 max-w-md mx-auto">
                    Small milestones help you stay on track
                  </p>

                  {aiSuggestedGamePlans.length > 0 && (
                    <div className="mb-4">
                      <Button
                        onClick={() => updateGoal({ gamePlans: aiSuggestedGamePlans })}
                        variant="outline"
                        className="bg-white text-purple-700 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Apply AI Suggestions
                      </Button>
                    </div>
                  )}
                  {canAddMilestone && (
                    <Button
                      onClick={addGamePlan}
                      className="bg-white text-purple-700 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Set My First Milestone
                    </Button>
                  )}
                </div>
              </div>
            )}

            {goal.gamePlans.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Your Milestones</h3>
                  <span className="text-sm text-purple-300 ">
                    {populatedGamePlans.length} milestone{populatedGamePlans.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {goal.gamePlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-200 font-semibold text-sm">
                          {index + 1}
                        </div>
                        {goal.gamePlans.length > 1 && (
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => index > 0 && moveGamePlan(index, index - 1)}
                              disabled={index === 0}
                              className="w-6 h-6 flex items-center justify-center text-purple-300 hover:text-white hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Move up"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => index < goal.gamePlans.length - 1 && moveGamePlan(index, index + 1)}
                              disabled={index === goal.gamePlans.length - 1}
                              className="w-6 h-6 flex items-center justify-center text-purple-300 hover:text-white hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Move down"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-3 min-w-0">
                        <Textarea
                          placeholder={
                            plan.title.length > 0
                              ? ""
                              : focusedMilestoneId === plan.id
                                ? "Enter your milestone..."
                                : exampleMilestones[currentMilestoneExampleIndex]
                          }
                          value={plan.title}
                          onChange={(e) => {
                            updateGamePlan(plan.id, { title: e.target.value })
                            e.target.style.height = "auto"
                            e.target.style.height = e.target.scrollHeight + "px"
                          }}
                          onFocus={() => setFocusedMilestoneId(plan.id)}
                          onBlur={() => setFocusedMilestoneId(null)}
                          ref={(textarea) => {
                            if (textarea) {
                              textarea.style.height = "auto"
                              textarea.style.height = textarea.scrollHeight + "px"
                            }
                          }}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-base p-4 md:p-6 rounded-2xl text-center w-full min-h-[96px] md:min-h-[112px] resize-none scrollbar-hide flex items-center focus-visible:outline-none"
                          rows={1}
                        />

                        {expandedPlan === plan.id ? (
                          <div className="space-y-3">
                            <Textarea
                              placeholder="Add notes, deadlines, or specific actions for this milestone..."
                              value={plan.notes}
                              onChange={(e) => updateGamePlan(plan.id, { notes: e.target.value })}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl p-3 text-sm scrollbar-hide focus-visible:outline-none focus-visible:ring-0"
                              rows={2}
                            />
                            <button
                              onClick={() => setExpandedPlan(null)}
                              className="text-purple-300 hover:text-white text-sm transition-colors"
                            >
                              Hide notes
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setExpandedPlan(plan.id)}
                            className="text-purple-300 hover:text-white text-sm transition-colors"
                          >
                            {plan.notes && plan.notes.length > 0 ? "Show notes" : "+ Add notes"}
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => removeGamePlan(plan.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/20 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {canAddMilestone && (
                  <button
                    onClick={addGamePlan}
                    className="w-full border-2 border-dashed border-white/20 hover:border-white/40 rounded-2xl p-6 text-white hover:bg-white/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Add Another Milestone</span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        )

      case "habit-boosters":
        const populatedHabitBoosters = goal.habitBoosters.filter((habit) => habit.title.trim().length > 0)
        const canAddHabit =
          populatedHabitBoosters.length === goal.habitBoosters.length || goal.habitBoosters.length === 0

        return (
          <div className="space-y-6 md:space-y-8">
            {isHabitAiLoading && goal.title.trim().length > 5 ? (
              <div className="text-center space-y-4">
                <div className="text-purple-300 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating AI habit suggestions... This might take a moment.</span>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <HabitBoosterSkeleton key={i} />
                  ))}
                </div>
                <Button
                  onClick={() => {
                    setIsHabitAiLoading(false)
                    setAiSuggestedHabitBooster([])
                  }}
                  variant="ghost"
                  className="text-purple-200 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 text-sm"
                >
                  Skip AI Suggestions
                </Button>
              </div>
            ) : null}

            {!isHabitAiLoading && goal.habitBoosters.length === 0 && (
              <div className="text-center space-y-6">
                <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-yellow-200" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Add Your First Habit Booster</h3>
                  {currentStep === "habit-boosters" && goal.habitBoosters.length === 0 && !isHabitAiLoading && (
                    <div className="text-purple-300 text-xs mb-4 max-w-md mx-auto min-h-[1.5rem] flex items-center justify-center">
                      <p className="text-center leading-tight"> {exampleHabits[currentHabitExampleIndex]}</p>
                    </div>
                  )}
                  <p className="text-purple-200 text-sm mb-6 max-w-md mx-auto">
                    Small daily actions help you build momentum towards your goal
                  </p>

                  {aiSuggestedHabitBoosters.length > 0 && (
                    <div className="mb-4">
                      <Button
                        onClick={() => updateGoal({ habitBoosters: aiSuggestedHabitBoosters })}
                        variant="outline"
                        className="bg-white text-purple-700 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Apply AI Suggestions
                      </Button>
                    </div>
                  )}
                  {canAddHabit && (
                    <Button
                      onClick={addHabitBooster}
                      className="bg-white text-purple-700 hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Start My Booster
                    </Button>
                  )}
                </div>
              </div>
            )}

            {goal.habitBoosters.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Your Habit Boosters</h3>
                  <span className="text-sm text-purple-300">
                    {populatedHabitBoosters.length} habit{populatedHabitBoosters.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {goal.habitBoosters.map((habit, index) => (
                  <div
                    key={habit.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-200 font-semibold text-sm">
                          {index + 1}
                        </div>
                        {goal.habitBoosters.length > 1 && (
                          <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                if (index > 0) {
                                  const draggedHabit = goal.habitBoosters[index]
                                  const updatedHabits = [...goal.habitBoosters]
                                  updatedHabits.splice(index, 1)
                                  updatedHabits.splice(index - 1, 0, draggedHabit)
                                  updateGoal({ habitBoosters: updatedHabits })
                                }
                              }}
                              disabled={index === 0}
                              className="w-6 h-6 flex items-center justify-center text-purple-300 hover:text-white hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Move up"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                if (index < goal.habitBoosters.length - 1) {
                                  const draggedHabit = goal.habitBoosters[index]
                                  const updatedHabits = [...goal.habitBoosters]
                                  updatedHabits.splice(index, 1)
                                  updatedHabits.splice(index + 1, 0, draggedHabit)
                                  updateGoal({ habitBoosters: updatedHabits })
                                }
                              }}
                              disabled={index === goal.habitBoosters.length - 1}
                              className="w-6 h-6 flex items-center justify-center text-purple-300 hover:text-white hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Move down"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-3 min-w-0">
                        <Textarea
                          placeholder="e.g., Walk 8,000 steps daily..."
                          value={habit.title}
                          onChange={(e) => {
                            updateHabitBooster(habit.id, { title: e.target.value })
                            e.target.style.height = "auto"
                            e.target.style.height = e.target.scrollHeight + "px"
                          }}
                          ref={(textarea) => {
                            if (textarea) {
                              textarea.style.height = "auto"
                              textarea.style.height = textarea.scrollHeight + "px"
                            }
                          }}
                          className="bg-transparent border-none text-white placeholder:text-white/60 p-0 text-base font-normal focus:ring-0 leading-relaxed resize-none min-h-[24px] w-full scrollbar-hide focus-visible:outline-none focus-visible:ring-0"
                          rows={1}
                        />

                        <div className="flex items-center gap-3 flex-wrap">
                          <Select
                            value={habit.frequency}
                            onValueChange={(value: "daily" | "weekly" | "monthly" | "custom") =>
                              updateHabitBooster(habit.id, { frequency: value })
                            }
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white w-32 focus-visible:outline-none focus-visible:ring-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent style={{ zIndex: 99999 }}>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>

                          {habit.frequency === "weekly" && (
                            <div className="flex items-center gap-2 text-sm text-purple-200">
                              <span>{habit.daysPerWeek || 3}x per week</span>
                              <div className="w-20">
                                <Slider
                                  value={[habit.daysPerWeek || 3]}
                                  onValueChange={([value]) => updateHabitBooster(habit.id, { daysPerWeek: value })}
                                  max={7}
                                  min={1}
                                  step={1}
                                  className="w-full [&>span:first-child]:focus-visible:ring-0 [&>span:first-child]:focus-visible:outline-none"
                                />
                              </div>
                            </div>
                          )}

                          {habit.frequency === "monthly" && (
                            <div className="flex items-center gap-2 text-sm text-purple-200">
                              <span>{habit.daysPerMonth || 10}x per month</span>
                              <div className="w-20">
                                <Slider
                                  value={[habit.daysPerMonth || 10]}
                                  onValueChange={([value]) => updateHabitBooster(habit.id, { daysPerMonth: value })}
                                  max={30}
                                  min={1}
                                  step={1}
                                  className="w-full [&>span:first-child]:focus-visible:ring-0 [&>span:first-child]:focus-visible:outline-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {habit.frequency === "custom" && (
                          <Textarea
                            placeholder="e.g.,'first Monday of the month'"
                            value={habit.customSchedule || ""}
                            onChange={(e) => {
                              updateHabitBooster(habit.id, { customSchedule: e.target.value })
                              e.target.style.height = "auto"
                              e.target.style.height = e.target.scrollHeight + "px"
                            }}
                            ref={(textarea) => {
                              if (textarea) {
                                textarea.style.height = "auto"
                                textarea.style.height = textarea.scrollHeight + "px"
                              }
                            }}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl p-3 text-sm resize-none min-h-[40px] scrollbar-hide focus-visible:outline-none focus-visible:ring-0"
                            rows={1}
                          />
                        )}
                      </div>

                      <button
                        onClick={() => removeHabitBooster(habit.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-500/20 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {canAddHabit && (
                  <button
                    onClick={addHabitBooster}
                    className="w-full border-2 border-dashed border-white/20 hover:border-white/40 rounded-2xl p-6 text-white hover:bg-white/5 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Add Another Habit</span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        )

      case "review":
        const reviewSections = [
          {
            key: "goal-overview",
            title: "Goal Overview",
            shouldRender: true,
            render: () => (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-200 group space-y-3 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-lg font-semibold text-white">Goal Overview</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setScrollBackToIndex(currentReviewSectionIndex)
                      setCurrentStep("goal-title")
                      setEditingSection("goal-tag")
                    }}
                    className="text-purple-200 hover:text-white hover:bg-white/10 rounded-full px-3 py-2 text-sm z-20"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <div
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center text-center",
                    goal.title ? "transform -translate-y-[10%]" : "transform -translate-y-1/3",
                  )}
                >
                  <p className="text-white text-xl font-medium">{goal.title || "No goal set"}</p>
                  {goal.notes && <p className="text-purple-200 mt-2 text-sm">{goal.notes}</p>}
                  {goal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 justify-center">
                      {goal.tags.map((tag) => (
                        <Badge key={tag} className="bg-indigo/20 rounded-full px-4 py-2 border border-white/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "timeline",
            title: "Timeline",
            shouldRender: goal.startDate || goal.duration,
            render: () => (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-200 group space-y-3 h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Timeline</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setScrollBackToIndex(currentReviewSectionIndex)
                      setCurrentStep("start-date")
                      setEditingSection("duration")
                    }}
                    className="text-purple-200 hover:text-white hover:bg-white/10 rounded-full px-3 py-2 text-sm"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  {goal.startDate && goal.duration ? (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mb-1">
                            <span className="text-green-400 text-lg">🚀</span>
                          </div>
                          <p className="text-xs font-medium text-white">Start</p>
                          <p className="text-xs text-purple-200">{format(goal.startDate, "MMM d")}</p>
                        </div>

                        <div className="flex-1 mx-4">
                          <div className="text-center mb-2">
                            <div className="bg-white/20 rounded-full px-3 py-1 inline-block">
                              <span className="text-xs font-medium text-white">{formatDuration(currentDuration)}</span>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="h-2 bg-white/10 rounded-full">
                              <div className="h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full w-full"></div>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mb-1">
                            <span className="text-blue-400 text-lg">🏆</span>
                          </div>
                          <p className="text-xs font-medium text-white">Goal</p>
                          <p className="text-xs text-purple-200">
                            {calculateTargetDate() && format(calculateTargetDate()!, "MMM d")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-purple-200 text-sm text-center">
                      No start date or duration set for the timeline.
                    </p>
                  )}

                  {goal.gamePlans.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-white mb-2">Milestones:</h4>
                      <ul className="space-y-1 text-sm text-purple-200">
                        {goal.gamePlans.slice(0, 2).map((plan, index) => (
                          <li key={plan.id} className="flex items-start gap-2">
                            <span className="text-white/60">{index + 1}.</span>
                            <span>{plan.title}</span>
                          </li>
                        ))}
                        {goal.gamePlans.length > 2 && (
                          <li className="text-white/60">... and {goal.gamePlans.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "milestones",
            title: "Milestones",
            shouldRender: goal.gamePlans.length > 0,
            render: () => (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-200 group space-y-3 h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Milestones</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setScrollBackToIndex(currentReviewSectionIndex)
                      setCurrentStep("game-plans")
                      setEditingSection("game-plans")
                    }}
                    className="text-purple-200 hover:text-white hover:bg-white/10 rounded-full px-3 py-2 text-sm"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="space-y-2">
                  {goal.gamePlans.map((plan, index) => (
                    <div key={plan.id} className="space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="text-sm text-purple-300 mt-1">{index + 1}.</span>
                        <div className="flex-1">
                          <p className="text-white text-base">{plan.title}</p>
                          {plan.notes && (
                            <>
                              {expandedPlan === plan.id ? (
                                <div className="space-y-1">
                                  <p className="text-purple-300 text-sm">{plan.notes}</p>
                                  <button
                                    onClick={() => setExpandedPlan(null)}
                                    className="text-purple-300 hover:text-white text-xs transition-colors"
                                  >
                                    Hide notes
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setExpandedPlan(plan.id)}
                                  className="text-purple-300 hover:text-white text-xs transition-colors"
                                >
                                  Show notes
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
          {
            key: "habit-boosters",
            title: "Habit Boosters",
            shouldRender: goal.habitBoosters.length > 0,
            render: () => (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all duration-200 group space-y-3 h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-semibold text-white">Habit Boosters</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setScrollBackToIndex(currentReviewSectionIndex)
                      setCurrentStep("habit-boosters")
                      setEditingSection("habit-boosters")
                    }}
                    className="text-purple-200 hover:text-white hover:bg-white/10 rounded-full px-3 py-2 text-sm"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="space-y-3">
                  {goal.habitBoosters.map((habit, index) => (
                    <div key={habit.id} className="space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="text-sm text-purple-300 mt-1">{index + 1}.</span>
                        <div className="flex-1">
                          <p className="text-white text-base">{habit.title}</p>
                          {habit.frequency === "daily" && <p className="text-purple-300 text-sm">Daily</p>}
                          {habit.frequency === "weekly" &&
                            habit.daysPerWeek !== undefined &&
                            habit.daysPerWeek !== null && (
                              <p className="text-purple-300 text-sm">{habit.daysPerWeek}x per week</p>
                            )}
                          {habit.frequency === "monthly" &&
                            habit.daysPerMonth !== undefined &&
                            habit.daysPerMonth !== null && (
                              <p className="text-purple-300 text-sm">{habit.daysPerMonth}x per month</p>
                            )}
                          {habit.frequency === "custom" && (
                            <>
                              {expandedHabit === habit.id ? (
                                <div className="space-y-1">
                                  <p className="text-purple-300 text-sm">
                                    {habit.customSchedule || "No custom schedule details."}
                                  </p>
                                  <button
                                    onClick={() => setExpandedHabit(null)}
                                    className="text-purple-300 hover:text-white text-xs transition-colors"
                                  >
                                    Hide details
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setExpandedHabit(habit.id)}
                                  className="text-purple-300 hover:text-white text-xs transition-colors"
                                >
                                  {habit.customSchedule && habit.customSchedule.length > 0
                                    ? "Show details"
                                    : "+ Add details"}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ),
          },
        ].filter((section) => section.shouldRender)

        return (
          <div className="space-y-6">
            <div className="relative min-h-[300px] flex items-stretch">
              <div
                ref={reviewScrollRef}
                className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4 w-full"
              >
                {reviewSections.map((section, index) => (
                  <div key={section.key} className="w-full flex-shrink-0 snap-center px-4">
                    {section.render()}
                  </div>
                ))}
              </div>
            </div>
            {reviewSections.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {reviewSections.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentReviewSectionIndex ? "bg-white" : "bg-white/40"
                    }`}
                    onClick={() => {
                      if (reviewScrollRef.current) {
                        const scrollAmount = reviewScrollRef.current.clientWidth * index
                        reviewScrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" })
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyle }} />
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-700 to-purple-900 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/15 via-purple-500/10 to-indigo-500/20"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/10 via-transparent to-purple-400/15"></div>

        <div className="relative z-10 w-full max-w-sm md:max-w-lg lg:max-w-2xl">
          <div className="flex flex-col items-center mb-8 md:mb-12">
            <div className="flex justify-between items-center w-full max-w-xs md:max-w-md mb-3">
              <span className="text-sm font-light text-gray-300">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-sm font-light text-gray-300">{Math.round(progress)}%</span>
            </div>
            <div className="w-full max-w-xs md:max-w-md bg-white/20 rounded-full h-2">
              <div
                className="bg-pink-400 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-sm leading-tight pb-2">
              {currentStep === "goal-tag" &&
              aiSuggestedTags.length > 0 &&
              goal.tags.some((tag) => aiSuggestedTags.includes(tag))
                ? "Your categories are ready—feel free to adjust"
                : steps[currentStepIndex].title}
            </h1>
            <p className="text-purple-200 text-sm md:text-base">{steps[currentStepIndex].description}</p>
          </div>

          <div className="mb-8">{renderStepContent()}</div>

          <div className="flex justify-between items-center">
            {currentStepIndex === 0 ? (
              <Button
                onClick={handlePrevious}
                variant="ghost"
                disabled={true}
                className="!bg-transparent text-white opacity-50 cursor-not-allowed rounded-full min-h-[44px] px-4 md:px-6"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            ) : (
              <Button
                onClick={handlePrevious}
                variant="ghost"
                className="!bg-transparent text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-full min-h-[44px] px-4 md:px-6"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}

            {currentStepIndex !== steps.length - 1 && ( // Add this conditional wrapper
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStepIndex
                        ? "bg-white scale-125"
                        : index < currentStepIndex
                          ? "bg-white/60"
                          : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            )}

            {currentStepIndex === steps.length - 1 ? (
              <Button
                onClick={handleConfirm}
                className="bg-white text-purple-700 border border-white/50  rounded-full min-h-[44px] px-4 md:px-6 hover:bg-white"
              >
                Confirm & Save
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : editingSection === currentStep ? (
              <Button
                onClick={() => {
                  setCurrentStep("review")
                  setEditingSection(null)
                }}
                variant="ghost"
                className="text-white hover:bg-white/10 rounded-full min-h-[44px] px-4 md:px-6"
              >
                Done Editing
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className={
                  currentStepIndex === 0
                    ? "bg-white text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full min-h-[44px] px-4 md:px-6 hover:bg-white"
                    : "bg-transparent text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-full min-h-[44px] px-4 md:px-6"
                }
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Snackbar Component */}
        <Snackbar
          isVisible={snackbarVisible}
          message={snackbarMessage}
          onUndo={handleUndo}
          onClose={hideSnackbar}
          duration={5000}
          showUndoButton={true}
          undoText="Undo"
        />
      </div>
      {showConfirmationScreen && <ConfirmationScreen onComplete={handlePetIntroduction} />}
    </>
  )
}
