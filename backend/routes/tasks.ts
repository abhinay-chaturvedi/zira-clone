import { Router } from "express";
import { sessionMiddleware } from "../middleware/session-middleware";
import { getTask, getTaskById, handleCreateTask, handleDeleteTask, handleUpdateTask } from "../controllers/tasks";

const router = Router();

router.post("/", sessionMiddleware, handleCreateTask)
router.get("/", sessionMiddleware, getTask)
router.delete("/:taskId", sessionMiddleware, handleDeleteTask);
router.patch("/:taskId", sessionMiddleware, handleUpdateTask)
router.get("/:taskId", sessionMiddleware, getTaskById)

export const tasksRoute = router;