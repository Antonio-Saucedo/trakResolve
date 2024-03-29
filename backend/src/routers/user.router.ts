import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  getDevTeam,
  createUser,
  loginUser,
  updateUserById,
  updateUserByIdParameter,
  deleteUserById,
} from "../controllers/user.controller";
const userRouter = Router();

// Get devTeam
userRouter.get("/users/devTeam", getDevTeam);

// POST/Create users
userRouter.post("/users/register", createUser);

// GET all users
userRouter.get("/users", getAllUsers);

// GET users by id
userRouter.get("/users/:id", getUserById);


// POST login user
userRouter.post("/users/login", loginUser);

// PUT/Update users by id
userRouter.put("/users/:id", updateUserById);

// PUT/Update users parameter by id
userRouter.put("/users/:id/:parameter", updateUserByIdParameter);

// DELETE users by id
userRouter.delete("/users/:id", deleteUserById);

export default userRouter;
