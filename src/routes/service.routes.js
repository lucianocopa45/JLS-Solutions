// routes/service.routes.js

import express from 'express';
import * as controller from '../controllers/service.controller.js';
import { 
    validatorCreateService, 
    validatorServiceIdParam, 
    validatorUpdateService, 
    validatorQueryPagination,
    validatorAssignServicesToProject,
    validatorUpdateAssignments,
    validatorProjectIdParam
} from '../validators/service.validator.js'; 
import { auth } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/authz.middleware.js';

const router = express.Router();

// -----------------------------------------------------
// Rutas de Servicios (CRUD Principal)
// -----------------------------------------------------

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Gestión de Servicios
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /services/postService:
 *   post:
 *     summary: Crear un nuevo servicio
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - service_name
 *               - price
 *             properties:
 *               service_name:
 *                 type: string
 *                 example: Diseño Web
 *               description:
 *                 type: string
 *                 example: Servicio profesional de diseño web
 *               price:
 *                 type: number
 *                 example: 1500.50
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *       400:
 *         description: Error en validación o dato duplicado
 */

/**
 * @swagger
 * /services/listServices/{page}/{limit}:
 *   get:
 *     summary: Listar servicios con paginación
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Lista paginada de servicios
 *       404:
 *         description: No se encontraron servicios
 */

/**
 * @swagger
 * /services/getServiceById/{id}:
 *   get:
 *     summary: Obtener un servicio por ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: Servicio encontrado
 *       404:
 *         description: Servicio no encontrado
 */

/**
 * @swagger
 * /services/putService/{id}:
 *   put:
 *     summary: Actualizar un servicio existente
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_name:
 *                 type: string
 *                 example: Servicio actualizado
 *               description:
 *                 type: string
 *                 example: Nueva descripción
 *               price:
 *                 type: number
 *                 example: 199.99
 *     responses:
 *       200:
 *         description: Servicio actualizado correctamente
 *       404:
 *         description: Servicio no encontrado
 */

/**
 * @swagger
 * /services/deleteService/{id}:
 *   delete:
 *     summary: Eliminar un servicio por ID
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Servicio eliminado correctamente
 *       404:
 *         description: Servicio no encontrado
 */


router.post('/postService/', auth, authorizeRole(["ADMIN"]),validatorCreateService, controller.postService); 
router.get('/listServices/:page/:limit', auth, authorizeRole(["ADMIN","CLIENTE"]),validatorQueryPagination, controller.listServices);
router.get('/getServiceById/:id', auth, authorizeRole(["ADMIN","CLIENTE"]),validatorServiceIdParam, controller.getServiceById);
router.put('/putService/:id', auth, authorizeRole(["ADMIN"]),validatorUpdateService, controller.putService); 
router.delete('/deleteService/:id', auth, authorizeRole(["ADMIN"]),validatorServiceIdParam, controller.deleteService);


/**
 * @swagger
 * tags:
 *   name: ServiceAssignments
 *   description: Asignación de servicios a proyectos
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /services/assignments:
 *   post:
 *     summary: Asignar uno o varios servicios a un proyecto
 *     tags: [ServiceAssignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_project
 *               - services
 *             properties:
 *               id_project:
 *                 type: integer
 *                 example: 8
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id_service
 *                     - quantity
 *                     - unit_price
 *                   properties:
 *                     id_service:
 *                       type: integer
 *                       example: 2
 *                     quantity:
 *                       type: integer
 *                       example: 1
 *                     unit_price:
 *                       type: number
 *                       format: float
 *                       example: 50000.00
 *     responses:
 *       201:
 *         description: Servicios asignados correctamente al proyecto
 *       400:
 *         description: Datos inválidos o servicio/proyecto inexistente
 */

/**
 * @swagger
 * /services/project/{idProject}:
 *   get:
 *     summary: Obtener todos los servicios asignados a un proyecto
 *     tags: [ServiceAssignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProject
 *         required: true
 *         schema:
 *           type: integer
 *         example: 7
 *     responses:
 *       200:
 *         description: Lista de servicios asignados
 *       404:
 *         description: El proyecto no existe o no tiene servicios asignados
 */

/**
 * @swagger
 * /services/project/{idProject}:
 *   put:
 *     summary: Actualizar los servicios asignados a un proyecto
 *     tags: [ServiceAssignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProject
 *         required: true
 *         schema:
 *           type: integer
 *         example: 8
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - services
 *             properties:
 *               services:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id_service
 *                     - quantity
 *                   properties:
 *                     id_service:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 5
 *                     unit_price:
 *                       type: number
 *                       format: float
 *                       nullable: true
 *                       example: 450.00
 *     responses:
 *       200:
 *         description: Asignaciones de servicios actualizadas correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Proyecto o servicio no encontrado
 */


// -----------------------------------------------------
// Rutas de Asignación (Project_Service)
// -----------------------------------------------------
router.post('/assignments', auth, authorizeRole(["ADMIN"]),validatorAssignServicesToProject, controller.assignServices); 

router.get('/project/:idProject', auth, authorizeRole(["ADMIN","CLIENTE"]),validatorProjectIdParam, controller.getServicesByProject);

router.put('/project/:idProject', auth, authorizeRole(["ADMIN"]),validatorUpdateAssignments, controller.putProjectServices);


export default router;