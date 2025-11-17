import express from 'express';
import * as controller from '../controllers/task.controller.js';
import { 
    validatorCreateTask, 
    validatorTaskIdParam, 
    validatorUpdateTask, 
    validatorQueryPagination,
    validatorAssignTaskBody,
    validatorUpdateAssignments,
    validatorEmployeeIdParam,
    validatorUnassignTask
} from '../validators/task.validator.js'; 
import { auth } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/authz.middleware.js';

const router = express.Router();

// -----------------------------------------------------
// Rutas de Tareas (CRUD Principal)
// -----------------------------------------------------

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Gestión de Tareas
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
 * /tasks/postTask:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - id_project
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Diseñar interfaz de usuario"
 *               description:
 *                 type: string
 *                 example: "Crear el diseño principal en Figma"
 *               status:
 *                 type: string
 *                 example: "Pendiente"
 *               priority:
 *                 type: integer
 *                 example: 2
 *               start_date:
 *                 type: string
 *                 example: "2025-01-12"
 *               end_date:
 *                 type: string
 *                 example: "2025-01-20"
 *               estimated_time:
 *                 type: number
 *                 example: 12.5
 *               actual_time:
 *                 type: number
 *                 example: 8
 *               id_project:
 *                 type: integer
 *                 example: 3
 *               id_assigned_employee:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Tarea creada correctamente
 *       400:
 *         description: Error de validación o datos inválidos
 */

/**
 * @swagger
 * /tasks/paginatedTasks/{page}/{limit}:
 *   get:
 *     summary: Listar tareas paginadas
 *     tags: [Tasks]
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
 *         description: Lista de tareas obtenida correctamente
 */

/**
 * @swagger
 * /tasks/project/{idProject}:
 *   get:
 *     summary: Obtener tareas por ID de proyecto
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idProject
 *         schema:
 *           type: integer
 *         required: true
 *         example: 3
 *     responses:
 *       200:
 *         description: Tareas del proyecto obtenidas correctamente
 *       404:
 *         description: No se encontraron tareas para ese proyecto
 */

/**
 * @swagger
 * /tasks/getTaskById/{id}:
 *   get:
 *     summary: Obtener una tarea por ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         example: 12
 *     responses:
 *       200:
 *         description: Tarea encontrada correctamente
 *       404:
 *         description: Tarea no encontrada
 */

/**
 * @swagger
 * /tasks/putTask/{id}:
 *   put:
 *     summary: Actualizar una tarea por ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Diseño UI actualizado"
 *               status:
 *                 type: string
 *                 example: "En progreso"
 *               priority:
 *                 type: integer
 *                 example: 1
 *               end_date:
 *                 type: string
 *                 example: "2025-02-10"
 *               id_project:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Tarea actualizada correctamente
 *       404:
 *         description: Tarea no encontrada
 */

/**
 * @swagger
 * /tasks/deleteTaskById/{id}:
 *   delete:
 *     summary: Eliminar una tarea por ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         example: 12
 *     responses:
 *       200:
 *         description: Tarea eliminada correctamente
 *       404:
 *         description: Tarea no encontrada
 */


router.post('/postTask/', auth, authorizeRole(["ADMIN"]), validatorCreateTask, controller.postTask); 
router.get('/paginatedTasks/:page/:limit', auth, authorizeRole(["ADMIN","EMPLEADO"]), validatorQueryPagination, controller.listTasks);
router.get('/project/:idProject', auth, authorizeRole(["ADMIN","EMPLEADO"]), validatorTaskIdParam, controller.getTasksByProject);
router.get('/getTaskById/:id', auth, authorizeRole(["ADMIN","EMPLEADO"]), validatorTaskIdParam, controller.getTaskById);
router.put('/putTask/:id', auth, authorizeRole(["ADMIN"]), validatorUpdateTask, controller.putTask); 
router.delete('/deleteTaskById/:id', auth, authorizeRole(["ADMIN"]), validatorTaskIdParam, controller.deleteTask);


// -----------------------------------------------------
// Rutas de Asignación (Tabla Intermedia)
// -----------------------------------------------------

/**
 * @swagger
 * tags:
 *   name: TaskAssignments
 *   description: Gestión de asignación de empleados a tareas
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
 * /tasks/assignments:
 *   post:
 *     summary: Asignar un empleado a una tarea
 *     tags: [TaskAssignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_task
 *               - id_employee
 *             properties:
 *               id_task:
 *                 type: integer
 *                 example: 5
 *               id_employees:
 *                 type: integer
 *                 example: [12]
 *     responses:
 *       201:
 *         description: Empleado asignado correctamente a la tarea
 *       400:
 *         description: Error de validación o asignación duplicada
 */

/**
 * @swagger
 * /tasks/assignments/{id}:
 *   put:
 *     summary: Actualizar una asignación de tarea
 *     tags: [TaskAssignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_task:
 *                 type: integer
 *                 example: 8
 *               id_employees:
 *                 type: integer
 *                 example: [2]
 *     responses:
 *       200:
 *         description: Asignación actualizada correctamente
 *       404:
 *         description: La asignación no existe
 */

/**
 * @swagger
 * /tasks/employee/{idEmployee}:
 *   get:
 *     summary: Obtener todas las tareas asignadas a un empleado
 *     tags: [TaskAssignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idEmployee
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: Tareas asignadas obtenidas correctamente
 *       404:
 *         description: No se encontraron tareas para ese empleado
 */

/**
 * @swagger
 * /tasks/{id}/unassign/{idEmployee}:
 *   delete:
 *     summary: Quitar la asignación de una tarea a un empleado
 *     tags: [TaskAssignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *       - in: path
 *         name: idEmployee
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *     responses:
 *       200:
 *         description: Empleado desasignado de la tarea correctamente
 *       404:
 *         description: No existe la asignación
 */



router.post('/assignments', auth, authorizeRole(["ADMIN"]),validatorAssignTaskBody, controller.assignEmployee); 
router.put('/assignments/:id', auth, authorizeRole(["ADMIN"]),validatorUpdateAssignments, controller.putTaskAssignments);
router.get('/employee/:idEmployee', auth, authorizeRole(["ADMIN", "EMPLEADO"]),validatorEmployeeIdParam, controller.getTasksByEmployee);
router.delete('/:id/unassign/:idEmployee', auth, authorizeRole(["ADMIN"]),validatorUnassignTask, controller.unassignEmployee); 

export default router;