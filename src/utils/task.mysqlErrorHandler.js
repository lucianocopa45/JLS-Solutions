// utils/task.mysqlErrorHandler.js

import ApiError from "./ApiError.js";

export const taskHandleMySQLError = (error, dataDb = {}) => {

    console.error("Error crudo de DB:", error);

    switch (error.code) {

        case "ER_DUP_ENTRY":
            // Duplicidad en la asignación (id_task, id_employee)
            if (error.sqlMessage.includes("id_task") && error.sqlMessage.includes("id_employee")) {
                throw new ApiError(400, "Este empleado ya está asignado a esta tarea.");
            }
            throw new ApiError(400, "Dato duplicado en un campo único.");

        case "ER_NO_REFERENCED_ROW_2":
            // FK: id_project o id_employee no existen
            if (error.sqlMessage.includes("id_project")) {
                throw new ApiError(400, `El proyecto con id ${dataDb.id_project} no existe.`);
            }
            // Esto cubre errores donde id_employees es una lista y uno falla
            if (error.sqlMessage.includes("id_employee")) {
                throw new ApiError(400, "Referencia a un empleado inexistente."); 
            }
            throw new ApiError(400, "Referencia a un registro inexistente (Clave Foránea).");

        case "ER_ROW_IS_REFERENCED_2":
            // Intentar borrar una tarea con asignaciones
            throw new ApiError(400, "No se puede eliminar esta tarea/asignación porque está referenciada en otra tabla.");

        case "ER_BAD_NULL_ERROR":
            throw new ApiError(400, "Falta un dato obligatorio.");
        
        case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
        case "ER_WARN_DATA_TRUNCATED":
        case "ER_DATA_TOO_LONG":
            throw new ApiError(400, "Tipo de dato/Longitud incorrecta en un campo.");

        case "PROTOCOL_CONNECTION_LOST":
        case "ECONNREFUSED":
            throw new ApiError(500, "Error de conexión con la base de datos.");

        default:
            throw new ApiError(500, "Error interno al procesar la tarea.");
    }
};