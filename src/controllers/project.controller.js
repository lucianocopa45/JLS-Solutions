// controllers/project.controller.js
import { 
    createProject, 
    listProjects, 
    getProjectById,
    getProjectByName, 
    updateProject, 
    deleteProjectById 
} from "../services/project.service.js";
import { projectHandleMySQLError } from "../utils/project.mysqlErrorHandler.js";

// --- POST / Create Project ---
export const postProject = async (req, res) => {
    try {
        const reqProject = req.body;
        const dataProject = await createProject(reqProject);
        res.status(201).json({ message: "Proyecto creado exitosamente", project: dataProject });
    } catch (error) {
        projectHandleMySQLError(error, req.body);
    }
}

// --- GET / List Paginated Projects ---
export const paginatedProjects = async (req, res) => {
    try {
        const pageRaw = parseInt(req.params.page); 
        const limitRaw = parseInt(req.params.limit);

        const page = (isNaN(pageRaw) || pageRaw <= 0) ? 1 : pageRaw;
        const limit = (isNaN(limitRaw) || limitRaw <= 0) ? 10 : limitRaw;

        console.log(`Página: ${page}, Límite: ${limit}`);

        const dataProjects = await listProjects(page, limit);

        if (!dataProjects.data || dataProjects.data.length === 0) {
            return res.status(200).json({ message: "No hay proyectos para mostrar", data: [] });
        }
        res.status(200).json(dataProjects); 
    } catch (error) {
        throw error; 
    }
}

// --- GET / Get Project by ID ---
export const getProject = async (req, res) => {
    try {
        const dataId = parseInt(req.params.id);
        const project = await getProjectById(dataId);

        if (!project || project.length === 0) {
            return res.status(404).json({ message: `No se ha encontrado proyecto con ID: ${dataId}` });
        }

        res.status(200).json(project[0]); 
    } catch (error) {
        throw error;
    }
}

export const getProjectByNameController = async (req, res) => {
    try {
        const reqName = req.params.name;
        const dataProjects = await getProjectByName(reqName);

        if (!dataProjects || dataProjects.length === 0) {
            return res.status(404).json({ message: `No se han encontrado proyectos que contengan: "${reqName}"` });
        }

        res.status(200).json(dataProjects);
    } catch (error) {
        throw error;
    }
}
// --- PUT / Update Project ---
export const putProject = async (req, res) => {
    try {
        const idParsed = parseInt(req.params.id);
        const reqData = req.body;

        const result = await updateProject(idParsed, reqData);

        if (!result) {
            return res.status(404).json({ message: "Proyecto no encontrado" });
        }

        return res.status(200).json({
            message: `Proyecto con ID ${idParsed} actualizado correctamente`,
            data: result
        });

    } catch (error) {
        projectHandleMySQLError(error, req.body); 
    }
};

// --- DELETE / Delete Project by ID ---
export const deleteProject = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const dataProject = await deleteProjectById(id);

        if (dataProject.affectedRows === 0) {
            return res.status(404).json({ message: `No se ha encontrado proyecto con ID: ${id}` });
        }
        res.status(200).json({ message: `Se ha eliminado proyecto con ID: ${id} correctamente` });
    } catch (error) {
        projectHandleMySQLError(error); 
    }
}