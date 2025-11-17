import express  from 'express';
import * as controller from '../controllers/user.controller.js';
import { 
    validatorCreateUser, 
    validatorUserIdParam, 
    validatorUpdateUser, 
    validatorGetUsername,
    validatorQueryPagination,

} from '../validators/user.validator.js';
import { login } from '../controllers/auth.controller.js';
import { authorizeRole } from '../middlewares/authz.middleware.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin_sistema
 *               password:
 *                 type: string
 *                 example: hash_admin123
 *     responses:
 *       200:
 *         description: Login exitoso, retorna token JWT
 *       401:
 *         description: Credenciales incorrectas
 */

/**
 * @swagger
 * /users/createUserDb:
 *   post:
 *     summary: Crear un usuario directamente en la base de datos (solo ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *               - id_role
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               password:
 *                 type: string
 *                 example: User123!
 *               username:
 *                 type: string
 *                 example: userTest
 *               id_role:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente en la base de datos
 *       400:
 *         description: Error por datos duplicados o inválidos
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /users/paginatedTasks/{page}/{limit}:
 *   get:
 *     summary: Obtener usuarios paginados
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: Lista paginada de usuarios obtenida con éxito
 *       403:
 *         description: No autorizado (se requieren roles EMPLEADO o ADMIN o CLIENTE)
 */

/**
 * @swagger
 * /users/getByIdUser/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID (solo ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Usuario encontrado correctamente
 *       401:
 *         description: Usuario no encontrado
 *       403:
 *         description: No autorizado
 */

/**
 * @swagger
 * /users/getByIdUserName/{userName}:
 *   get:
 *     summary: Buscar usuario por nombre de usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userName
 *         required: true
 *         schema:
 *           type: string
 *         example: admin
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       400:
 *         description: Username requerido
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */


/**
 * @swagger
 * /users/putUser/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID (solo ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *               - id_role
 *             properties:
 *               email:
 *                 type: string
 *                 example: newemail@gmail.com
 *               password:
 *                 type: string
 *                 example: NuevoPass123!
 *               username:
 *                 type: string
 *                 example: newUser
 *               id_role:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: No autorizado
 */

/**
 * @swagger
 * /users/deleteUser/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID (solo ADMIN)
 *     tags: [Users]
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
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: No autorizado
 */

router.post('/login', login);

router.get("/paginatedTasks/:page/:limit", auth, authorizeRole(["EMPLEADO", "ADMIN"]), validatorQueryPagination, controller.listUsersPage);
// router.post('/createUser', auth, authorizeRole(["ADMIN"]),controller.postUser);
router.post("/createUserDb", auth, authorizeRole(["ADMIN"]), validatorCreateUser, controller.postUserDb);
router.get("/getByIdUser/:id", auth,authorizeRole(["ADMIN"]),validatorUserIdParam, controller.getUserById);
router.get("/getByIdUserName/:userName", auth, authorizeRole(["ADMIN"]), validatorGetUsername,controller.getUserByUserName);
router.put("/putUser/:id", auth,authorizeRole(["ADMIN"]),validatorUpdateUser, controller.putUser);
router.delete("/deleteUser/:id", authorizeRole(["ADMIN"]), validatorUserIdParam, controller.deleteUser);

export default router;
