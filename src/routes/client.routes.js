// routes/client.routes.js
import express from 'express';
import * as controller from '../controllers/client.controller.js';
import { 
    validatorCreateClient, 
    validatorPageClient, 
    validatorUpdateClient, 
    validatorGetClientById,
    validatorGetClientByEmail 
} from '../validators/client.validator.js';
import { authorizeRole } from '../middlewares/authz.middleware.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Endpoints para la gestión de clientes
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         id_client:
 *           type: integer
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         client_status:
 *           type: string
 * 
 *       example:
 *         id_client: 1
 *         first_name: "Luciano"
 *         last_name: "Copa"
 *         email: "lucho@example.com"
 *         phone: "1133445566"
 *         address: "Av. Siempreviva 742"
 *         client_status: "Activo"
 *         id_user: 1
 * 
 *     ClientCreate:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         client_status:
 *           type: string
 *         id_user: 
 *         type: integer
 * 
 *       example:
 *         first_name: "Luciano"
 *         last_name: "Copa"
 *         email: "lucho@example.com"
 *         phone: "1133445566"
 *         address: "Buenos Aires"
 *         client_status: "Activo"
 *         id_user: 1
 * 
 *     ClientUpdate:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         company_name:
 *           type: string
 *         industry:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 *         email:
 *           type: string
 *         client_status:
 *           type: string
 *         id_user:
 *           type: integer
 * 
 *       example:
 *         first_name: "Lucho"
 *         last_name: "Copa"
 *         company_name: "Personal Flow"
 *         industry: "dwad"
 *         phone: "1122334455"
 *         address: "CABA"
 *         email: "gonza1@example.com"
 *         client_status: "Activo"
 *         id_user: 1
 */

/**
 * @swagger
 * /clients/postClient:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientCreate'
 *     responses:
 *       201:
 *         description: Cliente creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /clients/putClient/{id}:
 *   put:
 *     summary: Actualizar un cliente por ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientUpdate'
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /clients/deleteClientById/{id}:
 *   delete:
 *     summary: Eliminar un cliente por ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /clients/paginatedClients/{page}/{limit}:
 *   get:
 *     summary: Obtener clientes paginados
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cantidad de registros por página
 *     responses:
 *       200:
 *         description: Lista de clientes paginada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /clients/getClientById/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /clients/getClientByEmail/{email}:
 *   get:
 *     summary: Obtener un cliente mediante su email
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error del servidor
 */


router.post('/postClient', auth, authorizeRole(["ADMIN"]),validatorCreateClient, controller.postClient);
router.put('/putClient/:id', auth, authorizeRole(["ADMIN"]),validatorUpdateClient, controller.putClient);
router.delete('/deleteClientById/:id', auth, authorizeRole(["ADMIN"]),validatorGetClientById, controller.deleteClient);
router.get('/paginatedClients/:page/:limit', auth, authorizeRole(["ADMIN"]),validatorPageClient, controller.paginatedClients);
router.get('/getClientById/:id', auth, authorizeRole(["ADMIN"]),validatorGetClientById, controller.getClient);
router.get('/getClientByEmail/:email', auth, authorizeRole(["ADMIN"]),validatorGetClientByEmail, controller.getClientByEmailController);

export default router;