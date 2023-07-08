import { Router } from "express";
import {
  getAllBugReports,
  createBugReport,
  updateBugReportById,
  deleteBugReportById,
  getBugReportBySearchTerm,
  getBugById,
} from "../controllers/bug.controller";
const bugRouter = Router();

// GET all bug reports
bugRouter.get("/bugs", getAllBugReports);

// GET bug report by id
bugRouter.get("/bugs/:id", getBugById);

// GET bug reports by search term
bugRouter.get("/bugs/search/:searchType/:searchTerm", getBugReportBySearchTerm);

// POST/Create bug reports
bugRouter.post("/bugs", createBugReport);

// PUT/Update bug reports by id
bugRouter.put("/bugs/:id", updateBugReportById);

// DELETE bug reports by id
bugRouter.delete("/bugs/:id", deleteBugReportById);

export default bugRouter;
