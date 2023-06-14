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
bugRouter.get(`/v${process.env.VERSION}/bugs`, getAllBugReports);

// GET bug reports by id
bugRouter.get(`/v${process.env.VERSION}/bugs/:id`, getBugReportById);

// POST/Create bug reports
bugRouter.post(`/v${process.env.VERSION}/bugs`, createBugReport);

// PUT/Update bug reports by id
bugRouter.put(`/v${process.env.VERSION}/bugs/:id`, updateBugReportById);

// DELETE bug reports by id
bugRouter.delete(`/v${process.env.VERSION}/bugs/:id`, deleteBugReportById);

export default bugRouter;
