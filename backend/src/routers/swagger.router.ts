import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../swagger.json";

const swaggerRouter = Router();
swaggerRouter.use(`/v${process.env.VERSION}/api-docs`, swaggerUi.serve);
swaggerRouter.get(`/v${process.env.VERSION}/api-docs`, swaggerUi.setup(swaggerDocument));

export default swaggerRouter;
