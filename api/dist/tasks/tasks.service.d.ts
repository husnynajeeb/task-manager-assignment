import { Task } from './task.interface';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private tasks;
    findAll(): Task[];
    findOne(id: string): Task;
    create(createTaskDto: CreateTaskDto): Task;
    update(id: string, updateTaskDto: UpdateTaskDto): Task;
    remove(id: string): {
        message: string;
    };
}
