// validators/task.validator.js

import { check, param, query } from 'express-validator';

// Función helper mock (reemplazar por tu helper real)
const validatorResult = (req, res, next) => next(); 


// --- Validadores de la Tarea Principal (tasks) ---

export const validatorCreateTask = [
    check('title')
        .trim().escape().notEmpty().withMessage('El título es requerido')
        .isLength({ min: 5, max: 100 }).withMessage('El título debe tener entre 5 y 100 caracteres'),
    
    check('id_project')
        .notEmpty().withMessage('El ID del proyecto es requerido')
        .isInt({ gt: 0 }).withMessage('El ID del proyecto debe ser un número entero positivo').toInt(),
    
    check('status').optional().isIn(['Pendiente', 'En Progreso', 'Completada', 'Revisión']).withMessage('Estado inválido'),
    check('priority').optional().isInt({ min: 1, max: 5 }).withMessage('Prioridad debe ser entre 1 y 5').toInt(),
    check('start_date').optional({ nullable: true }).isISO8601().toDate().withMessage('Fecha de inicio inválida'),
    check('end_date').optional({ nullable: true }).isISO8601().toDate().withMessage('Fecha de fin inválida'),
    check('estimated_time').optional({ nullable: true }).isFloat({ min: 0.1 }).withMessage('Tiempo estimado inválido'),

    (req, res, next) => validatorResult(req, res, next)
];

export const validatorUpdateTask = [
    param('id').exists().withMessage('El ID de la tarea es obligatorio').isInt({ min: 1 }).toInt(),
    
    // Todos los campos son opcionales en el check, pero la lógica del PUT del servicio espera todos
    check('title').optional().isString().isLength({ min: 5, max: 100 }),
    check('status').optional().isIn(['Pendiente', 'En Progreso', 'Completada', 'Revisión']),
    check('actual_time').optional({ nullable: true }).isFloat({ min: 0 }),
    check('id_project').optional().isInt({ gt: 0 }).toInt(),

    (req, res, next) => validatorResult(req, res, next)
];

export const validatorQueryPagination = [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1 }).toInt(),
    (req, res, next) => validatorResult(req, res, next)
];

export const validatorTaskIdParam = [
    param('id').exists().withMessage('El ID de la tarea es obligatorio').isInt({ min: 1 }).toInt(),
    (req, res, next) => validatorResult(req, res, next)
];

// --- Validadores de Asignaciones (taskassignments) ---

export const validatorAssignTaskBody = [
    check('id_task')
        .notEmpty().withMessage('El ID de la tarea es requerido').isInt({ gt: 0 }).toInt(), 
    check('id_employee')
        .notEmpty().withMessage('El ID del empleado es requerido').isInt({ gt: 0 }).toInt()
        .isArray({ min: 1 }).withMessage('Debe proporcionar una lista (array) de IDs de empleados, con al menos un ID.')
        .custom((value) => {
            // Asegura que todos los elementos del array sean enteros positivos
            if (value.some(id => typeof id !== 'number' || id <= 0 || !Number.isInteger(id))) {
                throw new Error('Todos los IDs de empleado deben ser números enteros positivos.');
            }
            return true;
        }),
    (req, res, next) => validatorResult(req, res, next)
];
export const validatorUpdateAssignments = [
    // 1. Valida el ID de la Tarea en el parámetro de la URL
    param('id')
        .exists().withMessage('El ID de la tarea es obligatorio')
        .isInt({ gt: 0 }).withMessage('El ID de tarea debe ser un número entero positivo')
        .toInt(), 

    // 2. Valida la lista de Empleados en el cuerpo (puede ser un array vacío para desasignar a todos)
    check('id_employees')
        .optional() // El array es opcional, si no se envía, se asume que se quiere borrar la lista (aunque es mejor enviar un array vacío)
        .isArray().withMessage('El campo id_employees debe ser una lista (array).')
        .custom((value) => {
            // Asegura que si hay IDs, todos sean enteros positivos
            if (value && value.some(id => typeof id !== 'number' || id <= 0 || !Number.isInteger(id))) {
                throw new Error('Todos los IDs de empleado deben ser números enteros positivos.');
            }
            return true;
        }),
    
    (req, res, next) => validatorResult(req, res, next)
];
export const validatorEmployeeIdParam = [
    param('idEmployee') // Debe coincidir con el nombre del parámetro en la ruta
        .notEmpty().withMessage('El ID del empleado es requerido')
        .isInt({ gt: 0 }).withMessage('El ID del empleado debe ser un número entero positivo')
        .toInt(),
    (req, res, next) => validatorResult(req, res, next)
];
export const validatorUnassignTask = [
    ...validatorTaskIdParam, 
    param('idEmployee').exists().isInt({ gt: 0 }).toInt(),
    (req, res, next) => validatorResult(req, res, next)
];