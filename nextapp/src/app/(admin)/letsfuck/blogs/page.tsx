"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, FileText, Loader2 } from "lucide-react";

import { BlogSchema, type BlogFormValues } from "@/lib/validations";
import { createBlog, updateBlog, deleteBlog } from "@/actions/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
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
  } = useForm<BlogFormValues>({
    resolver: zodResolver(BlogSchema) as any,
    defaultValues: {
      title: "",
      partNo: "Part 1",
      content: "",
      author: "Anubhav Singh",
    },
  });

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const payload = await res.json();
        if (payload.success) {
          setBlogs(payload.data);
        }
      }
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    reset({
      title: "",
      partNo: `Part ${blogs.length + 1}`,
      content: "",
      author: "Anubhav Singh",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (blog: any) => {
    setEditingId(blog.id);
    reset({
      title: blog.title,
      partNo: blog.partNo,
      content: blog.content,
      author: blog.author || "Anubhav Singh",
    });
    setIsOpen(true);
  };

  const onSubmit = (data: BlogFormValues) => {
    startSubmitTransition(async () => {
      try {
        let result;
        if (editingId) {
          result = await updateBlog(editingId, data);
        } else {
          result = await createBlog(data);
        }

        if (result.success) {
          toast.success(editingId ? "Blog updated successfully!" : "Blog created successfully!");
          setIsOpen(false);
          fetchBlogs();
        }
      } catch (err: any) {
        toast.error(err.message || "Something went wrong.");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await deleteBlog(id);
      if (res.success) {
        toast.success("Blog deleted successfully.");
        fetchBlogs();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete blog.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Blogs Manager</h1>
          <p className="text-slate-400 text-sm mt-1">
            Write, edit, and publish blogs to your portfolio website.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-10 px-4 font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="h-4 w-4" />
          Write Blog
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-slate-950 border border-slate-900 text-white rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {editingId ? "Edit Blog Post" : "Publish New Blog Post"}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Fill in the details below. Once saved, it will display on the home screen immediately.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="title" className="text-xs font-semibold text-slate-300">
                    Blog Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Mastering Tailwind CSS v4"
                    className="bg-slate-900/60 border-slate-900 focus:border-slate-800 rounded-xl"
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-[10px] mt-0.5">{errors.title.message}</p>
                  )}
                </div>

                {/* Part No */}
                <div className="space-y-1.5">
                  <Label htmlFor="partNo" className="text-xs font-semibold text-slate-300">
                    Part / Sequence No
                  </Label>
                  <Input
                    id="partNo"
                    placeholder="e.g. Part 1, Part 2, or General"
                    className="bg-slate-900/60 border-slate-900 focus:border-slate-800 rounded-xl"
                    {...register("partNo")}
                  />
                  {errors.partNo && (
                    <p className="text-red-400 text-[10px] mt-0.5">{errors.partNo.message}</p>
                  )}
                </div>

                {/* Author */}
                <div className="space-y-1.5">
                  <Label htmlFor="author" className="text-xs font-semibold text-slate-300">
                    Author Name
                  </Label>
                  <Input
                    id="author"
                    placeholder="Anubhav Singh"
                    className="bg-slate-900/60 border-slate-900 focus:border-slate-800 rounded-xl"
                    {...register("author")}
                  />
                  {errors.author && (
                    <p className="text-red-400 text-[10px] mt-0.5">{errors.author.message}</p>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <Label htmlFor="content" className="text-xs font-semibold text-slate-300">
                  Blog Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your markdown or text content here..."
                  rows={10}
                  className="bg-slate-900/60 border-slate-900 focus:border-slate-800 rounded-xl font-mono text-sm resize-y min-h-[200px]"
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-red-400 text-[10px] mt-0.5">{errors.content.message}</p>
                )}
              </div>

              <DialogFooter className="pt-4 border-t border-slate-900/80 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-slate-900 text-slate-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitPending}
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-5 font-semibold flex items-center gap-1.5"
                >
                  {isSubmitPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Update Post" : "Publish Post"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blogs list */}
      <Card className="bg-slate-950/20 border-slate-900">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            All Blogs ({blogs.length})
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs">
            Manage your published articles. Blogs are loaded dynamically and order is by the latest updated date.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full bg-slate-900/40 rounded-xl" />
              <Skeleton className="h-16 w-full bg-slate-900/40 rounded-xl" />
              <Skeleton className="h-16 w-full bg-slate-900/40 rounded-xl" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-900 rounded-2xl bg-slate-950/40">
              <FileText className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">No blog posts found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {process.env.TURSO_DATABASE_URL
                  ? "Write and publish your first article to display it on the site."
                  : "Database not configured. Content will show static backup blogs."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-4">Title</th>
                    <th className="pb-3">Part No</th>
                    <th className="pb-3">Author</th>
                    <th className="pb-3">Updated At</th>
                    <th className="pb-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/50">
                  {blogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="hover:bg-slate-900/10 group transition-all"
                    >
                      <td className="py-4 pl-4 font-semibold text-white max-w-[200px] truncate">
                        {blog.title}
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/10">
                          {blog.partNo}
                        </span>
                      </td>
                      <td className="py-4 text-slate-400">{blog.author || "Anubhav Singh"}</td>
                      <td className="py-4 text-xs text-slate-500">
                        {new Date(blog.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(blog)}
                            className="h-8 w-8 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
                          >
                            <Edit2 className="h-4.5 w-4.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(blog.id)}
                            className="h-8 w-8 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
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
    </div>
  );
}
