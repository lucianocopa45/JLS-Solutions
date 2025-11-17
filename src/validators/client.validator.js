// validators/client.validator.js
import { check, param } from 'express-validator';
import { validatorResult } from '../helpers/validate.helper.js';

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
        .toInt(),
        
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