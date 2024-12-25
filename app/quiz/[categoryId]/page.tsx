"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

type Question = {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  all_answers?: string[]
}

export default function QuizPage({ params }: { params: { categoryId: string } }) {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `https://opentdb.com/api.php?amount=5&category=${params.categoryId}&difficulty=medium&type=multiple`
        )
        const data = await response.json()
        
        const questionsWithShuffledAnswers = data.results.map((q: Question) => ({
          ...q,
          all_answers: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
        }))
        
        setQuestions(questionsWithShuffledAnswers)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch questions:', error)
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [params.categoryId])

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)

    setTimeout(() => {
      if (answer === questions[currentQuestion].correct_answer) {
        setScore(score + 1)
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setQuizComplete(true)
      }
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Loading questions...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">No questions available</p>
      </div>
    )
  }

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <div className="text-6xl font-bold text-blue-600 mb-6">
            {score}/{questions.length}
          </div>
          <p className="text-gray-600 mb-8">
            {score === questions.length 
              ? "Perfect score! Amazing work! 🎉" 
              : score >= questions.length / 2 
                ? "Good job! Keep practicing! 👍" 
                : "Keep learning and try again! 💪"}
          </p>
          <Button 
            onClick={() => router.push('/home')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-lg"
          >
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto space-y-10">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Skillup AI</h1>
          <div className="bg-green-500/20 text-green-500 px-6 py-2 rounded-full text-lg">
            Score: {score}
          </div>
        </header>

        <div className="space-y-8">
          <div className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </div>

          <h2 className="text-2xl font-semibold leading-relaxed">
            {questions[currentQuestion].question}
          </h2>

          <div className="grid gap-4">
            {questions[currentQuestion].all_answers?.map((answer, index) => {
              const isSelected = selectedAnswer === answer
              const isCorrect = showResult && answer === questions[currentQuestion].correct_answer
              const isWrong = showResult && isSelected && !isCorrect

              return (
                <Button
                  key={index}
                  variant="outline"
                  className={`
                    w-full p-6 text-left text-lg font-medium
                    ${!showResult ? 'bg-white/10 text-white hover:bg-white/20' : ''}
                    ${isCorrect ? 'bg-green-500/20 text-green-500 border-green-500' : ''}
                    ${isWrong ? 'bg-red-500/20 text-red-500 border-red-500' : ''}
                  `}
                  onClick={() => !showResult && handleAnswer(answer)}
                  disabled={showResult}
                >
                  {answer}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 