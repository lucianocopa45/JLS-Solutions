// routes/project.routes.js
import express from 'express';

import * as controller from '../controllers/project.controller.js';
import { 
    validatorCreateProject, 
    validatorPageProject,
    validatorGetProjectById, 
    validatorGetProjectByName,
    validatorDeleteProjectById,
    validatorUpdateProject 
} from '../validators/project.validator.js';
import { authorizeRole } from '../middlewares/authz.middleware.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Endpoints para la gestión de proyectos
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
 *     Project:
 *       type: object
 *       properties:
 *         id_project:
 *           type: integer
 *           example: 15
 *         name:
 *           type: string
 *           example: "Sistema de Gestión Interna"
 *         description:
 *           type: string
 *           example: "Proyecto para automatizar la gestión administrativa"
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2025-02-01"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2025-05-30"
 *         status:
 *           type: string
 *           example: "En progreso"
 *         id_client:
 *           type: integer
 *           example: 7
 *         id_manager:
 *           type: integer
 *           example: 3
 *         budget:
 *           type: number
 *           example: 150000
 *         closed_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 * 
 * security:
 *  - bearerAuth: []
 */

/**
 * @swagger
 * /projects/postProject:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *           example:
 *             name: "Nueva plataforma educativa"
 *             description: "Proyecto creado para institución X"
 *             start_date: "2025-03-10"
 *             end_date: "2025-06-20"
 *             status: "Planeado"
 *             id_client: 5
 *             id_manager: 2
 *             budget: 250000
 *             closed_at: "2026-03-25"
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Proyecto creado exitosamente"
 *               project:
 *                 id_project: 25
 *                 name: "Nueva plataforma educativa"
 *                 description: "Proyecto creado para institución X"
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /projects/paginatedProjects/{page}/{limit}:
 *   get:
 *     summary: Obtener proyectos paginados
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         example: 1
 *       - in: path
 *         name: limit
 *         schema:
 *           type: integer
 *         required: true
 *         example: 10
 *     responses:
 *       200:
 *         description: Lista paginada de proyectos
 *         content:
 *           application/json:
 *             example:
 *               page: 1
 *               limit: 10
 *               totalItems: 52
 *               totalPages: 6
 *               data:
 *                 - id_project: 1
 *                   name: "Proyecto Alpha"
 *                   start_date: "2025-01-10"
 *                   status: "Finalizado"
 *                   budget: 120000
 */

/**
 * @swagger
 * /projects/getProjectById/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         example: 3
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             example:
 *               id_project: 3
 *               name: "Proyecto Intranet"
 *               description: "Intranet corporativa"
 *       404:
 *         description: Proyecto no encontrado
 */

/**
 * @swagger
 * /projects/getByNameProject/{name}:
 *   get:
 *     summary: Buscar proyectos por nombre (LIKE)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         example: "Sistema"
 *     responses:
 *       200:
 *         description: Lista de coincidencias encontradas
 *         content:
 *           application/json:
 *             example:
 *               - id_project: 5
 *                 name: "Sistema Contable"
 *               - id_project: 8
 *                 name: "Sistema de Ventas"
 *       404:
 *         description: No se encontraron coincidencias
 */

/**
 * @swagger
 * /projects/putProject/{id}:
 *   put:
 *     summary: Actualizar un proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *           example:
 *             name: "Proyecto actualizado"
 *             description: "Nueva descripción"
 *             start_date: "2025-02-01"
 *             end_date: "2025-06-01"
 *             status: "En progreso"
 *             id_client: 4
 *             id_manager: 1
 *             budget: 300000
 *             closed_at: "2026-03-25"
 *     responses:
 *       200:
 *         description: Proyecto actualizado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Proyecto con ID 10 actualizado correctamente"
 *       404:
 *         description: Proyecto no encontrado
 */

/**
 * @swagger
 * /projects/deleteProjectById/{id}:
 *   delete:
 *     summary: Eliminar un proyecto por ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         example: 10
 *     responses:
 *       200:
 *         description: Proyecto eliminado correctamente
 *       404:
 *         description: Proyecto no encontrado
 */


router.post('/postProject', auth, authorizeRole(["ADMIN"]), validatorCreateProject, controller.postProject);
router.get('/paginatedProjects/:page/:limit', auth, authorizeRole(["ADMIN","EMPLEADO","CLIENTE"]), validatorPageProject, controller.paginatedProjects);
router.get('/getProjectById/:id', auth, authorizeRole(["ADMIN","EMPLEADO","CLIENTE"]), validatorGetProjectById,controller.getProject);
router.get('/getByNameProject/:name', auth, authorizeRole(["ADMIN","EMPLEADO","CLIENTE"]), validatorGetProjectByName, controller.getProjectByNameController);
router.put('/putProject/:id', auth, authorizeRole(["ADMIN"]), validatorUpdateProject, controller.putProject);
router.delete('/deleteProjectById/:id', auth, authorizeRole(["ADMIN"]), validatorDeleteProjectById, controller.deleteProject);

export default router;