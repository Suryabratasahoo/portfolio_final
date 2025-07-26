"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Target, Award, Briefcase, GraduationCap, Globe, Rocket, Plus, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { v4 as uuidv4 } from "uuid";

export default function GoalsAdminPage() {
  const [activeTab, setActiveTab] = useState("edit")
  const [timelineItems, setTimelineItems] = useState<any[]>([])
  const [changedIds, setChangedIds] = useState<Set<string>>(new Set());
  const [isNewItem, setIsNewItem] = useState(false);
  
  useEffect(() => {
    const fetchTimeLines = async () => {
      const response = await fetch('/api/timelines');
      if (!response.ok) {
        throw new Error('Failed to fetch timelines');
      }
      const data = await response.json();
      console.log(data);
      setTimelineItems(data.timelines);
    }

    fetchTimeLines();
  }, [])

  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const iconOptions = [
    { value: "Target", label: "Target", icon: <Target className="h-4 w-4" /> },
    { value: "Award", label: "Award", icon: <Award className="h-4 w-4" /> },
    { value: "Briefcase", label: "Briefcase", icon: <Briefcase className="h-4 w-4" /> },
    { value: "GraduationCap", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
    { value: "Globe", label: "Globe", icon: <Globe className="h-4 w-4" /> },
    { value: "Rocket", label: "Rocket", icon: <Rocket className="h-4 w-4" /> },
    { value: "Calendar", label: "Calendar", icon: <Calendar className="h-4 w-4" /> },
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
    { value: "completed", label: "Completed" },
    { value: "in-progress", label: "In Progress" },
    { value: "planning", label: "Planning" },
    { value: "not-started", label: "Not Started" },
  ]

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Target":
        return <Target className="h-5 w-5" />
      case "Award":
        return <Award className="h-5 w-5" />
      case "Briefcase":
        return <Briefcase className="h-5 w-5" />
      case "GraduationCap":
        return <GraduationCap className="h-5 w-5" />
      case "Globe":
        return <Globe className="h-5 w-5" />
      case "Rocket":
        return <Rocket className="h-5 w-5" />
      case "Calendar":
        return <Calendar className="h-5 w-5" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-500 bg-blue-500/10"
      case "purple":
        return "text-purple-500 bg-purple-500/10"
      case "amber":
        return "text-amber-500 bg-amber-500/10"
      case "green":
        return "text-green-500 bg-green-500/10"
      case "pink":
        return "text-pink-500 bg-pink-500/10"
      case "indigo":
        return "text-indigo-500 bg-indigo-500/10"
      case "rose":
        return "text-rose-500 bg-rose-500/10"
      default:
        return "text-blue-500 bg-blue-500/10"
    }
  }
  
  const getColorBg = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500"
      case "purple":
        return "bg-purple-500"
      case "amber":
        return "bg-amber-500"
      case "green":
        return "bg-green-500"
      case "pink":
        return "bg-pink-500"
      case "indigo":
        return "bg-indigo-500"
      case "rose":
        return "bg-rose-500"
      default:
        return "bg-blue-500"
    }
  }

  const handleItemChange = (id: string, field: string, value: string) => {
    setTimelineItems(timelineItems.map((item) => (item._id === id ? { ...item, [field]: value } : item)))
    setChangedIds((prev) => new Set(prev).add(id))
  }

  const handleAddItem = () => {
    const newItem = {
      _id: uuidv4(),
      icon: "Target",
      title: "New Goal",
      description: "Description of your new goal or milestone",
      timeframe: "January 2025",
      status: "not-started",
      category: "New Category",
      details: "Detailed information about this goal",
      color: "blue",
      isNew: true
    }

    setTimelineItems((prevItems) => [...prevItems, newItem]);
    setEditingItem(newItem._id);
    setIsNewItem(true);
  }

  const handleDeleteItem = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await fetch(`/api/timelines`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      setTimelineItems((prevItems) => prevItems.filter((item) => item._id !== id));
      toast.success("Item deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete item.");
    } finally {
      setDeletingId(null);
    }

    if (editingItem === id) {
      setEditingItem(null);
      setIsNewItem(false);
    }
  }

  const handleSave = async () => {
    // this will save the changes in the database
    const changedItems = timelineItems.filter((item) => changedIds.has(item._id) && !item.isNew);
    if (changedItems.length === 0) {
      toast.error("No changes made to save.");
      return;
    }
    try {
      const response = await fetch('/api/timelines', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ timelines: changedItems })
      })
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
      toast.success("Changes saved successfully.");

      setChangedIds(new Set());
      setActiveTab("preview");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes.");
    }
  }

  const handlePublish = async () => {
    if (!editingItem) return;
    
    const newItem = timelineItems.find(item => item._id === editingItem);
    if (!newItem) return;
    
    try {
      // Use POST for creating new items
      const response = await fetch('/api/timelines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ timeline: newItem })
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish new goal');
      }
      
      // Update the item to no longer be new
      setTimelineItems(timelineItems.map(item => 
        item._id === editingItem ? { ...item, isNew: false } : item
      ));
      
      setIsNewItem(false);
      setChangedIds(prev => {
        const updated = new Set(prev);
        updated.delete(editingItem);
        return updated;
      });
      
      toast.success("New goal published successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to publish new goal.");
    }
  }

  const handleItemSelect = (id: string) => {
    const selectedItem = timelineItems.find(item => item._id === id);
    setEditingItem(id);
    setIsNewItem(!!selectedItem?.isNew);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Goals & Milestones</h1>
          <p className="text-muted-foreground">Edit your upcoming goals and timeline</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setActiveTab("preview")}>
            Cancel
          </Button>
          {isNewItem && editingItem ? (
            <Button onClick={handlePublish} variant="default">
              Publish Goal
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={changedIds.size === 0}>
              Save Changes
            </Button>
          )}
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
                  <CardTitle>Goals</CardTitle>
                  <CardDescription>Select a goal to edit or add a new one</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {timelineItems.map((item) => (
                    <Button
                      key={item._id}
                      variant={editingItem === item._id ? "default" : "outline"}
                      className={`w-full justify-between ${item.isNew ? "border-blue-500" : ""}`}
                      onClick={() => handleItemSelect(item._id)}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.isNew && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full mr-2">New</span>}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item._id);
                        }}
                        disabled={deletingId === item._id} // disable button during deletion
                      >
                        {deletingId === item._id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </Button>
                  ))}
                  <Button onClick={handleAddItem} variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Goal
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {editingItem !== null && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {isNewItem ? "Create New Goal" : "Edit Goal"}
                      {isNewItem && <span className="ml-2 text-sm text-blue-500">(Needs to be published)</span>}
                    </CardTitle>
                    <CardDescription>
                      {isNewItem 
                        ? "Fill in the details for your new goal and click Publish" 
                        : "Update the details for this goal or milestone"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {timelineItems
                      .filter((item) => item._id === editingItem)
                      .map((item) => (
                        <div key={item._id} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={item.title}
                              onChange={(e) => handleItemChange(item._id, "title", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={item.description}
                              onChange={(e) => handleItemChange(item._id, "description", e.target.value)}
                              rows={2}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="icon">Icon</Label>
                              <Select
                                value={item.icon}
                                onValueChange={(value) => handleItemChange(item._id, "icon", value)}
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
                                value={typeof item.color === 'string' ? item.color.replace("text-", "").replace("-500", "") : item.color}
                                onValueChange={(value) => handleItemChange(item._id, "color", value)}
                              >
                                <SelectTrigger id="color">
                                  <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                                <SelectContent>
                                  {colorOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      <div className="flex items-center">
                                        <div className={`w-4 h-4 rounded-full ${getColorBg(option.value)} mr-2`} />
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
                              <Label htmlFor="timeframe">Timeframe</Label>
                              <Input
                                id="timeframe"
                                value={item.timeframe}
                                onChange={(e) => handleItemChange(item._id, "timeframe", e.target.value)}
                                placeholder="e.g. January 2025"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="status">Status</Label>
                              <Select
                                value={item.status}
                                onValueChange={(value) => handleItemChange(item._id, "status", value)}
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
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                              id="category"
                              value={item.category}
                              onChange={(e) => handleItemChange(item._id, "category", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="details">Details</Label>
                            <Textarea
                              id="details"
                              value={item.details}
                              onChange={(e) => handleItemChange(item._id, "details", e.target.value)}
                              rows={4}
                            />
                          </div>

                          {isNewItem && (
                            <div className="pt-4">
                              <Button className="w-full" onClick={handlePublish}>
                                Publish Goal
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {editingItem === null && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">Select a goal from the list to edit or add a new one</p>
                    <Button onClick={handleAddItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Goal
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
              <CardDescription>This is how your goals and milestones will appear on the website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-4xl mx-auto relative">
                {/* Timeline line */}
                <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-border transform md:-translate-x-1/2" />

                {/* Timeline items */}
                <div className="relative space-y-12">
                  {timelineItems
                    .filter(item => !item.isNew) // Don't show unpublished items in preview
                    .map((item, index) => (
                    <div
                      key={item._id}
                      className={`relative ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"} md:w-[calc(50%-20px)]`}
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-0 md:left-auto ${
                          index % 2 === 0 ? "md:-left-[25px]" : "md:-right-[25px]"
                        } top-0 w-[30px] h-[30px] rounded-full border-4 border-background ${
                          getColorClass(item.color)
                        } flex items-center justify-center z-10`}
                      >
                        <span className={item.color === "blue" ? "text-blue-500" : `text-${item.color}-500`}>
                          {getIconComponent(item.icon)}
                        </span>
                      </div>

                      {/* Content card */}
                      <div className="ml-10 md:ml-0 bg-background rounded-lg border border-border/50 overflow-hidden">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full ${getColorClass(item.color)} mb-2`}
                              >
                                {item.category}
                              </span>
                              <h3 className="text-lg font-medium">{item.title}</h3>
                            </div>
                          </div>

                          <p className="text-muted-foreground text-sm mb-3">{item.description}</p>

                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{item.timeframe}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>
                                {item.status === "completed"
                                  ? "Completed"
                                  : item.status === "in-progress"
                                    ? "In Progress"
                                    : item.status === "planning"
                                      ? "Planning Phase"
                                      : "Not Started"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
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