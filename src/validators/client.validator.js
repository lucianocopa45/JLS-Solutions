// validators/client.validator.js
import { check, param } from 'express-validator';
import { validatorResult } from '../helpers/validate.helper.js';
import { getRoleIdByUserId } from '../services/user.service.js';
import ApiError from '../utils/ApiError.js';

const ROL_REQUERIDO_CLIENTE = 3;

const validateClientBody = (isUpdate = false) => [
    // --- Campos Requeridos (NOT NULL) ---
    check('first_name')
        .optional(isUpdate)
        .trim().escape().notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),

    check('email')
        .optional(isUpdate)
        .trim().notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Debe ser un formato de correo electrónico válido')
        .isLength({ max: 100 }).withMessage('El email no debe exceder los 100 caracteres'),
        
    // --- Clave Foránea / Única ---
    check('id_user')
        .optional({ nullable: true }).isInt({ gt: 0 }).withMessage('El ID de usuario debe ser un número entero positivo')
    .toInt() // Sanitización: convierte a entero

    // VALIDACIÓN DE INTEGRIDAD Y DE ROL
    .custom(async (idUser) => {
        
        // 1. Obtener el rol actual del usuario de la DB
        const rolIdAsignado = await getRoleIdByUserId(idUser); // Función que busca id_role por id_use
        if (rolIdAsignado === null) {
            // El ID de usuario no existe, se lanza error.
            throw new ApiError(400, `El usuario con ID ${idUser} no existe en la tabla de usuarios.`);
        }
        
        // 2. Comparar el rol del usuario con el rol requerido (EMPLEADO = 2)
        if (rolIdAsignado !== ROL_REQUERIDO_CLIENTE) {
            // Si el rol es incorrecto (ej. 1 o 3), se lanza un error específico.
            throw new ApiError(400, `El usuario con ID ${idUser} tiene el rol ID ${rolIdAsignado}. Para crear un registro de Cliente, el usuario debe tener el rol ID ${ROL_REQUERIDO_CLIENTE} (Empleado).`);
        }
        
        // Pasa la validación si el usuario existe y su rol es 2
        return true;
    }),
    
        
    // --- Campos Opcionales ---
    check('last_name').optional({ nullable: true }).trim().escape().isLength({ max: 50 }),
    check('company_name').optional({ nullable: true }).trim().escape().isLength({ max: 100 }),
    check('phone').optional({ nullable: true }).trim().escape().isLength({ max: 20 }),
    check('address').optional({ nullable: true }).trim().escape().isLength({ max: 150 }),
    check('industry').optional({ nullable: true }).trim().escape().isLength({ max: 100 }),
    check('client_status')
        .optional({ nullable: true })
        .isIn(['Activo', 'Inactivo', 'Potencial', 'Calificado']).withMessage('Estado de cliente no válido'),
];

export const validatorCreateClient = [
    ...validateClientBody(false),
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorUpdateClient = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo').toInt(),
    ...validateClientBody(true),
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorGetClientById = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo').toInt(),
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorGetClientByEmail = [
    param('email').trim().notEmpty().withMessage('El email es obligatorio').isEmail().withMessage('Debe ser un email válido'),
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorPageClient = [
    param('page').isInt({ min: 1 }).withMessage('page debe ser un número entero mayor o igual a 1').toInt(),
    param('limit').isInt({ min: 1 }).withMessage('limit debe ser un número entero mayor o igual a 1').toInt(),
    (req, res, next) => validatorResult(req, res, next)
];