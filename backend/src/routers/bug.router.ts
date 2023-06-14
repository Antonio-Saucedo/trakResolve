import { Router } from "express";
import {
  getAllBugReports,
  createBugReport,
  updateBugReportById,
  deleteBugReportById,
  getBugReportBySearchTerm,
} from "../controllers/bug.controller";
const bugRouter = Router();

// Version must be updated when needed.

// GET all bug reports
bugRouter.get(`/v1/bugs`, getAllBugReports);

// GET bug reports by search term
bugRouter.get(`/v1/bugs/:searchType/:searchTerm`, getBugReportBySearchTerm);

// POST/Create bug reports
bugRouter.post(`/v1/bugs`, createBugReport);

// PUT/Update bug reports by id
bugRouter.put(`/v1/bugs/:id`, updateBugReportById);

// DELETE bug reports by id
bugRouter.delete(`/v1/bugs/:id`, deleteBugReportById);

export default bugRouter;
