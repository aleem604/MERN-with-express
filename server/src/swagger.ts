// src/swagger.ts
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for my Node.js + TypeScript app",
    },
    servers: [
      {
        url: process.env.API_URL, // adjust as needed
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to your route files with annotations
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
