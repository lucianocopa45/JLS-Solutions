// src/utils/api.error.js

/**
 * Clase para manejar errores personalizados de la API
 * Permite enviar un código de estado y un mensaje específico
 */
export default class ApiError extends Error {
  /**
   * @param {number} statusCode - Código HTTP (ej: 400, 404, 500)
   * @param {string} message - Mensaje descriptivo del error
   * @param {string} [code] - Código interno o de MySQL opcional (ej: ER_DUP_ENTRY)
   */
  constructor(statusCode, message, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;

    // Mantener el stack trace correcto (opcional, útil en desarrollo)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
