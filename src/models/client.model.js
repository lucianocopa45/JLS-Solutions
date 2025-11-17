// models/client.model.js
export class Client {
    constructor(id_client, first_name, last_name, company_name, email, phone, address, id_user, industry, client_status) {
        this.id_client = id_client;
        this.first_name = first_name;
        this.last_name = last_name;
        this.company_name = company_name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.id_user = id_user; 
        this.industry = industry;
        this.client_status = client_status;
    }
}