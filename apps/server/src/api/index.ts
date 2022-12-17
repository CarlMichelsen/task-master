import { Router } from "express";
import healthRouter from "./routes/health";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";

// middleware
import { authMiddleware } from "./middleware/authMiddleware";

const router = Router();

router.use("/health", authMiddleware, healthRouter);
router.use("/auth", authMiddleware, authRouter);
router.use("/user", authMiddleware, userRouter);

export default router;
