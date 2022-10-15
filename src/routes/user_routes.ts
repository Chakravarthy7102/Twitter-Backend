import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth";
import UserController from "../controller/user_controller";

const router = Router();
const user = new UserController();

router.post("/update-profile", checkAuth, user.updateProfile);
router.get("/get-my-profile", checkAuth, user.getMyProfile);

export default router;
