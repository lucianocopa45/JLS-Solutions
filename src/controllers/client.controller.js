// controllers/client.controller.js
import { 
    createClient, listClients, getClientById, 
    getClientByEmail, 
    updateClient, deleteClientById 
} from "../services/client.service.js"; 
import { clientHandleMySQLError } from "../utils/client.mysqlErrorHandler.js";

// --- POST ---
export const postClient = async (req, res) => {
    try{
        const dataClient = await createClient(req.body);
        res.status(201).json({message: "Cliente creado exitosamente", client: dataClient});
    } catch (error){
        clientHandleMySQLError(error, req.body);
    }
}

// --- GET Paginated ---
export const paginatedClients = async (req, res) => {
    try{
        const pageRaw = parseInt(req.params.page); 
        const limitRaw = parseInt(req.params.limit);

        const page = (isNaN(pageRaw) || pageRaw <= 0) ? 1 : pageRaw;
        const limit = (isNaN(limitRaw) || limitRaw <= 0) ? 10 : limitRaw;

        console.log(`Página: ${page}, Límite: ${limit}`);

        const dataClients = await listClients(page, limit);

        if (!dataClients.data || dataClients.data.length === 0) {
            return res.status(200).json({message: "No hay clientes", data: []});
        }
        res.status(200).json(dataClients);
    } catch(error){
        throw error;
    }
}

// --- GET By ID ---
export const getClient = async (req, res) => {
    try{
        const dataId = parseInt(req.params.id);
        const client = await getClientById(dataId);

        if (!client || client.length === 0) {
            return res.status(404).json({message: `No se ha encontrado cliente con ID: ${dataId}`});
        }

        res.status(200).json(client[0]);
    } catch(error){
        throw error;
    }
}

// --- GET By Email ---
export const getClientByEmailController = async (req, res) => {
    try{
        const reqEmail = req.params.email;
        const dataClient = await getClientByEmail(reqEmail);

        if(!dataClient || dataClient.length === 0){
            return res.status(404).json({message: `No se ha encontrado cliente con Email: ${reqEmail}`});
        }

        res.status(200).json(dataClient[0]);
    }catch (error){
        throw error;
    }
}

// --- PUT ---
export const putClient = async (req, res) => {
    try {
        const idParsed = parseInt(req.params.id);
        const result = await updateClient(idParsed, req.body);

        if (!result) {
            return res.status(404).json({message: "Cliente no encontrado"});
        }

        return res.status(200).json({
            message: `Cliente con ID ${idParsed} actualizado correctamente`,
            data: result
        });

    } catch (error) {
        clientHandleMySQLError(error, req.body);
    }
};

// --- DELETE ---
export const deleteClient = async(req, res) => {
    try{
        const id = parseInt(req.params.id);
        const dataClient = await deleteClientById(id);

        if (dataClient.affectedRows === 0) {
            return res.status(404).json({message: `No se ha encontrado cliente con ID: ${id}`});
        }
        res.status(200).json({message: `Se ha eliminado cliente con ID: ${id} correctamente`});
    } catch(error){
        clientHandleMySQLError(error);
    }
}