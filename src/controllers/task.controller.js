// controllers/task.controller.js

import * as taskService from "../services/task.service.js";
import { taskHandleMySQLError } from "../utils/task.mysqlErrorHandler.js"; // Asumiendo importación

// POST /tasks
export const postTask = async (req, res) => {
    try {
        const dataTask = await taskService.createTask(req.body);
        res.status(201).json({ message: "Tarea creada exitosamente", task: dataTask });
    } catch (error) {
        taskHandleMySQLError(error, req.body, res);
    }
}

// GET /tasks?page=x&limit=y
export const listTasks = async (req, res) => {
    try {
        const pageRaw = parseInt(req.params.page);
        const limitRaw = parseInt(req.params.limit);

        const page = (isNaN(pageRaw) || pageRaw <= 0) ? 1 : pageRaw;
        const limit = (isNaN(limitRaw) || limitRaw <= 0) ? 10 : limitRaw;

        console.log(`Página: ${page}, Límite: ${limit}`);
        
        const dataTasks = await taskService.listTasks(page, limit);

        if (!dataTasks || dataTasks.data.length === 0) {
            return res.status(404).json({ error: "No se encontraron tareas" });
        }
        res.status(200).json(dataTasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

// GET /tasks/:id
export const getTaskById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const task = await taskService.getTaskById(id);

        if (!task) {
            return res.status(404).json({ message: `No se ha encontrado tarea con ID: ${id}` });
        }
        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

// PUT /tasks/:id
export const putTask = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        // Nota: Si usas PUT, asegúrate de enviar todos los campos. Si solo envías algunos, 
        // tu servicio podría sobrescribir los no enviados con NULL. Si ese es el caso, 
        // es mejor usar un enfoque PATCH (SELECT previo + UPDATE)
        const result = await taskService.updateTask(id, req.body); 

        if (!result) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        return res.status(200).json({
            message: `Tarea con ID ${id} actualizada correctamente`,
            result: result
        });
    } catch (error) {
        taskHandleMySQLError(error, req.body, res);
    }
};

// DELETE /tasks/:id
export const deleteTask = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const dataTask = await taskService.deleteTaskById(id);

        if (dataTask.affectedRows === 0) {
            return res.status(404).json({ message: `No se ha encontrado tarea con ID: ${id}` });
        }
        res.status(200).json({ message: `Se ha eliminado tarea con ID: ${id} correctamente` });
    } catch (error) {
        taskHandleMySQLError(error, req.body, res);
    }
}

// POST /tasks/assignments
export const assignEmployee = async (req, res) => {
    try {
        // Extraemos el ID de la tarea y el ARRAY de IDs de empleados
        const { id_task, id_employees } = req.body; 
        
        const idTaskParsed = parseInt(id_task);
        // id_employees ya es un array de números gracias al validador (to.Int opcionalmente)

        // Llamamos al nuevo servicio que maneja el array
        const assignmentResult = await taskService.assignEmployeesToTask(idTaskParsed, id_employees);
        
        res.status(201).json({ 
            message: `Se asignaron ${assignmentResult.count} empleados a la Tarea ${id_task} exitosamente.`, 
            data: assignmentResult 
        });
    } catch (error) {
        // El manejador de errores de MySQL debe estar preparado para capturar ER_NO_REFERENCED_ROW_2 
        // si algún id_employee no existe, o ER_DUP_ENTRY si hay duplicados.
        taskHandleMySQLError(error, req.body, res); 
    }
}
export const putTaskAssignments = async (req, res) => {
    try {
        const idTask = parseInt(req.params.id);
        const idEmployees = req.body.id_employees || []; // Asume un array vacío si no se proporciona

        const result = await taskService.updateTaskAssignments(idTask, idEmployees);

        res.status(200).json({ 
            message: `Asignaciones de la Tarea ${idTask} actualizadas. Total de empleados: ${result.assigned_count}.`, 
            data: result
        });
    } catch (error) {
        console.error(error);
        // El manejador de errores capturará fallos si algún id_employee no existe (ER_NO_REFERENCED_ROW_2)
        taskHandleMySQLError(error, req.body, res); 
    }
}
export const getTasksByProject = async (req, res) => {
    try {
        const idProject = parseInt(req.params.idProject);
        
        // Llama al servicio que realiza la consulta por la clave foránea (FK)
        const tasks = await taskService.getTasksByProject(idProject);

        if (!tasks || tasks.length === 0) {
            // Usa 404 Not Found si el recurso (la lista de tareas) está vacío para ese proyecto.
            return res.status(404).json({ message: `No se han encontrado tareas para el Proyecto ID: ${idProject}` });
        }
        
        // Devuelve las tareas encontradas
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        // Usa el manejador de errores de MySQL si es una excepción conocida de DB
        // taskHandleMySQLError(error, req.body, res); 
        // Si no, devuelve un error 500
        res.status(500).json({ message: "Error interno del servidor al buscar tareas por proyecto", error: error.message });
    }
}
export const getTasksByEmployee = async (req, res) => {
    try {
        const idEmployee = parseInt(req.params.idEmployee);
        
        // Llama al servicio para obtener las tareas
        const tasks = await taskService.getTasksByEmployee(idEmployee);

        if (!tasks || tasks.length === 0) {
            // 404 Not Found si no hay tareas asignadas a ese ID de empleado.
            return res.status(404).json({ message: `No se han encontrado tareas asignadas para el Empleado ID: ${idEmployee}` });
        }
        
        // Devuelve las tareas encontradas
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        // Usa el manejador de errores
        taskHandleMySQLError(error, req.params, res); 
    }
}
export const unassignEmployee = async (req, res) => {
    try {
        const idTask = parseInt(req.params.id);
        const idEmployee = parseInt(req.params.idEmployee);

        // Llama al servicio para eliminar la fila de la tabla taskassignments
        const result = await taskService.unassignEmployeeFromTask(idTask, idEmployee);

        if (result.affectedRows === 0) {
            // Si affectedRows es 0, la asignación no existía o los IDs eran incorrectos.
            return res.status(404).json({ message: `La asignación entre Tarea ${idTask} y Empleado ${idEmployee} no fue encontrada.` });
        }
        
        // Respuesta exitosa
        res.status(200).json({ message: `Empleado ${idEmployee} desasignado de la Tarea ${idTask} correctamente.` });
    } catch (error) {
        console.error(error);
        // Usa el manejador de errores de MySQL si la desasignación falla por una razón de DB
        taskHandleMySQLError(error, req.params, res); 
    }
}