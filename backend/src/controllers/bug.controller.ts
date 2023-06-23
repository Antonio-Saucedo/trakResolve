import { getDb } from "../configs/database.config";
import { claimEquals } from "express-openid-connect";
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

export const createBugReport = asyncHandler(async (req: any, res: any) => {
  try {
    if (req.oidc.isAuthenticated()) {
      let failMessage = "";
      const data = {
        summary: req.body.summary,
        link: req.body.link,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        reproductionFindings: req.body.reproductionFindings,
        developmentFindings: req.body.developmentFindings,
        message: req.body.message,
        resolved: req.body.resolved,
        tags: req.body.tags,
      };
      if (typeof data.summary != "string") {
        failMessage += "To create bug report, enter a summary string.\n";
      }
      if (typeof data.link != "string") {
        failMessage += "To create bug report, enter a link string.\n";
      }
      if (typeof data.imageUrl != "string") {
        failMessage += "To create bug report, enter an imageUrl string.\n";
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
      if (typeof data.message != "string") {
        failMessage += "To create bug report, enter a message string.\n";
      }
      if (typeof data.resolved != "boolean") {
        failMessage +=
          "To create bug report, enter a true/false resolved value.\n";
      }
      if (typeof data.tags != "string") {
        failMessage += "To create bug report, enter a tags strings.\n";
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
    } else {
      res.status(401).json("You must login to create bug reports.");
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
    if (claimEquals("user", true)) {
      res
        .status(401)
        .json(
          "You do not have access to update bug reports. Please create a new report for additional problems."
        );
    }
    if (req.oidc.isAuthenticated()) {
      if (!ObjectId.isValid(req.params.id)) {
        res.status(400).json("ID must be alphanumeric, 24 characters long.");
      } else {
        let failMessage = "";
        const data = {
          summary: req.body.summary,
          link: req.body.link,
          imageUrl: req.body.imageUrl,
          description: req.body.description,
          reproductionFindings: req.body.reproductionFindings,
          developmentFindings: req.body.developmentFindings,
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
        if (typeof data.imageUrl != "string") {
          failMessage += "To update bug report, enter an imageUrl string.\n";
        }
        if (typeof data.description != "string") {
          failMessage += "To update bug report, enter a description string.\n";
        }
        if (typeof data.reproductionFindings != "string") {
          failMessage +=
            "To update bug report, enter a reproductionFindings.\n";
        }
        if (typeof data.developmentFindings != "string") {
          failMessage += "To update bug report, enter a developmentFindings.\n";
        }
        if (typeof data.message != "string") {
          failMessage += "To update bug report, enter a message string.\n";
        }
        if (typeof data.resolved != "boolean") {
          failMessage +=
            "To update bug report, enter a true/false resolved value.\n";
        }
        if (typeof data.tags != "string") {
          failMessage += "To update bug report, enter a tags strings.\n";
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
                  imageUrl: data.imageUrl,
                  description: data.description,
                  reproductionFindings: data.reproductionFindings,
                  developmentFindings: data.developmentFindings,
                  message: data.message,
                  resolved: data.resolved,
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
    } else {
      res.status(401).json("You must login to update bug reports.");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

export const deleteBugReportById = asyncHandler(async (req: any, res: any) => {
  try {
    if (claimEquals("admin", false)) {
      res
        .status(401)
        .json(
          "You must be an admin to delete bug reports. Please contact a TrakResolve admin for help."
        );
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
