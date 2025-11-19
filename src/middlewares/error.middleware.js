// src/middlewares/error.middleware.js

/**
 * Middleware global de manejo de errores.
 * Captura errores lanzados en controladores o servicios.
 */
const errorHandler = (err, req, res, next) => {
  console.error("🛑 Error capturado:", err);

  // Si el error no tiene statusCode, asumimos 500 (Error interno del servidor)
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;

 // Enviar respuesta en formato JSON legible al cliente.
  res.status(statusCode).json({
  // Indica que la operación no fue exitosa.
  success: false,
  // Incluye el código de estado HTTP de la respuesta.
  status: statusCode,
  // Proporciona un mensaje descriptivo del error, o un mensaje genérico si no se proporciona.
  message: err.message || "Error interno del servidor",
  // Incluye un código de error personalizado si existe, o uno genérico.
  code: err.code || "UNKNOWN_ERROR",
  // Incluye el mensaje de error de SQL si está presente (útil en desarrollo para errores de base de datos).
  sqlMessage: err.sqlMessage || null, 
  // Solo incluye el 'stack trace' del error si el entorno es 'development',
  // para evitar exponer detalles internos en producción.
  stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;