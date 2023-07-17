import { getDb } from "../configs/database.config";
import { claimEquals, claimIncludes } from "express-openid-connect";
import asyncHandler from "express-async-handler";
const ObjectId = require("mongodb").ObjectId;

export const getAllBugReports = asyncHandler(async (req: any, res: any) => {
  try {
    const result = await getDb().db("trakResolve").collection("bugs").find();
    result.toArray().then((lists: any) => {
      if (!lists[0]) {
        res.status(404).json("Bug reports were not found. Try again later.");
      } else {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists);
      }
    });
  } catch (err) {
    res.status(500).json("Bug reports were not found. Try again later.");
  }
});

export const getBugById = asyncHandler(async (req: any, res: any) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json("ID must be alphanumeric, 24 characters long.");
    } else {
      const userId = new ObjectId(req.params.id);
      const result = await getDb()
        .db("trakResolve")
        .collection("bugs")
        .find({ _id: userId });
      result.toArray().then((lists: any) => {
        if (!lists[0]) {
          res.status(404).json(`Bug report with ID ${userId} was not found.`);
        } else {
          res.setHeader("Content-Type", "application/json");
          res.status(200).json(lists[0]);
        }
      });
    }
  } catch (err) {
    res.status(500).json("Bug reports were not found. Try again later.");
  }
});

export const getBugReportBySearchTerm = asyncHandler(
  async (req: any, res: any) => {
    try {
      const valid = [
        "_id",
        "reportedBy",
        "summary",
        "link",
        "description",
        "resolved",
        "tag",
      ];
      const searchType = req.params.searchType;
      if (valid.includes(searchType)) {
        const searchTerm = req.params.searchTerm;
        if (searchType == "_id") {
          if (!ObjectId.isValid(searchTerm)) {
            res
              .status(400)
              .json("ID must be alphanumeric, 24 characters long.");
          } else {
            const userId = new ObjectId(searchTerm);
            const result = await getDb()
              .db("trakResolve")
              .collection("bugs")
              .find({ _id: userId });
            result.toArray().then((lists: any) => {
              if (!lists[0]) {
                res
                  .status(404)
                  .json(`Bug report with ID ${userId} was not found.`);
              } else {
                res.setHeader("Content-Type", "application/json");
                res.status(200).json(lists);
              }
            });
          }
        } else if (searchType == "reportedBy") {
          const result = await getDb()
            .db("trakResolve")
            .collection("bugs")
            .find({ reportedBy: { $regex: searchTerm } });
          result.toArray().then((lists: any) => {
            if (!lists[0]) {
              res
                .status(404)
                .json(`Bug reports reported by ${searchTerm} were not found.`);
            } else {
              res.setHeader("Content-Type", "application/json");
              res.status(200).json(lists);
            }
          });
        } else if (searchType == "summary") {
          const result = await getDb()
            .db("trakResolve")
            .collection("bugs")
            .find({ summary: { $regex: searchTerm } });
          result.toArray().then((lists: any) => {
            if (!lists[0]) {
              res
                .status(404)
                .json(
                  `Bug report with summary containing ${searchTerm} was not found.`
                );
            } else {
              res.setHeader("Content-Type", "application/json");
              res.status(200).json(lists);
            }
          });
        } else if (searchType == "link") {
          const result = await getDb()
            .db("trakResolve")
            .collection("bugs")
            .find({ link: { $regex: searchTerm } });
          result.toArray().then((lists: any) => {
            if (!lists[0]) {
              res
                .status(404)
                .json(
                  `Bug report with link containing ${searchTerm} was not found.`
                );
            } else {
              res.setHeader("Content-Type", "application/json");
              res.status(200).json(lists);
            }
          });
        } else if (searchType == "description") {
          const userId = new ObjectId(req.params.id);
          const result = await getDb()
            .db("trakResolve")
            .collection("bugs")
            .find({ description: { $regex: searchTerm } });
          result.toArray().then((lists: any) => {
            if (!lists[0]) {
              res
                .status(404)
                .json(
                  `Bug report with description containing ${searchTerm} was not found.`
                );
            } else {
              res.setHeader("Content-Type", "application/json");
              res.status(200).json(lists);
            }
          });
        } else if (searchType == "resolved") {
          const result = await getDb()
            .db("trakResolve")
            .collection("bugs")
            .find({ resolved: searchTerm.toLowerCase() == "true" });
          result.toArray().then((lists: any) => {
            if (!lists[0]) {
              res
                .status(404)
                .json(
                  `Bug report with resolved value os ${searchTerm} was not found.`
                );
            } else {
              res.setHeader("Content-Type", "application/json");
              res.status(200).json(lists);
            }
          });
        } else if (searchType == "tag") {
          const result = await getDb()
            .db("trakResolve")
            .collection("bugs")
            .find({ tags: { $regex: searchTerm } });
          result.toArray().then((lists: any) => {
            if (!lists[0]) {
              res
                .status(404)
                .json(
                  `Bug report with tags containing ${searchTerm} was not found.`
                );
            } else {
              res.setHeader("Content-Type", "application/json");
              res.status(200).json(lists);
            }
          });
        } else {
          getAllBugReports;
        }
      } else {
        res
          .status(400)
          .json(
            "Search types are _id, summary, link, description, resolved and tag."
          );
      }
    } catch (err) {
      res.status(500).json("Bug report was not found. Try again later.");
    }
  }
);

export const getuserMessages = asyncHandler(async (req: any, res: any) => {
  try {
    if (claimIncludes("roles")) {
      let failMessage = "";
      const data = {
        user: req.params.user,
      };
      if (typeof data.user != "string") {
        failMessage += "To get user messages, enter a user string.\n";
      }
      if (failMessage != "") {
        res.status(400);
        res.send(failMessage);
      } else {
        const result = await getDb()
          .db("trakResolve")
          .collection("bugs")
          .find({ reportedBy: data.user })
          .project({ message: 1, resolved: 1 });
        result.toArray().then((lists: any) => {
          if (!lists[0]) {
            res.status(404).json(`Messages for ${data.user} were not found.`);
          } else {
            res.status(200).json(lists);
          }
        });
      }
    } else {
      res
        .status(401)
        .json(
          "You do not have access to update bug reports. Please create a new report for additional problems."
        );
    }
  } catch (err) {
    res.status(500).json("Messages were not found. Try again later.");
  }
});

export const createBugReport = asyncHandler(async (req: any, res: any) => {
  try {
    if (!claimIncludes("roles")) {
      res.status(401).json("You must login to create bug reports.");
    }
    let failMessage = "";
    const data = {
      reportedBy: req.body.reportedBy,
      summary: req.body.summary,
      link: req.body.link,
      description: req.body.description,
      reproductionFindings: req.body.reproductionFindings,
      developmentFindings: req.body.developmentFindings,
      assignedTo: req.body.assignedTo,
      message: req.body.message,
      resolved: req.body.resolved,
      tags: req.body.tags,
    };
    if (typeof data.reportedBy != "string") {
      failMessage += "To create bug report, enter a reportedBy string.\n";
    }
    if (typeof data.summary != "string") {
      failMessage += "To create bug report, enter a summary string.\n";
    }
    if (typeof data.link != "string") {
      failMessage += "To create bug report, enter a link string.\n";
    }
    if (typeof data.description != "string") {
      failMessage += "To create bug report, enter a description string.\n";
    }
    if (typeof data.reproductionFindings != "string") {
      failMessage += "To create bug report, enter a reproductionFindings.\n";
    }
    if (typeof data.developmentFindings != "string") {
      failMessage += "To create bug report, enter a developmentFindings.\n";
    }
    if (typeof data.assignedTo != "string") {
      failMessage += "To assign ticket, enter an assignedTo string.\n";
    }
    if (typeof data.assignedTo == "string" && data.assignedTo != "dev_team") {
      failMessage +=
        "To assign ticket, enter 'dev_team' for assignedTo string.\n";
    }
    if (typeof data.message != "string") {
      failMessage += "To create bug report, enter a message string.\n";
    }
    if (typeof data.resolved != "boolean") {
      failMessage +=
        "To create bug report, enter a true/false resolved value.\n";
    }
    if (typeof data.tags != "object") {
      failMessage += "To create bug report, enter a tags list.\n";
    }
    if (failMessage != "") {
      res.status(400);
      res.send(failMessage);
    } else {
      const responce = await getDb()
        .db("trakResolve")
        .collection("bugs")
        .insertOne(data);
      if (responce.acknowledged) {
        res.status(201).json(responce);
      } else {
        res
          .status(500)
          .json(
            responce.error ||
              "Something went wrong while creating the bug report. Try again later."
          );
      }
    }
  } catch (err) {
    res
      .status(500)
      .json(
        "Something went wrong while creating the bug report. Try again later."
      );
  }
});

export const updateBugReportById = asyncHandler(async (req: any, res: any) => {
  try {
    if (claimEquals("user", true) || !claimIncludes("roles")) {
      res.status(401).json("You are not authorized to use this request.");
    }
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json("ID must be alphanumeric, 24 characters long.");
    } else {
      let failMessage = "";
      const valid = [
        "developer_user",
        "qa_user",
        "lead_user",
        "admin_user",
        "dev_team",
        "finished_dev",
      ];
      const data = {
        summary: req.body.summary,
        link: req.body.link,
        description: req.body.description,
        reproductionFindings: req.body.reproductionFindings,
        developmentFindings: req.body.developmentFindings,
        assignedTo: req.body.assignedTo,
        message: req.body.message,
        resolved: req.body.resolved,
        tags: req.body.tags,
      };
      if (typeof data.summary != "string") {
        failMessage += "To update bug report, enter a summary string.\n";
      }
      if (typeof data.link != "string") {
        failMessage += "To update bug report, enter a link string.\n";
      }
      if (typeof data.description != "string") {
        failMessage += "To update bug report, enter a description string.\n";
      }
      if (typeof data.reproductionFindings != "string") {
        failMessage += "To update bug report, enter a reproductionFindings.\n";
      }
      if (typeof data.developmentFindings != "string") {
        failMessage += "To update bug report, enter a developmentFindings.\n";
      }
      if (typeof data.assignedTo != "string") {
        failMessage += "To assign ticket, enter an assignedTo string.\n";
      }
      if (
        typeof data.assignedTo == "string" &&
        !valid.includes(data.assignedTo)
      ) {
        failMessage += "To assign ticket, enter a valid devTeam role.\n";
      }
      if (typeof data.message != "string") {
        failMessage += "To update bug report, enter a message string.\n";
      }
      if (typeof data.resolved != "boolean") {
        failMessage +=
          "To update bug report, enter a true/false resolved value.\n";
      }
      if (typeof data.tags != "object") {
        failMessage += "To update bug report, enter a tags list.\n";
      }
      if (failMessage != "") {
        res.status(400);
        res.send(failMessage);
      } else {
        const userId = new ObjectId(req.params.id);
        const responce = await getDb()
          .db("trakResolve")
          .collection("bugs")
          .updateOne(
            { _id: userId },
            {
              $set: {
                summary: data.summary,
                link: data.link,
                description: data.description,
                reproductionFindings: data.reproductionFindings,
                developmentFindings: data.developmentFindings,
                assignedTo: data.assignedTo,
                message: data.message,
                resolved: data.resolved,
                tags: data.tags,
              },
            }
          );
        if (responce.acknowledged) {
          if (responce.modifiedCount > 0) {
            res.status(204).send();
          } else {
            res.status(304).send("No changes were made.");
          }
        } else {
          res
            .status(500)
            .json(
              responce.error ||
                "Something went wrong while updating the bug report. Try again later."
            );
        }
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export const updateBugTagsById = asyncHandler(async (req: any, res: any) => {
  try {
    if (claimEquals("user", true) || !claimIncludes("roles")) {
      res.status(401).json("You are not authorized to use this request.");
    }
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json("ID must be alphanumeric, 24 characters long.");
    } else {
      let failMessage = "";
      const data = {
        tags: req.body,
      };
      if (typeof data.tags != "string") {
        failMessage += "To update bug report, enter a tags string.\n";
      }
      if (failMessage != "") {
        res.status(400);
        res.send(failMessage);
      } else {
        const userId = new ObjectId(req.params.id);
        const responce = await getDb()
          .db("trakResolve")
          .collection("bugs")
          .updateOne(
            { _id: userId },
            {
              $push: {
                tags: data.tags,
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
                "Something went wrong while updating the bug report. Try again later."
            );
        }
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export const updateBugMessagesById = asyncHandler(
  async (req: any, res: any) => {
    try {
      if (!claimIncludes("lead", "admin")) {
        res.status(401).json("You are not authorized to use this request.");
      } else {
        if (!ObjectId.isValid(req.params.id)) {
          res.status(400).json("ID must be alphanumeric, 24 characters long.");
        } else {
          let failMessage = "";
          const data = {
            bugId: req.body.bugId,
            message: req.body.message,
            isOpen: req.body.isOpen,
          };
          if (typeof data.bugId != "string") {
            failMessage += "To update user messages, enter a bugId string.\n";
          }
          if (typeof data.message != "string") {
            failMessage += "To update user messages, enter a message string.\n";
          }
          if (typeof data.isOpen != "boolean") {
            failMessage +=
              "To update user messages, enter an isOpen boolean.\n";
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
                    messages: data,
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
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export const updateBugAssignedById = asyncHandler(
  async (req: any, res: any) => {
    try {
      if (claimEquals("user", true) || !claimIncludes("roles")) {
        res.status(401).json("You are not authorized to use this request.");
      }
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json("ID must be alphanumeric, 24 characters long.");
      } else {
        let failMessage = "";
        const valid = [
          "developer_user",
          "qa_user",
          "lead_user",
          "admin_user",
          "dev_team",
          "finished_dev",
        ];
        const data = {
          assignedTo: req.body,
        };
        if (typeof data.assignedTo != "string") {
          failMessage += "To assign ticket, enter an assignedTo string.\n";
        }
        if (
          typeof data.assignedTo == "string" &&
          !valid.includes(data.assignedTo)
        ) {
          failMessage += "To assign ticket, enter a valid devTeam role.\n";
        }
        if (failMessage != "") {
          res.status(400);
          res.send(failMessage);
        } else {
          const userId = new ObjectId(req.params.id);
          const responce = await getDb()
            .db("trakResolve")
            .collection("bugs")
            .updateOne(
              { _id: userId },
              {
                $set: {
                  assignedTo: data.assignedTo,
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
                  "Something went wrong while assigning the ticket. Try again later."
              );
          }
        }
      }
    } catch (err) {
      res
        .status(500)
        .json(
          "Something went wrong while assigning the ticket. Try again later."
        );
    }
  }
);

export const deleteBugReportById = asyncHandler(async (req: any, res: any) => {
  try {
    if (claimEquals("admin", false)) {
      res.status(401).json("You are not authorized to use this request.");
    }
    if (req.oidc.isAuthenticated()) {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json("ID must be alphanumeric, 24 characters long.");
      } else {
        const userId = new ObjectId(req.params.id);
        const responce = await getDb()
          .db("trakResolve")
          .collection("bugs")
          .deleteOne({ _id: userId }, true);
        if (responce.deletedCount > 0) {
          res
            .status(200)
            .send(`Bug report with ID ${userId} was deleted sucessfully.`);
        } else {
          res
            .status(500)
            .json(
              responce.error ||
                "Something went wrong while deleting the bug report. Try again later."
            );
        }
      }
    } else {
      res.status(401).json("You must login to delete bug reports.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
