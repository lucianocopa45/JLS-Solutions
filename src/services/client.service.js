// services/client.service.js
import { Client } from '../models/client.model.js';
import { db } from '../config/database.js';

// --- CREATE ---
export const createClient = async (data) => {
    const query = "INSERT INTO clients(first_name, last_name, company_name, email, phone, address, id_user, industry, client_status) VALUES (?,?,?,?,?,?,?,?,?);";
    const newClient = new Client(
        null, 
        data.first_name, data.last_name, data.company_name, 
        data.email, data.phone, data.address, 
        data.id_user, data.industry, data.client_status || 'Activo'
    );

    const values = [
        newClient.first_name, newClient.last_name, newClient.company_name, 
        newClient.email, newClient.phone, newClient.address, 
        newClient.id_user, newClient.industry, newClient.client_status
    ];

    const [result] = await db.query(query, values);

    return {
        ...newClient,
        id_client: result.insertId
    };
};

// --- LIST / PAGINATE ---
export const listClients = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;

        const cleanLimit = Math.floor(limit);
        const cleanOffset = Math.floor(offset);

        const [rows] = await db.query(`SELECT * FROM clients LIMIT ${cleanLimit} OFFSET ${cleanOffset}`);
        const [countResult] = await db.query("SELECT COUNT(*) AS total FROM clients");
        const totalItems = countResult[0]?.total || 0;
        const totalPages = Math.ceil(totalItems / limit);

        return { page, limit, totalItems, totalPages, data: rows };
    } catch (error) {
        throw error;
    }
};

// --- GET BY ID ---
export const getClientById = async (idClient) => {
    try {
        const query = 'SELECT * FROM clients WHERE id_client = ?;';
        const [result] = await db.query(query, [idClient]);
        return result;
    } catch (error) {
        throw error;
    }
};

// --- GET BY EMAIL (Búsqueda única) ---
export const getClientByEmail = async (clientEmail) => {
    try {
        const query = 'SELECT * FROM clients WHERE email = ?;';
        const [result] = await db.query(query, [clientEmail]);
        return result;
    } catch (error) {
        throw error;
    }
};

// --- UPDATE ---
export const updateClient = async (idClient, dataClient) => {
    try {
        const query = 'UPDATE clients SET first_name = ?, last_name = ?, company_name = ?, email = ?, phone = ?, address = ?, id_user = ?, industry = ?, client_status = ? WHERE id_client = ?;';
        const clientUpdate = new Client(
            null, 
            dataClient.first_name, dataClient.last_name, dataClient.company_name, 
            dataClient.email, dataClient.phone, dataClient.address, 
            dataClient.id_user, dataClient.industry, dataClient.client_status
        );

        const values = [
            clientUpdate.first_name, clientUpdate.last_name, clientUpdate.company_name, 
            clientUpdate.email, clientUpdate.phone, clientUpdate.address, 
            clientUpdate.id_user, clientUpdate.industry, clientUpdate.client_status, idClient
        ];
        
        const [result] = await db.query(query, values);
        
        return result.affectedRows > 0 ? result : null;
    } catch (error) {
        throw error;
    }
};

// --- DELETE ---
export const deleteClientById = async (idClient) => {
    try {
        const query = 'DELETE FROM clients WHERE id_client = ?;';
        const [result] = await db.query(query, [idClient]);
        return result;
    } catch (error) {
        throw error;
    }
};