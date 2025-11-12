// src/middlewares/error.middleware.js

/**
 * Middleware global de manejo de errores.
 * Captura errores lanzados en controladores o servicios.
 */
const errorHandler = (err, req, res, next) => {
  console.error("🛑 Error capturado:", err);

  // Si el error no tiene statusCode, asumimos 500 (Error interno del servidor)
  const statusCode = Number.isInteger(err.statusCode) ? err.statusCode : 500;

  // Enviar respuesta en formato JSON legible
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || "Error interno del servidor",
    code: err.code || "UNKNOWN_ERROR",
    sqlMessage: err.sqlMessage || null, // útil en desarrollo
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;