"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { Textarea } from "@/components/ui/textarea"

export default function CertificationsAdminPage() {
  const [activeTab, setActiveTab] = useState("edit")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Education state
  const [education, setEducation] = useState<any[]>([])
  const [originalEducation, setOriginalEducation] = useState<any[]>([])
  const [changedEducationIds, setChangedEducationIds] = useState<Set<string>>(new Set())
  const [deletedEducationIds, setDeletedEducationIds] = useState<Set<string>>(new Set())
  const [newEducationItems, setNewEducationItems] = useState<any[]>([])
  
  // Certification state
  const [certifications, setCertifications] = useState<any[]>([])
  const [originalCertifications, setOriginalCertifications] = useState<any[]>([])
  const [changedCertificationIds, setChangedCertificationIds] = useState<Set<string>>(new Set())
  const [deletedCertificationIds, setDeletedCertificationIds] = useState<Set<string>>(new Set())
  const [newCertificationItems, setNewCertificationItems] = useState<any[]>([])

  const [editingType, setEditingType] = useState<"education" | "certification">("education")
  const [editingItem, setEditingItem] = useState<string | number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch education data
        const educationResponse = await fetch('/api/education');
        if (!educationResponse.ok) {
          throw new Error('Failed to fetch education data');
        }
        const educationData = await educationResponse.json();
        const educationItems = Array.isArray(educationData) ? educationData : 
                             educationData.education && Array.isArray(educationData.education) ? educationData.education : [];
        
        setEducation(educationItems);
        setOriginalEducation(JSON.parse(JSON.stringify(educationItems))); // Deep copy for comparison
        
        // Fetch certification data
        const certificationResponse = await fetch('/api/certifications');
        if (!certificationResponse.ok) {
          throw new Error('Failed to fetch certification data');
        }
        const certificationData = await certificationResponse.json();
        const certificationItems = Array.isArray(certificationData) ? certificationData : 
                                  certificationData.certifications && Array.isArray(certificationData.certifications) ? 
                                  certificationData.certifications : [];
        
        setCertifications(certificationItems);
        setOriginalCertifications(JSON.parse(JSON.stringify(certificationItems))); // Deep copy for comparison
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [])

  // Education handlers
  const handleEducationChange = (id: string, field: string, value: string) => {
    setEducation(education.map((item) => {
      if (item._id === id) {
        setChangedEducationIds(prev => new Set(prev.add(id)));
        return { ...item, [field]: value };
      }
      return item;
    }));
  }

  const handleNewEducationChange = (tempId: number, field: string, value: string) => {
    setNewEducationItems(newEducationItems.map((item) => 
      item.tempId === tempId ? { ...item, [field]: value } : item
    ));
  }

  const handleAddEducation = () => {
    const tempId = Date.now(); // Temporary ID for UI purposes
    const newItem = {
      tempId,
      degree: "New Degree/Course",
      institution: "Institution Name",
      period: "Start - End",
      description: "Description of your education",
      isNew: true
    }
    setNewEducationItems([...newEducationItems, newItem])
    setEditingType("education")
    setEditingItem(tempId)
  }

  const handleDeleteEducation = (id: string) => {
    // If it's an existing education item (has _id)
    if (education.some(item => item._id === id)) {
      setDeletedEducationIds(prev => new Set(prev.add(id)));
      setEducation(education.filter((item) => item._id !== id));
    } 
    // If it's a new education item (has tempId)
    else {
      setNewEducationItems(newEducationItems.filter(item => item.tempId !== id));
    }
    
    if (editingType === "education" && editingItem === id) {
      setEditingItem(null);
    }
  }

  // Certification handlers
  const handleCertificationChange = (id: string, field: string, value: string) => {
    setCertifications(certifications.map((item) => {
      if (item._id === id) {
        setChangedCertificationIds(prev => new Set(prev.add(id)));
        return { ...item, [field]: value };
      }
      return item;
    }));
  }

  const handleNewCertificationChange = (tempId: number, field: string, value: string) => {
    setNewCertificationItems(newCertificationItems.map((item) => 
      item.tempId === tempId ? { ...item, [field]: value } : item
    ));
  }

  const handleAddCertification = () => {
    const tempId = Date.now(); // Temporary ID for UI purposes
    const newItem = {
      tempId,
      name: "New Certification",
      issuer: "Issuing Organization",
      date: "Year",
      isNew: true
    }
    setNewCertificationItems([...newCertificationItems, newItem])
    setEditingType("certification")
    setEditingItem(tempId)
  }

  const handleDeleteCertification = (id: string) => {
    // If it's an existing certification item (has _id)
    if (certifications.some(item => item._id === id)) {
      setDeletedCertificationIds(prev => new Set(prev.add(id)));
      setCertifications(certifications.filter((item) => item._id !== id));
    } 
    // If it's a new certification item (has tempId)
    else {
      setNewCertificationItems(newCertificationItems.filter(item => item.tempId !== id));
    }
    
    if (editingType === "certification" && editingItem === id) {
      setEditingItem(null);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Handle education changes
      await saveEducationChanges();
      
      // Handle certification changes
      await saveCertificationChanges();
      
      toast.success('Changes saved successfully');
      setActiveTab('preview');
      
      // Refresh data
      await refreshData();
      
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  }
  
  const saveEducationChanges = async () => {
    // Handle existing education updates
    if (changedEducationIds.size > 0 || deletedEducationIds.size > 0) {
      const changedEducation = education.filter(item => changedEducationIds.has(item._id));
      
      const response = await fetch('/api/education', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedEducation: changedEducation,
          deletedIds: Array.from(deletedEducationIds)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update education data');
      }
      toast.success('Education data updated successfully');
    }
    
    // Handle new education items
    if (newEducationItems.length > 0) {
      // Remove temporary IDs before sending to server
      const educationToAdd = newEducationItems.map(({ tempId, isNew, ...rest }) => rest);
      
      const response = await fetch('/api/education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newEducation: educationToAdd }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add new education data');
      }
      toast.success('New education data added successfully');
    }
    
    // Reset tracking
    setChangedEducationIds(new Set());
    setDeletedEducationIds(new Set());
    setNewEducationItems([]);
  }
  
  const saveCertificationChanges = async () => {
    // Handle existing certification updates
    if (changedCertificationIds.size > 0 || deletedCertificationIds.size > 0) {
      const changedCertification = certifications.filter(item => changedCertificationIds.has(item._id));
      
      const response = await fetch('/api/certifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedCertifications: changedCertification,
          deletedIds: Array.from(deletedCertificationIds)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update certification data');
      }
      toast.success('Certification data updated successfully');
    }
    
    // Handle new certification items
    if (newCertificationItems.length > 0) {
      // Remove temporary IDs before sending to server
      const certificationsToAdd = newCertificationItems.map(({ tempId, isNew, ...rest }) => rest);
      
      const response = await fetch('/api/certifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newCertifications: certificationsToAdd }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add new certification data');
      }
      toast.success('New certification data added successfully');
    }
    
    // Reset tracking
    setChangedCertificationIds(new Set());
    setDeletedCertificationIds(new Set());
    setNewCertificationItems([]);
  }
  
  const refreshData = async () => {
    try {
      // Refresh education data
      const educationResponse = await fetch('/api/education');
      if (educationResponse.ok) {
        const data = await educationResponse.json();
        const educationData = Array.isArray(data) ? data : 
                             data.education && Array.isArray(data.education) ? data.education : [];
        
        setEducation(educationData);
        setOriginalEducation(JSON.parse(JSON.stringify(educationData)));
      }
      
      // Refresh certification data
      const certificationResponse = await fetch('/api/certifications');
      if (certificationResponse.ok) {
        const data = await certificationResponse.json();
        const certificationData = Array.isArray(data) ? data : 
                                 data.certifications && Array.isArray(data.certifications) ? 
                                 data.certifications : [];
        
        setCertifications(certificationData);
        setOriginalCertifications(JSON.parse(JSON.stringify(certificationData)));
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  }

  // Combine existing and new items for display
  const allEducation = [...education, ...newEducationItems];
  const allCertifications = [...certifications, ...newCertificationItems];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Certifications & Education</h1>
          <p className="text-muted-foreground">Update your certifications and education</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setActiveTab("preview")} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
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
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading education and certification data...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                    <CardDescription>Select an education item to edit or add a new one</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {allEducation.map((item) => (
                      <Button
                        key={item._id || item.tempId}
                        variant={editingType === "education" && editingItem === (item._id || item.tempId) ? "default" : "outline"}
                        className="w-full justify-between"
                        onClick={() => {
                          setEditingType("education")
                          setEditingItem(item._id || item.tempId)
                        }}
                      >
                        <span className="truncate">{item.degree}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteEducation(item._id || item.tempId)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Button>
                    ))}
                    <Button onClick={handleAddEducation} variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Education
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Certifications</CardTitle>
                    <CardDescription>Select a certification to edit or add a new one</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {allCertifications.map((item) => (
                      <Button
                        key={item._id || item.tempId}
                        variant={editingType === "certification" && editingItem === (item._id || item.tempId) ? "default" : "outline"}
                        className="w-full justify-between"
                        onClick={() => {
                          setEditingType("certification")
                          setEditingItem(item._id || item.tempId)
                        }}
                      >
                        <span className="truncate">{item.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCertification(item._id || item.tempId)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </Button>
                    ))}
                    <Button onClick={handleAddCertification} variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Certification
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                {editingType === "education" && editingItem !== null && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Education</CardTitle>
                      <CardDescription>Update the details for this education</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {education
                        .filter((item) => item._id === editingItem)
                        .map((item) => (
                          <div key={item._id} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="degree">Degree/Course</Label>
                              <Input
                                id="degree"
                                value={item.degree}
                                onChange={(e) => handleEducationChange(item._id, "degree", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="institution">Institution</Label>
                              <Input
                                id="institution"
                                value={item.institution}
                                onChange={(e) => handleEducationChange(item._id, "institution", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="period">Period</Label>
                              <Input
                                id="period"
                                value={item.period}
                                onChange={(e) => handleEducationChange(item._id, "period", e.target.value)}
                                placeholder="e.g. 2015 - 2019"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={item.description}
                                onChange={(e) => handleEducationChange(item._id, "description", e.target.value)}
                                rows={3}
                              />
                            </div>
                          </div>
                        ))}
                        
                      {newEducationItems
                        .filter((item) => item.tempId === editingItem)
                        .map((item) => (
                          <div key={item.tempId} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="degree">Degree/Course</Label>
                              <Input
                                id="degree"
                                value={item.degree}
                                onChange={(e) => handleNewEducationChange(item.tempId, "degree", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="institution">Institution</Label>
                              <Input
                                id="institution"
                                value={item.institution}
                                onChange={(e) => handleNewEducationChange(item.tempId, "institution", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="period">Period</Label>
                              <Input
                                id="period"
                                value={item.period}
                                onChange={(e) => handleNewEducationChange(item.tempId, "period", e.target.value)}
                                placeholder="e.g. 2015 - 2019"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={item.description}
                                onChange={(e) => handleNewEducationChange(item.tempId, "description", e.target.value)}
                                rows={3}
                              />
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                )}

                {editingType === "certification" && editingItem !== null && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Edit Certification</CardTitle>
                      <CardDescription>Update the details for this certification</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {certifications
                        .filter((item) => item._id === editingItem)
                        .map((item) => (
                          <div key={item._id} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Certification Name</Label>
                              <Input
                                id="name"
                                value={item.name}
                                onChange={(e) => handleCertificationChange(item._id, "name", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="issuer">Issuing Organization</Label>
                              <Input
                                id="issuer"
                                value={item.issuer}
                                onChange={(e) => handleCertificationChange(item._id, "issuer", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="date">Date</Label>
                              <Input
                                id="date"
                                value={item.date}
                                onChange={(e) => handleCertificationChange(item._id, "date", e.target.value)}
                                placeholder="e.g. 2022"
                              />
                            </div>
                          </div>
                        ))}
                        
                      {newCertificationItems
                        .filter((item) => item.tempId === editingItem)
                        .map((item) => (
                          <div key={item.tempId} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Certification Name</Label>
                              <Input
                                id="name"
                                value={item.name}
                                onChange={(e) => handleNewCertificationChange(item.tempId, "name", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="issuer">Issuing Organization</Label>
                              <Input
                                id="issuer"
                                value={item.issuer}
                                onChange={(e) => handleNewCertificationChange(item.tempId, "issuer", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="date">Date</Label>
                              <Input
                                id="date"
                                value={item.date}
                                onChange={(e) => handleNewCertificationChange(item.tempId, "date", e.target.value)}
                                placeholder="e.g. 2022"
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
                        Select an education or certification item from the list to edit or add a new one
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button onClick={handleAddEducation}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Education
                        </Button>
                        <Button onClick={handleAddCertification} variant="outline">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Certification
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                This is how your education and certifications will appear on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Education */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-medium">Education</h3>
                  </div>

                  <div className="space-y-6">
                    {allEducation.map((item) => (
                      <div key={item._id || item.tempId} className="relative pl-6 border-l border-primary/20">
                        <div className="absolute left-[-4px] top-1 h-2 w-2 rounded-full bg-primary" />
                        <h4 className="text-base font-medium">{item.degree}</h4>
                        <p className="text-sm text-muted-foreground">{item.institution}</p>
                        <p className="text-xs text-muted-foreground mb-1">{item.period}</p>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-medium">Certifications</h3>
                  </div>

                  <div className="space-y-3">
                    {allCertifications.map((item) => (
                      <div key={item._id || item.tempId} className="relative pl-6 border-l border-primary/20">
                        <div className="absolute left-[-4px] top-1 h-2 w-2 rounded-full bg-primary" />
                        <h4 className="text-base font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.issuer} • {item.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}