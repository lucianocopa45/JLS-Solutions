// services/project.service.js
import { Project } from '../models/project.model.js';
import { db } from '../config/database.js';

// --- CREATE ---
export const createProject = async (data) => {
    
    const query = "INSERT INTO projects(name, description, start_date, end_date, status, id_client, id_manager, budget, closed_at) VALUES (?,?,?,?,?,?,?,?,?);"
    const newProject = new Project(
        null,
        data.name,
        data.description,
        data.start_date,
        data.end_date,
        data.status,
        data.id_client,
        data.id_manager,
        data.budget,
        data.closed_at || null // closed_at puede ser nulo en la creación
    );

    const values = [
        newProject.name,
        newProject.description,
        newProject.start_date,
        newProject.end_date,
        newProject.status,
        newProject.id_client,
        newProject.id_manager,
        newProject.budget,
        newProject.closed_at
    ];

    const [result] = await db.query(query, values);

    // Nota: El objeto devuelto podría no incluir updated_at, ya que se genera en DB.
    return {
        ...newProject,
        id_project: result.insertId
    };
};

// --- LIST / PAGINATE --- (La lógica es la misma)
export const listProjects = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;

        const cleanLimit = Math.floor(limit);
        const cleanOffset = Math.floor(offset);

        const [rows] = await db.query(`SELECT * FROM projects LIMIT ${cleanLimit} OFFSET ${cleanOffset}`);
        const [countResult] = await db.query("SELECT COUNT(*) AS total FROM projects");
        const totalItems = countResult[0]?.total || 0;
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

// --- GET BY ID ---
export const getProjectById = async (idProject) => {
    try {
        const query = 'SELECT * FROM projects WHERE id_project = ?;';
        const [result] = await db.query(query, [idProject]);
        return result;
    } catch (error) {
        throw error;
    }
};

export const getProjectByName = async (projectName) => {
    try {
        const query = 'SELECT * FROM projects WHERE name LIKE ?;';
        // Agregamos comodines '%' para buscar coincidencias parciales
        const searchPattern = `%${projectName}%`; 
        const [result] = await db.query(query, [searchPattern]);
        return result;
    } catch (error) {
        throw error;
    }
};
// --- UPDATE ---
export const updateProject = async (idProject, dataProject) => {
    try {
        const query = 'UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ?, status = ?, id_client = ?, id_manager = ?, budget = ?, closed_at = ? WHERE id_project = ?;';
        
        // Se asume que el DTO (dataProject) contiene todos los campos necesarios.
        const projectUpdate = new Project(
            null,
            dataProject.name,
            dataProject.description,
            dataProject.start_date,
            dataProject.end_date,
            dataProject.status,
            dataProject.id_client,
            dataProject.id_manager,
            dataProject.budget,
            dataProject.closed_at // Puede ser la fecha o null
        );

        const values = [
            projectUpdate.name,
            projectUpdate.description,
            projectUpdate.start_date,
            projectUpdate.end_date,
            projectUpdate.status,
            projectUpdate.id_client,
            projectUpdate.id_manager,
            projectUpdate.budget,
            projectUpdate.closed_at,
            idProject
        ];
        
        const [result] = await db.query(query, values);
        if (result.affectedRows === 0) {
            return null;
        }
        return result;
    } catch (error) {
        throw error;
    }
};

// --- DELETE --- (La lógica es la misma)
export const deleteProjectById = async (idProject) => {
    try {
        const query = 'DELETE FROM projects WHERE id_project = ?;';
        const [result] = await db.query(query, [idProject]);
        return result;
    } catch (error) {
        throw error;
    }
};