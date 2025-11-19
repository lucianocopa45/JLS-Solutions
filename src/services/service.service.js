// services/service.service.js

import { Service } from '../models/service.model.js';
import { db } from '../config/database.js'; // Asumiendo tu configuración de DB

// POST - Crear Servicio
// -----------------------------------------------------------
export const createService = async (data) => {
    try {
        const query = "INSERT INTO services(service_name, description, price) VALUES (?,?,?);";
        
        const newService = new Service(
            null, 
            data.service_name, 
            data.description, 
            data.price
        );

        const values = [newService.service_name, newService.description, newService.price];
        const [result] = await db.query(query, values);
        
        return { 
            ...newService,
            id_service: result.insertId
        };
    } catch (error) {
        throw error;
    }
};

// GET - Listar Servicios con Paginación
// -----------------------------------------------------------
export const listServices = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;

        const cleanLimit = Math.floor(limit);
        const cleanOffset = Math.floor(offset);
        // 1) Datos paginados
        const [rows] = await db.query(`SELECT * FROM services LIMIT ${cleanLimit} OFFSET ${cleanOffset}`);

        // 2) Total de registros
        const [countResult] = await db.query("SELECT COUNT(*) AS total FROM services");
        const totalItems = countResult[0]?.total || 0;

        // 3) Cálculo seguro
        const totalPages = Math.ceil(totalItems / limit);

        return {
            page,
            limit,
            totalItems,
            totalPages,
            data: rows
        };
    } catch (error) {
        throw error;
    }
};

// GET - Obtener Servicio por ID
// -----------------------------------------------------------
export const getServiceById = async (idService) => {
    try {
        const query = 'SELECT * FROM services WHERE id_service = ?;';
        const [rows] = await db.query(query, [idService]);
        
        return rows[0] || null; // Devolver el objeto o null
    } catch (error) {
        throw error;
    }
};

// PUT - Actualizar Servicio
// -----------------------------------------------------------
export const updateService = async (idService, data) => {
    try {
        const query = 'UPDATE services SET service_name = ?, description = ?, price = ? WHERE id_service = ?;';
        
        const serviceUpdate = new Service(
            null,
            data.service_name,
            data.description,
            data.price
        );

        const values = [serviceUpdate.service_name, serviceUpdate.description, serviceUpdate.price, idService];
        const [result] = await db.query(query, values);
        
        if (result.affectedRows === 0) {
            return null;
        }
        return result;
    } catch (error) {
        throw error;
    }
};

// DELETE - Eliminar Servicio
// -----------------------------------------------------------
export const deleteServiceById = async (idService) => {
    try {
        const query = 'DELETE FROM services WHERE id_service = ?;';
        const [result] = await db.query(query, [idService]);
        
        return result;
    } catch (error) {
        throw error;
    }
};

// POST - Asignar/Añadir Servicios a Proyecto (Project_Service)
// -----------------------------------------------------------
export const assignServicesToProject = async (idProject, services) => {
    try {
        // Aseguramos que el ID del proyecto sea un número (el controlador ya debería haberlo parseado, pero la seguridad es clave)
        const projectIdParsed = parseInt(idProject);

        if (!services || services.length === 0 || isNaN(projectIdParsed)) {
            return { count: 0, id_project: idProject, assigned_services: [] };
        }

        // Mapeamos los servicios, asegurando la conversión explícita de tipos
        const valueRows = services.map(s => {
            const serviceId = parseInt(s.id_service); // Debe ser entero
            const quantity = parseInt(s.quantity || 1); // Debe ser entero (default 1)
            const unitPrice = s.unit_price ? parseFloat(s.unit_price) : null; // Debe ser flotante o null

            // Validación de seguridad para la DB (aunque el validador ya debería hacerlo)
            if (isNaN(serviceId) || isNaN(quantity)) {
                // Lanzar un error específico si los datos internos no son numéricos
                throw new Error(`Datos numéricos inválidos para el servicio ID: ${s.id_service}`);
            }

            return [
                projectIdParsed, 
                serviceId, 
                quantity, 
                unitPrice 
            ];
        });

        const placeholders = valueRows.map(() => '(?,?,?,?)').join(',');
        const flatValues = valueRows.flat();
        
        // El formato de la consulta es correcto: usa PLACEHOLDERS (?)
        const query = `
            INSERT INTO project_service (id_project, id_service, quantity, unit_price)
            VALUES ${placeholders};
        `;
        
        const [result] = await db.query(query, flatValues); 

        return {
            count: result.affectedRows,
            id_project: projectIdParsed,
            assigned_services: services.map(s => s.id_service)
        };
    } catch (error) {
        // Propagamos el error (será capturado por serviceHandleMySQLError en el controlador)
        throw error;
    }
};
// GET - Obtener Servicios asignados a un proyecto
// -----------------------------------------------------------
export const getServicesByProject = async (idProject) => {
    try {
        const query = `
            SELECT 
                ps.id_project, 
                s.id_service, 
                s.service_name, 
                ps.quantity, 
                ps.unit_price,
                s.price AS base_price
            FROM 
                project_service ps
            JOIN 
                services s ON ps.id_service = s.id_service
            WHERE 
                ps.id_project = ?;
        `;
        const [rows] = await db.query(query, [idProject]);
        
        return rows;
    } catch (error) {
        throw error;
    }
};

// PUT - Sobrescribir todos los servicios de un proyecto (Project_Service)
// -----------------------------------------------------------
export const updateProjectServices = async (idProject, services) => {
    try {
        // Ejecución de la lógica de la transacción:
        
        // 1. Eliminar todas las asignaciones existentes para el proyecto
        const deleteQuery = 'DELETE FROM project_service WHERE id_project = ?;';
        await db.query(deleteQuery, [idProject]);

        if (services && services.length > 0) {
            // 2. Insertar la nueva lista de asignaciones (reutilizando lógica de assignServicesToProject)
            const valueRows = services.map(s => [
                idProject, 
                s.id_service, 
                s.quantity || 1, 
                s.unit_price || null 
            ]);

            const placeholders = valueRows.map(() => '(?,?,?,?)').join(',');
            const flatValues = valueRows.flat();

            const insertQuery = `
                INSERT INTO project_service (id_project, id_service, quantity, unit_price)
                VALUES ${placeholders};
            `;
            const [result] = await db.query(insertQuery, flatValues);
            
            return {
                id_project: idProject,
                assigned_count: result.affectedRows,
                assigned_services: services
            };
        }
        
        // Si la lista de entrada está vacía, solo se ejecutó el DELETE.
        return {
            id_project: idProject,
            assigned_count: 0,
            assigned_services: []
        };
    } catch (error) {
        throw error;
    }
};