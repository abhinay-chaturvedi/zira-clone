import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { config } from "./config";
import {
  authRoute,
  memberRoute,
  projectsRouter,
  tasksRoute,
  workspacesRoute,
} from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

dotenv.config();
const app: Application = express();

app.use(express.json());

// app.use(express.urlencoded({extended: false}))
console.log(config.APP_URL)
app.use(cookieParser());
app.use(
  cors({
    origin: config.APP_URL, // Frontend origin
    credentials: true, // Allow cookies to be sent
  })
);

app.get("/", (req: Request, res: Response) => {
  console.info(req.cookies);
  res.json("Hi there! just starting with the demo api");
});
// console.log(config, process.env.APPWRITE_DATABASE_ID)
app.use("/api/auth", authRoute);
app.use("/api/workspaces", workspacesRoute);
app.use("/api/members", memberRoute);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", tasksRoute);

app.listen(config.PORT, () => {
  console.log("Server is running on the port 5000!");
});
