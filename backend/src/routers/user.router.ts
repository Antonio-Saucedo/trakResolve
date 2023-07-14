import { Router } from "express";
import {
  getAllUsers,
  getuserById,
  createUser,
  loginUser,
  updateUserById,
  updateUserByIdParameter,
  deleteUserById,
} from "../controllers/user.controller";
const userRouter = Router();

// GET all users
userRouter.get("/users", getAllUsers);

// GET users by id
userRouter.get("/users/:id", getuserById);

// POST/Create users
userRouter.post("/users/register", createUser);

// POST login user
userRouter.post("/users/login", loginUser);

// PUT/Update users by id
userRouter.put("/users/:id", updateUserById);

// PUT/Update users parameter by id
userRouter.put("/users/:id/:parameter", updateUserByIdParameter);

// DELETE users by id
userRouter.delete("/users/:id", deleteUserById);

export default userRouter;
