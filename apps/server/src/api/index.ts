import { Router } from "express";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";

// middleware
import { authMiddleware } from "./middleware/authMiddleware";

const router = Router();

router.use("/health", authMiddleware, healthRouter);
router.use("/auth", authMiddleware, authRouter);

export default router;
