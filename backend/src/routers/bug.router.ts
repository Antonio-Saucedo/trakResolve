import { Router } from "express";
import {
  getAllBugReports,
  getBugById,
  getBugReportBySearchTerm,
  getuserMessages,
  createBugReport,
  updateBugReportById,
  updateBugTagsById,
  updateBugMessagesById,
  updateBugAssignedById,
  deleteBugReportById,
} from "../controllers/bug.controller";
const bugRouter = Router();

// GET all bug reports
bugRouter.get("/bugs", getAllBugReports);

// GET bug report by id
bugRouter.get("/bugs/:id", getBugById);

// GET bug reports by search term
bugRouter.get("/bugs/search/:searchType/:searchTerm", getBugReportBySearchTerm);

// GET user messages
bugRouter.get("/bugs/messages/:user", getuserMessages);

// POST/Create bug reports
bugRouter.post("/bugs", createBugReport);

// PUT/Update bug reports by id
bugRouter.put("/bugs/:id", updateBugReportById);

// PUT/Update bug report tags by id
bugRouter.put("/bugs/tags/:id", updateBugTagsById);

// PUT/Update bug users messages by id
bugRouter.put("/bugs/messages/:id", updateBugMessagesById);

// PUT/Update bug assignment by id
bugRouter.put("/bugs/assign/:id", updateBugAssignedById);

// DELETE bug reports by id
bugRouter.delete("/bugs/:id", deleteBugReportById);

export default bugRouter;
