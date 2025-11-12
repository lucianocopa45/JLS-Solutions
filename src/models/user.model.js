export class User {
    
    constructor(id, email, password, username, id_role) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.created_at = new Date();
    this.id_role = id_role;
    
}
}