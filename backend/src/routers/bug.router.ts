import { Router } from "express";
import {
  getAllBugReports,
  createBugReport,
  updateBugReportById,
  deleteBugReportById,
  getBugReportBySearchTerm,
} from "../controllers/bug.controller";
const bugRouter = Router();

// GET all bug reports
bugRouter.get("/bugs", getAllBugReports);

// GET bug reports by search term
bugRouter.get("/bugs/:searchType/:searchTerm", getBugReportBySearchTerm);

// POST/Create bug reports
bugRouter.post("/bugs", createBugReport);

// PUT/Update bug reports by id
bugRouter.put("/bugs/:id", updateBugReportById);

// DELETE bug reports by id
bugRouter.delete("/bugs/:id", deleteBugReportById);

export default bugRouter;
