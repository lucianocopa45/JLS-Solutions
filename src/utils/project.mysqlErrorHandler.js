// utils/project.mysqlErrorHandler.js
import ApiError from "./ApiError.js";

export const projectHandleMySQLError = (error, dataDb = {}) => {

    console.error("Error crudo de DB:", error);

    switch (error.code) {

        case "ER_DUP_ENTRY":
            // Si asumes que el 'name' del proyecto es UNIQUE.
            if (error.sqlMessage.includes("name")) {
                throw new ApiError(400, "Ya existe un proyecto con ese nombre.");
            }
            throw new ApiError(400, "Dato duplicado en un campo único del proyecto.");

        case "ER_NO_REFERENCED_ROW_2":
            // Claves foráneas: id_client y id_manager
            if (error.sqlMessage.includes("id_client")) {
                throw new ApiError(400, `El Cliente con ID ${dataDb.id_client} no existe.`);
            }
            if (error.sqlMessage.includes("id_manager")) {
                throw new ApiError(400, `El Manager (Empleado) con ID ${dataDb.id_manager} no existe.`);
            }
            throw new ApiError(400, "Clave foránea no encontrada (Cliente o Manager).");

        case "ER_ROW_IS_REFERENCED_2":
            throw new ApiError(400, "No se puede eliminar este proyecto porque está referenciado en otra tabla.");

        case "ER_BAD_NULL_ERROR":
            // Campos NOT NULL que faltan: name, start_date, id_client
            throw new ApiError(400, "Falta un dato obligatorio (name, start_date, o id_client).");

        case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
            // Problemas con fechas, números o estados
            if (error.sqlMessage.includes("date") || error.sqlMessage.includes("closed_at")) {
                 throw new ApiError(400, "Formato de fecha u hora incorrecto.");
            }
            if (error.sqlMessage.includes("budget")) {
                 throw new ApiError(400, "El presupuesto debe ser un valor numérico válido.");
            }
            throw new ApiError(400, "Tipo de dato incorrecto en un campo.");

        case "ER_DATA_TOO_LONG":
            // Posiblemente 'name' o 'status' excede el límite (100 o 30 chars)
            throw new ApiError(400, "El valor ingresado excede el tamaño permitido.");

        case "PROTOCOL_CONNECTION_LOST":
        case "ECONNREFUSED":
            throw new ApiError(500, "Error de conexión con la base de datos.");

        default:
            throw new ApiError(500, "Error interno al procesar el proyecto.");
    }
};