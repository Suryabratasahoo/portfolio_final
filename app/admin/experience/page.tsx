"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Experience } from "@/models/experience"
import toast from "react-hot-toast"

export default function ExperienceAdminPage() {

  const [activeTab, setActiveTab] = useState("edit")
  const [experiences, setExperiences] = useState<any[]>([])
  const [editingExperience, setEditingExperience] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch experiences on component mount
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch("/api/experiences")
        if (!response.ok) {
          throw new Error("Failed to fetch experiences")
        }
        const data = await response.json()
        setExperiences(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching experiences:", error)
        toast.error("Failed to load experiences. Please try again.")
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  const handleExperienceChange = (id: string, field: string, value: string) => {
    setExperiences(experiences.map((exp) => (exp._id === id ? { ...exp, [field]: value } : exp)))
  }

  const handleAddExperience = () => {
    const newExperience= {
      id: `temp-${Date.now()}`, // Temporary ID until saved to server
      role: "New Position",
      company: "Company Name",
      period: "Start - End",
      description: "Description of your responsibilities and achievements",
    }
    setExperiences([...experiences, newExperience])
    setEditingExperience(newExperience.id)
  }

  const handleDeleteExperience = async (id: string) => {
    try {
      // If it's a temporary ID (not yet saved to server), just remove it from state
      if (id.startsWith("temp-")) {
        setExperiences(experiences.filter((exp) => exp._id !== id))
        if (editingExperience === id) {
          setEditingExperience(null)
        }
        return
      }

      const response = await fetch(`/api/experiences/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete experience")
      }
      
      setExperiences(experiences.filter((exp) => exp._id !== id))
      
      if (editingExperience === id) {
        setEditingExperience(null)
      }
      
      toast.success("Experience deleted successfully")
    } catch (error) {
      console.error("Error deleting experience:", error)
      toast.error("Failed to delete experience. Please try again.")
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const savePromises = experiences.map(async (exp) => {
        // For new experiences (with temporary IDs)
        if (exp.id?.startsWith("temp-")) {
          const { id, ...experienceData } = exp
          const response = await fetch("/api/experiences", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(experienceData),
          })
          
          if (!response.ok) {
            throw new Error("Failed to create experience")
          }
          
          return await response.json()
        } 
        // For existing experiences
        else {
          const response = await fetch(`/api/experiences/${exp._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(exp),
          })
          
          if (!response.ok) {
            throw new Error("Failed to update experience")
          }
          
          return await response.json()
        }
      })

      const updatedExperiences = await Promise.all(savePromises)
      setExperiences(updatedExperiences)
      
      toast.success("Experiences saved successfully")
      
      setActiveTab("preview")
    } catch (error) {
      console.error("Error saving experiences:", error)
      toast.error("failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading experiences...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Experience</h1>
          <p className="text-muted-foreground">Update your professional experience</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setActiveTab("preview")} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Positions</CardTitle>
                  <CardDescription>Select a position to edit or add a new one</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {experiences.map((exp) => (
                    <Button
                      key={exp._id}
                      variant={editingExperience === exp._id ? "default" : "outline"}
                      className="w-full justify-between"
                      onClick={() => setEditingExperience(exp._id!)}
                    >
                      <span className="truncate">{exp.role}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteExperience(exp._id!)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Button>
                  ))}
                  <Button onClick={handleAddExperience} variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Position
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {editingExperience !== null && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Position</CardTitle>
                    <CardDescription>Update the details for this position</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {experiences
                      .filter((exp) => exp._id === editingExperience)
                      .map((exp) => (
                        <div key={exp._id} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="role">Role/Position</Label>
                            <Input
                              id="role"
                              value={exp.role}
                              onChange={(e) => handleExperienceChange(exp._id!, "role", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(exp._id!, "company", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="period">Period</Label>
                            <Input
                              id="period"
                              value={exp.period}
                              onChange={(e) => handleExperienceChange(exp._id!, "period", e.target.value)}
                              placeholder="e.g. 2021 - Present"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={exp.description}
                              onChange={(e) => handleExperienceChange(exp._id!, "description", e.target.value)}
                              rows={4}
                            />
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {editingExperience === null && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      Select a position from the list to edit or add a new one
                    </p>
                    <Button onClick={handleAddExperience}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Position
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>This is how your experience will appear on the website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-3xl mx-auto">
                <div className="relative border-l border-border pl-6 space-y-12">
                  {experiences.map((exp) => (
                    <div key={exp._id} className="relative">
                      <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-primary" />
                      <Badge variant="outline" className="mb-2 font-normal">
                        {exp.period}
                      </Badge>
                      <h4 className="text-base font-medium">{exp.role}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{exp.company}</p>
                      <p className="text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}