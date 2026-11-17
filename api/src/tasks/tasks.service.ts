
import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Task, TaskStatus } from './task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  //  Returns all tasks stored in memory.
  findAll(): Task[] {
    return this.tasks;
  }

  //  Finds a task by ID or throws a 404 error.
  findOne(id: string): Task {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  //  Creates and stores a new task.
  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: randomUUID(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status ?? TaskStatus.TODO,
      dueDate: createTaskDto.dueDate,
      createdAt: new Date().toISOString(),
    };

    this.tasks.push(task);
    return task;
  }

  //  Updates an existing task with the supplied fields.
  update(id: string, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);

    Object.assign(task, updateTaskDto);

    return task;
  }

  //  Deletes an existing task from memory.
  remove(id: string): { message: string } {
    const task = this.findOne(id);

    this.tasks = this.tasks.filter((item) => item.id !== id);

    return { message: `Task "${task.title}" deleted successfully` };
  }
}
