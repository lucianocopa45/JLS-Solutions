import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Almacena la instancia del Pool de Conexiones
let dbPool = null;

// Configuración de la base de datos, incluyendo opciones para el Pool
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    
// Opciones clave para el Pool:
    waitForConnections: true, 
    connectionLimit: 15,     
    queueLimit: 0,
    
    // CONFIGURACIÓN PARA ENTORNO CLOUD (Railway)
    enableKeepAlive: true,        // Mantiene la conexión viva enviando paquetes
    keepAliveInitialDelay: 0,     // Inicia la verificación inmediatamente
    idleTimeout: 30000            // Cierra conexiones inactivas después de 30 segundos
};

/**
 * Crea e inicializa el Pool de Conexiones si aún no existe.
 * Esto asegura que el Pool solo se inicialice una vez al inicio de la aplicación.
 * @returns {mysql.Pool} El Pool de Conexiones.
 */
export const connectDB = () => {
    // Si el Pool ya existe, lo devuelve.
    if (dbPool) {
        return dbPool;
    }

    // Si no existe, lo crea.
    try {
        // Usamos createPool para gestión robusta de conexiones
        dbPool = mysql.createPool(dbConfig);
        console.log("✅ Pool de Conexiones MySQL creado y listo.");
        return dbPool;
    } catch (error) {
        console.error("❌ Error al crear el Pool de Conexiones:", error);
        throw error;
    }
};

export const db = {
    /**
     * Ejecuta una consulta SQL usando el Pool de Conexiones.
     * El Pool obtiene una conexión, ejecuta la consulta y la libera automáticamente.
     * Esto previene el error 'connection is in closed state'.
     */
    query: async (sql, values) => {
        // Llamamos a connectDB() sin 'await' para obtener la instancia del Pool.
        const pool = connectDB(); 
        
        // Usamos pool.execute para consultas con parámetros (?) por seguridad.
        return pool.execute(sql, values); 
    },
    
    /**
     * Cierra todas las conexiones activas en el Pool (usado típicamente al apagar el servidor).
     */
    end: async () => {
        if (dbPool) {
            await dbPool.end();
            dbPool = null;
            console.log("Pool de Conexiones a la base de datos cerrada.");
        }
    }
};