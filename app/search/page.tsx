"use client"

import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Menu, Send } from 'lucide-react'
import { useState } from "react"
import { SideMenu } from "@/components/side-menu"
import { ProfilePhoto } from "@/components/profile-photo"

export default function SearchPage() {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)

  const handleSearch = async () => {
    if (!question.trim()) return

    setLoading(true)
    try {
      const response = await fetch(
        "https://api.cohere.ai/v1/generate",
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer UhmIa7qoC3MG0yIlgMeHJ8g7TIw1Tc0QCe8CT4Ip",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: question,
            max_tokens: 300,
            temperature: 0.7,
            model: 'command',
            return_likelihoods: 'NONE'
          })
        }
      )

      const result = await response.json()
      setAnswer(result.generations[0].text)
    } catch (error) {
      console.error("Error:", error)
      setAnswer("Sorry, I couldn't process your question. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      <header className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsSideMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-blue-600">SkillUp AI</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-6 w-6" />
          </Button>
          <ProfilePhoto />
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <p className="text-lg">
            SkillUp Assistant
          </p>
          <div className="flex gap-2">
            <Input 
              type="text" 
              placeholder="Type your question..." 
              className="flex-1"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={handleSearch}
              disabled={loading || !question.trim()}
              className="bg-blue-600 text-white hover:bg-blue-700 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Thinking...</p>
          </div>
        )}

        {answer && !loading && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-2">Answer:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-4">Popular Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Programming", color: "bg-blue-500" },
              { name: "Mathematics", color: "bg-red-500" },
              { name: "Physics", color: "bg-purple-500" },
              { name: "Chemistry", color: "bg-amber-500" },
            ].map((topic) => (
              <Button
                key={topic.name}
                className={`
                  h-auto py-4 ${topic.color} text-white 
                  hover:opacity-90 transition-opacity
                `}
                onClick={() => setQuestion(`Explain ${topic.name} concepts`)}
              >
                {topic.name}
              </Button>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
    </div>
  )
}

