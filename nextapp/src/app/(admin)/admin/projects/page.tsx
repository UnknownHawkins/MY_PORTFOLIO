"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, FolderKanban, Loader2, Link as LinkIcon } from "lucide-react";

import { ProjectSchema, type ProjectFormValues } from "@/lib/validations";
import { createProject, updateProject, deleteProject } from "@/actions/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitPending, startSubmitTransition] = useTransition();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      tags: [],
      technologies: [],
      githubUrl: "",
      liveUrl: "",
      imageUrl: "",
      status: "completed",
      featured: false,
      order: 0,
      type: "",
    },
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) {
        const payload = await res.json();
        if (payload.success) {
          setProjects(payload.data);
        }
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    reset({
      title: "",
      description: "",
      longDescription: "",
      tags: ["HTML", "CSS"],
      technologies: ["HTML5", "CSS3"],
      githubUrl: "",
      liveUrl: "",
      imageUrl: "",
      status: "completed",
      featured: false,
      order: projects.length + 1,
      type: "",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (project: any) => {
    setEditingId(project.id);
    reset({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || "",
      tags: project.tags,
      technologies: project.technologies,
      githubUrl: project.githubUrl || "",
      liveUrl: project.liveUrl || "",
      imageUrl: project.imageUrl || "",
      status: project.status,
      featured: project.featured,
      order: project.order,
      type: project.type || "",
    });
    setIsOpen(true);
  };

  const onSubmit = (data: ProjectFormValues) => {
    startSubmitTransition(async () => {
      try {
        let result;
        if (editingId) {
          result = await updateProject(editingId, data);
        } else {
          result = await createProject(data);
        }

        if (result.success) {
          toast.success(editingId ? "Project updated successfully!" : "Project created successfully!");
          setIsOpen(false);
          fetchProjects();
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong.");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await deleteProject(id);
      if (res.success) {
        toast.success("Project deleted successfully.");
        fetchProjects();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete project.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Projects Manager</h1>
          <p className="text-slate-400 text-sm mt-1">
            Create, update, or remove portfolio items
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl cursor-pointer shadow-md border-0"
        >
          <Plus className="mr-1.5 h-4.5 w-4.5" />
          Add Project
        </Button>
      </div>

      <Card className="bg-slate-900/40 border-slate-900">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-white">Registered Projects ({projects.length})</CardTitle>
          <CardDescription className="text-slate-500 text-xs mt-1">
            Display order is sorted by order index ascendancy
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 bg-slate-900/60 rounded-xl w-full" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm flex flex-col items-center justify-center gap-4">
              <FolderKanban className="h-12 w-12 text-slate-700" />
              <span>No projects found. Add your first project using the button.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950/40 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-900">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Tags</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/60">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="py-4 px-4 font-bold text-white">
                        {proj.title}
                        {proj.featured && (
                          <Badge className="ml-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold uppercase rounded-md">
                            Featured
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs font-semibold uppercase">{proj.status}</td>
                      <td className="py-4 px-4 font-mono font-bold text-xs">{proj.order}</td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1 max-w-[200px] overflow-hidden truncate">
                          {proj.tags.slice(0, 2).map((t: string) => (
                            <Badge key={t} variant="secondary" className="bg-slate-950 border border-slate-900 text-slate-500 text-[9px] rounded-md font-semibold">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleOpenEdit(proj)}
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            onClick={() => handleDelete(proj.id)}
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-300 max-w-2xl overflow-y-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingId ? "Edit Project Details" : "Register New Project"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Fill in project coordinates. Standard HTML rendering is applied.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Title & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs text-slate-400 font-bold uppercase tracking-wider">Title</Label>
                <Input
                  id="title"
                  className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-700 focus-visible:ring-blue-500/50"
                  {...register("title")}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type" className="text-xs text-slate-400 font-bold uppercase tracking-wider">Type / Label</Label>
                <Input
                  id="type"
                  placeholder="e.g. 3rd Year Mini Project"
                  className="bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-700"
                  {...register("type")}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs text-slate-400 font-bold uppercase tracking-wider">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Brief intro description of the project..."
                className="bg-slate-950/60 border-slate-800 text-white resize-none"
                {...register("description")}
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            {/* GitHub & Live URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="githubUrl" className="text-xs text-slate-400 font-bold uppercase tracking-wider">Code Repository Link</Label>
                <Input
                  id="githubUrl"
                  placeholder="https://github.com/..."
                  className="bg-slate-950/60 border-slate-800 text-white"
                  {...register("githubUrl")}
                />
                {errors.githubUrl && <p className="text-xs text-red-500">{errors.githubUrl.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="liveUrl" className="text-xs text-slate-400 font-bold uppercase tracking-wider">Live Preview URL</Label>
                <Input
                  id="liveUrl"
                  placeholder="https://..."
                  className="bg-slate-950/60 border-slate-800 text-white"
                  {...register("liveUrl")}
                />
                {errors.liveUrl && <p className="text-xs text-red-500">{errors.liveUrl.message}</p>}
              </div>
            </div>

            {/* Order, Status, Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="space-y-1.5">
                <Label htmlFor="order" className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order Position</Label>
                <Input
                  id="order"
                  type="number"
                  className="bg-slate-950/60 border-slate-800 text-white"
                  {...register("order", { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</Label>
                <select
                  id="status"
                  className="w-full h-10 px-3 bg-slate-950 border border-slate-800 text-white rounded-lg"
                  {...register("status")}
                >
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="held">Held</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  id="featured"
                  type="checkbox"
                  className="w-4 h-4 accent-blue-500 bg-slate-950 border border-slate-800"
                  {...register("featured")}
                />
                <Label htmlFor="featured" className="text-sm font-semibold text-slate-300">Featured Highlight</Label>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-800/80">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitPending}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer border-0 h-10 px-4"
              >
                {isSubmitPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
