import { Employee } from '../models/employee.model.js';
import { db } from '../config/database.js';

export const createEmployee = async (data) => {
    const query = "INSERT INTO employee(first_name, last_name, dni, phone, position, salary, id_user) VALUES (?,?,?,?,?,?,?);"
    const nuevoEmployee = new Employee(
        null,
        data.first_name,
        data.last_name,
        data.dni,
        data.phone,
        data.position,
        data.salary,
        data.id_user
    )

    const values = [nuevoEmployee.first_name, nuevoEmployee.last_name, nuevoEmployee.dni, nuevoEmployee.phone, nuevoEmployee.position, nuevoEmployee.salary, nuevoEmployee.id_user];

    const [result] = await db.query(query, values);

    return {
        id: result.insertId,
        first_name: nuevoEmployee.first_name, 
        last_name: nuevoEmployee.last_name, 
        dni: nuevoEmployee.dni, 
        phone: nuevoEmployee.phone, 
        position: nuevoEmployee.position, 
        salary: nuevoEmployee.salary, 
        id_user: nuevoEmployee.id_user
    }
};

export const listEmployee = async (page, limit) => {
    try{
    let offset = (page - 1) * limit;

    const cleanLimit = Math.floor(limit);
    const cleanOffset = Math.floor(offset);

  // 1) Datos paginados
    const [rows] = await db.query(`SELECT * FROM employee LIMIT ${cleanLimit} OFFSET ${cleanOffset}`);

  // 2) Total de registros
    const [countResult] = await db.query(
    "SELECT COUNT(*) AS total FROM employee"
    );

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
    } catch(error) {
        throw error;
    }
    
};
export const getEmployeeId = async (idEmploye) => {
    try{
    const query = 'SELECT * FROM employee WHERE id_employee = ?;';
    const [result] = await db.query(query, [idEmploye]);

    return result;
    } catch(error){
        throw error;
    }
};

export const getEmployeDni = async (dniEmploye) => {
    try{
        const query = 'SELECT * FROM employee WHERE dni = ?;';
        const [result] = await db.query(query, [dniEmploye]);

        return result;
    }catch (error){
        throw error;
    }
};

export const updateEmployee = async (idEmploye, dataEmployee) => {
    try{
        const query = 'UPDATE employee SET first_name = ?, last_name = ?, dni = ?, phone = ?, position = ?, salary = ? WHERE id_employee = ?;';
        const employeeUpdate = new Employee(
            null,
            dataEmployee.first_name,
            dataEmployee.last_name,
            dataEmployee.dni,
            dataEmployee.phone,
            dataEmployee.position,
            dataEmployee.salary,
            null
        );

        const values = [employeeUpdate.first_name, employeeUpdate.last_name, employeeUpdate.dni, employeeUpdate.phone, employeeUpdate.position, employeeUpdate.salary, idEmploye];
        const [result] = await db.query(query, values);
        if (result.affectedRows === 0) {
            return null;
        }
        return result;
    } catch(error){
        throw error;
    }
};

export const deleteEmployeeById = async (idEmploye) => {
    try{
    const query = 'DELETE FROM employee WHERE id_employee = ?;';

    const [result] = await db.query(query, [idEmploye]);

    return result;
    }
    catch(error){
        throw error;
    }
};
