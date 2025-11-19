// validators/user.validator.js

import { check, param, query } from 'express-validator';
import { validatorResult } from '../helpers/validate.helper.js';

// const validatorResult = (req, res, next) => next(); // Mock o tu helper real

export const validatorCreateUser = [
    check('email')
        .trim().notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('El email no tiene un formato válido'),
    
    check('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .bail()
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .isStrongPassword({
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        symbols: '!@#$%^&*()+-=[]{};:"|,./<>?_`~'
    }).withMessage('La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo.'),
    check('username')
        .trim().notEmpty().withMessage('El nombre de usuario es requerido')
        .isLength({ min: 3, max: 45 }).withMessage('El username debe tener entre 3 y 45 caracteres'),
    
    check('id_role')
        .notEmpty().withMessage('El ID de rol es requerido')
        .isInt({ gt: 0 }).withMessage('El ID de rol debe ser un número entero positivo').toInt(),
    
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorUpdateUser = [
    param('id').exists().isInt({ min: 1 }).toInt(),
    
    check('email').optional().isEmail().withMessage('Formato de email inválido'),
    check('password').optional().isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres')
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        symbols: '!@#$%^&*()+-=[]{};:"|,./<>?_`~'
    }).withMessage('La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo.'),
    check('username').optional().isLength({ min: 3, max: 45 }),
    check('id_role').optional().isInt({ gt: 0 }).toInt(),
    
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorUserIdParam = [
    param('id').exists().isInt({ min: 1 }).toInt(),
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorUserEmailParam = [
    param('email').exists().isEmail().withMessage('El email proporcionado no es válido'),
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorQueryPagination = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1 }).toInt(),
    (req, res, next) => validatorResult(req, res, next)
];
export const validatorGetUsername = [
    // Valida que el parámetro 'userName' exista en la URL
    param('userName')
        .exists().withMessage('El nombre de usuario es requerido para la búsqueda')
        .trim()
        .isString().withMessage('El nombre de usuario debe ser una cadena de texto')
        .isLength({ min: 1 }).withMessage('El nombre de usuario no puede estar vacío'),

    // Middleware final que maneja los resultados de la validación
    (req, res, next) => validatorResult(req, res, next)
];