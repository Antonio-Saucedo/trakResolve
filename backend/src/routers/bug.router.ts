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
bugRouter.get("/search", getAllBugReports);

// GET bug reports by search term
bugRouter.get("/search/:searchType/:searchTerm", getBugReportBySearchTerm);

// POST/Create bug reports
bugRouter.post("/search", createBugReport);

// PUT/Update bug reports by id
bugRouter.put("/search/:id", updateBugReportById);

// DELETE bug reports by id
bugRouter.delete("/search/:id", deleteBugReportById);

export default bugRouter;
