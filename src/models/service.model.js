// models/service.model.js
export class Service {
    constructor(id_service, service_name, description, price) {
        this.id_service = id_service;
        this.service_name = service_name;
        this.description = description;
        this.price = price;
    }
}