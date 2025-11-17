import request from 'supertest';
import app from '../app.js'; // Ajusta la ruta a donde exportaste tu aplicación Express
import { db } from '../config/database.js'; // Importa la conexión a la base de datos si es necesario

// ----------------------------------------------------
// 1. Configuración y Variables
// ----------------------------------------------------
let employeeId;
const API_PREFIX = '/api/employee'; // Prefijo de tu router
const MOCK_EMPLOYEE = {
    first_name: "Juan",
    last_name: "Perez",
    dni: "30123456",
    phone: "1155551234",
    position: "Desarrollador Junior",
    salary: 50000.50,
    id_user: 9999 // Asegúrate de que este ID_USER exista o sea mockeado/creado para pruebas
};

// ----------------------------------------------------
// 2. Setup (Opcional, pero recomendado)
// ----------------------------------------------------
// Hooks de Jest para limpiar antes/después de las pruebas
beforeAll(async () => {
    // OPCIONAL: Limpiar datos o asegurar condiciones iniciales
    // await db.query('DELETE FROM employee WHERE dni = ?', [MOCK_EMPLOYEE.dni]); 
    console.log("Iniciando pruebas de Empleado...");
});

afterAll(async () => {
    // OPCIONAL: Limpiar los datos creados durante la prueba
    if (employeeId) {
        await db.query('DELETE FROM employee WHERE id_employee = ?', [employeeId]);
        console.log(`Empleado de prueba con ID ${employeeId} eliminado.`);
    }
    // Asegúrate de cerrar la conexión de la BD si usas un pool
    await db.end(); 
    console.log("Pruebas de Empleado finalizadas y conexión cerrada.");
});

// ----------------------------------------------------
// 3. Suite de Pruebas (El Ciclo CRUD)
// ----------------------------------------------------

describe('📝 Ciclo de Vida CRUD para Employee', () => {

    it('1. POST /postEmployee: Debería crear un nuevo empleado (201)', async () => {
        const response = await request(app)
            .post(`${API_PREFIX}/postEmployee`)
            .send(MOCK_EMPLOYEE);

        expect(response.statusCode).toBe(201);
        expect(response.body.employee).toBeDefined();
        
        // **ENCADENAMIENTO CLAVE:** Guardar el ID para usarlo en las siguientes pruebas
        employeeId = response.body.employee.id; 
        expect(employeeId).toBeGreaterThan(0);
        expect(response.body.employee.dni).toBe(MOCK_EMPLOYEE.dni);
    });

    it('2. GET /getByIdEmployee/:id: Debería obtener el empleado recién creado (200)', async () => {
        const response = await request(app)
            .get(`${API_PREFIX}/getByIdEmployee/${employeeId}`);

        expect(response.statusCode).toBe(200);
        // La respuesta es un array, como está definida en tu controller: [result]
        expect(response.body).toHaveLength(1); 
        expect(response.body[0].id_employee).toBe(employeeId);
    });

    it('3. PUT /putEmployee/:id: Debería actualizar el salario del empleado (200)', async () => {
        const updatedData = { salary: 65000.75 };

        const response = await request(app)
            .put(`${API_PREFIX}/putEmployee/${employeeId}`)
            .send(updatedData);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('actualizado correctamente');
        // Opcional: Verificar que los datos se actualizaron correctamente en la DB
    });

    it('4. DELETE /deleteEmployeById/:id: Debería eliminar el empleado (200)', async () => {
        const response = await request(app)
            .delete(`${API_PREFIX}/deleteEmployeById/${employeeId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('Se ha eliminado empleado');
    });

    it('5. DELETE /deleteEmployeById/:id: Debería fallar al intentar eliminarlo de nuevo (400)', async () => {
        const response = await request(app)
            .delete(`${API_PREFIX}/deleteEmployeById/${employeeId}`);
            
        // Tu controller devuelve 400 si affectedRows es 0
        expect(response.statusCode).toBe(400); 
        expect(response.body.message).toContain('No se ha encontrado empleado');
    });
});