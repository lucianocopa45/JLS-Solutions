// utils/client.mysqlErrorHandler.js
import ApiError from "./ApiError.js";

export const clientHandleMySQLError = (error, dataDb = {}) => {

    console.error("Error crudo de DB:", error);

    switch (error.code) {

        case "ER_DUP_ENTRY":
            if (error.sqlMessage.includes("email")) {
                throw new ApiError(400, "El Email ya está registrado para otro cliente.");
            }
            if (error.sqlMessage.includes("id_user")) {
                throw new ApiError(400, "Este usuario ya tiene un cliente asignado.");
            }
            throw new ApiError(400, "Dato duplicado en un campo único del cliente.");

        case "ER_NO_REFERENCED_ROW_2":
            if (error.sqlMessage.includes("id_user")) {
                throw new ApiError(400, `El Usuario con ID ${dataDb.id_user} no existe.`);
            }
            throw new ApiError(400, "Clave foránea no encontrada (Usuario).");

        case "ER_ROW_IS_REFERENCED_2":
            throw new ApiError(400, "No se puede eliminar este cliente porque está asociado a uno o más proyectos.");

        case "ER_BAD_NULL_ERROR":
            throw new ApiError(400, "Falta un dato obligatorio (id_user).");

        case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
        case "ER_DATA_TOO_LONG":
            throw new ApiError(400, "Error en el formato o tamaño de los datos proporcionados (ej. status no válido).");

        case "PROTOCOL_CONNECTION_LOST":
        case "ECONNREFUSED":
            throw new ApiError(500, "Error de conexión con la base de datos.");

        default:
            throw new ApiError(500, "Error interno al procesar el cliente.");
    }
};