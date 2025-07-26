"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Upload, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"

interface Skill {
  id: number
  name: string
  icon: string
  level: number
  categoryId: number
}

interface Category {
  id: number
  name: string
  color: string
  skills: Skill[]
}

export default function SkillsAdminPage() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState("edit")
  const [skillCategories, setSkillCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const [editingSkill, setEditingSkill] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingIcon, setUploadingIcon] = useState(false)

  const colorOptions = [
    { value: "blue", label: "Blue" },
    { value: "purple", label: "Purple" },
    { value: "pink", label: "Pink" },
    { value: "green", label: "Green" },
    { value: "amber", label: "Amber" },
    { value: "indigo", label: "Indigo" },
    { value: "rose", label: "Rose" },
  ]

  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-500 to-cyan-400"
      case "purple":
        return "from-purple-500 to-indigo-400"
      case "pink":
        return "from-pink-500 to-rose-400"
      case "green":
        return "from-green-500 to-emerald-400"
      case "amber":
        return "from-amber-500 to-orange-400"
      case "indigo":
        return "from-indigo-500 to-blue-400"
      case "rose":
        return "from-rose-500 to-pink-400"
      default:
        return "from-blue-500 to-cyan-400"
    }
  }

  // Fetch all categories and skills on component mount
  useEffect(() => {
    fetchSkillsData()
  }, [])

  const fetchSkillsData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/skills')
      if (!response.ok) {
        throw new Error('Failed to fetch skills data')
      }
      const data = await response.json()
      setSkillCategories(data)
    } catch (error) {
      console.error('Error fetching skills:', error)
      toast({
        title: "Error",
        description: "Failed to load skills data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (id: number, field: string, value: string) => {
    setSkillCategories(
      skillCategories.map((category) => 
        category.id === id ? { ...category, [field]: value } : category
      )
    )
  }

  const handleSkillChange = (categoryId: number, skillId: number, field: string, value: string | number) => {
    setSkillCategories(
      skillCategories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            skills: category.skills.map((skill) => 
              skill.id === skillId ? { ...skill, [field]: value } : skill
            ),
          }
        }
        return category
      })
    )
  }

  // Handle file upload for skill icons
  const handleIconUpload = async (file: File) => {
    if (!editingCategory || !editingSkill) return

    try {
      setUploadingIcon(true)
      
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('skillId', editingSkill.toString())
      
      const response = await fetch('/api/skills/skill/upload-icon', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload icon')
      }

      const { iconUrl } = await response.json()
      
      // Update the skill with the new icon URL
      handleSkillChange(editingCategory, editingSkill, 'icon', iconUrl)
      
      toast({
        title: "Success",
        description: "Icon uploaded successfully",
      })
    } catch (error) {
      console.error('Error uploading icon:', error)
      toast({
        title: "Error",
        description: "Failed to upload icon",
        variant: "destructive",
      })
    } finally {
      setUploadingIcon(false)
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select an image file",
          variant: "destructive",
        })
        return
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB",
          variant: "destructive",
        })
        return
      }
      
      handleIconUpload(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleAddCategory = async () => {
    try {
      const response = await fetch('/api/skills/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "New Category",
          color: "blue",
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create category')
      }

      const newCategory = await response.json()
      const categoryWithSkills = { ...newCategory, skills: [] }
      setSkillCategories([...skillCategories, categoryWithSkills])
      setEditingCategory(newCategory.id)
      setEditingSkill(null)
      
      toast({
        title: "Success",
        description: "Category created successfully",
      })
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id: number) => {
    try {
      const response = await fetch(`/api/skills/category/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      setSkillCategories(skillCategories.filter((category) => category.id !== id))
      if (editingCategory === id) {
        setEditingCategory(null)
        setEditingSkill(null)
      }

      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const handleAddSkill = async (categoryId: number) => {
    try {
      const response = await fetch('/api/skills/skill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "New Skill",
          icon: "/placeholder.svg?height=60&width=60",
          level: 50,
          categoryId: categoryId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create skill')
      }

      const newSkill = await response.json()
      setSkillCategories(
        skillCategories.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              skills: [...category.skills, newSkill],
            }
          }
          return category
        })
      )
      setEditingSkill(newSkill.id)

      toast({
        title: "Success",
        description: "Skill created successfully",
      })
    } catch (error) {
      console.error('Error creating skill:', error)
      toast({
        title: "Error",
        description: "Failed to create skill",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSkill = async (categoryId: number, skillId: number) => {
    try {
      const response = await fetch(`/api/skills/skill/${skillId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete skill')
      }

      setSkillCategories(
        skillCategories.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              skills: category.skills.filter((skill) => skill.id !== skillId),
            }
          }
          return category
        })
      )
      if (editingSkill === skillId) {
        setEditingSkill(null)
      }

      toast({
        title: "Success",
        description: "Skill deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting skill:', error)
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      })
    }
  }

  const handleSaveCategory = async (category: Category) => {
    try {
      setSaving(true)
      const response = await fetch(`/api/skills/category/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: category.name,
          color: category.color,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update category')
      }

      toast({
        title: "Success",
        description: "Category updated successfully",
      })
    } catch (error) {
      console.error('Error updating category:', error)
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSkill = async (skill: Skill) => {
    try {
      setSaving(true)
      const response = await fetch(`/api/skills/skill/${skill.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: skill.name,
          icon: skill.icon,
          level: skill.level,
          categoryId: skill.categoryId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update skill')
      }

      toast({
        title: "Success",
        description: "Skill updated successfully",
      })
    } catch (error) {
      console.error('Error updating skill:', error)
      toast({
        title: "Error",
        description: "Failed to update skill",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAll = async () => {
    try {
      setSaving(true)
      
      // Save all categories
      for (const category of skillCategories) {
        await handleSaveCategory(category)
        
        // Save all skills in this category
        for (const skill of category.skills) {
          await handleSaveSkill(skill)
        }
      }
      
      setActiveTab("preview")
    } catch (error) {
      console.error('Error saving all:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">Manage your technical skills and proficiency</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setActiveTab("preview")}>
            Cancel
          </Button>
          <Button onClick={handleSaveAll} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
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
                  <CardTitle>Skill Categories</CardTitle>
                  <CardDescription>Select a category to edit or add a new one</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {skillCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={editingCategory === category.id ? "default" : "outline"}
                      className="w-full justify-between"
                      onClick={() => {
                        setEditingCategory(category.id)
                        setEditingSkill(null)
                      }}
                    >
                      <span className="truncate">{category.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCategory(category.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Button>
                  ))}
                  <Button onClick={handleAddCategory} variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Category
                  </Button>
                </CardContent>
              </Card>

              {editingCategory !== null && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills</CardTitle>
                    <CardDescription>Select a skill to edit or add a new one</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {skillCategories
                      .find((category) => category.id === editingCategory)
                      ?.skills.map((skill) => (
                        <Button
                          key={skill.id}
                          variant={editingSkill === skill.id ? "default" : "outline"}
                          className="w-full justify-between"
                          onClick={() => setEditingSkill(skill.id)}
                        >
                          <span className="truncate">{skill.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSkill(editingCategory, skill.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Button>
                      ))}
                    <Button onClick={() => handleAddSkill(editingCategory)} variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Skill
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="md:col-span-2">
              {editingCategory !== null && editingSkill === null && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Category</CardTitle>
                    <CardDescription>Update the details for this skill category</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {skillCategories
                      .filter((category) => category.id === editingCategory)
                      .map((category) => (
                        <div key={category.id} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Category Name</Label>
                            <Input
                              id="name"
                              value={category.name}
                              onChange={(e) => handleCategoryChange(category.id, "name", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="color">Color</Label>
                            <Select
                              value={category.color}
                              onValueChange={(value) => handleCategoryChange(category.id, "color", value)}
                            >
                              <SelectTrigger id="color">
                                <SelectValue placeholder="Select a color" />
                              </SelectTrigger>
                              <SelectContent>
                                {colorOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center">
                                      <div className={`w-4 h-4 rounded-full bg-${option.value}-500 mr-2`} />
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button 
                              onClick={() => handleSaveCategory(category)} 
                              disabled={saving}
                              size="sm"
                            >
                              {saving ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save Category"
                              )}
                            </Button>
                            <Button onClick={() => handleAddSkill(category.id)} variant="outline" size="sm">
                              <Plus className="mr-2 h-4 w-4" />
                              Add Skill to this Category
                            </Button>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {editingCategory !== null && editingSkill !== null && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Skill</CardTitle>
                    <CardDescription>Update the details for this skill</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {skillCategories
                      .find((category) => category.id === editingCategory)
                      ?.skills.filter((skill) => skill.id === editingSkill)
                      .map((skill) => (
                        <div key={skill.id} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="skillName">Skill Name</Label>
                            <Input
                              id="skillName"
                              value={skill.name}
                              onChange={(e) => handleSkillChange(editingCategory, skill.id, "name", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Skill Icon</Label>
                            <div className="border border-border rounded-md p-4">
                              <div className="flex items-center justify-center mb-4">
                                <div className="relative w-16 h-16">
                                  <Image
                                    src={skill.icon || "/placeholder.svg"}
                                    alt={skill.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={triggerFileInput}
                                disabled={uploadingIcon}
                              >
                                {uploadingIcon ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Icon
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor="level">Proficiency Level ({skill.level}%)</Label>
                            </div>
                            <Slider
                              id="level"
                              min={0}
                              max={100}
                              step={5}
                              value={[skill.level]}
                              onValueChange={(value) => handleSkillChange(editingCategory, skill.id, "level", value[0])}
                            />
                          </div>

                          <div className="pt-4">
                            <Button 
                              onClick={() => handleSaveSkill(skill)} 
                              disabled={saving}
                              size="sm"
                            >
                              {saving ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save Skill"
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {editingCategory === null && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      Select a category from the list to edit or add a new one
                    </p>
                    <Button onClick={handleAddCategory}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Category
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
              <CardDescription>This is how your skills will appear on the website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                {skillCategories.map((category) => (
                  <div key={category.id} className="relative">
                    <div className="bg-background rounded-lg p-6 shadow-sm border border-border/50 h-full">
                      <div
                        className={`bg-gradient-to-r ${getColorClass(category.color)} p-3 rounded-lg mb-6 inline-block`}
                      >
                        <h3 className="text-white font-medium">{category.name}</h3>
                      </div>

                      <div className="space-y-6">
                        {category.skills.map((skill) => (
                          <div key={skill.id} className="flex items-center gap-4">
                            <div
                              className={`relative w-12 h-12 rounded-full bg-gradient-to-r ${getColorClass(
                                category.color,
                              )} p-0.5 flex items-center justify-center`}
                            >
                              <div className="bg-background rounded-full p-2 w-full h-full flex items-center justify-center">
                                <Image
                                  src={skill.icon || "/placeholder.svg"}
                                  alt={skill.name}
                                  width={30}
                                  height={30}
                                  className="rounded-full"
                                />
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{skill.name}</span>
                                <span className="text-xs text-muted-foreground">{skill.level}%</span>
                              </div>
                              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${getColorClass(category.color)}`}
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}