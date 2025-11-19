import e from 'express';
import { listUsers, crearUsuarioBd, getUserId, getUsername, updateUser, deleteById } from '../services/user.service.js';
import { userHandleMySQLError } from '../utils/user.mysqlErrorHandler.js';
// import ApiError from '../utils/ApiError.js'

export const postUser = (req, res) =>{
    const userData = req.body;

    console.log(userData);
    if (!userData.nombre || !userData.apellido || !userData.email || !userData.password || !userData.rol) {
        return res.status(400).json({ error: 'Faltan datos en el body' });
    }
    const newUser = createUser(userData);
    res.status(201).json(newUser);
}

export const listUsersPage = async (req, res) => {
    try {
        const pageRaw = parseInt(req.params.page); 
        const limitRaw = parseInt(req.params.limit);

        const page = (isNaN(pageRaw) || pageRaw <= 0) ? 1 : pageRaw;
        const limit = (isNaN(limitRaw) || limitRaw <= 0) ? 10 : limitRaw;

        console.log(`Página: ${page}, Límite: ${limit}`);

        const dataUsers = await listUsers(page, limit);

        if (!dataUsers || dataUsers.data.length === 0) {
            return res.status(404).json({ error: "No se encontraron usuarios" });
        }
        res.status(200).json(dataUsers);
    } catch (error) {
        userHandleMySQLError(error, req.query); 
        throw error;
    }
}

export const postUserDb = async (req, res) => {
    const dataDb = req.body;
    console.log(dataDb);

    try {
    const newUserDb = await crearUsuarioBd(dataDb);
    return res.status(201).json({ message: 'Usuario creado exitosamente', user: newUserDb });
    } catch (error) {
        userHandleMySQLError(error, req.query); 
        throw error;
}
};

export const getUserById = async (req, res) => {
        console.log("¡DEBUG! Controlador getUserById alcanzado."); 
        console.log("ID recibido:", req.params.id); // Asegúrate de que el ID se está capturando
    try{
        const id = parseInt(req.params.id);
        const dataById = await getUserId(id);
        if (!dataById || dataById.length == 0) {
            return res.status(401).json({message : "Usuario no encontrado"});
        }
        res.json(dataById);
        console.log(dataById);
    }catch(error){
        console.error(error)
    }
}
export const getUserByUserName = async (req, res) => {
    try {
        const { userName } = req.params;
console.log(userName);
        if (!userName) {
            return res.status(400).json({ message: "Username is required" });
        }

        const dataUser = await getUsername(userName);

        return res.status(200).json(dataUser);

    } catch (error) {
        console.error("Error in getUserByUserName:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const putUser = async (req, res) => {
    try{
    const idData = parseInt(req.params.id);
    const data = req.body;

    const dataUpdate = await updateUser(idData, data);

    if (isNaN(idData)) {
        return res.status(400).json({ message: "El ID proporcionado no es válido." });
    }
    if (!data || !data.email || !data.password) {
        return res.status(400).json({ message: 'Faltan datos obligatorios (email y password) en el cuerpo de la solicitud.' });
    }

    if (dataUpdate.affectedRows === 0) {
    return res.status(404).json({ message: "Usuario no encontrado para la actualización." });
    }
    
    res.status(200).json({ 
        message: `Usuario con ID ${idData} actualizado con éxito.`,
        user: dataUpdate
    });
    
    } catch(error){
        userHandleMySQLError(error, req.query); 
        throw error;
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await deleteById(id)

    if (data.affectedRows === 0) {
        // Aquí puedes determinar que el registro no existía
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    res.status(200).json({message: `Usuario con ID ${id} eliminado con éxito`});

    } catch (error) {
        console.error("Error en la función deleteById:", error);
        res.status(500).json({ message: "Error interno del servidor al intentar eliminar el usuario." });
    }
}