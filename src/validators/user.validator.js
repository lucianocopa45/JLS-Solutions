import { check } from 'express-validator';
import { validatorResult } from '../helpers/validate.helper.js';

export const validatorCreate = [
    check('email')
    .notEmpty().withMessage('El correo electrónico es obligatorio.')
    .isEmail().withMessage('Debe ingresar un correo electrónico válido.')
    .isLength({ max: 100 }).withMessage('El correo no puede superar los 100 caracteres.'),
    
    check('password')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.')
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }).withMessage('La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un símbolo.'),
    
    check('username')
    .notEmpty().withMessage('El nombre de usuario es obligatorio.')
    .isLength({ min: 4, max: 50 }).withMessage('El nombre de usuario debe tener entre 4 y 50 caracteres.'),
    
    check('id_role')
    .notEmpty().withMessage('Debe asignar un rol.')
    .isInt().withMessage('El ID del rol debe ser un número entero.'),
    
    (req, res, next) => validatorResult(req, res, next)
]