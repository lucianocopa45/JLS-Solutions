// controllers/service.controller.js

import * as serviceService from "../services/service.service.js";
import { serviceHandleMySQLError } from "../utils/service.mysqlErrorHandler.js";

// POST /services
export const postService = async (req, res) => {
    try {
        const dataService = await serviceService.createService(req.body);
        res.status(201).json({ message: "Servicio creado exitosamente", service: dataService });
    } catch (error) {
        serviceHandleMySQLError(error, req.body, res);
    }
}

// GET /services?page=x&limit=y
export const listServices = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const dataServices = await serviceService.listServices(page, limit);
        if (!dataServices || dataServices.data.length === 0) {
            return res.status(404).json({ error: "No se encontraron servicios" });
        }
        res.status(200).json(dataServices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

// GET /services/:id
export const getServiceById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const service = await serviceService.getServiceById(id);
        if (!service) {
            return res.status(404).json({ message: `No se ha encontrado servicio con ID: ${id}` });
        }
        res.status(200).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

// PUT /services/:id
export const putService = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await serviceService.updateService(id, req.body); 
        if (!result) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }
        res.status(200).json({ message: `Servicio con ID ${id} actualizado correctamente`, result: result });
    } catch (error) {
        serviceHandleMySQLError(error, req.body, res);
    }
};

// DELETE /services/:id
export const deleteService = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await serviceService.deleteServiceById(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `No se ha encontrado servicio con ID: ${id}` });
        }
        res.status(200).json({ message: `Se ha eliminado servicio con ID: ${id} correctamente` });
    } catch (error) {
        serviceHandleMySQLError(error, req.body, res);
    }
}

// POST /services/assignments (Añadir servicios a proyecto)
export const assignServices = async (req, res) => {
    try {
        const { id_project, services } = req.body; 
        
        // 1. Conversión a número (este es el valor seguro)
        const idProjectParsed = parseInt(id_project);

        // *** Nota: El validador debe asegurar que idProjectParsed NO sea NaN ***

        // 2. Llamada al servicio con el ID parseado
        const assignmentResult = await serviceService.assignServicesToProject(idProjectParsed, services);
        
        // 3. Usar idProjectParsed en el mensaje de éxito para garantizar consistencia
        res.status(201).json({ 
            message: `Se asignaron ${assignmentResult.count} servicios al Proyecto ${idProjectParsed} exitosamente.`, 
            data: assignmentResult 
        });
    } catch (error) {
        // El manejador de errores de MySQL debe estar preparado para capturar ER_NO_REFERENCED_ROW_2 
        // si algún ID no existe, o ER_DUP_ENTRY si hay duplicados.
        serviceHandleMySQLError(error, req.body, res); 
        next(error);
    }
}

// GET /services/project/:idProject (Listar servicios asignados)
export const getServicesByProject = async (req, res) => {
    try {
        const idProject = parseInt(req.params.idProject);
        const services = await serviceService.getServicesByProject(idProject);

        if (!services || services.length === 0) {
            return res.status(404).json({ message: `No se encontraron servicios asignados al Proyecto ID: ${idProject}` });
        }
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        serviceHandleMySQLError(error, req.params, res);
    }
}

// PUT /services/project/:idProject (Sobrescribir asignaciones)
export const putProjectServices = async (req, res) => {
    let idProject;
    try {
        idProject = parseInt(req.params.idProject);
        const services = req.body.services || []; 

        const result = await serviceService.updateProjectServices(idProject, services);

        res.status(200).json({ 
            message: `Asignaciones de servicios para el Proyecto ${idProject} actualizadas (Total: ${result.assigned_count}).`, 
            data: result
        });
    } catch (error) {
        const apiError = serviceHandleMySQLError(error, idProject);
        
        next(apiError);
    }
}