import { Router } from "express";
import { login, me } from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/login", login);
router.get("/me", verifyToken, me);

export default router;