"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ConfirmationScreenProps {
  onComplete: () => void
}

export default function ConfirmationScreen({ onComplete }: ConfirmationScreenProps) {
  const [showFollowUp, setShowFollowUp] = useState(false)

  useEffect(() => {
    // Show confetti for 1.5 seconds, then transition to follow-up
    const timer = setTimeout(() => {
      setShowFollowUp(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    color: [
      "#FFD700", // Gold
      "#FF6B6B", // Coral
      "#4ECDC4", // Turquoise
      "#45B7D1", // Sky Blue
      "#96CEB4", // Mint
      "#FFEAA7", // Light Yellow
      "#DDA0DD", // Plum
      "#98D8C8", // Mint Green
      "#F7DC6F", // Banana
      "#BB8FCE", // Light Purple
    ][Math.floor(Math.random() * 10)],
    size: Math.random() * 8 + 4,
    initialX: 50, // Start from center
    initialY: 50,
    targetX: Math.random() * 100,
    targetY: Math.random() * 100,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.3,
    duration: Math.random() * 1.5 + 1,
  }))

  // Generate sparkle effects
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.5,
  }))

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-indigo-700 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-400/30 to-indigo-400/30"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3), rgba(99, 102, 241, 0.3))",
            "linear-gradient(45deg, rgba(236, 72, 153, 0.3), rgba(99, 102, 241, 0.3), rgba(147, 51, 234, 0.3))",
            "linear-gradient(45deg, rgba(99, 102, 241, 0.3), rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3))",
          ],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Radial Burst Effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="w-full h-full bg-gradient-radial from-white/20 via-transparent to-transparent" />
      </motion.div>

      {/* Confetti Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {confettiPieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute rounded-full shadow-lg"
            style={{
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size,
              left: `${piece.initialX}%`,
              top: `${piece.initialY}%`,
              boxShadow: `0 0 ${piece.size}px ${piece.color}40`,
            }}
            initial={{
              x: 0,
              y: 0,
              rotate: 0,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: (piece.targetX - piece.initialX) * 8,
              y: (piece.targetY - piece.initialY) * 8 + Math.random() * 200 + 100,
              rotate: piece.rotation * 4,
              scale: [0, 1.2, 1, 0.8, 0],
              opacity: [0, 1, 1, 0.7, 0],
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Sparkle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size,
            }}
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 1, 1.2, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0.8, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
          >
            <div
              className="w-full h-full bg-white"
              style={{
                clipPath:
                  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                filter: "drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))",
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100],
              opacity: [0.6, 0],
              scale: [1, 0.5],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              delay: Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-md">
        <AnimatePresence mode="wait">
          {!showFollowUp ? (
            <motion.div
              key="success"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-6"
            >
              <motion.div
                animate={{
                  textShadow: [
                    "0 0 20px rgba(255, 255, 255, 0.5)",
                    "0 0 30px rgba(255, 255, 255, 0.8)",
                    "0 0 20px rgba(255, 255, 255, 0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  Fantastic! Your goal is set — you're officially ready to GetGoing!
                </h1>
              </motion.div>

              <motion.div
                className="text-6xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                ✨
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="followup"
              initial={{ scale: 0, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  className="text-5xl mb-4"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  👋
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Now, meet your new virtual companion!
                </h2>

                <p className="text-xl text-white/90 leading-relaxed">
                 They’ll grow with you as you progress, cheer you on, and keep you motivated along the way
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onComplete}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl border-0 transform transition-all duration-200"
                >
                  Introduce Me to My Pet
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
