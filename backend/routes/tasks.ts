import { Router } from "express";
import { sessionMiddleware } from "../middleware/session-middleware";
import { getTask, handleCreateTask } from "../controllers/tasks";

const router = Router();

router.post("/", sessionMiddleware, handleCreateTask)
router.get("/", sessionMiddleware, getTask)

export const tasksRoute = router;