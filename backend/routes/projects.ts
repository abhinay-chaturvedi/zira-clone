import { Router } from "express";
import { sessionMiddleware } from "../middleware/session-middleware";
import {
  getProjectsInWorkspace,
  handleCreateProject,
  handleDeleteProject,
  handleProjectAnalytics,
  handleUpdateProject,
} from "../controllers/projects";
import multer from "multer";

const router = Router();

router.get("/", sessionMiddleware, getProjectsInWorkspace);
router.post(
  "/",
  sessionMiddleware,
  multer().single("image"),
  handleCreateProject
);
router.patch(
  "/:projectId",
  sessionMiddleware,
  multer().single("image"),
  handleUpdateProject
);
router.delete("/:projectId", sessionMiddleware, handleDeleteProject)
router.get("/:projectId/analytics", sessionMiddleware, handleProjectAnalytics);
export const projectsRouter = router;
