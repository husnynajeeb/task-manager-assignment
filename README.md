#  Task Manager

A full-stack Task Manager application built with **NestJS** and **Next.js**. It allows users to create, view, update, delete, filter, and sort tasks.

## Features

- Create new tasks with a title, description, status, and due date.
- View all tasks in a table.
- Edit existing tasks.
- Delete tasks with confirmation.
- Filter tasks by status.
- Sort tasks by due date (earliest first or latest first).
- Validate incoming API requests.
- Display loading and error states.
- Show success and error notifications.

## Tech Stack

### Backend
- NestJS
- TypeScript
- class-validator
- class-transformer
- In-memory storage

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Sonner (toast notifications)

## Project Structure

```text
task-manager-assignment/
├── api/
│   └── src/
│       ├── tasks/
│       │   ├── dto/
│       │   ├── task.interface.ts
│       │   ├── tasks.controller.ts
│       │   ├── tasks.service.ts
│       │   └── tasks.module.ts
│       ├── app.module.ts
│       └── main.ts
├── web/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── types/
│   └── .env.local.example
└── README.md
```

## Prerequisites

- Node.js (v22 or compatible version)
- npm
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/husnynajeeb/task-manager-assignment.git
cd task-manager-assignment
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your public GitHub repository URL.

### 2. Install backend dependencies

```bash
cd api
npm install
```

### 3. Configure the backend

The backend uses port `3001` for local development.

### 4. Start the backend

```bash
PORT=3001 npm run start:dev
```

The API will be available at:

`http://localhost:3001`

### 5. Install frontend dependencies

Open a second terminal:

```bash
cd task-manager-assignment/web
npm install
```

### 6. Configure frontend environment variables

Create a `.env.local` file inside the `web` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 7. Start the frontend

```bash
npm run dev
```

The frontend will be available at:

`http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Retrieve all tasks |
| GET | `/tasks/:id` | Retrieve a task by ID |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Task Fields

| Field | Description |
|---|---|
| id | Unique task identifier |
| title | Required task title |
| description | Optional task description |
| status | TODO, IN_PROGRESS, or DONE |
| dueDate | Optional due date |
| createdAt | Task creation timestamp |

## Validation and Error Handling

- Task titles are required.
- Task titles and descriptions have maximum length limits.
- Status values must match the supported task statuses.
- Due dates must be valid date strings.
- Invalid requests return HTTP 400.
- Requests for non-existent tasks return HTTP 404.

## Storage

This project uses in-memory storage. Tasks are stored while the backend process is running. Restarting the backend resets the task data.

## How I Used AI

AI tools were used as development assistance during the implementation process, including:

- Understanding NestJS and Next.js project structure.
- Assisting with DTO validation and API implementation.
- Helping integrate frontend API requests.
- Troubleshooting UI and integration issues.
- Reviewing implementation details and improving documentation.

All generated and assisted code was reviewed, tested, and integrated into the project.

## Author

Husny Najeeb