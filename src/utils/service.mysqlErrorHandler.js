// utils/service.mysqlErrorHandler.js

import ApiError from "./ApiError.js";

export const serviceHandleMySQLError = (error, dataDb = {}) => {

    console.error("Error crudo de DB:", error);

    switch (error.code) {

        case "ER_DUP_ENTRY":
            if (error.sqlMessage.includes("service_name")) {
                throw new ApiError(400, "El nombre del servicio ya está registrado.");
            }
            // Clave primaria compuesta duplicada (Project_Service)
            if (error.sqlMessage.includes("PRIMARY")) {
                throw new ApiError(400, "El servicio ya está asignado a este proyecto.");
            }
            throw new ApiError(400, "Dato duplicado en un campo único.");

        case "ER_NO_REFERENCED_ROW_2":
            // Fallo de FK: id_project o id_service no existen
            if (error.sqlMessage.includes("id_project")) {
                throw new ApiError(400, `El proyecto con id ${dataDb.id_project} no existe.`);
            }
            if (error.sqlMessage.includes("id_service")) {
                // Aquí usamos el plural si los datos vienen como una lista (asignación masiva)
                const serviceId = Array.isArray(dataDb.services) 
                                ? "uno de los servicios" 
                                : dataDb.id_service;
                
                throw new ApiError(400, `El servicio con id ${serviceId} no existe.`);
            }
            throw new ApiError(400, "Referencia a un registro inexistente (Clave Foránea).");

        case "ER_ROW_IS_REFERENCED_2":
            throw new ApiError(400, "No se puede eliminar este servicio porque está en uso en Project_Service.");

        case "ER_BAD_NULL_ERROR":
            throw new ApiError(400, "Falta un dato obligatorio.");

        case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
            throw new ApiError(400, "Tipo de dato incorrecto en un campo.");

        case "ER_DATA_TOO_LONG":
            throw new ApiError(400, "El valor ingresado excede el tamaño permitido.");

        case "PROTOCOL_CONNECTION_LOST":
        case "ECONNREFUSED":
            throw new ApiError(500, "Error de conexión con la base de datos."); // Cambiado a 500 para reflejar un error interno

        default:
            throw new ApiError(500, "Error interno al procesar el servicio.");
    }
};