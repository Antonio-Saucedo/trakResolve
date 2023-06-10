import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Trak Resolve Info API",
    description: "Trak Resolve Info API",
    version: "1.0.0",
  },
  host: "localhost:5200",
  schemes: ["http"],
  tags: [
    {
      name: "bugs",
      description: "Get bug report information from Trak Resolve.",
    },
  ],
  components: {
    schemas: {
      bugs: {
        type: "object",
        properties: {
          summary: {
            type: "string",
          },
          link: {
            type: "string",
          },
          imageUrl: {
            type: "string",
          },
          description: {
            type: "string",
          },
          reproductionFindings: {
            type: "string",
          },
          developmentFindings: {
            type: "string",
          },
          message: {
            type: "string",
          },
          resolved: {
            type: "boolean",
          },
          tags: {
            type: "string",
          },
        },
      },
    },
  },
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routers/bug.router.ts"];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);