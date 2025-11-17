// src/docs/swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JLS-Solution - API",
      version: "1.0.0",
      description:
        "API RESTful de JLS-Solution — proyecto de consultora. Gestión de empleados, usuarios, proyectos, clientes y tareas.",
    },
    servers: [
      { url: "http://localhost:3040/api", description: "Servidor local" },
      { url: "https://jls-solutions-production.up.railway.app/api", description: "Producción (Railway)" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Employee model
        Employee: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            first_name: { type: "string", example: "Luciano" },
            last_name: { type: "string", example: "Copa" },
            dni: { type: "string", example: "40222111" },
            phone: { type: "string", example: "1133445566" },
            position: { type: "string", example: "Desarrollador Backend" },
            salary: { type: "number", format: "float", example: 450000 },
            id_user: { type: "integer", example: 3 }
          }
        },
        EmployeeInput: {
          type: "object",
          required: ["first_name","last_name","dni","phone","position","salary","id_user"],
          properties: {
            first_name: { type: "string", example: "Luciano" },
            last_name: { type: "string", example: "Copa" },
            dni: { type: "string", example: "40222111" },
            phone: { type: "string", example: "1133445566" },
            position: { type: "string", example: "Desarrollador Backend" },
            salary: { type: "number", format: "float", example: 450000 },
            id_user: { type: "integer", example: 3 }
          }
        },
        EmployeeUpdate: {
          type: "object",
          description: "Campos opcionales para actualización",
          properties: {
            first_name: { type: "string", example: "Luciano" },
            last_name: { type: "string", example: "Copa" },
            dni: { type: "string", example: "40222111" },
            phone: { type: "string", example: "1133445566" },
            position: { type: "string", example: "Desarrollador Backend Senior" },
            salary: { type: "number", format: "float", example: 550000 }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Mensaje de error descriptivo" },
            errors: { type: "array", items: { type: "string" } }
          }
        },
        PaginatedEmployees: {
          type: "object",
          properties: {
            docs: { type: "array", items: { $ref: "#/components/schemas/Employee" } },
            totalDocs: { type: "integer", example: 100 },
            limit: { type: "integer", example: 10 },
            page: { type: "integer", example: 1 },
            totalPages: { type: "integer", example: 10 }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.js", "./src/models/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export { swaggerSpec, setupSwagger, swaggerUi };
