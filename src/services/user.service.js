import { User } from "../models/user.model.js";
import { db } from "../config/database.js";

export const listUsers = async (page, limit) => {
    try {
        const offset = (page - 1) * limit;

        const [rows] = await db.query("SELECT id_user, email, username, created_at, id_role FROM user LIMIT ? OFFSET ?", [limit, offset]);
        const [countResult] = await db.query("SELECT COUNT(*) AS total FROM user");
        const totalItems = countResult[0]?.total || 0;
        const totalPages = Math.ceil(totalItems / limit);

        return { page, limit, totalItems, totalPages, data: rows };
    } catch (error) {
        throw error;
    }
};

export const crearUsuarioBd = async (data) => {
    try{
        const query = "INSERT INTO user (email, password, username, created_at, id_role) VALUES (?, ?, ?, ?, ?);";
        
        const nuevoUsuarioDb = new User(
            null,
            data.email,
            data.password,
            data.username,
            data.id_role
        );

        const values = [nuevoUsuarioDb.email,nuevoUsuarioDb.password,nuevoUsuarioDb.username,nuevoUsuarioDb.created_at,nuevoUsuarioDb.id_role];

        const [result] = await db.query(query, values);
        
        return { 
            id: result.insertId,
            email: nuevoUsuarioDb.email,
            username: nuevoUsuarioDb.username,
            created_at: nuevoUsuarioDb.created_at,
            id_role: nuevoUsuarioDb.id_role
        }; 

    } catch(error) {
        throw error;
    }
}

export const getUsername = async (userName) => {
    try{
    const query = 'SELECT * FROM user where username like ?;';
    const [result] = await db.query(query, [`%${userName}%`]);

    return result;
    } catch (error){
        throw error;
    }
}

export const getUserId = async (idUser) => {
    try{
        console.log("¡DEBUG! Ejecutando consulta en DB para ID:", idUser); // Confirma que llegamos aquí
        

        const query = 'SELECT * FROM user WHERE id_user = ?';
        const [result] = await db.query(query, [idUser]);

        console.log("¡DEBUG! Resultado de la DB:", result); // Muestra lo que regresa la DB

        return result;
    }catch(error){
        console.error("¡ERROR DE BASE DE DATOS!", error); // Muestra el error de la DB
        throw error;
    }
}

export const updateUser = async (idUser, data) => {
    try{
        const query = 'UPDATE user SET email = ?, password = ?, username=?, id_role=? where id_user = ?;'

        const userUpdate = new User(
            null,
            data.email,
            data.password,
            data.username,
            data.id_role
        );

        const values = [userUpdate.email, userUpdate.password, userUpdate.username, userUpdate.id_role, idUser];

        const [result] = await db.query(query, values)

        return result;

    }catch(error){
        throw error;
    }

}

export const deleteById = async (idUser) => {
    try {
        const query = 'DELETE FROM user WHERE id_user = ?;';

        const [result] = await db.query(query, [idUser]);

        return result;
        
    } catch (error) {
        console.error(error);
    }
}

export const createLogin = async (data) => {
    try{

        const query = 'SELECT username, password, roles.role_name FROM user inner join roles on user.id_role = roles.id_role WHERE username = ? ;';
        const [result] = await db.query(query, [data.username]);

        if (result.length === 0) {
            return null;
        }

        const user = result[0];

        if (data.password !== user.password) {
            // Contraseña incorrecta
            return null;
        }

        return {
            username: user.username,
            role_name: user.role_name,
        };

    } catch (error){
        throw error;
    }
}

export const getRoleIdByUserId = async (idUser) => {
    try {
        const query = 'SELECT id_role FROM user WHERE id_user = ?';
        
        // 🚨 Importante: tu tabla se llama 'user' o 'users'? Asegúrate de usar el nombre correcto.
        const [rows] = await db.query(query, [idUser]);
        
        // Retorna el id_role si se encuentra una fila, o null si el array está vacío
        return rows[0] ? rows[0].id_role : null;
        
    } catch (error) {
        // En caso de error de DB (ej. conexión), lanza el error para que sea manejado
        console.error("Error al obtener el rol del usuario:", error);
        throw error;
    }
};