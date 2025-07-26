"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Upload, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import LoadingScreen from "@/components/admin/loading-screen"

export default function ProjectsAdminPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("edit")
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [editingProject, setEditingProject] = useState(null)
  const [newTag, setNewTag] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  // Fetch projects from the API
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/projects")
      const data = await response.json()

      if (data.success) {
        setProjects(data.data)
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch projects",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while fetching projects",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  interface Project {
    _id: string
    title: string
    description: string
    image: string
    tags: string[]
    liveUrl: string
    githubUrl: string
    cloudinaryId?: string
  }

  type ProjectField = keyof Omit<Project, "_id" | "cloudinaryId">

  const handleProjectChange = (id: string, field: ProjectField, value: any) => {
    setProjects(projects.map((project: Project) => (project._id === id ? { ...project, [field]: value } : project)))
  }

  const handleAddProject = async () => {
    try {
      const newProject = {
        title: "New Project",
        description: "Project description goes here",
        image: "/placeholder.svg?height=400&width=600",
        tags: ["Tag 1", "Tag 2"],
        liveUrl: "#",
        githubUrl: "#",
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      })

      const data = await response.json()

      if (data.success) {
        setProjects([...projects, data.data])
        setEditingProject(data.data._id)
        toast({
          title: "Success",
          description: "New project created",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create project",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while creating the project",
        variant: "destructive",
      })
    }
  }

  interface DeleteProjectResponse {
    success: boolean
    message?: string
    data?: any
  }

  const handleDeleteProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      const data: DeleteProjectResponse = await response.json()

      if (data.success) {
        setProjects(projects.filter((project) => project._id !== id))
        if (editingProject === id) {
          setEditingProject(null)
        }
        toast({
          title: "Success",
          description: "Project deleted successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete project",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while deleting the project",
        variant: "destructive",
      })
    }
  }

  const handleAddTag = (id: string) => {
    if (!newTag.trim()) return

    const project = projects.find((p) => p._id === id)
    if (project && !project.tags.includes(newTag)) {
      handleProjectChange(id, "tags", [...project.tags, newTag])
    }
    setNewTag("")
  }

  const handleRemoveTag = (id: string, tag: string) => {
    const project = projects.find((p) => p._id === id)
    if (project) {
      handleProjectChange(
        id,
        "tags",
        project.tags.filter((t: string) => t !== tag),
      )
    }
  }

  const handleSave = async () => {
    try {
      // Get the current project being edited
      const project = projects.find((p) => p._id === editingProject)

      if (!project) return

      const response = await fetch(`/api/projects/${editingProject}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Project updated successfully",
        })
        setActiveTab("preview")
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update project",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while saving the project",
        variant: "destructive",
      })
    }
  }

  interface ImageUploadResponse {
    success: boolean
    message?: string
    data?: {
      image: string
      cloudinaryId?: string
    }
  }

  interface ImageUploadEvent extends React.ChangeEvent<HTMLInputElement> { }

  const handleImageUpload = async (id:string, e:ImageUploadEvent) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return toast({
        title: "Error",
        description: "Only JPEG, PNG, and WebP images are allowed",
        variant: "destructive",
      })
    }

    if (file.size > maxSize) {
      return toast({
        title: "Error",
        description: "File size should be less than 5MB",
        variant: "destructive",
      })
    }

    try {
      setUploadingImage(true)

      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      formData.append('projectId', id)

      const response = await fetch('/api/projects/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        // Update the project in our state
        setProjects(
          projects.map((project) =>
            project._id === id
              ? { ...project, image: data.data?.image, filename: data.data?.filename }
              : project
          )
        )

        toast({
          title: "Success",
          description: "Image uploaded successfully",
        })
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to upload image",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while uploading the image",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }
  if (loading) {
    return <LoadingScreen text="Loading projects..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setActiveTab("preview")}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
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
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>Select a project to edit or add a new one</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {projects.map((project) => (
                    <Button
                      key={project._id}
                      variant={editingProject === project._id ? "default" : "outline"}
                      className="w-full justify-between"
                      onClick={() => setEditingProject(project._id)}
                    >
                      <span className="truncate">{project.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteProject(project._id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Button>
                  ))}
                  <Button onClick={handleAddProject} variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Project
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {editingProject !== null && (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Project</CardTitle>
                    <CardDescription>Update the details for this project</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {projects
                      .filter((project) => project._id === editingProject)
                      .map((project) => (
                        <div key={project._id} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Project Title</Label>
                            <Input
                              id="title"
                              value={project.title}
                              onChange={(e) => handleProjectChange(project._id, "title", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={project.description}
                              onChange={(e) => handleProjectChange(project._id, "description", e.target.value)}
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Project Image</Label>
                            <div className="border border-border rounded-md p-4">
                              <div className="relative h-48 mb-4">
                                <Image
                                  src={project.image || "/placeholder.svg"}
                                  alt={project.title}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <div className="relative">
                                <input
                                  type="file"
                                  id={`image-upload-${project._id}`}
                                  className="hidden"
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={(e) => handleImageUpload(project._id, e)}
                                  disabled={uploadingImage}
                                />
                                <Button
                                  variant="outline"
                                  className="w-full"
                                  disabled={uploadingImage}
                                  onClick={() => {
                                    const input = document.getElementById(`image-upload-${project._id}`);
                                    if (input) (input as HTMLInputElement).click();
                                  }}
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  {uploadingImage ? "Uploading..." : "Upload New Image"}
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Tags</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {project.tags.map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                  {tag}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 p-0 ml-1"
                                    onClick={() => handleRemoveTag(project._id, tag)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a tag"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    handleAddTag(project._id)
                                  }
                                }}
                              />
                              <Button onClick={() => handleAddTag(project._id)}>Add</Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="liveUrl">Live URL</Label>
                              <Input
                                id="liveUrl"
                                value={project.liveUrl}
                                onChange={(e) => handleProjectChange(project._id, "liveUrl", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="githubUrl">GitHub URL</Label>
                              <Input
                                id="githubUrl"
                                value={project.githubUrl}
                                onChange={(e) => handleProjectChange(project._id, "githubUrl", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              )}

              {editingProject === null && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      Select a project from the list to edit or add a new one
                    </p>
                    <Button onClick={handleAddProject}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Project
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
              <CardDescription>This is how your projects will appear on the website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project._id} className="overflow-hidden h-full border-none bg-background shadow-sm">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="px-4 py-3">
                      <CardTitle className="text-lg font-medium">{project.title}</CardTitle>
                      <CardDescription className="text-sm">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 py-2">
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {project.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="px-2 py-0.5 text-xs font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}