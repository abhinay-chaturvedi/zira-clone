import { Application, Router } from "express";
import { sessionMiddleware } from "../middleware/session-middleware";
import { getTask, getTaskById, handleBulkUpdate, handleCreateTask, handleDeleteTask, handleUpdateTask } from "../controllers/tasks";

const router = Router();

router.use(sessionMiddleware);
router.post("/", handleCreateTask)
router.get("/", getTask)
router.delete("/:taskId", handleDeleteTask);
router.patch("/:taskId", handleUpdateTask)
router.get("/:taskId", getTaskById)
router.post("/bulk-update", handleBulkUpdate);

export const tasksRoute = router;