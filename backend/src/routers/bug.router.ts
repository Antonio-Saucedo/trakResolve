import { Router } from "express";
import {
  getAllBugReports,
  getBugReportById,
  createBugReport,
  updateBugReportById,
  deleteBugReportById,
} from "../controllers/bug.controller";
const bugRouter = Router();

// GET all bug reports
bugRouter.get("/bugs", getAllBugReports);

// GET bug reports by id
bugRouter.get("/bugs/:id", getBugReportById);

// POST/Create bug reports
bugRouter.post("/bugs", createBugReport);

// PUT/Update bug reports by id
bugRouter.put("/bugs/:id", updateBugReportById);

// DELETE bug reports by id
bugRouter.delete("/bugs/:id", deleteBugReportById);

export default bugRouter;
