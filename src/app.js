import express from "express";
import router from "./routes/user.routes.js";
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import ApiError from './utils/ApiError.js'
import errorHandler from './middlewares/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT_API;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(morgan('dev'));

app.use('/api', router);

app.use((req, res, next) => {
    const customMessage = `El recurso al que intenta acceder (${req.originalUrl}) no existe o ha sido movido.`;
    next(new ApiError(404, customMessage));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});