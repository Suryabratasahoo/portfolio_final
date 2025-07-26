"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Clock, FileEdit, Layers, Settings, Users } from "lucide-react"
import Link from "next/link"
import LoadingScreen from "@/components/admin/loading-screen"

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)

  // Simulate loading data from an API
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const sections = [
    {
      title: "Stats Counter",
      description: "Edit the 'By the Numbers' section statistics",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin/stats",
      count: 4,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Projects",
      description: "Manage your portfolio projects",
      icon: <Layers className="h-5 w-5" />,
      href: "/admin/projects",
      count: 4,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "What I'm Doing Now",
      description: "Update your current activities and focus",
      icon: <Clock className="h-5 w-5" />,
      href: "/admin/now",
      count: 5,
      color: "bg-amber-500/10 text-amber-500",
    },
    {
      title: "Goals & Milestones",
      description: "Edit your upcoming goals and timeline",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/goals",
      count: 6,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Experience",
      description: "Update your professional experience",
      icon: <FileEdit className="h-5 w-5" />,
      href: "/admin/experience",
      count: 3,
      color: "bg-pink-500/10 text-pink-500",
    },
    {
      title: "Skills",
      description: "Manage your technical skills and proficiency",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/skills",
      count: 12,
      color: "bg-indigo-500/10 text-indigo-500",
    },
    {
      title: "Certifications",
      description: "Update your certifications and education",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/certifications",
      count: 6,
      color: "bg-rose-500/10 text-rose-500",
    },
  ]

  if (loading) {
    return <LoadingScreen text="Loading dashboard..." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your portfolio website content</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`${section.color} p-2 rounded-md`}>{section.icon}</div>
                <div className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-md">{section.count} items</div>
              </div>
              <CardTitle className="mt-2">{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={section.href}>
                <Button variant="outline" className="w-full justify-between group">
                  Manage
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
