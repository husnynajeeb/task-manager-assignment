
//  Task Manager page with create, edit, delete, filter and sorting.
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import type { Task, TaskStatus } from "@/types/task";
import { taskApi } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type StatusFilter = "ALL" | TaskStatus;
type SortOrder = "NONE" | "ASC" | "DESC";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [dueDate, setDueDate] = useState("");

  const [filter, setFilter] = useState<StatusFilter>("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>("NONE");

  //  Load tasks from the backend.
  useEffect(() => {
    let ignore = false;

    taskApi
      .getAll()
      .then((data) => {
        if (!ignore) setTasks(data);
      })
      .catch(() => {
        if (!ignore) {
          setError("Unable to load tasks. Please try again.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  //  Reset the task form.
  function resetForm() {
    setTitle("");
    setDescription("");
    setStatus("TODO");
    setDueDate("");
    setEditingTask(null);
  }

  //  Open the dialog for creating a task.
  function openCreateDialog() {
    resetForm();
    setDialogOpen(true);
  }

  //  Open the dialog with an existing task's details.
  function openEditDialog(task: Task) {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setDueDate(task.dueDate || "");
    setDialogOpen(true);
  }

  //  Create or update a task.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a task title.");
      return;
    }

    try {
      setSaving(true);

      const taskData = {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        dueDate: dueDate || undefined,
      };

      if (editingTask) {
        const updatedTask = await taskApi.update(
          editingTask.id,
          taskData
        );

        setTasks((current) =>
          current.map((task) =>
            task.id === editingTask.id ? updatedTask : task
          )
        );

        toast.success("Task updated successfully!");
      } else {
        const newTask = await taskApi.create(taskData);

        setTasks((current) => [...current, newTask]);

        toast.success("Task created successfully!");
      }

      resetForm();
      setDialogOpen(false);
    } catch {
      toast.error(
        editingTask
          ? "Failed to update task."
          : "Failed to create task."
      );
    } finally {
      setSaving(false);
    }
  }

  //  Delete a task after user confirmation.
  async function handleDelete(task: Task) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) return;

    try {
      await taskApi.delete(task.id);

      setTasks((current) =>
        current.filter((item) => item.id !== task.id)
      );

      toast.success("Task deleted successfully!");
    } catch {
      toast.error("Failed to delete task. Please try again.");
    }
  }

  //  Return the appropriate status badge style.
  function getStatusVariant(status: TaskStatus) {
    switch (status) {
      case "DONE":
        return "default";
      case "IN_PROGRESS":
        return "secondary";
      default:
        return "outline";
    }
  }

  //  Filter and sort tasks for display.
  const displayedTasks = tasks
    .filter((task) => filter === "ALL" || task.status === filter)
    .slice()
    .sort((a, b) => {
      if (sortOrder === "NONE") return 0;

      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const comparison = a.dueDate.localeCompare(b.dueDate);

      return sortOrder === "ASC" ? comparison : -comparison;
    });

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">

        {/*  Page heading and create action. */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
               Task Manager
            </h1>
            <p className="mt-2 text-sm text-gray-500">
               Organize and manage your daily tasks.
            </p>
          </div>

          <Button onClick={openCreateDialog}>
            +  Create Task
          </Button>
        </div>

        {/*  Create and edit task dialog. */}
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTask
                  ? " Edit Task"
                  : " Create New Task"}
              </DialogTitle>

              <DialogDescription>
                 Enter the task details below.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title"> Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter task title"
                  maxLength={100}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description"> Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Enter task description"
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status"> Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as TaskStatus)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate"> Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editingTask
                      ? "Save Changes"
                      : "Create Task"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/*  Task list and filter controls. */}
        <Card>
          <CardHeader>
            <CardTitle>
               Your Tasks ({tasks.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1 space-y-2">
                <Label htmlFor="filter"> Filter by Status</Label>
                <select
                  id="filter"
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.target.value as StatusFilter)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="ALL">All Tasks</option>
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="sort"> Sort by Due Date</Label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(event.target.value as SortOrder)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="NONE">Default Order</option>
                  <option value="ASC">Earliest First</option>
                  <option value="DESC">Latest First</option>
                </select>
              </div>
            </div>

            {loading && (
              <p className="py-6 text-center text-gray-500">
                 Loading tasks...
              </p>
            )}

            {error && (
              <p className="py-6 text-center text-red-600">
                {error}
              </p>
            )}

            {!loading && !error && tasks.length === 0 && (
              <p className="py-10 text-center text-gray-500">
                 No tasks yet
              </p>
            )}

            {!loading && !error && tasks.length > 0 &&
              displayedTasks.length === 0 && (
                <p className="py-8 text-center text-gray-500">
                   No tasks match this filter.
                </p>
              )}

            {!loading && !error && displayedTasks.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-sm text-gray-500">
                      <th className="p-3"> Title</th>
                      <th className="p-3"> Status</th>
                      <th className="p-3"> Due Date</th>
                      <th className="p-3"> Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayedTasks.map((task) => (
                      <tr key={task.id} className="border-b last:border-0">
                        <td className="p-3">
                          <p className="font-medium">{task.title}</p>
                          {task.description && (
                            <p className="mt-1 text-sm text-gray-500">
                              {task.description}
                            </p>
                          )}
                        </td>

                        <td className="p-3">
                          <Badge variant={getStatusVariant(task.status)}>
                            {task.status.replace("_", " ")}
                          </Badge>
                        </td>

                        <td className="p-3 text-sm">
                          {task.dueDate || "—"}
                        </td>

                        <td className="p-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(task)}
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(task)}
                            >
                              Delete
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
    </main>
  );
}
