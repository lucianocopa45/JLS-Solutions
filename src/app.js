import express from "express";
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import ApiError from './utils/ApiError.js'
import errorHandler from './middlewares/error.middleware.js';
import mainRoutes from './routes/index.js';
import swaggerUi from 'swagger-ui-express'; // ⬅️ ¡Verifica que esta línea exista!
import { swaggerSpec } from './config/swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3030;
const HOST = '0.0.0.0'; 

app.use(helmet());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(morgan('dev'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // ⬅️ Nuevo endpoint

app.use('/api', mainRoutes);

app.use((req, res, next) => {
    const customMessage = `El recurso al que intenta acceder (${req.originalUrl}) no existe o ha sido movido.`;
    next(new ApiError(404, customMessage));
});

app.use(errorHandler);

app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en el puerto ${PORT} ${HOST}`);
});
export default app