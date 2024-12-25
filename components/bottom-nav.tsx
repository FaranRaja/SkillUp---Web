"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background p-2">
      <div className="flex items-center justify-around">
        <Link href="/home">
          <Button variant="ghost" size="icon" className={pathname === "/home" ? "text-blue-600" : ""}>
            <Home className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/categories">
          <Button variant="ghost" size="icon" className={pathname === "/categories" ? "text-blue-600" : ""}>
            <BookOpen className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/search">
          <Button variant="ghost" size="icon" className={pathname === "/search" ? "text-blue-600" : ""}>
            <Search className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </nav>
  )
}

