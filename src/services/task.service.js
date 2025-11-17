// services/task.service.js

import { Task } from '../models/task.model.js';
import { db } from '../config/database.js'; // Asumiendo configuración de DB

// POST - Crear Tarea
export const createTask = async (data) => {
    const query = "INSERT INTO tasks(title, description, status, priority, start_date, end_date, estimated_time, id_project) VALUES (?,?,?,?,?,?,?,?);";
    
    const newTask = new Task(
        null, 
        data.title,
        data.description || null,
        data.status || 'Pendiente', 
        data.priority || 3,         
        data.start_date || null,
        data.end_date || null,
        data.estimated_time || null,
        null, 
        data.id_project
    );

    const values = [
        newTask.title, newTask.description, newTask.status, newTask.priority, 
        newTask.start_date, newTask.end_date, newTask.estimated_time, newTask.id_project
    ];
    
    const [result] = await db.query(query, values);

    return {
        ...newTask,
        id_task: result.insertId
    };
};

// GET - Listar Tareas con Paginación
export const listTasks = async (page, limit) => {
    const offset = (page - 1) * limit;

    const [rows] = await db.query("SELECT * FROM tasks LIMIT ? OFFSET ?", [limit, offset]);
    const [countResult] = await db.query("SELECT COUNT(*) AS total FROM tasks");
    const totalItems = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { page, limit, totalItems, totalPages, data: rows };
};

// GET - Obtener Tarea por ID
export const getTaskById = async (idTask) => {
    const query = 'SELECT * FROM tasks WHERE id_task = ?;';
    const [rows] = await db.query(query, [idTask]);
    return rows[0] || null; 
};

// GET - Obtener Tareas por Proyecto
export const getTasksByProject = async (idProject) => {
    const query = 'SELECT * FROM tasks WHERE id_project = ? ORDER BY priority DESC, start_date ASC;';
    const [rows] = await db.query(query, [idProject]);
    return rows; 
};

// PUT - Actualizar Tarea
export const updateTask = async (idTask, data) => {
    // Nota: Es mejor hacer un SELECT primero o usar un enfoque PATCH más flexible
    const query = 'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, start_date = ?, end_date = ?, estimated_time = ?, actual_time = ?, id_project = ? WHERE id_task = ?;';
    
    const values = [
        data.title, data.description, data.status, data.priority, 
        data.start_date, data.end_date, data.estimated_time, data.actual_time, 
        data.id_project, idTask 
    ];

    const [result] = await db.query(query, values);
    return result.affectedRows > 0 ? result : null; 
};

// DELETE - Eliminar Tarea
export const deleteTaskById = async (idTask) => {
    const query = 'DELETE FROM tasks WHERE id_task = ?;';
    const [result] = await db.query(query, [idTask]);
    return result; 
};

// POST - Asignar Empleado (Desde JSON Body)
export const assignEmployeesToTask = async (idTask, idEmployees) => {
    
    // 1. **Verificación de Seguridad:** Asegurarse de que es un array y tiene contenido.
    if (!Array.isArray(idEmployees) || idEmployees.length === 0) {
        // Si no hay empleados, podemos devolver un resultado vacío sin intentar la DB.
        return { count: 0, id_task: idTask, assigned_employees: [] };
    }
    
    // 2. Ejecutar la lógica de asignación sobre el array validado
    // Genera el SQL para la inserción masiva
    const values = idEmployees.map(idEmployee => [idTask, idEmployee]); // LÍNEA 89 (Ahora segura)
    
    const placeholders = values.map(() => '(?,?)').join(',');
    const flatValues = values.flat();

    const query = `INSERT INTO taskassignments(id_task, id_employee) VALUES ${placeholders};`;
    
    const [result] = await db.query(query, flatValues); 

    return {
        count: result.affectedRows,
        id_task: idTask,
        assigned_employees: idEmployees
    };
};
export const updateTaskAssignments = async (idTask, idEmployees) => {
    // 1. Iniciar la transacción (Asumiendo que db.getConnection() y transaction methods existen)

    try {
        const deleteQuery = 'DELETE FROM taskassignments WHERE id_task = ?;';
        await db.query(deleteQuery, [idTask]);

        if (idEmployees && idEmployees.length > 0) {
            // 3. INSERTAR la nueva lista de asignaciones
            const values = idEmployees.map(idEmployee => [idTask, idEmployee]);
            const placeholders = values.map(() => '(?,?)').join(',');
            const flatValues = values.flat();

            const insertQuery = `INSERT INTO taskassignments(id_task, id_employee) VALUES ${placeholders};`;
            await db.query(insertQuery, flatValues);
        }
        
        // await connection.commit(); // Confirmar la transacción
        
        return {
            id_task: idTask,
            assigned_count: idEmployees ? idEmployees.length : 0,
            assigned_employees: idEmployees || []
        };

    } catch (error) {
        throw error; // Lanzar para que el controlador lo maneje
    }
};
export const getTasksByEmployee = async (idEmployee) => {
    // Consulta JOIN para obtener detalles de la tarea filtrando por el ID del empleado en la tabla intermedia.
    const query = `
        SELECT 
            t.*
        FROM 
            tasks t
        INNER JOIN 
            taskassignments ta ON t.id_task = ta.id_task
        WHERE 
            ta.id_employee = ?;
    `;
    const [rows] = await db.query(query, [idEmployee]);
    return rows;
};
// DELETE - Desasignar Empleado de una Tarea (Se mantiene con URL)
export const unassignEmployeeFromTask = async (idTask, idEmployee) => {
    const query = 'DELETE FROM taskassignments WHERE id_task = ? AND id_employee = ?;';
    const [result] = await db.query(query, [idTask, idEmployee]);
    return result;
};