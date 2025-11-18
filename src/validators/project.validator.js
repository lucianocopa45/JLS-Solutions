// validators/project.validator.js
import { check, param } from 'express-validator';
import { validatorResult } from '../helpers/validate.helper.js';

const validateProjectBody = (isUpdate = false) => [
    // Campos requeridos en la creación
    check('name')
        .optional(!isUpdate).notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

    check('start_date')
        .optional(!isUpdate).notEmpty().withMessage('La fecha de inicio es requerida')
        .isDate().withMessage('La fecha de inicio debe ser un formato de fecha válido (YYYY-MM-DD)'),
        
    check('id_client')
        .optional(!isUpdate).notEmpty().withMessage('El ID de cliente es requerido')
        .isInt({ gt: 0 }).withMessage('El ID de cliente debe ser un entero positivo')
        .toInt(),

    // Campos opcionales o con DEFAULT
    check('description').optional().trim().escape(),

    check('end_date')
        .optional({ nullable: true }).isDate().withMessage('La fecha de fin debe ser un formato de fecha válido (YYYY-MM-DD)'),

    check('status')
        .optional().trim().escape()
        .isIn(['Activo', 'Pendiente', 'Completado', 'Cancelado']).withMessage('Estado no válido'),

    check('id_manager')
        .optional({ nullable: true }).isInt({ gt: 0 }).withMessage('El ID de manager debe ser un entero positivo')
        .toInt(),

    check('budget')
        .optional({ nullable: true }).isFloat({ min: 0 }).withMessage('El presupuesto debe ser un número positivo'),
        
    check('closed_at')
        .optional({ nullable: true }) // Permite que sea opcional o null
        .custom((value) => {
            if (value === null) {
                return true; // Si es null, siempre pasa.
            }
            
            // Intenta crear un objeto Date con el valor (ISO, YYYY-MM-DD HH:mm:ss, etc.)
            const date = new Date(value);
            
            // Verifica si la creación de la fecha resultó en 'Invalid Date'
            if (isNaN(date.getTime())) {
                throw new Error('La fecha/hora no es válida.');
            }
            
            return true; // Si llegamos aquí, la fecha es válida.
        })
        .withMessage('La fecha de cierre debe ser un formato de fecha y hora válido')
];

// --- Validators ---

export const validatorCreateProject = [
    ...validateProjectBody(false),
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorPageProject = [
    param('page').isInt({ min: 1 }).withMessage('page debe ser un número entero mayor o igual a 1').toInt(),
    param('limit').isInt({ min: 1 }).withMessage('limit debe ser un número entero mayor o igual a 1').toInt(),
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorGetProjectById = [
    // Valida que el parámetro 'id' exista y sea un número entero positivo
    param('id')
        .exists().withMessage('El ID del proyecto es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
        .toInt(), // Convierte el parámetro a entero para usarlo en el controlador

    // Middleware final que maneja los resultados de la validación
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorDeleteProjectById = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo').toInt(),
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorGetProjectByName = [
    // Valida que el parámetro 'name' exista, no esté vacío y tenga una longitud mínima.
    param('name')
        .exists().withMessage('El nombre de búsqueda es obligatorio')
        .trim().notEmpty().withMessage('El nombre de búsqueda no puede estar vacío')
        .isLength({ min: 2 }).withMessage('El nombre de búsqueda debe tener al menos 2 caracteres'),

    // Middleware final
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorUpdateProject = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo').toInt(),
    ...validateProjectBody(true), // Pasa true para hacer todos los campos opcionales en el body
    (req, res, next) => validatorResult(req, res, next)
];