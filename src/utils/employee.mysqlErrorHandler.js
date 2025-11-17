import ApiError from "./ApiError.js";

export const employeeHandleEmployeeMySQLError = (error, dataDb = {}) => {

    console.error("Error crudo de DB:", error);

    switch (error.code) {

        case "ER_DUP_ENTRY":
            if (error.sqlMessage.includes("dni")) {
                throw new ApiError(400, "El DNI ya está registrado.");
            }
            if (error.sqlMessage.includes("phone")) {
                throw new ApiError(400, "El teléfono ya está registrado.");
            }
            if (error.sqlMessage.includes("id_user")) {
                throw new ApiError(400, "Este usuario ya tiene un empleado asignado.");
            }
            throw new ApiError(400, "Dato duplicado en un campo único.");

        case "ER_NO_REFERENCED_ROW_2":
            throw new ApiError(400, `El usuario con id ${dataDb.id_user} no existe.`);

        case "ER_ROW_IS_REFERENCED_2":
            throw new ApiError(400, "No se puede eliminar este empleado porque está referenciado en otra tabla.");

        case "ER_BAD_NULL_ERROR":
            throw new ApiError(400, "Falta un dato obligatorio.");

        case "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD":
            throw new ApiError(400, "Tipo de dato incorrecto en un campo.");

        case "ER_DATA_TOO_LONG":
            throw new ApiError(400, "El valor ingresado excede el tamaño permitido.");

        case "PROTOCOL_CONNECTION_LOST":
        case "ECONNREFUSED":
            throw new ApiError(500, "Error de conexión con la base de datos.");

        default:
            throw new ApiError(500, "Error interno al procesar el empleado.");
    }
};
