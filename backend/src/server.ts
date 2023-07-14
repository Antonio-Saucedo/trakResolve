import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { initDb } from "./configs/database.config";
import bugRouter from "./routers/bug.router";
import userRouter from "./routers/user.router";
import swaggerRouter from "./routers/swagger.router";
import cors from "cors";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", {
    title: "Trak Resolve Info API",
    version: process.env.VERSION,
  });
});

app.use(`/api/v${process.env.VERSION}`, swaggerRouter);
app.use(`/api/v${process.env.VERSION}`, bugRouter);
app.use(`/api/v${process.env.VERSION}`, userRouter);

initDb((err: Error) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(process.env.PORT);
    console.log(`Connected to DB and listening on ${process.env.PORT}`);
  }
});

module.exports = app;
