import type { Task, TaskStatus } from "@/types/task";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
}

export const taskApi = {
  async getAll(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/tasks`);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    return response.json();
  },

  async create(data: CreateTaskData): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    return response.json();
  },

  async update(id: string, data: Partial<CreateTaskData>): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
  },
};