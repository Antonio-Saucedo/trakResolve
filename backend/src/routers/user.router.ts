import { Router } from "express";
import {
  getAllUsers,
  getuserById,
  getuserMessages,
  createUser,
  loginUser,
  updateUserById,
  updateUserByIdParameter,
  updateUserMessagesById,
  deleteUserById,
} from "../controllers/user.controller";
const userRouter = Router();

// GET all users
userRouter.get("/users", getAllUsers);

// GET users by id
userRouter.get("/users/:id", getuserById);

// GET user messages
userRouter.get("/users/messages/:id", getuserMessages);

// POST/Create users
userRouter.post("/users", createUser);

// POST login user
userRouter.post("/users/login", loginUser);

// PUT/Update users by id
userRouter.put("/users/:id", updateUserById);

// PUT/Update users parameter by id
userRouter.put("/users/:id/:parameter", updateUserByIdParameter);

// PUT/Update users messages by id
userRouter.put("/users/messages/:id", updateUserMessagesById);

// DELETE users by id
userRouter.delete("/users/:id", deleteUserById);

export default userRouter;
