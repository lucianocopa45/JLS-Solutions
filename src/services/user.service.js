import { User } from "../models/user.model.js";
import { db } from "../config/database.js";
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

const usuarios = [];

export const createUser = (userData) => {

    const newUser = new User(
        usuarios.length + 1,
        userData.nombre,
        userData.apellido,
        userData.email,
        userData.password,
        userData.rol
    );
    
    usuarios.push(newUser);
    return newUser;
}

export const listUser = async () => {
    try{ 
    const [result] = await db.query("SELECT * FROM user");

    const usuarios = result.map(u => ({
      ...u,
      created_at: dayjs(u.created_at).format('DD/MM/YYYY HH:mm:ss')
    }));

    return usuarios;
    //console.log(result);
    } catch(error){
        console.error(error);
    }
}

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
            password: nuevoUsuarioDb.password,
            username: nuevoUsuarioDb.username,
            created_at: nuevoUsuarioDb.created_at,
            id_role: nuevoUsuarioDb.id_role
        }; 

    } catch(error) {
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