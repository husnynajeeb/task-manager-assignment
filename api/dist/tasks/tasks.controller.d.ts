import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(): import("./task.interface").Task[];
    findOne(id: string): import("./task.interface").Task;
    create(createTaskDto: CreateTaskDto): import("./task.interface").Task;
    update(id: string, updateTaskDto: UpdateTaskDto): import("./task.interface").Task;
    remove(id: string): {
        message: string;
    };
}
