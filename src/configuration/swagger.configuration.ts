import { injectable } from "tsyringe";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import ExpressConfiguration from "./express.configuration";

@injectable()
export default class SwaggerConfiguration {
  private readonly swaggerSpec: object

  constructor(private readonly expressConfiguration: ExpressConfiguration) {
    this.swaggerSpec = swaggerJSDoc({
      swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: "API Documentation",
          version: "1.0.0",
          description: "Documentation for the backend API",
        },
        servers: [
          {
            url: "http://localhost:8080",
            description: "Local server",
          },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        security: [
          { 
            bearerAuth: [],
          },
        ],
      },
      apis: [
        "./src/documentation/**/*.ts",
      ],
    })
  }

  public setup(): void {
    this.expressConfiguration.getExpressApplication().use("/api/docs", swaggerUi.serve, swaggerUi.setup(this.swaggerSpec));
  }
}