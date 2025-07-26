"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, BookOpen, Briefcase, Coffee, Music, Plus, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function NowAdminPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("edit")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  // Initial empty state
  interface NowItem {
    id: string | number
    icon: string
    title: string
    description: string
    color: string
    link: string
    status: string
    progress: number
  }

  interface IconOption {
    value: string
    label: string
    icon: JSX.Element
  }

  interface ColorOption {
    value: string
    label: string
  }

  interface StatusOption {
    value: string
    label: string
  }

  const initialItems: NowItem[] = []

  const [nowItems, setNowItems] = useState(initialItems)
  const [editingItem, setEditingItem] = useState<string | number | null>(null)

  // Fetch items from the API on component mount
  useEffect(() => {
    async function fetchNowItems() {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/now")
        
        if (!response.ok) {
          throw new Error(`Failed to fetch items: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Transform MongoDB _id to client-side id
        interface ApiNowItem {
          _id: string;
          icon: string;
          title: string;
          description: string;
          color: string;
          link: string;
          status: string;
          progress: number;
        }

        interface NowItem {
          id: string;
          icon: string;
          title: string;
          description: string;
          color: string;
          link: string;
          status: string;
          progress: number;
        }

        const transformedData: NowItem[] = (data as ApiNowItem[]).map((item: ApiNowItem): NowItem => ({
          id: item._id,
          icon: item.icon,
          title: item.title,
          description: item.description,
          color: item.color,
          link: item.link,
          status: item.status,
          progress: item.progress
        }))
        
        setNowItems(transformedData)
        
        // Set the first item as active if we have items
        if (transformedData.length > 0) {
          setEditingItem(transformedData[0].id)
        }
      } catch (err) {
        console.error("Error fetching Now items:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchNowItems()
  }, [])

  const iconOptions = [
    { value: "Code", label: "Code", icon: <Code className="h-4 w-4" /> },
    { value: "BookOpen", label: "Book", icon: <BookOpen className="h-4 w-4" /> },
    { value: "Briefcase", label: "Briefcase", icon: <Briefcase className="h-4 w-4" /> },
    { value: "Coffee", label: "Coffee", icon: <Coffee className="h-4 w-4" /> },
    { value: "Music", label: "Music", icon: <Music className="h-4 w-4" /> },
  ]

  const colorOptions = [
    { value: "blue", label: "Blue" },
    { value: "purple", label: "Purple" },
    { value: "amber", label: "Amber" },
    { value: "green", label: "Green" },
    { value: "pink", label: "Pink" },
    { value: "indigo", label: "Indigo" },
    { value: "rose", label: "Rose" },
  ]

  const statusOptions = [
    { value: "In Progress", label: "In Progress" },
    { value: "Ongoing", label: "Ongoing" },
    { value: "Active", label: "Active" },
    { value: "New", label: "New" },
    { value: "Planning", label: "Planning" },
    { value: "Completed", label: "Completed" },
  ]

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Code":
        return <Code className="h-5 w-5" />
      case "BookOpen":
        return <BookOpen className="h-5 w-5" />
      case "Briefcase":
        return <Briefcase className="h-5 w-5" />
      case "Coffee":
        return <Coffee className="h-5 w-5" />
      case "Music":
        return <Music className="h-5 w-5" />
      default:
        return <Code className="h-5 w-5" />
    }
  }

  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "from-blue-500 to-cyan-400"
      case "purple":
        return "from-purple-500 to-indigo-400"
      case "amber":
        return "from-amber-500 to-orange-400"
      case "green":
        return "from-green-500 to-emerald-400"
      case "pink":
        return "from-pink-500 to-rose-400"
      case "indigo":
        return "from-indigo-500 to-blue-400"
      case "rose":
        return "from-rose-500 to-pink-400"
      default:
        return "from-blue-500 to-cyan-400"
    }
  }

  // Handle item changes
  const handleItemChange = (id: string | number, field: string, value: string | number) => {
    setNowItems(nowItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // Add a new item
  const handleAddItem = () => {
    const newItem = {
      id: `temp-${Date.now()}`, // Temporary ID for client-side
      icon: "Code",
      title: "New Activity",
      description: "Description of your new activity",
      color: "blue",
      link: "#",
      status: "New",
      progress: 0,
    }
    setNowItems([...nowItems, newItem])
    setEditingItem(newItem.id)
  }

  // Delete an item
  const handleDeleteItem = (id: string | number) => {
    setNowItems(nowItems.filter((item) => item.id !== id))
    if (editingItem === id) {
      // Select another item if available
      const remainingItems = nowItems.filter((item) => item.id !== id)
      if (remainingItems.length > 0) {
        setEditingItem(remainingItems[0].id)
      } else {
        setEditingItem(null)
      }
    }
  }

  // Save changes to the database
  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      
      const response = await fetch("/api/now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nowItems),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`)
      }
      
      // Get the updated items with proper MongoDB IDs
      const updatedItems = await response.json()
      
      // Transform MongoDB _id to client-side id
      interface NowItem {
        id: string;
        icon: string;
        title: string;
        description: string;
        color: string;
        link: string;
        status: string;
        progress: number;
      }

      const transformedData: NowItem[] = updatedItems.map((item: any): NowItem => ({
        id: item._id,
        icon: item.icon,
        title: item.title,
        description: item.description,
        color: item.color,
        link: item.link,
        status: item.status,
        progress: item.progress
      }))
      
      setNowItems(transformedData)
      
      toast({
        title: "Changes saved",
        description: "Your 'What I'm Doing Now' section has been updated successfully.",
      })
      
      setActiveTab("preview")
    } catch (err) {
      console.error("Error saving Now items:", err)
      
      
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">What I'm Doing Now</h1>
          <p className="text-muted-foreground">Update your current activities and focus</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setActiveTab("preview")} disabled={isLoading || isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || isSaving}>
            {isSaving ? (
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

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="edit" disabled={isLoading}>Edit</TabsTrigger>
          <TabsTrigger value="preview" disabled={isLoading}>Preview</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading your activities...</span>
          </div>
        ) : (
          <>
            <TabsContent value="edit" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Activities</CardTitle>
                      <CardDescription>Select an activity to edit or add a new one</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {nowItems.map((item) => (
                        <Button
                          key={item.id}
                          variant={editingItem === item.id ? "default" : "outline"}
                          className="w-full justify-between"
                          onClick={() => setEditingItem(item.id)}
                        >
                          <span className="truncate">{item.title}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteItem(item.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Button>
                      ))}
                      <Button onClick={handleAddItem} variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Activity
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:col-span-2">
                  {editingItem !== null && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Edit Activity</CardTitle>
                        <CardDescription>Update the details for this activity</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {nowItems
                          .filter((item) => item.id === editingItem)
                          .map((item) => (
                            <div key={item.id} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                  id="title"
                                  value={item.title}
                                  onChange={(e) => handleItemChange(item.id, "title", e.target.value)}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                  id="description"
                                  value={item.description}
                                  onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                                  rows={3}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="icon">Icon</Label>
                                  <Select
                                    value={item.icon}
                                    onValueChange={(value) => handleItemChange(item.id, "icon", value)}
                                  >
                                    <SelectTrigger id="icon">
                                      <SelectValue placeholder="Select an icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {iconOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          <div className="flex items-center">
                                            {option.icon}
                                            <span className="ml-2">{option.label}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="color">Color</Label>
                                  <Select
                                    value={item.color}
                                    onValueChange={(value) => handleItemChange(item.id, "color", value)}
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
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="status">Status</Label>
                                  <Select
                                    value={item.status}
                                    onValueChange={(value) => handleItemChange(item.id, "status", value)}
                                  >
                                    <SelectTrigger id="status">
                                      <SelectValue placeholder="Select a status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="link">Link URL</Label>
                                  <Input
                                    id="link"
                                    value={item.link}
                                    onChange={(e) => handleItemChange(item.id, "link", e.target.value)}
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <Label htmlFor="progress">Progress ({item.progress}%)</Label>
                                </div>
                                <Slider
                                  id="progress"
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={[item.progress]}
                                  onValueChange={(value) => handleItemChange(item.id, "progress", value[0])}
                                />
                              </div>
                            </div>
                          ))}
                      </CardContent>
                    </Card>
                  )}

                  {editingItem === null && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground mb-4">
                          Select an activity from the list to edit or add a new one
                        </p>
                        <Button onClick={handleAddItem}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add New Activity
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
                  <CardDescription>
                    This is how your "What I'm Doing Now" section will appear on the website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {nowItems.map((item) => (
                      <div key={item.id} className="relative group">
                        <div className="bg-background rounded-lg p-6 shadow-sm border border-border/50 h-full relative overflow-hidden">
                          {/* Status indicator */}
                          <div className="absolute top-4 right-4 flex items-center">
                            <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${getColorClass(item.color)} mr-2`} />
                            <span className="text-xs text-muted-foreground">{item.status}</span>
                          </div>

                          {/* Icon */}
                          <div
                            className={`inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-r ${getColorClass(
                              item.color,
                            )} text-white mb-4`}
                          >
                            {getIconComponent(item.icon)}
                          </div>

                          {/* Content */}
                          <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4">{item.description}</p>

                          {/* Progress bar */}
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-4">
                            <div
                              className={`h-full bg-gradient-to-r ${getColorClass(item.color)}`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>

                          {/* Link */}
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{item.progress}% complete</span>
                            <span className="text-xs flex items-center gap-1 text-primary">Learn more</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
      </div>
    )
  }