import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../swagger.json";

const swaggerRouter = Router();
swaggerRouter.use(`/api-docs`, swaggerUi.serve);
swaggerRouter.get(`/api-docs`, swaggerUi.setup(swaggerDocument));

export default swaggerRouter;
