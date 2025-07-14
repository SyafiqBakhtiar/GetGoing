"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight, Target, Repeat, CheckSquare, Timer, PawPrint, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Feature {
  id: number
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    id: 1,
    icon: <Target className="w-8 h-8 text-emerald-400" />,
    title: "Goals",
    description: "Crush big goals with step-by-step milestones and daily habit support.",
  },
  {
    id: 2,
    icon: <Repeat className="w-8 h-8 text-sky-400" />,
    title: "Habits",
    description: "Build lasting routines with streaks, reminders, and positive reinforcement.",
  },
  {
    id: 3,
    icon: <CheckSquare className="w-8 h-8 text-fuchsia-200" />,
    title: "Tasks",
    description: "Quickly capture and organize tasks — with smart AI-suggested subtasks.",
  },
  {
    id: 4,
    icon: <Timer className="w-8 h-8 text-amber-400" />,
    title: "Focus Timer",
    description: "Block distractions.",
  },
  {
    id: 5,
    icon: <PawPrint className="w-8 h-8 text-rose-400" />,
    title: "Virtual Pet",
    description: "Grow a companion as you progress.",
  },
  {
    id: 6,
    icon: <FileText className="w-8 h-8 text-cyan-400" />,
    title: "Quick Notes",
    description: "Jot ideas and convert them to tasks or goals later.",
  },
]

export default function FeatureCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

  // Update current slide based on scroll position
  const updateCurrentSlide = useCallback(() => {
    if (!scrollContainerRef.current || isScrollingRef.current) return

    const container = scrollContainerRef.current
    const cardWidth = 320 // w-80 = 320px
    const gap = 16 // gap-4 = 16px
    const scrollLeft = container.scrollLeft
    const newSlide = Math.round(scrollLeft / (cardWidth + gap))

    if (newSlide !== currentSlide && newSlide >= 0 && newSlide < features.length) {
      setCurrentSlide(newSlide)
    }
  }, [currentSlide])

  // Scroll to specific slide (for button/dot clicks)
  const scrollToSlide = useCallback((slideIndex: number) => {
    if (!scrollContainerRef.current) return

    isScrollingRef.current = true
    const container = scrollContainerRef.current
    const cardWidth = 320 // w-80 = 320px
    const gap = 16 // gap-4 = 16px
    const scrollPosition = slideIndex * (cardWidth + gap)

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    })

    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrollingRef.current = false
    }, 500)
  }, [])

  const handlePrevious = () => {
    const newSlide = (currentSlide - 1 + features.length) % features.length
    scrollToSlide(newSlide)
  }

  const handleNext = () => {
    const newSlide = (currentSlide + 1) % features.length
    scrollToSlide(newSlide)
  }

  const handleDotClick = (index: number) => {
    scrollToSlide(index)
  }

  // Handle scroll events to update current slide
  const handleScroll = useCallback(() => {
    updateCurrentSlide()
  }, [updateCurrentSlide])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious()
    } else if (e.key === "ArrowRight") {
      handleNext()
    }
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
            >
              Skip
            </Button>
          </div>

          {/* Title */}
          <div className="text-center mb-8 md:mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent drop-shadow-sm leading-tight pb-2">
              Discover Core Features
            </h1>
          </div>

          {/* Onboarding Progress Indicator - Now below title */}
          <div className="flex flex-col items-center mb-12 md:mb-16">
            {/* Step and Percentage Labels */}
            <div className="flex justify-between items-center w-full max-w-md mb-3">
              <span className="text-sm font-light text-gray-300">Step 2 of 6</span>
              <span className="text-sm font-light text-gray-300">33%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: "33.33%" }}
              ></div>
            </div>
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <Button
              onClick={handlePrevious}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10 rounded-full p-3"
              aria-label="Previous feature"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleNext}
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10 rounded-full p-3"
              aria-label="Next feature"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Carousel Container */}
          <div className="relative" onKeyDown={handleKeyDown} tabIndex={0} role="region" aria-label="Feature carousel">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 md:gap-6 pb-4 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onScroll={handleScroll}
            >
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`flex-none w-80 md:w-96 snap-center transition-all duration-300 ${
                    index === currentSlide ? "scale-105" : "scale-95 opacity-75"
                  }`}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-64 flex flex-col justify-center items-center text-center border border-white/20 shadow-2xl">
                    <div className="mb-6 p-4 bg-white/10 rounded-full">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-sm font-light text-purple-100 mt-1 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile Navigation Hint */}
          <div className="md:hidden text-center mt-6">
            <p className="text-sm text-purple-200/80">Swipe left or right to explore features</p>
          </div>
        </div>
      </div>
    </div>
  )
}
