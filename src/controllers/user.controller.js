import e from 'express';
import { createUser, listUser, crearUsuarioBd, getUserId, updateUser, deleteById } from '../services/user.service.js';
import ApiError from '../utils/ApiError.js'

export const postUser = (req, res) =>{
    const userData = req.body;

    console.log(userData);
    if (!userData.nombre || !userData.apellido || !userData.email || !userData.password || !userData.rol) {
        return res.status(400).json({ error: 'Faltan datos en el body' });
    }
    const newUser = createUser(userData);
    res.status(201).json(newUser);
}

export const getAllUser = async (req, res) => {
    const allUsers = await listUser();
    console.log(allUsers);
    if (!allUsers) {
        return res.status(400).json({ error: "No hay Usuarios" });
    }

    res.status(200).json(allUsers);
    console.log(allUsers);
}

export const postUserDb = async (req, res) => {
    const dataDb = req.body;
    console.log(dataDb);

    try {
    const newUserDb = await crearUsuarioBd(dataDb);
    return res.status(201).json({ message: 'Usuario creado exitosamente', user: newUserDb });
    } catch (error) {
    console.error("Error crudo de DB:", error);

    switch (error.code) {
    case "ER_DUP_ENTRY":
        if (error.sqlMessage.includes("email")) {
        throw new ApiError(400, "El email ya está registrado.");
        }
        if (error.sqlMessage.includes("username")) {
        throw new ApiError(400, "El nombre de usuario ya está en uso.");
        }
        throw new ApiError(400, "Datos duplicados.");

    case "ER_NO_REFERENCED_ROW_2":
        throw new ApiError(400, `El rol con id ${dataDb.id_role} no existe.`);

    case "ER_ROW_IS_REFERENCED_2":
        throw new ApiError(400, "No se puede eliminar este usuario porque está siendo usado en otra tabla.");

    case "ER_BAD_NULL_ERROR":
        throw new ApiError(400, "Falta un dato obligatorio.");

    case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
        throw new ApiError(400, "El tipo de dato ingresado no es válido.");

    case "PROTOCOL_CONNECTION_LOST":
    case "ECONNREFUSED":
        throw new ApiError(500, "Error de conexión con la base de datos.");

    default:
        throw new ApiError(500, "Error interno al crear el usuario.");
    }
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
        console.error("Error en la función putUser:", error);
    switch (error.code) {
    case "ER_DUP_ENTRY":
        if (error.sqlMessage.includes("email")) {
        throw new ApiError(400, "El email ya está registrado.");
        }
        if (error.sqlMessage.includes("username")) {
        throw new ApiError(400, "El nombre de usuario ya está en uso.");
        }
        throw new ApiError(400, "Datos duplicados.");

    case "ER_NO_REFERENCED_ROW_2":
        throw new ApiError(400, `El rol con id ${dataDb.id_role} no existe.`);

    case "ER_ROW_IS_REFERENCED_2":
        throw new ApiError(400, "No se puede eliminar este usuario porque está siendo usado en otra tabla.");

    case "ER_BAD_NULL_ERROR":
        throw new ApiError(400, "Falta un dato obligatorio.");

    case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
        throw new ApiError(400, "El tipo de dato ingresado no es válido.");

    case "PROTOCOL_CONNECTION_LOST":
    case "ECONNREFUSED":
        throw new ApiError(500, "Error de conexión con la base de datos.");

    default:
        throw new ApiError(500, "Error interno al crear el usuario.");
    }
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