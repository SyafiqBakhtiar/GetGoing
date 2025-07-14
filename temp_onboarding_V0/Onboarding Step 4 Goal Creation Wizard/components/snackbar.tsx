"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SnackbarProps {
  isVisible: boolean
  message: string
  onUndo?: () => void
  onClose: () => void
  duration?: number // in milliseconds, default to 3000
  showUndoButton?: boolean
  undoText?: string
}

const Snackbar: React.FC<SnackbarProps> = ({
  isVisible,
  message,
  onUndo,
  onClose,
  duration = 3000,
  showUndoButton = false,
  undoText = "Undo",
}) => {
  const [show, setShow] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isVisible) {
      setShow(true)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        setShow(false)
        // Give time for animation to complete before calling onClose
        setTimeout(onClose, 300)
      }, duration)
    } else {
      setShow(false)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isVisible, duration, onClose])

  const handleUndoClick = () => {
    if (onUndo) {
      onUndo()
    }
    setShow(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    // Give time for animation to complete before calling onClose
    setTimeout(onClose, 300)
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out",
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none",
      )}
    >
      <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-4 min-w-[280px] max-w-md">
        <span className="text-sm font-medium flex-1">{message}</span>
        {showUndoButton && onUndo && (
          <Button
            variant="ghost"
            onClick={handleUndoClick}
            className="text-blue-300 hover:text-blue-200 hover:bg-gray-700 px-3 py-1 rounded-md text-sm"
          >
            {undoText}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Snackbar
