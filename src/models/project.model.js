// models/project.model.js
export class Project {
    constructor(id_project, name, description, start_date, end_date, status, id_client, id_manager, budget, closed_at) {
        this.id_project = id_project;
        this.name = name;
        this.description = description;
        this.start_date = start_date;
        this.end_date = end_date;
        this.status = status;
        this.id_client = id_client;
        this.id_manager = id_manager;
        this.budget = budget;
        this.closed_at = closed_at; 
    }
}