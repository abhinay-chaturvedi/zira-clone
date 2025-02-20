import { Router } from "express";
import { validate } from "../middleware/validate";
import { z } from "zod";
import { sessionMiddleware } from "../middleware/session-middleware";
import {
  createWorkSpace,
  deleteWorkspace,
  getWorkSpaces,
  handleJoinWorkspace,
  handleWorkspaceAnalytics,
  resetInviteCode,
  updateWorkspace,
} from "../controllers/workspaces";
import multer from "multer";
const router = Router();

const workspacesSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

router.get("/", sessionMiddleware, getWorkSpaces);
router.post(
  "/",
  multer().single("image"),
  validate(workspacesSchema),
  sessionMiddleware,
  createWorkSpace
);
router.patch(
  "/:workspaceId",
  multer().single("image"),
  sessionMiddleware,
  updateWorkspace
);
router.delete("/:workspaceId", sessionMiddleware, deleteWorkspace);
router.post(
  "/:workspaceId/reset-invite-code",
  sessionMiddleware,
  resetInviteCode
);
router.post(
  "/:workspaceId/join",
  sessionMiddleware,
  validate(z.object({ code: z.string() })),
  handleJoinWorkspace
);
router.get("/:workspaceId/analytics", sessionMiddleware, handleWorkspaceAnalytics);
export const workspacesRoute = router;
