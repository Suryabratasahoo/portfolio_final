"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Users, Clock, Award, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingScreen from "@/components/admin/loading-screen"
import toast from "react-hot-toast"

export default function StatsAdminPage() {
  const [activeTab, setActiveTab] = useState("edit")
  const [loading, setLoading] = useState(true)
  const [changedIds, setChangedIds] = useState<Set<string>>(new Set())

  const [stats, setStats] = useState<any[]>([])

  // Simulate loading data from an API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        
        // Ensure stats is an array
        const statsArray = Array.isArray(data) ? data : 
                          data.stats && Array.isArray(data.stats) ? data.stats : [];
        
        setStats(statsArray);
        setLoading(false); // Set loading to false after data is fetched successfully
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load statistics.");
        setLoading(false); // Also set loading to false if there's an error
        // Initialize with empty array on error
        setStats([]);
      }
    }
    
    fetchStats();
  }, [])

  const iconOptions = [
    { value: "Clock", label: "Clock", icon: <Clock className="h-4 w-4" /> },
    { value: "Code", label: "Code", icon: <Code className="h-4 w-4" /> },
    { value: "Users", label: "Users", icon: <Users className="h-4 w-4" /> },
    { value: "Award", label: "Award", icon: <Award className="h-4 w-4" /> },
  ]

  const colorOptions = [
    { value: "blue", label: "Blue" },
    { value: "purple", label: "Purple" },
    { value: "green", label: "Green" },
    { value: "amber", label: "Amber" },
    { value: "pink", label: "Pink" },
    { value: "indigo", label: "Indigo" },
    { value: "rose", label: "Rose" },
  ]

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Clock":
        return <Clock className="h-6 w-6" />
      case "Code":
        return <Code className="h-6 w-6" />
      case "Users":
        return <Users className="h-6 w-6" />
      case "Award":
        return <Award className="h-6 w-6" />
      default:
        return <Clock className="h-6 w-6" />
    }
  }

  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500/10 text-blue-500"
      case "purple":
        return "bg-purple-500/10 text-purple-500"
      case "green":
        return "bg-green-500/10 text-green-500"
      case "amber":
        return "bg-amber-500/10 text-amber-500"
      case "pink":
        return "bg-pink-500/10 text-pink-500"
      case "indigo":
        return "bg-indigo-500/10 text-indigo-500"
      case "rose":
        return "bg-rose-500/10 text-rose-500"
      default:
        return "bg-blue-500/10 text-blue-500"
    }
  }

  const handleStatChange = (id: string, field: string, value: string | number) => {
    setStats(stats.map((stat) => (stat._id === id ? { ...stat, [field]: value } : stat)))
    setChangedIds((prev) => new Set(prev).add(id))
  }

  const handleSave = async () => {
    if (changedIds.size === 0) {
      toast('No changes made', {
          icon: '😖',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        }
      );
      return
    }

    // Get only the stats that have been changed
    const changedStats = stats.filter(stat => changedIds.has(stat._id))

    try {
      const response = await fetch('/api/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stats: changedStats })
      })
      
      if (!response.ok) {
        throw new Error('Failed to save changes')
      }
      const data = await response.json();
      
      // Ensure we handle the response correctly
      const updatedStats = Array.isArray(data) ? data : 
                          data.stats && Array.isArray(data.stats) ? data.stats : stats;
      
      setStats(updatedStats);
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error(error)
      toast.error("Failed to save changes")
      return
    }

    // Reset tracking
    setChangedIds(new Set())
    setActiveTab("preview")
  }

  if (loading) {
    return <LoadingScreen text="Loading statistics..." />
  }

  // Guard against stats not being an array
  if (!Array.isArray(stats)) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Stats Counter</h1>
            <p className="text-muted-foreground">Error: Could not load statistics</p>
          </div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stats Counter</h1>
          <p className="text-muted-foreground">Edit the "By the Numbers" section statistics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setActiveTab("preview")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={changedIds.size === 0}>Save Changes</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="space-y-4">
          {stats.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No statistics found. Please add some or check the API.</p>
              </CardContent>
            </Card>
          ) : (
            stats.map((stat) => (
              <Card key={stat._id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Stat Item</CardTitle>
                  </div>
                  <CardDescription>Edit this statistic</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`icon-${stat.id}`}>Icon</Label>
                      <Select value={stat.icon} onValueChange={(value) => handleStatChange(stat._id, "icon", value)}>
                        <SelectTrigger id={`icon-${stat.id}`}>
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
                      <Label htmlFor={`color-${stat.id}`}>Color</Label>
                      <Select value={stat.color} onValueChange={(value) => handleStatChange(stat.id, "color", value)}>
                        <SelectTrigger id={`color-${stat.id}`}>
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
                      <Label htmlFor={`value-${stat.id}`}>Value</Label>
                      <Input
                        id={`value-${stat.id}`}
                        type="number"
                        value={stat.value}
                        onChange={(e) => handleStatChange(stat._id, "value", Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`suffix-${stat.id}`}>Suffix</Label>
                      <Input
                        id={`suffix-${stat.id}`}
                        value={stat.suffix}
                        onChange={(e) => handleStatChange(stat._id, "suffix", e.target.value)}
                        placeholder="e.g. +, %, k"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`label-${stat.id}`}>Label</Label>
                    <Input
                      id={`label-${stat.id}`}
                      value={stat.label}
                      onChange={(e) => handleStatChange(stat._id, "label", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>This is how your stats will appear on the website</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.length === 0 ? (
                <p className="text-center text-muted-foreground">No statistics to preview</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
                  {stats.map((stat) => (
                    <div key={stat._id} className="relative">
                      <div className="bg-background rounded-lg p-6 text-center shadow-sm border border-border/50 h-full flex flex-col items-center justify-center">
                        <div className={`${getColorClass(stat.color)} p-3 rounded-full mb-4`}>
                          {getIconComponent(stat.icon)}
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-2">
                          {stat.value}
                          {stat.suffix}
                        </h3>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}