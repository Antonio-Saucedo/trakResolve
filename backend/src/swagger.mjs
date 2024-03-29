import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Trak Resolve Info API",
    description: "Trak Resolve Info API",
    version: "1.0.0",
  },
  host: "trakresolve.onrender.com",
  schemes: ["https"],
  tags: [
    {
      name: "bugs",
      description: "Get bug report information from Trak Resolve.",
    },
    {
      name: "users",
      description: "Get user profile information from Trak Resolve.",
    },
  ],
  components: {
    schemas: {
      bugs: {
        type: "object",
        properties: {
          reportedBy: {
            type: "string",
          },
          summary: {
            type: "string",
          },
          link: {
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
          assignedTo: {
            type: "string",
            example: "dev_team",
          },
          message: {
            type: "string",
          },
          resolved: {
            type: "boolean",
          },
          tags: {
            type: "list",
            example: ["tag1", "tag2", "tag3"],
          },
        },
      },
      users: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
          },
          lastName: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
          },
          role: {
            type: "string",
          },
        },
      },
    },
  },
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routers/bug.router.ts", "./routers/user.router.ts"];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
