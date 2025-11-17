// utils/user.mysqlErrorHandler.js

import ApiError from "./ApiError.js"; 

export const userHandleMySQLError = (error, dataDb = {}) => {

    console.error("Error crudo de DB:", error);

    switch (error.code) {

        case "ER_DUP_ENTRY":
            if (error.sqlMessage.includes("email")) {
                throw new ApiError(400, "El email ya está registrado.");
            }
            if (error.sqlMessage.includes("username")) {
                throw new ApiError(400, "El nombre de usuario ya está en uso.");
            }
            throw new ApiError(400, "Dato duplicado en un campo único.");

        case "ER_NO_REFERENCED_ROW_2":
            throw new ApiError(400, `El rol con id ${dataDb.id_role} no existe.`);

        case "ER_ROW_IS_REFERENCED_2":
            throw new ApiError(400, "No se puede eliminar este usuario porque está referenciado (ej. es un empleado).");

        case "ER_BAD_NULL_ERROR":
            throw new ApiError(400, "Falta un dato obligatorio.");
        
        case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
        case "ER_DATA_TOO_LONG":
            throw new ApiError(400, "Tipo de dato/Longitud incorrecta.");
        
        case "PROTOCOL_CONNECTION_LOST":
        case "ECONNREFUSED":
            throw new ApiError(500, "Error de conexión con la base de datos.");

        default:
            throw new ApiError(500, "Error interno al procesar el usuario.");
    }
};