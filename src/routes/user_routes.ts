import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth";
import UserController from "../controller/user_controller";

const router = Router();
const user = new UserController();

router.post("/update-profile", checkAuth, user.updateProfile);
router.get("/get-my-profile", checkAuth, user.getMyProfile);
router.get("/follow", checkAuth, user.follow);
router.get("/unfollow", checkAuth, user.unfollow);
router.get("/get-others-profile", checkAuth, user.othersProfile);

export default router;
