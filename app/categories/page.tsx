"use client"

import { BottomNav } from "@/components/bottom-nav"
import { Bell, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { SideMenu } from "@/components/side-menu"
import { ProfilePhoto } from "@/components/profile-photo"

export default function CategoriesPage() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)

  const categories = [
    { 
      title: "Notes", 
      gradient: "from-blue-500 to-purple-500",
      description: "Access your study materials and lecture notes"
    },
    { 
      title: "Text-Based Content", 
      gradient: "from-pink-500 to-red-500",
      description: "Read articles and educational content"
    },
    { 
      title: "Interactives", 
      gradient: "from-orange-500 to-red-500",
      description: "Engage with interactive learning materials"
    },
    { 
      title: "Videos", 
      gradient: "from-yellow-500 to-orange-500",
      description: "Watch educational videos and tutorials"
    },
  ]

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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Learning Categories</h2>
          <p className="text-gray-600 mb-8">
            Choose a category to start learning and enhance your skills
          </p>
          
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((category) => (
              <div
                key={category.title}
                className={`
                  p-8 rounded-xl bg-gradient-to-r ${category.gradient} 
                  text-white cursor-pointer transition-all duration-200 
                  hover:shadow-lg hover:scale-[1.02] transform-gpu
                  flex flex-col justify-between min-h-[200px]
                `}
              >
                <div>
                  <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
                  <p className="text-white/80">{category.description}</p>
                </div>
                <Button 
                  variant="secondary" 
                  className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Explore
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
    </div>
  )
}

