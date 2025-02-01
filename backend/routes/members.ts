import { Router } from "express";
import { sessionMiddleware } from "../middleware/session-middleware";
import { deleteMemberFromWorkspace, getMembersInWorkspace, updateMemberOfWorkspace } from "../controllers/members";


const router = Router();

router.get("/", sessionMiddleware, getMembersInWorkspace);
router.delete("/:memberId", sessionMiddleware, deleteMemberFromWorkspace);
router.patch("/:memberId", sessionMiddleware, updateMemberOfWorkspace);

export const memberRoute = router;