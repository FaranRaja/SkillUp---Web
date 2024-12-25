"use client"

import { Button } from "@/components/ui/button"
import { Bell, Menu } from 'lucide-react'
import { BottomNav } from "@/components/bottom-nav"
import { useState } from "react"
import { QuizSelectionDialog } from "@/components/quiz-selection-dialog"
import { SideMenu } from "@/components/side-menu"
import { useAuth } from "@/context/auth-context"
import { ProfilePhoto } from "@/components/profile-photo"

export default function HomePage() {
  const { user } = useAuth()
  const [showQuizSelection, setShowQuizSelection] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)

  const username = user?.email 
    ? user.email.split('@')[0].replace(/[0-9]/g, '') 
    : 'User'

  return (
    <div className="min-h-screen pb-16">
      <header className="flex items-center justify-between p-4">
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

      <main className="p-4 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Hi {username},</h2>
          <p className="text-red-500">You have 4 Activities pending</p>
        </div>

        <div className="bg-blue-600 text-white p-4 rounded-lg flex justify-between items-center">
          <div>
            <div className="text-3xl font-bold">300</div>
            <div className="text-sm">Points</div>
            <div className="text-sm mt-1">Cross 500 within the week to move to next tier.</div>
          </div>
          <Button 
            variant="secondary" 
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => setShowQuizSelection(true)}
          >
            Take Quiz
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">4 Pending Activities</h3>
            <span className="text-red-500">!</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { title: "OOP", type: "Notes", color: "bg-pink-100 text-pink-500" },
              { title: "SEC", type: "Video", color: "bg-orange-100 text-orange-500" },
              { title: "DSA", type: "Text", color: "bg-blue-100 text-blue-500" },
              { title: "ICT", type: "Notes", color: "bg-purple-100 text-purple-500" },
            ].map((activity) => (
              <div key={activity.title} className="p-4 rounded-lg bg-white border">
                <h4 className="font-semibold">{activity.title}</h4>
                <span className={`text-sm px-2 py-1 rounded-full ${activity.color}`}>
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Popular Subjects</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Mathematics", color: "bg-blue-500" },
              { name: "Chemistry", color: "bg-red-500" },
              { name: "Physics", color: "bg-purple-500" },
              { name: "Computer", color: "bg-amber-500" },
            ].map((subject) => (
              <Button
                key={subject.name}
                className={`h-auto py-4 ${subject.color} text-white hover:opacity-90`}
              >
                {subject.name}
              </Button>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />

      <QuizSelectionDialog 
        open={showQuizSelection} 
        onOpenChange={setShowQuizSelection}
      />

      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
      />
    </div>
  )
}

