import { Router } from "express";

import authRoutes from "./auth_routes";
import postRoutes from "./post_routes";
import userRoutes from "./user_routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/post", postRoutes);
router.use("/user", userRoutes);

export default router;
