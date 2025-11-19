// Importa el framework Express para crear la aplicación web.
import express from "express";
// Importa dotenv para cargar variables de entorno desde el archivo .env.
import dotenv from 'dotenv';
// Importa helmet para asegurar la aplicación configurando varios encabezados HTTP.
import helmet from 'helmet';
// Importa cors (Cross-Origin Resource Sharing) para permitir peticiones desde dominios específicos.
import cors from 'cors';
// Importa morgan para el registro (logging) de peticiones HTTP en la consola.
import morgan from 'morgan';
// Importa la clase de utilidad personalizada para manejar errores de API con códigos de estado específicos.
import ApiError from './utils/ApiError.js'
// Importa el middleware de manejo de errores centralizado.
import errorHandler from './middlewares/error.middleware.js';
// Importa el archivo principal de rutas que agrupa todas las rutas de la API.
import mainRoutes from './routes/index.js';
// Importa swagger-ui-express para servir la documentación de la API generada con Swagger/OpenAPI.
import swaggerUi from 'swagger-ui-express'; 
// Importa la especificación de la documentación de Swagger configurada previamente.
import { swaggerSpec } from './config/swagger.js';

// Carga las variables de entorno del archivo .env al objeto process.env.
dotenv.config();

// Inicializa la aplicación Express.
const app = express();
// Define el puerto del servidor, tomando el valor de las variables de entorno o usando 3030 por defecto.
const PORT = process.env.PORT || 3030;
// Define el host del servidor, configurado para escuchar en todas las interfaces de red.
const HOST = '0.0.0.0'; 

// --- Configuración de Middlewares Globales ---

// Aplica el middleware helmet para establecer encabezados de seguridad HTTP.
app.use(helmet());
// Configura y aplica el middleware CORS.
app.use(cors({
 // Define una lista de orígenes permitidos para acceder a la API.
  origin: [
  "http://localhost:3000",
  "http://localhost:3040",
  "https://jls-solutions-production.up.railway.app"
  ],
 // Especifica los métodos HTTP permitidos.
  methods: ["GET","POST","PUT","PATCH","DELETE"],
 // Especifica los encabezados permitidos en las peticiones.
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
}));
// Middleware para parsear el cuerpo de las peticiones entrantes con formato JSON.
app.use(express.json());
// Middleware para parsear el cuerpo de las peticiones con formato URL-encoded.
// La opción 'extended: true' permite objetos anidados en el body.
app.use(express.urlencoded({ extended: true })); 
// Aplica el middleware morgan en formato 'dev' para logging conciso de peticiones.
app.use(morgan('dev'));
// Configura el endpoint '/docs' para servir la interfaz de usuario de Swagger con la especificación de la API.
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Configuración de Rutas de la API ---

// Monta el enrutador principal en el prefijo '/api'. Todas las rutas comenzarán con /api.
app.use('/api', mainRoutes);

// --- Manejo de Rutas No Encontradas (404) ---

// Middleware catch-all para manejar cualquier ruta que no haya sido gestionada por las rutas anteriores.
app.use((req, res, next) => {
 // Crea un mensaje de error personalizado indicando que el recurso no existe.
  const customMessage = `El recurso al que intenta acceder (${req.originalUrl}) no existe o ha sido movido.`;
 // Pasa un nuevo objeto ApiError con código de estado 404 al siguiente middleware (el manejador de errores).
  next(new ApiError(404, customMessage));
});

// --- Manejador de Errores Global ---

// Middleware de manejo de errores final (debe ser el último middleware cargado).
app.use(errorHandler);

// Inicia el servidor Express para que escuche peticiones en el puerto y host definidos.
app.listen(PORT, HOST, () => {
  // Muestra un mensaje en la consola indicando que el servidor se ha iniciado correctamente.
  console.log(`Servidor corriendo en el puerto ${PORT} ${HOST}`);
});
// Exporta la instancia de la aplicación Express para su uso en pruebas o en otros módulos.
export default app