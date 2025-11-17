import { check, param } from 'express-validator';
import { validatorResult } from '../helpers/validate.helper.js';

/**
 * Validación para la creación de un nuevo empleado (POST)
 */
export const validatorCreateEmployee = [
  // --- REGLAS DE NEGOCIO ---
  // --- VALIDACIÓN DE CAMPOS ---
    check('first_name')
    .trim()
    .escape()
    .notEmpty().withMessage('El nombre es requerido')
    .isString().withMessage('El nombre debe ser texto')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),

    check('last_name')
    .trim()
    .escape()
    .notEmpty().withMessage('El apellido es requerido')
    .isString().withMessage('El apellido debe ser texto')
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),

    check('dni')
    .trim()
    .escape()
    .notEmpty().withMessage('El DNI es requerido')
    .isNumeric({ no_symbols: true }).withMessage('El DNI solo debe contener números, sin puntos ni guiones')
    .isLength({ min: 7, max: 8 }).withMessage('El DNI debe tener entre 7 y 8 dígitos'),

    check('phone')
    .trim()
    .escape()
    .notEmpty().withMessage('El teléfono es requerido')
    .isString().withMessage('El teléfono debe ser texto')
    .isLength({ min: 7, max: 20 }).withMessage('El teléfono debe tener entre 7 y 20 caracteres'),

    check('position')
    .trim()
    .escape()
    .notEmpty().withMessage('El cargo es requerido')
    .isString().withMessage('El cargo debe ser texto')
    .isLength({ min: 3, max: 100 }).withMessage('El cargo debe tener entre 3 y 100 caracteres'),

    check('salary')
    .trim()
    .escape()
    .notEmpty().withMessage('El salario es requerido')
    .isFloat({ gt: 0 }).withMessage('El salario debe ser un número positivo mayor a 0'),

    check('id_user')
    .trim()
    .escape()
    .notEmpty().withMessage('El ID de usuario es requerido')
    .isInt({ gt: 0 }).withMessage('El ID de usuario debe ser un número entero positivo')
    .toInt(), // Sanitización: convierte a entero

  // Middleware final que maneja los resultados de la validación
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorPageEmployee = [
  param('page')
    .exists().withMessage('El parámetro page es obligatorio')
    .isInt({ min: 1 }).withMessage('page debe ser un número entero mayor o igual a 1')
    .toInt(),

  param('limit')
    .exists().withMessage('El parámetro limit es obligatorio')
    .isInt({ min: 1 }).withMessage('limit debe ser un número entero mayor o igual a 1')
    .toInt(),
    
    (req, res, next) => validatorResult(req, res, next)
];
export const validatorUpdateEmployee = [

  param('id')
  .exists().withMessage('El parámetro ID es obligatorio')
  .isInt({ min: 1 }).withMessage('ID debe ser un número entero mayor o igual a 1'),

  check("first_name")
    .optional()
    .isString().withMessage("El nombre debe ser texto")
    .isLength({ min: 2 }).withMessage("El nombre debe tener al menos 2 caracteres"),

  check("last_name")
    .optional()
    .isString().withMessage("El apellido debe ser texto")
    .isLength({ min: 2 }).withMessage("El apellido debe tener al menos 2 caracteres"),

  check("dni")
    .optional()
    .isNumeric().withMessage("El DNI debe ser un número")
    .isLength({ min: 7, max: 8 }).withMessage("El DNI debe tener entre 7 y 10 dígitos"),

  check("phone")
    .optional()
    .isString().withMessage("El teléfono debe ser texto")
    .isLength({ min: 6 }).withMessage("El teléfono debe tener al menos 6 caracteres"),

  check("position")
    .optional()
    .isString().withMessage("La posición debe ser texto"),

  check("salary")
    .optional()
    .isFloat({ gt: 0 }).withMessage("El salario debe ser un número positivo"), // Adjusted to gt: 0  

    (req, res, next) => validatorResult(req, res, next)
];

export const validatorGetEmployeeById = [
    // Valida que el parámetro 'id' exista y sea un número entero positivo
    param('id')
        .exists().withMessage('El ID del empleado es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
        .toInt(), // Convierte el parámetro a entero para usarlo en el controlador

    // Middleware final que maneja los resultados de la validación
    (req, res, next) => validatorResult(req, res, next)
];