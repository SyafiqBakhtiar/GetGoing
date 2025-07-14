"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { CheckSquare, Repeat, Target } from "lucide-react"

interface OnboardingOption {
  id: number
  icon: React.ReactNode
  title: string
}

const onboardingOptions: OnboardingOption[] = [
  {
    id: 1,
    icon: <Target className="w-8 h-8 text-emerald-400" />,
    title: "Set a Goal",
  },
  {
    id: 2,
    icon: <Repeat className="w-8 h-8 text-sky-400" />,
    title: "Build a Habit",
  },
  {
    id: 3,
    icon: <CheckSquare className="w-8 h-8 text-fuchsia-200" />,
    title: "Add a Task",
  },
]

export default function OnboardingStep3() {
  const handleCardClick = (option: string) => {
    console.log(`Selected: ${option}`)
    // Handle navigation to next step
  }

  const handleSkip = () => {
    console.log("Skipped step 3")
    // Handle skip navigation
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 via-purple-800 to-indigo-900 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
      {/* Modern mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/10 to-blue-600/20"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-indigo-600/15 via-transparent to-purple-500/15"></div>

      {/* Content wrapper with relative positioning */}
      <div className="relative z-10 w-full max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col justify-center">
          {/* Skip Button - Top Right */}
          <div className="flex justify-end mb-8 md:mb-12">
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-white/90 font-semibold px-8 md:px-12 py-3 md:py-4 text-base md:text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              onClick={handleSkip}
            >
              Skip
            </Button>
          </div>

          {/* Title */}
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-sm leading-tight pb-2">
              Kickstart Your Journey
            </h1>
          </div>

          {/* Onboarding Progress Indicator - Now below title */}
          <div className="flex flex-col items-center mb-12 md:mb-16">
            {/* Step and Percentage Labels */}
            <div className="flex justify-between items-center w-full max-w-md mb-3">
              <span className="text-sm font-light text-gray-300">Step 3 of 6</span>
              <span className="text-sm font-light text-gray-300">50%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>

          {/* Cards Section */}
          <div className="flex-1 flex flex-col justify-center pb-4">
            <div className="w-full max-w-4xl mx-auto px-4">
              {/* Cards Container - Vertical Stack */}
              <div className="flex flex-col gap-4 sm:gap-6">
                {onboardingOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleCardClick(option.title)}
                    className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl hover:bg-white/15 active:scale-95 transition-all duration-200 group"
                    style={{ outline: "none", WebkitTapHighlightColor: "transparent" }}
                  >
                    <div className="flex items-center gap-6 text-left">
                      <div className="flex-shrink-0 p-4 bg-white/10 rounded-full group-hover:bg-white/20 transition-all duration-200">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl font-semibold text-white">{option.title}</h3>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
