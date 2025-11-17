// validators/service.validator.js

import { check, param, query } from 'express-validator';

const validatorResult = (req, res, next) => next(); // Mock

// --- Validadores de la tabla Services (CRUD) ---

export const validatorCreateService = [
    check('service_name')
        .trim().escape().notEmpty().withMessage('El nombre del servicio es requerido')
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
    
    check('price')
        .notEmpty().withMessage('El precio es requerido')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser un número positivo'),
    
    check('description')
        .optional({ nullable: true }).isString(),

    (req, res, next) => validatorResult(req, res, next)
];

export const validatorUpdateService = [
    param('id').exists().isInt({ min: 1 }).toInt(),
    check('service_name').optional().isLength({ min: 3, max: 100 }),
    check('price').optional().isFloat({ gt: 0 }),
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorServiceIdParam = [
    param('id').exists().isInt({ min: 1 }).toInt(),
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorQueryPagination = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1 }).toInt(),
    (req, res, next) => validatorResult(req, res, next)
];

// --- Validadores de Asignaciones (Project_Service) ---

export const validatorAssignServicesToProject = [
    check('id_project')
        .notEmpty().withMessage('El ID del proyecto es requerido')
        .isInt({ gt: 0 }).toInt(), 
        
    check('services') // services debe ser un array de objetos
        .isArray({ min: 1 }).withMessage('Debe proporcionar una lista de servicios para asignar.'),

    // Validar cada objeto dentro del array 'services'
    check('services.*.id_service') // Accede a la propiedad id_service de cada elemento
        .notEmpty().withMessage('El ID del servicio es requerido para la asignación')
        .isInt({ gt: 0 }).withMessage('El ID del servicio debe ser un número entero positivo').toInt(),
        
    check('services.*.quantity')
        .optional().isInt({ min: 1 }).withMessage('La cantidad debe ser un entero mayor o igual a 1').toInt(),

    check('services.*.unit_price')
        .optional().isFloat({ gt: 0 }).withMessage('El precio unitario debe ser un número positivo'),
    
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorProjectIdParam = [
    param('idProject').exists().isInt({ min: 1 }).toInt(),
    (req, res, next) => validatorResult(req, res, next)
];


export const validatorUpdateAssignments = [
    // 1. Valida el ID del Proyecto en el parámetro de la URL
    param('idProject') 
        .exists().withMessage('El ID del proyecto es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID de proyecto debe ser un número entero positivo')
        .toInt(), 

    // 2. Valida la lista de Servicios en el cuerpo. Debe ser un array (puede ser vacío para desasignar todo)
    check('services')
        .isArray().withMessage('El campo services debe ser una lista (array) de objetos.')
        .custom((value) => {
            // Permite un array vacío (para desasignar todo)
            if (!value) return true;
            
            // Si el array no está vacío, verifica que cada elemento sea un objeto
            if (value.some(s => typeof s !== 'object' || s === null)) {
                throw new Error('Todos los elementos de services deben ser objetos.');
            }
            return true;
        }),

    // 3. Valida cada objeto dentro del array 'services'
    check('services.*.id_service') // Accede a la propiedad id_service de cada elemento
        .exists().withMessage('El ID del servicio es requerido en cada objeto de la lista')
        .isInt({ gt: 0 }).withMessage('El ID del servicio debe ser un número entero positivo').toInt(),
        
    check('services.*.quantity')
        .optional()
        .isInt({ min: 1 }).withMessage('La cantidad debe ser un entero mayor o igual a 1').toInt(),

    check('services.*.unit_price')
        .optional()
        .isFloat({ gt: 0 }).withMessage('El precio unitario debe ser un número positivo'),
    
    (req, res, next) => validatorResult(req, res, next)
];