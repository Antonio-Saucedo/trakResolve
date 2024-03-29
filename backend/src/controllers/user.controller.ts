import { getDb } from "../configs/database.config";
import { claimEquals } from "express-openid-connect";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
const ObjectId = require("mongodb").ObjectId;

export const getAllUsers = asyncHandler(async (req: any, res: any) => {
  try {
    if (claimEquals("admin", false)) {
      res.status(401).json("You must be an admin to see users.");
    } else {
      const result = await getDb().db("trakResolve").collection("users").find();
      result.toArray().then((lists: any) => {
        if (!lists[0]) {
          res.status(404).json("Users were not found. Try again later.");
        } else {
          res.setHeader("Content-Type", "application/json");
          res.status(200).json(lists);
        }
      });
    }
  } catch (err) {
    res.status(500).json("users were not found. Try again later.");
  }
});

export const getUserById = asyncHandler(async (req: any, res: any) => {
  try {
    if (claimEquals("admin", false)) {
      res.status(401).json("You must be an admin to see users.");
    } else {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json("ID must be alphanumeric, 24 characters long.");
      } else {
        const userId = new ObjectId(req.params.id);
        const result = await getDb()
          .db("trakResolve")
          .collection("users")
          .find({ _id: userId });
        result.toArray().then((lists: any) => {
          if (!lists[0]) {
            res.status(404).json(`User with ID ${userId} was not found.`);
          } else {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(lists[0]);
          }
        });
      }
    }
  } catch (err) {
    res.status(500).json("User was not found. Try again later.");
  }
});

export const getDevTeam = asyncHandler(async (req: any, res: any) => {
  try {
    if (claimEquals("user", true) || claimEquals("", true)) {
      res.status(401).json("You are not authorized to use this request.");
    } else {
      const result = await getDb()
        .db("trakResolve")
        .collection("users")
        .find({ role: { $regex: "^((?!user).)*$" } })
        .project({ _id: 0, firstName: 1, lastName: 1 });
      result.toArray().then((lists: any) => {
        if (!lists[0]) {
          res.status(404).json("Development team was not found.");
        } else {
          res.setHeader("Content-Type", "application/json");
          res.status(200).json(lists);
        }
      });
    }
  } catch (err) {
    res.status(500).json("Development team was not found. Try again later.");
  }
});

export const createUser = asyncHandler(async (req: any, res: any) => {
  try {
    let failMessage = "";
    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    };
    if (typeof data.firstName != "string") {
      failMessage += "To create user profile, enter a firstName string.\n";
    }
    if (typeof data.lastName != "string") {
      failMessage += "To create user profile, enter a lastName string.\n";
    }
    if (typeof data.email != "string") {
      failMessage += "To create user profile, enter an email string.\n";
    }
    if (typeof data.email == "string") {
      const expression: RegExp =
        /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
      if (!expression.test(data.email)) {
        failMessage += "To create user profile, enter a valid email.";
      }
    }
    if (typeof data.password != "string") {
      failMessage += "To create user profile, enter a password.\n";
    } else {
      data.password = await bcrypt.hash(data.password, 10);
    }
    if (typeof data.role != "string") {
      failMessage += "To create user profile, enter a role string.\n";
    }
    if (
      typeof data.role == "string" &&
      claimEquals("admin", false) &&
      data.role != "user"
    ) {
      failMessage += "To create user profile, enter 'user' for role string.\n";
    }
    if (failMessage != "") {
      res.status(400);
      res.send(failMessage);
    } else {
      const responce = await getDb()
        .db("trakResolve")
        .collection("users")
        .insertOne(data);
      if (responce.acknowledged) {
        const user = await getDb()
          .db("trakResolve")
          .collection("users")
          .findOne({ email: data.email.toLowerCase() });
        res.status(201).send(generateTokenReponse(user));
      } else {
        res
          .status(500)
          .json(
            responce.error ||
              "Something went wrong while creating the user profile. Try again later."
          );
      }
    }
  } catch (err) {
    res
      .status(500)
      .json(
        "Something went wrong while creating the user profile. Try again later."
      );
  }
});

export const loginUser = asyncHandler(async (req: any, res: any) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = await getDb()
      .db("trakResolve")
      .collection("users")
      .findOne({ email: data.email.toLowerCase() });
    if (user && (await bcrypt.compare(data.password, user.password))) {
      res.send(generateTokenReponse(user));
    } else {
      res.status(400).send("Invalid email or password.");
    }
  } catch (err) {
    res.status(500).json("Something went wrong during login. Try again later.");
  }
});

export const updateUserById = asyncHandler(async (req: any, res: any) => {
  try {
    if (
      claimEquals("user", false) &&
      claimEquals("developer", false) &&
      claimEquals("qa", false) &&
      claimEquals("lead", false) &&
      claimEquals("admin", false)
    ) {
      res.status(401).json("You must login to update user profile.");
    } else {
      if (req.oidc.isAuthenticated()) {
        if (!ObjectId.isValid(req.params.id)) {
          res.status(400).json("ID must be alphanumeric, 24 characters long.");
        } else {
          let failMessage = "";
          const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
          };
          if (typeof data.firstName != "string") {
            failMessage +=
              "To update user profile, enter a firstName string.\n";
          }
          if (typeof data.lastName != "string") {
            failMessage += "To update user profile, enter a lastName string.\n";
          }
          if (typeof data.email != "string") {
            failMessage += "To update user profile, enter an email string.\n";
          }
          if (typeof data.email == "string") {
            const expression: RegExp =
              /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
            if (!expression.test(data.email)) {
              failMessage += "To update user profile, enter a valid email.";
            }
          }
          if (typeof data.password != "string") {
            failMessage += "To update user profile, enter a password.\n";
          }
          if (typeof data.role != "string") {
            failMessage += "To update user profile, enter a role string.\n";
          }
          if (
            typeof data.role == "string" &&
            claimEquals("admin", false) &&
            data.role != "user"
          ) {
            failMessage +=
              "To update user profile, enter 'user' for role string.\n";
          }
          if (
            typeof data.role == "string" &&
            claimEquals("admin", true) &&
            data.role != "user" &&
            data.role != "developer" &&
            data.role != "qa" &&
            data.role != "lead" &&
            data.role != "admin"
          ) {
            failMessage +=
              "To update user profile, enter 'user', 'developer', 'qa', 'lead' or 'admin' for role string.";
          }
          if (failMessage != "") {
            res.status(400);
            res.send(failMessage);
          } else {
            const userId = new ObjectId(req.params.id);
            const responce = await getDb()
              .db("trakResolve")
              .collection("users")
              .updateOne(
                { _id: userId },
                {
                  $set: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                  },
                }
              );
            if (responce.modifiedCount > 0) {
              res.status(204).send();
            } else {
              res
                .status(500)
                .json(
                  responce.error ||
                    "Something went wrong while updating the user profile. Try again later."
                );
            }
          }
        }
      } else {
        res.status(401).json("You must login to update user profiles.");
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export const updateUserByIdParameter = asyncHandler(
  async (req: any, res: any) => {
    try {
      if (
        claimEquals("user", false) &&
        claimEquals("developer", false) &&
        claimEquals("qa", false) &&
        claimEquals("lead", false) &&
        claimEquals("admin", false)
      ) {
        res.status(401).json("You must login to update user profile.");
      } else {
        if (req.oidc.isAuthenticated()) {
          if (!ObjectId.isValid(req.params.id)) {
            res
              .status(400)
              .json("ID must be alphanumeric, 24 characters long.");
          } else {
            const valid = [
              "firstName",
              "lastName",
              "email",
              "password",
              "role",
            ];
            const parameter = req.params.parameter;
            if (valid.includes(parameter)) {
              let failMessage = "";
              if (
                parameter == "firstName" &&
                typeof req.body.parameter != "string"
              ) {
                failMessage +=
                  "To update user profile, enter a firstName string.\n";
              }
              if (
                parameter == "lastName" &&
                typeof req.body.parameter != "string"
              ) {
                failMessage +=
                  "To update user profile, enter a lastName string.\n";
              }
              if (
                parameter == "email" &&
                typeof req.body.parameter != "string"
              ) {
                failMessage +=
                  "To update user profile, enter an email string.\n";
              }
              if (
                parameter == "email" &&
                typeof req.body.parameter == "string"
              ) {
                const expression: RegExp =
                  /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
                if (!expression.test(req.body.parameter)) {
                  failMessage += "To update user profile, enter a valid email.";
                }
              }
              if (
                parameter == "password" &&
                typeof req.body.parameter != "string"
              ) {
                failMessage += "To update user profile, enter a password.\n";
              }
              if (
                parameter == "role" &&
                typeof req.body.parameter != "string"
              ) {
                failMessage += "To update user profile, enter a role string.\n";
              }
              if (
                parameter == "role" &&
                typeof req.body.parameter == "string" &&
                claimEquals("admin", false) &&
                req.body.parameter != "user"
              ) {
                failMessage +=
                  "To update user profile, enter 'user' for role string.\n";
              }
              if (
                parameter == "role" &&
                typeof req.body.parameter == "string" &&
                claimEquals("admin", true) &&
                req.body.parameter != "user" &&
                req.body.parameter != "developer" &&
                req.body.parameter != "qa" &&
                req.body.parameter != "lead" &&
                req.body.parameter != "admin"
              ) {
                failMessage +=
                  "To update user profile, enter 'user', 'developer', 'qa', 'lead' or 'admin' for role string.";
              }
              if (failMessage != "") {
                res.status(400);
                res.send(failMessage);
              } else {
                const userId = new ObjectId(req.params.id);
                if (parameter == "firstName") {
                  const responce = await getDb()
                    .db("trakResolve")
                    .collection("users")
                    .updateOne(
                      { _id: userId },
                      {
                        $set: {
                          firstName: req.body.parameter,
                        },
                      }
                    );
                  if (responce.modifiedCount > 0) {
                    res.status(204).send();
                  } else {
                    res
                      .status(500)
                      .json(
                        responce.error ||
                          "Something went wrong while updating the user profile. Try again later."
                      );
                  }
                }
                if (parameter == "lastName") {
                  const responce = await getDb()
                    .db("trakResolve")
                    .collection("users")
                    .updateOne(
                      { _id: userId },
                      {
                        $set: {
                          lastName: req.body.parameter,
                        },
                      }
                    );
                  if (responce.modifiedCount > 0) {
                    res.status(204).send();
                  } else {
                    res
                      .status(500)
                      .json(
                        responce.error ||
                          "Something went wrong while updating the user profile. Try again later."
                      );
                  }
                }
                if (parameter == "email") {
                  const responce = await getDb()
                    .db("trakResolve")
                    .collection("users")
                    .updateOne(
                      { _id: userId },
                      {
                        $set: {
                          email: req.body.parameter,
                        },
                      }
                    );
                  if (responce.modifiedCount > 0) {
                    res.status(204).send();
                  } else {
                    res
                      .status(500)
                      .json(
                        responce.error ||
                          "Something went wrong while updating the user profile. Try again later."
                      );
                  }
                }
                if (parameter == "password") {
                  const responce = await getDb()
                    .db("trakResolve")
                    .collection("users")
                    .updateOne(
                      { _id: userId },
                      {
                        $set: {
                          password: req.body.parameter,
                        },
                      }
                    );
                  if (responce.modifiedCount > 0) {
                    res.status(204).send();
                  } else {
                    res
                      .status(500)
                      .json(
                        responce.error ||
                          "Something went wrong while updating the user profile. Try again later."
                      );
                  }
                }
                if (parameter == "role") {
                  const responce = await getDb()
                    .db("trakResolve")
                    .collection("users")
                    .updateOne(
                      { _id: userId },
                      {
                        $set: {
                          role: req.body.parameter,
                        },
                      }
                    );
                  if (responce.modifiedCount > 0) {
                    res.status(204).send();
                  } else {
                    res
                      .status(500)
                      .json(
                        responce.error ||
                          "Something went wrong while updating the user profile. Try again later."
                      );
                  }
                }
              }
            } else {
              res
                .status(400)
                .json(
                  "The available fields to update are firstName, lastName, email, password, role."
                );
            }
          }
        } else {
          res.status(401).json("You must login to update user profiles.");
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export const deleteUserById = asyncHandler(async (req: any, res: any) => {
  try {
    if (claimEquals("admin", false)) {
      res.status(401).json("You must be an admin to delete users.");
    }
    if (req.oidc.isAuthenticated()) {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json("ID must be alphanumeric, 24 characters long.");
      } else {
        const userId = new ObjectId(req.params.id);
        const responce = await getDb()
          .db("trakResolve")
          .collection("users")
          .deleteOne({ _id: userId }, true);
        if (responce.deletedCount > 0) {
          res
            .status(200)
            .send(`User profile with ID ${userId} was deleted sucessfully.`);
        } else {
          res
            .status(500)
            .json(
              responce.error ||
                "Something went wrong while deleting the user profile. Try again later."
            );
        }
      }
    } else {
      res.status(401).json("You must login to delete user profiles.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

const generateTokenReponse = (user: any) => {
  const token = jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "30d",
    }
  );
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    token: token,
  };
};
