// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// export const db = await mysql.createConnection({
//   host: process.env.DB_HOST,

//   user: process.env.DB_USER,

//   password: process.env.DB_PASSWORD,

//   database: process.env.DB_NAME,

//   port: process.env.DB_PORT

// });

// console.log("✅ Conectado a la base de datos MySQL correctamente");

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Almacena la conexión una vez que se establece.
let dbConnection = null;

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

/**
 * Establece o devuelve la conexión a la base de datos (Singleton pattern).
 * @returns {Promise<mysql.Connection>}
 */
export const connectDB = async () => {
    // Si la conexión ya existe, la devuelve inmediatamente.
    if (dbConnection) {
        return dbConnection;
    }

    // Si no existe, la crea.
    try {
        dbConnection = await mysql.createConnection(dbConfig);
        console.log("✅ Conectado a la base de datos MySQL correctamente");
        return dbConnection;
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error);
        throw error;
    }
};

export const db = {
    query: async (sql, values) => {
        const connection = await connectDB();
        return connection.query(sql, values);
    },
    end: async () => {
        if (dbConnection) {
            await dbConnection.end();
            dbConnection = null;
            console.log("Conexión a la base de datos cerrada.");
        }
    }
};