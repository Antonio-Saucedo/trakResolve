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
          phone: {
            type: "number",
          },
          password: {
            type: "string",
          },
          role: {
            type: "string",
          },
          messages: {
            type: "array",
            items: {
              bugId: {
                type: "string",
              },
              message: {
                type: "string",
              },
              isOpen: {
                type: "boolean",
              },
            },
            example: {
              bugId: "string",
              message: "string",
              isOpen: true,
            },
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
