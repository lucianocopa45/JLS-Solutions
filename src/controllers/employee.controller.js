import { createEmployee, listEmployee, getEmployeeId, getEmployeDni, updateEmployee, deleteEmployeeById } from "../services/employee.service.js"; 
import { employeeHandleEmployeeMySQLError } from "../utils/employee.mysqlErrorHandler.js";

export const postEmployee = async (req, res) => {
    try{
    const reqEmployee = req.body;
    console.log(reqEmployee);
    
    const dataEmployee = await createEmployee(reqEmployee);
    res.status(201).json({message: "Empleado creado exitosamente", employee: dataEmployee});
    } catch (error){
        employeeHandleEmployeeMySQLError(error, req.body);
    }
}

export const paginatedEmployee = async (req, res) => {  
    try{
    const page = parseInt(req.params.page)
    const limit = parseInt(req.params.limit);
    const dataEmployee = await listEmployee(page, limit);

    if (!dataEmployee) {
        return res.status(400).json({error: "No hay empleados"});
    }
    res.status(201).json(dataEmployee);
    } catch(error){
        throw error;
    }
}

export const getEmployeeById = async (req, res) => {
    try{
    const dataId = parseInt(req.params.id);

    const employee = await getEmployeeId(dataId);

    if (!employee || employee.length === 0) {
        return res.status(401).json({message: `No se ha encontrado empleado con ID: ${dataId}`});
    }

    res.json(employee)
    console.log(employee)
    } catch(error){
        throw error;
    }
}

export const getEmployeeByDni = async (req, res) => {
    try{
    const reqDni = req.params.dni;
    const dataDni = await (getEmployeDni(reqDni));

    if(!dataDni || dataDni.length === 0){
        return res.status(400).json({message: `No se ha encontrado empleado con DNI: ${reqDni}`});
    }

    res.status(200).json(dataDni);
} catch(error){
    throw error;
}
}

export const putEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const idParsed = parseInt(id);

    const reqData = req.body;

    const result = await updateEmployee(idParsed, reqData);

    if (!result) {
      return res.status(404).json({
        message: "Empleado no encontrado"
      });
    }

    return res.status(200).json({
      message: `Empleado con ID ${idParsed} actualizado correctamente`,
      data: result
    });

  } catch (error) {
    console.error("Error crudo de DB:", error);
    return res.status(500).json({
      message: "Error interno al procesar el empleado",
      error: error.message
    });
  }
};

export const deleteEmployee = async(req, res) => {
  try{
  const id = parseInt(req.params.id);

  const dataEmployee = await deleteEmployeeById(id);

  if (dataEmployee.affectedRows === 0) {
    return res.status(400).json({message: `No se ha encontrado empleado con ID: ${id}`});
  }
  res.status(200).json({message: `Se ha eliminado empleado con ID: ${id} correctamente`});
  } catch(error){
    throw error;
  }
}