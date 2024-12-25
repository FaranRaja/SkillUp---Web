"use client"

import { Button } from "@/components/ui/button"
import { Settings, User, LogOut, Book, Star, History, HelpCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import Image from 'next/image'

export function SideMenu({ isOpen, onClose }: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const { logout, user } = useAuth()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const username = user?.email 
    ? user.email.split('@')[0].replace(/[0-9]/g, '') 
    : 'User'

  const fetchProfilePhoto = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('photo_url')
        .eq('id', user?.id)
        .single()

      if (data?.photo_url) {
        setPhotoUrl(data.photo_url)
      }
    } catch (err) {
      console.error('Error fetching photo:', err)
    }
  }, [user?.id])

  useEffect(() => {
    if (user?.id) {
      fetchProfilePhoto()
    }
  }, [user?.id, fetchProfilePhoto])

  const menuItems = [
    { icon: <User className="w-5 h-5" />, label: "Profile", href: "/profile" },
    { icon: <Star className="w-5 h-5" />, label: "My Progress", href: "/progress" },
    { icon: <History className="w-5 h-5" />, label: "Quiz History", href: "/history" },
    { icon: <Book className="w-5 h-5" />, label: "My Courses", href: "/courses" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings", href: "/settings" },
    { icon: <HelpCircle className="w-5 h-5" />, label: "Help & Support", href: "/help" },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-white z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-4 pb-6 border-b">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{username}</h3>
              <p className="text-sm text-gray-500">Student</p>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start gap-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                onClick={onClose}
              >
                {item.icon}
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="pt-6 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                logout()
                onClose()
              }}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
} 