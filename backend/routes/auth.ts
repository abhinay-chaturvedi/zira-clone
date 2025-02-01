import expreess, { Request, Response, Router } from "express";
import z from "zod";
import { validate } from "../middleware/validate";
import { currentUser, loginController, logoutController, registerController } from "../controllers/auth";
import { sessionMiddleware } from "../middleware/session-middleware";

const router: Router = expreess.Router();

const loginSchema = z.object({
  email: z.string().email("invalid emal"),
  password: z.string().min(1, "Password needed!"),
});
const registerSchema = z.object({
  name: z.string().min(1, "Enter your name!"),
  email: z.string().email(),
  password: z.string().min(4, "Minimum of 4 characters required"),
});
router.post("/login", validate(loginSchema), loginController);
router.post("/register", validate(registerSchema), registerController);
router.post("/logout", logoutController);
router.get("/current", sessionMiddleware, currentUser);
// router.get("/login", (req, res): any => res.json({ message: "s" }));
export const authRoute = router;
