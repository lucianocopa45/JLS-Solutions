import express from 'express';

import * as controller from '../controllers/employee.controller.js';
import { validatorCreateEmployee, validatorPageEmployee, validatorGetEmployeeById, validatorUpdateEmployee } from '../validators/employee.validator.js';
import { authorizeRole } from '../middlewares/authz.middleware.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Employees
 *     description: Gestión de empleados
 *
 * components:
 *   schemas:
 *     Employee:
 *       $ref: '#/components/schemas/Employee'
 *     EmployeeInput:
 *       $ref: '#/components/schemas/EmployeeInput'
 *     EmployeeUpdate:
 *       $ref: '#/components/schemas/EmployeeUpdate'
 *
 *   examples:
 *     EmployeeExample:
 *       summary: Ejemplo de empleado
 *       value:
 *         id: 1
 *         first_name: "Luciano"
 *         last_name: "Copa"
 *         dni: "40222111"
 *         phone: "1133445566"
 *         position: "Desarrollador Backend"
 *         salary: 450000
 *         id_user: 3
 *
 * security:
 *   - bearerAuth: []
 *
 */

/**
 * @swagger
 * /employees/postEmployee:
 *   post:
 *     summary: Crea un nuevo empleado
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []        # quitar o comentar si querés que sea público
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *           examples:
 *             empleadoEj:
 *               $ref: '#/components/examples/EmployeeExample'
 *     responses:
 *       201:
 *         description: Empleado creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /employees/paginatedEmploye/{page}/{limit}:
 *   get:
 *     summary: Obtiene empleados paginados
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página (>=1)
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Cantidad por página (>=1)
 *     responses:
 *       200:
 *         description: Lista paginada de empleados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedEmployees'
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /employees/getByIdEmployee/{id}:
 *   get:
 *     summary: Obtiene un empleado por ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Empleado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /employees/getEmployeeById/{dni}:
 *   get:
 *     summary: Obtiene un empleado por DNI
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: dni
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Empleado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /employees/putEmployee/{id}:
 *   put:
 *     summary: Actualiza un empleado por ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeUpdate'
 *           examples:
 *             updateEj:
 *               value:
 *                 position: "Desarrollador Senior"
 *                 salary: 550000
 *                 first_name: "Luciano"
 *                 last_name: "Copa"
 *                 dni: "40222111"
 *                 phone: "1133445566"
 * 
 *     responses:
 *       200:
 *         description: Empleado actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /employees/deleteEmployeById/{id}:
 *   delete:
 *     summary: Elimina un empleado por ID
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Empleado eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Empleado eliminado correctamente"
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post('/postEmployee', auth, authorizeRole(["ADMIN"]),validatorCreateEmployee,controller.postEmployee);
router.get('/paginatedEmploye/:page/:limit', auth, authorizeRole(["ADMIN"]),validatorPageEmployee, controller.paginatedEmployee);
router.get('/getByIdEmployee/:id', auth, authorizeRole(["ADMIN"]),validatorGetEmployeeById,controller.getEmployeeById);
router.get('/getEmployeeById/:dni', auth, authorizeRole(["ADMIN"]),controller.getEmployeeByDni);
router.put('/putEmployee/:id', auth, authorizeRole(["ADMIN"]),validatorUpdateEmployee, controller.putEmployee);
router.delete('/deleteEmployeById/:id', auth, authorizeRole(["ADMIN"]),controller.deleteEmployee);

export default router;