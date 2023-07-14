import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { initDb } from "./configs/database.config";
import bugRouter from "./routers/bug.router";
import userRouter from "./routers/user.router";
import swaggerRouter from "./routers/swagger.router";
import { auth, requiresAuth } from "express-openid-connect";
import cors from "cors";
import path from "path";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config));

// app.get("/profile", requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });

app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname,'public', 'index.html'))
// })

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
  // console.log(req.oidc.isAuthenticated());
  res.render("index", {
    title: "Trak Resolve Info API",
    // isAuthenticated: req.oidc.isAuthenticated(),
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
