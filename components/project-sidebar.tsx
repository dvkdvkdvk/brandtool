'use client'

import * as React from 'react'
import {
  ChevronRight,
  FolderPlus,
  History,
  MoreHorizontal,
  Pencil,
  Plus,
  Settings,
  Trash2,
  FileCode,
  Upload,
  X,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar'
import type { Project, ComponentRequest, DesignTokens } from '@/lib/store'

interface ProjectSidebarProps {
  projects: Project[]
  activeProject: Project | null
  activeRequest: ComponentRequest | null
  onSelectProject: (project: Project) => void
  onSelectRequest: (request: ComponentRequest) => void
  onCreateProject: (name: string, clientName: string) => void
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void
  onDeleteProject: (projectId: string) => void
  onDeleteRequest: (projectId: string, requestId: string) => void
  onUpdateCSS: (css: string) => void
  onClearTokens: () => void
  onPasteCSS: (content: string, name: string) => void
  children: React.ReactNode
}

export function ProjectSidebar({
  projects,
  activeProject,
  activeRequest,
  onSelectProject,
  onSelectRequest,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onDeleteRequest,
  onUpdateCSS,
  onClearTokens,
  onPasteCSS,
  children,
}: ProjectSidebarProps) {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [editingProject, setEditingProject] = React.useState<Project | null>(null)
  const [projectName, setProjectName] = React.useState('')
  const [clientName, setClientName] = React.useState('')
  const [editName, setEditName] = React.useState('')
  const [editClientName, setEditClientName] = React.useState('')
  const [screenshotUrl, setScreenshotUrl] = React.useState('')

  const handleOpenSettings = () => {
    if (activeProject?.screenshotUrl) {
      setScreenshotUrl(activeProject.screenshotUrl)
    } else {
      setScreenshotUrl('')
    }
    setIsSettingsOpen(true)
  }

  const handleCreateProject = () => {
    if (projectName && clientName) {
      onCreateProject(projectName, clientName)
      setProjectName('')
      setClientName('')
      setIsCreateOpen(false)
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setEditName(project.name)
    setEditClientName(project.clientName)
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingProject && editName && editClientName) {
      onUpdateProject(editingProject.id, {
        name: editName,
        clientName: editClientName,
      })
      setIsEditOpen(false)
      setEditingProject(null)
    }
  }

  const tokensToCSS = (tokens: DesignTokens): string => {
    let css = ':root {\n'
    if (tokens.colors) {
      Object.entries(tokens.colors).forEach(([key, value]) => {
        css += `  --${key}: ${value};\n`
      })
    }
    if (tokens.fonts) {
      Object.entries(tokens.fonts).forEach(([key, value]) => {
        css += `  --font-${key}: ${value};\n`
      })
    }
    css += '}\n'
    return css
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileCode className="h-4 w-4 text-primary" />
              </div>
              <h1 className="font-bold text-sm">BrandTool</h1>
            </div>
            <ThemeToggle />
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Projects */}
          <SidebarGroup>
            <div className="flex items-center justify-between px-2 py-2">
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="My Brand Project"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="client-name">Client Name</Label>
                      <Input
                        id="client-name"
                        placeholder="Client Name or Brand"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateProject} disabled={!projectName || !clientName}>
                      Create Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <Collapsible
                      defaultOpen={activeProject?.id === project.id}
                      onOpenChange={() => onSelectProject(project)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={activeProject?.id === project.id}
                          className="cursor-pointer"
                        >
                          <FolderPlus className="h-4 w-4" />
                          <span>{project.name}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <span className="text-xs text-muted-foreground">{project.clientName}</span>
                          </SidebarMenuSubItem>

                          {project.requests && project.requests.length > 0 && (
                            <>
                              <SidebarMenuSubItem>
                                <span className="text-xs font-semibold">Components</span>
                              </SidebarMenuSubItem>
                              {project.requests.map((request) => (
                                <SidebarMenuSubItem
                                  key={request.id}
                                  isActive={activeRequest?.id === request.id}
                                  className="cursor-pointer"
                                  onClick={() => onSelectRequest(request)}
                                >
                                  <History className="h-3 w-3" />
                                  <span className="text-xs">{request.prompt.substring(0, 30)}...</span>
                                </SidebarMenuSubItem>
                              ))}
                            </>
                          )}

                          <SidebarMenuSubItem>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start h-auto px-0 py-1"
                              onClick={handleOpenSettings}
                            >
                              <Settings className="h-3 w-3 mr-2" />
                              <span className="text-xs">Settings</span>
                            </Button>
                          </SidebarMenuSubItem>

                          <SidebarMenuSubItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start h-auto px-0 py-1 text-destructive hover:text-destructive"
                                  onClick={() => setEditingProject(project)}
                                >
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  <span className="text-xs">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will delete "{project.name}" and all its components.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDeleteProject(project.id)}
                                    className="bg-destructive"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter />
        <SidebarRail />
      </Sidebar>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Project Settings - {activeProject?.name}</DialogTitle>
            <DialogDescription>Upload a visual reference for AI generation</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Visual Reference Section */}
            <div className="rounded-lg border border-border p-4 bg-muted/50">
              <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Visual Reference
              </h3>

              <label className="flex items-center justify-center gap-3 p-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-muted/30 cursor-pointer transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Click to upload</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    
                    try {
                      const formData = new FormData()
                      formData.append('file', file)
                      
                      const response = await fetch('/api/upload-screenshot', {
                        method: 'POST',
                        body: formData,
                      })
                      
                      const data = await response.json()
                      
                      if (data.url) {
                        setScreenshotUrl(data.url)
                        if (activeProject) {
                          onUpdateProject(activeProject.id, { screenshotUrl: data.url })
                        }
                        toast.success('Screenshot uploaded!', {
                          description: 'AI will match this design style'
                        })
                      } else {
                        toast.error('Upload failed', { description: data.error || 'Try again' })
                      }
                    } catch (error) {
                      toast.error('Upload failed', { description: 'Network error' })
                    }
                  }}
                />
              </label>

              {(screenshotUrl || activeProject?.screenshotUrl) && (
                <div className="mt-4 rounded-lg border border-border overflow-hidden">
                  <img
                    src={screenshotUrl || activeProject?.screenshotUrl!}
                    alt="Reference"
                    className="w-full h-40 object-cover object-top"
                  />
                  <div className="p-2 bg-muted/50 flex items-center justify-between">
                    <span className="text-xs font-medium">Reference active</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 hover:text-destructive"
                      onClick={() => {
                        setScreenshotUrl('')
                        if (activeProject) {
                          onUpdateProject(activeProject.id, { screenshotUrl: '' })
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-client">Client Name</Label>
              <Input
                id="edit-client"
                value={editClientName}
                onChange={(e) => setEditClientName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="flex-1">{children}</main>
    </SidebarProvider>
  )
}
