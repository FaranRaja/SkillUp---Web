"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

const subjects = [
  { id: 18, name: "Computer Science", icon: "💻" },
  { id: 19, name: "Mathematics", icon: "🔢" },
  { id: 17, name: "Science", icon: "🔬" },
  { id: 22, name: "Geography", icon: "🌍" },
]

export function QuizSelectionDialog({ open, onOpenChange }: { 
  open: boolean
  onOpenChange: (open: boolean) => void 
}) {
  const router = useRouter()

  if (!open) return null

  const startQuiz = (categoryId: number) => {
    router.push(`/quiz/${categoryId}`)
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-blue-600">SkillUp AI Quiz</h2>
          <button 
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <Button
              key={subject.id}
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => startQuiz(subject.id)}
            >
              <span className="text-2xl">{subject.icon}</span>
              <span>{subject.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 