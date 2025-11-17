// models/task.model.js
export class Task {
    constructor(id_task, title, description, status, priority, start_date, end_date, estimated_time, actual_time, id_project, updated_at) {
        this.id_task = id_task;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.start_date = start_date;
        this.end_date = end_date;
        this.estimated_time = estimated_time;
        this.actual_time = actual_time;
        this.id_project = id_project;
        this.updated_at = updated_at;
    }
}