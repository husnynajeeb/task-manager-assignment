"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const task_interface_1 = require("./task.interface");
let TasksService = class TasksService {
    tasks = [];
    findAll() {
        return this.tasks;
    }
    findOne(id) {
        const task = this.tasks.find((item) => item.id === id);
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
    create(createTaskDto) {
        const task = {
            id: (0, crypto_1.randomUUID)(),
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: createTaskDto.status ?? task_interface_1.TaskStatus.TODO,
            dueDate: createTaskDto.dueDate,
            createdAt: new Date().toISOString(),
        };
        this.tasks.push(task);
        return task;
    }
    update(id, updateTaskDto) {
        const task = this.findOne(id);
        Object.assign(task, updateTaskDto);
        return task;
    }
    remove(id) {
        const task = this.findOne(id);
        this.tasks = this.tasks.filter((item) => item.id !== id);
        return { message: `Task "${task.title}" deleted successfully` };
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)()
], TasksService);
//# sourceMappingURL=tasks.service.js.map