"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Layers, Clock, Settings, FileEdit, Award, Home, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: Home,
      current: pathname === "/admin",
    },
    {
      name: "Stats Counter",
      href: "/admin/stats",
      icon: BarChart3,
      current: pathname === "/admin/stats",
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: Layers,
      current: pathname === "/admin/projects",
    },
    {
      name: "What I'm Doing Now",
      href: "/admin/now",
      icon: Clock,
      current: pathname === "/admin/now",
    },
    {
      name: "Goals & Milestones",
      href: "/admin/goals",
      icon: Settings,
      current: pathname === "/admin/goals",
    },
    {
      name: "Experience",
      href: "/admin/experience",
      icon: FileEdit,
      current: pathname === "/admin/experience",
    },
    {
      name: "Skills",
      href: "/admin/skills",
      icon: Settings,
      current: pathname === "/admin/skills",
    },
    {
      name: "Certifications",
      href: "/admin/certifications",
      icon: Award,
      current: pathname === "/admin/certifications",
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden bg-background/80 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 border-b border-border">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors",
                    item.current
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      item.current ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-border">
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                View Site
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start mt-2 text-muted-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
